/**
 * Habibi Check - Multi-Source Data Repository & Schema Adapter Layer
 * Seamlessly switches between:
 *  1. Supabase (PostgREST API when VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY are set)
 *  2. External API / Crawler JSON Feed (when VITE_EXTERNAL_FEED_URL is set)
 *  3. Local Storage Indexed DB / Seed Store (with live JSON/CSV ingestion & persistence)
 */
import { transactions as baselineSeedData } from '../data/mockData.js';

const STORAGE_KEYS = {
  RECORDS: 'habibi_check_market_records_v6_en_24landmarks',
  METADATA: 'habibi_check_market_meta_v6_en_24landmarks',
  PROVIDER_OVERRIDE: 'habibi_check_provider_override'
};

export const AUTO_SYNC_INTERVAL_MS = 24 * 60 * 60 * 1000; // 24 Hours (Daily Auto-Sync)

const ENV_CONFIG = {
  preferredProvider: (import.meta.env?.VITE_DATA_PROVIDER || 'auto').toLowerCase(),
  supabaseUrl: import.meta.env?.VITE_SUPABASE_URL || '',
  supabaseAnonKey: import.meta.env?.VITE_SUPABASE_ANON_KEY || '',
  supabaseTable: import.meta.env?.VITE_SUPABASE_PROPERTIES_TABLE || 'properties',
  externalFeedUrl: import.meta.env?.VITE_EXTERNAL_FEED_URL || ''
};

/**
 * Normalizes any raw record (Supabase snake_case row, crawler JSON, or camelCase seed item)
 * into the canonical Habibi Check Property & Transaction model.
 */
export function normalizePropertyRecord(raw, index = 0) {
  const projectName =
    raw.projectName ||
    raw.project_name ||
    raw.master_project ||
    raw.name ||
    'Unknown Project';

  const buildingName =
    raw.buildingName ||
    raw.building_name ||
    raw.sub_project ||
    raw.tower ||
    raw.name ||
    projectName;

  const island =
    raw.island ||
    raw.location ||
    raw.region ||
    raw.community ||
    'Al Reem Island';

  const areaSqFt = Number(raw.areaSqFt ?? raw.area_sqft ?? raw.size_sqft ?? 1000);
  const transactionAmountAED = Number(
    raw.transactionAmountAED ?? raw.transaction_amount_aed ?? raw.dari_price_aed ?? raw.askingAED ?? 1500000
  );
  const askingAED = Number(
    raw.askingAED ?? raw.asking_aed ?? raw.portal_price_aed ?? transactionAmountAED
  );
  const serviceChargeSqFt = Number(raw.serviceChargeSqFt ?? raw.service_charge_sqft ?? 17);

  const coordinates = raw.coordinates || {
    lat: Number(raw.lat ?? raw.latitude ?? 24.4947),
    lng: Number(raw.lng ?? raw.longitude ?? 54.4069)
  };

  const completionStatus =
    raw.completionStatus || raw.completion_status || raw.propertyClass || 'Ready';

  const dariSqFt = areaSqFt > 0 ? Math.round(transactionAmountAED / areaSqFt) : 0;

  // Build quarterly historical trend series if not explicitly provided by DB
  const historicalTrends = Array.isArray(raw.historicalTrends || raw.historical_trends) &&
    (raw.historicalTrends || raw.historical_trends).length > 0
      ? (raw.historicalTrends || raw.historical_trends)
      : [
          { quarter: '2026 Q1', avgSqFt: Math.round(dariSqFt * 0.94) },
          { quarter: '2026 Q2', avgSqFt: Math.round(dariSqFt * 0.97) },
          { quarter: '2026 Q3', avgSqFt: dariSqFt }
        ];

  return {
    id: String(raw.id || `${projectName.toLowerCase().replace(/\s+/g, '-')}-${index}`),
    name: projectName,
    projectName,
    buildingName,
    island,
    location: island,
    developer: raw.developer || 'Aldar',
    unitType: raw.unitType || raw.unit_type || 'Apartment',
    bedrooms: raw.bedrooms || '2BR',
    areaSqFt,
    transactionAmountAED,
    askingAED,
    serviceChargeSqFt,
    completionStatus,
    propertyClass: completionStatus,
    coordinates,
    transactionDate: raw.transactionDate || raw.transaction_date || '2026-10-01',
    portalSource: raw.portalSource || raw.portal_source || 'ADREC Official Registry',
    listingUrl: raw.listingUrl || raw.listing_url || 'https://trackadrec.com',
    verifiedListing: raw.verifiedListing ?? raw.verified_listing ?? true,
    historicalTrends,
    recentRawTransactions: Array.isArray(raw.recentRawTransactions) ? raw.recentRawTransactions : [],
    updatedAt: raw.updatedAt || raw.updated_at || new Date().toISOString()
  };
}

/**
 * Converts a canonical Property record to a Supabase / Postgres snake_case row payload
 */
