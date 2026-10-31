import {
  supabaseClientConfig,
  normalizePropertyRecord,
  toSupabaseRow
} from './supabaseClient.js';

/**
 * Precise Dual-Price Gap Engine (현재 매물 호가 vs DARI 동일 평형/침실 실거래가 평균)
 * @param {number} askingAED - Active portal asking price in AED
 * @param {number} areaSqFt - Unit area in SqFt
 * @param {string} bedroom - Bedroom tier ('Studio' | '1BR' | '2BR' | '3BR')
 * @param {Array} projectTxs - All transaction/listing records belonging to the same project
 */
export function analyzePriceGap(askingAED, areaSqFt, bedroom, projectTxs = []) {
  const safeArea = Number(areaSqFt) > 0 ? Number(areaSqFt) : 1;
  const safeAsking = Number(askingAED) || 0;

  const sameBedroomTxs = Array.isArray(projectTxs)
    ? projectTxs.filter(tx => tx.bedrooms === bedroom && Number(tx.areaSqFt) > 0)
    : [];

  const baselinePool =
    sameBedroomTxs.length > 0
      ? sameBedroomTxs
      : Array.isArray(projectTxs)
      ? projectTxs.filter(tx => Number(tx.areaSqFt) > 0)
      : [];

  // Weighted DARI official transaction baseline per SqFt for the matching bedroom tier
  let dariAvgSqFt = safeAsking / safeArea;
  if (baselinePool.length > 0) {
    const totalDariAmount = baselinePool.reduce((sum, tx) => sum + Number(tx.transactionAmountAED || 0), 0);
    const totalDariArea = baselinePool.reduce((sum, tx) => sum + Number(tx.areaSqFt || 0), 0);
    if (totalDariArea > 0) {
      dariAvgSqFt = totalDariAmount / totalDariArea;
    }
  }

  const askingSqFt = safeAsking / safeArea;
  const rawGap = dariAvgSqFt > 0 ? ((askingSqFt - dariAvgSqFt) / dariAvgSqFt) * 100 : 0;
  const gapRate = Number(rawGap.toFixed(1));

  if (gapRate <= -3) {
    return {
      askingSqFt: Math.round(askingSqFt),
      dariAvgSqFt: Math.round(dariAvgSqFt),
      gapRate,
      shortBadge: `🔥 Hot Deal (${gapRate}%)`,
      badge: `🔥 ${Math.abs(gapRate)}% Below Avg`,
      type: 'below'
    };
  }

  if (gapRate >= 5) {
    return {
      askingSqFt: Math.round(askingSqFt),
      dariAvgSqFt: Math.round(dariAvgSqFt),
      gapRate,
      shortBadge: `📈 +${gapRate}% Above Avg`,
      badge: `📈 +${gapRate}% Above Market`,
      type: 'premium'
    };
  }

  return {
    askingSqFt: Math.round(askingSqFt),
    dariAvgSqFt: Math.round(dariAvgSqFt),
    gapRate,
    shortBadge: `⚖️ Fair (${gapRate > 0 ? `+${gapRate}` : gapRate}%)`,
    badge: '⚖️ Fair Market Price',
    type: 'fair'
  };
}

class PropertyService {
  constructor() {
    this.cache = null;
    this.meta = {
      source: 'Local DB (DARI Verified)',
      provider: 'local',
      lastSyncedAt: new Date().toISOString(),
      recordCount: 0
    };
  }

  /**
   * Resolves the active data source (Supabase -> External Feed -> Local DB)
   * with automatic fallback so the UI never crashes if offline.
   */
  async resolveDataset(forceRefresh = false) {
    if (this.cache && !forceRefresh) {
      return { records: this.cache, meta: this.meta };
    }

    const activeProvider = supabaseClientConfig.getActiveProviderName();

    if (activeProvider === 'supabase' && supabaseClientConfig.isConfigured()) {
      try {
        const records = await supabaseClientConfig.fetchFromSupabase();
        if (records.length > 0) {
          this.cache = records;
          this.meta = {
            source: 'Supabase Live DB (DARI + Portal)',
            provider: 'supabase',
            lastSyncedAt: new Date().toISOString(),
            recordCount: records.length
          };
          supabaseClientConfig.saveToLocalDB(records, this.meta.source);
          return { records: this.cache, meta: this.meta };
        }
      } catch (err) {
        console.warn('[HabibiCheck] Supabase unreachable, falling back to Local DB:', err.message);
      }
    }

    if (activeProvider === 'api' && supabaseClientConfig.isExternalFeedConfigured()) {
      try {
        const records = await supabaseClientConfig.fetchFromExternalFeed();
        if (records.length > 0) {
          this.cache = records;
          this.meta = {
            source: 'External Portal Feed API',
            provider: 'api',
            lastSyncedAt: new Date().toISOString(),
            recordCount: records.length
          };
          supabaseClientConfig.saveToLocalDB(records, this.meta.source);
          return { records: this.cache, meta: this.meta };
        }
      } catch (err) {
        console.warn('[HabibiCheck] External API unreachable, falling back to Local DB:', err.message);
      }
    }

    const localData = supabaseClientConfig.loadFromLocalDB();
    this.cache = localData.records;
    this.meta = localData.meta;

    // Auto-sync once every 24h (or on explicit forceRefresh) from /crawled_market_data.json
    const needsDailyAutoSync = forceRefresh || supabaseClientConfig.shouldAutoSync();
    if (typeof window !== 'undefined' && needsDailyAutoSync) {
      try {
        const res = await fetch(`/crawled_market_data.json?t=${Date.now()}`);
        if (res.ok) {
          const payload = await res.json();
          if (Array.isArray(payload.data) && payload.data.length > 0) {
            const saved = supabaseClientConfig.saveToLocalDB(
              payload.data,
              payload.source || 'ADREC Official Registry (Auto-Synced Daily)'
            );
            this.cache = saved.records;
            this.meta = {
              ...saved.meta,
              adrecLastUpdated: payload.adrecLastUpdated || '2026-10-30',
              autoSyncSchedule: '24h (Daily Auto-Sync)'
            };
          }
        }
      } catch {
        // Fallback to localData seamlessly
      }
    }

    return { records: this.cache, meta: this.meta };
  }

  getDataSourceMeta() {
    return this.meta;
  }

  shouldTriggerDailyAutoSync() {
    return supabaseClientConfig.shouldAutoSync();
  }

  async getAllProperties(forceRefresh = false) {
    const { records } = await this.resolveDataset(forceRefresh);
    return records;
  }