export function toSupabaseRow(record) {
  const normalized = normalizePropertyRecord(record);
  return {
    id: normalized.id,
    name: normalized.name,
    project_name: normalized.projectName,
    building_name: normalized.buildingName,
    island: normalized.island,
    developer: normalized.developer,
    unit_type: normalized.unitType,
    bedrooms: normalized.bedrooms,
    area_sqft: normalized.areaSqFt,
    transaction_amount_aed: normalized.transactionAmountAED,
    asking_aed: normalized.askingAED,
    service_charge_sqft: normalized.serviceChargeSqFt,
    completion_status: normalized.completionStatus,
    lat: normalized.coordinates.lat,
    lng: normalized.coordinates.lng,
    transaction_date: normalized.transactionDate,
    portal_source: normalized.portalSource,
    verified_listing: normalized.verifiedListing,
    historical_trends: normalized.historicalTrends,
    updated_at: normalized.updatedAt
  };
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export const supabaseClientConfig = {
  isConfigured() {
    return Boolean(ENV_CONFIG.supabaseUrl && ENV_CONFIG.supabaseAnonKey);
  },

  isExternalFeedConfigured() {
    return Boolean(ENV_CONFIG.externalFeedUrl);
  },

  getActiveProviderName() {
    if (isBrowser()) {
      const override = window.localStorage.getItem(STORAGE_KEYS.PROVIDER_OVERRIDE);
      if (override) return override;
    }
    if (ENV_CONFIG.preferredProvider !== 'auto') {
      return ENV_CONFIG.preferredProvider;
    }
    if (this.isConfigured()) return 'supabase';
    if (this.isExternalFeedConfigured()) return 'api';
    return 'local';
  },

  async fetchFromSupabase() {
    const endpoint = `${ENV_CONFIG.supabaseUrl.replace(/\/$/, '')}/rest/v1/${ENV_CONFIG.supabaseTable}?select=*&order=transaction_date.desc`;
    const response = await fetch(endpoint, {
      headers: {
        apikey: ENV_CONFIG.supabaseAnonKey,
        Authorization: `Bearer ${ENV_CONFIG.supabaseAnonKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Supabase fetch failed: ${response.status} ${response.statusText}`);
    }

    const rows = await response.json();
    return rows.map((row, idx) => normalizePropertyRecord(row, idx));
  },

  async fetchFromExternalFeed(customUrl) {
    const targetUrl = customUrl || ENV_CONFIG.externalFeedUrl;
    const response = await fetch(targetUrl, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`External feed fetch failed: ${response.status}`);
    }

    const payload = await response.json();
    const rawList = Array.isArray(payload) ? payload : payload.data || payload.properties || [];
    return rawList.map((item, idx) => normalizePropertyRecord(item, idx));
  },

  loadFromLocalDB() {
    const normalizedSeed = baselineSeedData.map((item, idx) => normalizePropertyRecord(item, idx));
    if (!isBrowser()) {
      return {
        records: normalizedSeed,
        meta: {
          source: 'Local DB (DARI Verified Seed)',
          provider: 'local',
          lastSyncedAt: '2026-10-31T12:00:00.000Z',
          recordCount: normalizedSeed.length
        }
      };
    }

    try {
      const cachedRaw = window.localStorage.getItem(STORAGE_KEYS.RECORDS);
      const cachedMeta = window.localStorage.getItem(STORAGE_KEYS.METADATA);

      if (cachedRaw) {
        const parsed = JSON.parse(cachedRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const normalized = parsed.map((item, idx) => normalizePropertyRecord(item, idx));
          const meta = cachedMeta
            ? JSON.parse(cachedMeta)
            : {
                source: 'Local DB (Persisted Store)',
                provider: 'local',
                lastSyncedAt: new Date().toISOString(),
                recordCount: normalized.length
              };
          return { records: normalized, meta };
        }
      }

      // Initialize Local DB with normalized baseline records
      const initialMeta = {
        source: 'Local DB (DARI Baseline Synced)',
        provider: 'local',
        lastSyncedAt: new Date().toISOString(),
        recordCount: normalizedSeed.length
      };
      window.localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(normalizedSeed));
      window.localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(initialMeta));

      return { records: normalizedSeed, meta: initialMeta };
    } catch {
      return {
        records: normalizedSeed,
        meta: {
          source: 'Local Memory Fallback',
          provider: 'local',
          lastSyncedAt: new Date().toISOString(),
          recordCount: normalizedSeed.length
        }
      };
    }
  },

  saveToLocalDB(rawRecords, sourceLabel = 'Custom Feed Import') {
    const normalized = rawRecords.map((item, idx) => normalizePropertyRecord(item, idx));
    const meta = {
      source: sourceLabel,
      provider: 'local',
      lastSyncedAt: new Date().toISOString(),
      recordCount: normalized.length
    };

    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(normalized));
      window.localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(meta));
    }

    return { records: normalized, meta };
  },

  shouldAutoSync() {
    if (!isBrowser()) return false;
    try {
      const cachedMeta = window.localStorage.getItem(STORAGE_KEYS.METADATA);
      if (!cachedMeta) return true;
      const parsed = JSON.parse(cachedMeta);
      const lastSyncedTime = new Date(parsed.lastSyncedAt || 0).getTime();
      if (!lastSyncedTime || Number.isNaN(lastSyncedTime)) return true;
      return Date.now() - lastSyncedTime >= AUTO_SYNC_INTERVAL_MS;
    } catch {
      return true;
    }
  },

  resetLocalDB() {
    const normalizedSeed = baselineSeedData.map((item, idx) => normalizePropertyRecord(item, idx));
    const meta = {
      source: 'Local DB (DARI Baseline Reset)',
      provider: 'local',
      lastSyncedAt: new Date().toISOString(),
      recordCount: normalizedSeed.length
    };

    if (isBrowser()) {
      window.localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(normalizedSeed));
      window.localStorage.setItem(STORAGE_KEYS.METADATA, JSON.stringify(meta));
    }

    return { records: normalizedSeed, meta };
  }
};