  /**
   * Filters and sorts properties across Al Reem, Yas, and Saadiyat Islands
   */
  async getProperties(filters = {}, forceRefresh = false) {
    const { records } = await this.resolveDataset(forceRefresh);

    // Pre-group by project for accurate gapRate sorting
    const projectMap = records.reduce((acc, item) => {
      const key = item.projectName || item.name;
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    const filtered = records.filter(p => {
      const region = p.island || p.location;
      const targetRegion =
        filters.island && filters.island !== 'All' ? filters.island : filters.location;
      if (targetRegion && targetRegion !== 'All' && region !== targetRegion) return false;

      if (filters.developer && filters.developer !== 'All' && p.developer !== filters.developer) {
        return false;
      }

      const status = p.completionStatus || p.propertyClass;
      if (
        filters.completionStatus &&
        filters.completionStatus !== 'All' &&
        status !== filters.completionStatus
      ) {
        return false;
      }

      if (filters.unitType && filters.unitType !== 'All' && p.unitType !== filters.unitType) {
        return false;
      }

      if (filters.bedrooms && filters.bedrooms !== 'All') {
        const normalizedBed = filters.bedrooms === '3BR+' ? '3BR' : filters.bedrooms;
        if (p.bedrooms !== filters.bedrooms && p.bedrooms !== normalizedBed) return false;
      }

      if (filters.maxServiceCharge && Number(p.serviceChargeSqFt) > Number(filters.maxServiceCharge)) {
        return false;
      }

      if (filters.minPrice && p.askingAED < parseInt(filters.minPrice, 10)) return false;
      if (filters.maxPrice && p.askingAED > parseInt(filters.maxPrice, 10)) return false;

      if (filters.dealType && filters.dealType !== 'All') {
        const gapInfo = analyzePriceGap(
          p.askingAED,
          p.areaSqFt,
          p.bedrooms,
          projectMap[p.projectName || p.name] || [p]
        );
        if (gapInfo.type !== filters.dealType) return false;
      }

      return true;
    });

    // Apply deterministic sorting
    const sortBy = filters.sortBy || 'gapAsc';
    return [...filtered].sort((a, b) => {
      if (sortBy === 'priceAsc') return a.askingAED - b.askingAED;
      if (sortBy === 'priceDesc') return b.askingAED - a.askingAED;
      if (sortBy === 'sqftAsc') return a.askingAED / a.areaSqFt - b.askingAED / b.areaSqFt;
      if (sortBy === 'dateDesc') return new Date(b.transactionDate) - new Date(a.transactionDate);

      // Default 'gapAsc': Best undervalued deals (🔥 급매) first
      const gapA = analyzePriceGap(
        a.askingAED,
        a.areaSqFt,
        a.bedrooms,
        projectMap[a.projectName || a.name] || [a]
      ).gapRate;
      const gapB = analyzePriceGap(
        b.askingAED,
        b.areaSqFt,
        b.bedrooms,
        projectMap[b.projectName || b.name] || [b]
      ).gapRate;
      return gapA - gapB;
    });
  }

  /**
   * Computes project-level analytics, bedroom tier breakdowns, and historical price/sqft trends
   */
  async calculateProjectMetrics(projectName) {
    const { records } = await this.resolveDataset(false);
    const projectTransactions = records.filter(
      p => (p.projectName || p.name) === projectName
    );

    if (projectTransactions.length === 0) {
      return {
        averagePricePerSqFt: 0,
        askingAveragePerSqFt: 0,
        projectGapRate: 0,
        projectTransactions: [],
        recentTransactions: [],
        historicalTrends: []
      };
    }

    const totalDariSqFt = projectTransactions.reduce(
      (sum, tx) => sum + tx.transactionAmountAED / tx.areaSqFt,
      0
    );
    const totalAskingSqFt = projectTransactions.reduce(
      (sum, tx) => sum + tx.askingAED / tx.areaSqFt,
      0
    );

    const averagePricePerSqFt = Math.round(totalDariSqFt / projectTransactions.length);
    const askingAveragePerSqFt = Math.round(totalAskingSqFt / projectTransactions.length);
    const projectGapRate = Number(
      (((askingAveragePerSqFt - averagePricePerSqFt) / averagePricePerSqFt) * 100).toFixed(1)
    );

    // Merge actual recentRawTransactions from ADREC registry if available
    const allRawRecent = [];
    const seenKeys = new Set();
    for (const tx of projectTransactions) {
      if (Array.isArray(tx.recentRawTransactions)) {
        for (const r of tx.recentRawTransactions) {
          const k = `${r.date}-${r.amount}-${r.unit}`;
          if (!seenKeys.has(k)) {
            seenKeys.add(k);
            allRawRecent.push(r);
          }
        }
      }
    }

    const recentTransactions =
      allRawRecent.length > 0
        ? allRawRecent
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6)
        : [...projectTransactions]
            .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
            .slice(0, 5)
            .map(tx => ({
              date: tx.transactionDate,
              amount: tx.askingAED || tx.transactionAmountAED,
              askingAED: tx.askingAED,
              unit: `${tx.buildingName || tx.name} • ${tx.bedrooms}`,
              pricePerSqFt: Math.round((tx.askingAED || tx.transactionAmountAED) / tx.areaSqFt)
            }));

    return {
      averagePricePerSqFt,
      askingAveragePerSqFt,
      projectGapRate,
      projectTransactions,
      recentTransactions,
      historicalTrends: projectTransactions[0]?.historicalTrends || []
    };
  }

  evaluateDeal(property, projectMetrics) {
    const txPool = projectMetrics?.projectTransactions?.length
      ? projectMetrics.projectTransactions
      : [property];

    return analyzePriceGap(property.askingAED, property.areaSqFt, property.bedrooms, txPool);
  }

  /**
   * Allows live JSON/Crawler feed ingestion or adding new market listings into Local DB
   */
  async ingestMarketFeed(rawArray, sourceLabel = 'Live Portal JSON Feed') {
    if (!Array.isArray(rawArray) || rawArray.length === 0) {
      throw new Error('Feed payload must be a non-empty array of property records.');
    }
    const saved = supabaseClientConfig.saveToLocalDB(rawArray, sourceLabel);
    this.cache = saved.records;
    this.meta = saved.meta;
    return saved;
  }

  /**
   * Resets Local DB back to the verified Abu Dhabi DARI baseline dataset
   */
  async resetToBaseline() {
    const reset = supabaseClientConfig.resetLocalDB();
    this.cache = reset.records;
    this.meta = reset.meta;
    return reset;
  }

  normalizePropertyRecord = normalizePropertyRecord;
  toSupabaseRow = toSupabaseRow;
  analyzePriceGap = analyzePriceGap;
}

export const propertyService = new PropertyService();
