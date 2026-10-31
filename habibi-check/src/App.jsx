import React, { useState, useEffect, useCallback } from 'react';
import { propertyService } from './services/propertyService';
import FilterBar from './components/FilterBar';
import ProjectList from './components/ProjectList';
import MapComponent from './components/MapComponent';
import ProjectDrawer from './components/ProjectDrawer';
import {
  Building2,
  Map as MapIcon,
  List,
  Database,
  RefreshCw,
  Upload,
  CheckCircle2,
  X
} from 'lucide-react';
import './index.css';

const CURRENT_YEAR = new Date().getFullYear();

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricsMap, setMetricsMap] = useState({});
  const [dataMeta, setDataMeta] = useState(() => propertyService.getDataSourceMeta());
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [feedError, setFeedError] = useState('');

  const [drawerState, setDrawerState] = useState({
    isOpen: false,
    projectName: null,
    metrics: null,
    properties: []
  });

  const [filters, setFilters] = useState({
    island: 'All',
    location: 'All',
    developer: 'All',
    completionStatus: 'All',
    bedrooms: 'All',
    dealType: 'All',
    sortBy: 'gapAsc',
    minPrice: '',
    maxPrice: ''
  });

  const loadMarketData = useCallback(async (activeFilters, forceRefresh = false) => {
    try {
      const data = await propertyService.getProperties(activeFilters, forceRefresh);
      setProperties(data);
      setDataMeta({ ...propertyService.getDataSourceMeta() });
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      setLoading(true);
      try {
        const data = await propertyService.getProperties(filters, false);
        if (isMounted) {
          setProperties(data);
          setDataMeta({ ...propertyService.getDataSourceMeta() });
        }
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchFiltered();

    // Background 24-hour Auto-Sync check (runs every 30 minutes while tab is open & triggers if >=24h elapsed)
    const autoSyncTimer = setInterval(async () => {
      if (propertyService.shouldTriggerDailyAutoSync?.()) {
        await loadMarketData(filters, true);
      }
    }, 30 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(autoSyncTimer);
    };
  }, [filters, loadMarketData]);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      const projectNames = [...new Set(properties.map(p => p.projectName || p.name))];
      if (projectNames.length === 0) return;

      const entries = await Promise.all(
        projectNames.map(async (name) => {
          const metrics = await propertyService.calculateProjectMetrics(name);
          return [name, metrics];
        })
      );

      if (isMounted) {
        setMetricsMap(prev => ({ ...prev, ...Object.fromEntries(entries) }));
      }
    };

    fetchMetrics();

    return () => {
      isMounted = false;
    };
  }, [properties]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleMarkerClick = useCallback((projectName, metrics, projectProps) => {
    setDrawerState({
      isOpen: true,
      projectName,
      metrics,
      properties: projectProps
    });
  }, []);

  const handleSelectProjectFromCard = useCallback(
    (projectName) => {
      const projectProps = properties.filter(p => (p.projectName || p.name) === projectName);
      const metrics = metricsMap[projectName];
      setDrawerState({
        isOpen: true,
        projectName,
        metrics,
        properties: projectProps
      });
    },
    [properties, metricsMap]
  );

  const closeDrawer = () => {
    setDrawerState(prev => ({ ...prev, isOpen: false }));
  };

  const handleIngestJson = async (e) => {
    e.preventDefault();
    setFeedError('');
    try {
      const parsed = JSON.parse(jsonInput);
      const list = Array.isArray(parsed) ? parsed : parsed.data || parsed.properties;
      await propertyService.ingestMarketFeed(list, 'Live Portal / Custom JSON Feed');
      setFeedModalOpen(false);
      setJsonInput('');
      await loadMarketData(filters, false);
    } catch (err) {
      setFeedError(err.message || 'Invalid JSON array format.');
    }
  };

  const handleResetBaseline = async () => {
    await propertyService.resetToBaseline();
    await loadMarketData(filters, false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Habibi Check</h1>
              <p className="text-xs text-gray-500">Abu Dhabi Real Estate Intelligence (Official ADREC & DARI Analytics)</p>
            </div>
          </div>

          {/* Data Freshness & Source Control Bar */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <Database size={13} className="text-emerald-600" />
              {dataMeta.source}
            </span>

            <button
              type="button"
              onClick={() => loadMarketData(filters, true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-full transition"
              title="Re-sync data source now"
            >
              <RefreshCw size={12} /> Sync Now
            </button>

            <button
              type="button"
              onClick={() => setFeedModalOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full border border-blue-200 transition"
            >
              <Upload size={12} /> Connect Live Feed
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Abu Dhabi Freehold Market Explorer</h2>
            <p className="text-sm text-gray-600">
              Compare official ADREC / DARI transaction baselines against latest unit prices across 24 landmark communities in Al Reem, Yas, and Saadiyat Islands.
            </p>
          </div>
          <div className="text-xs text-gray-500 flex items-center gap-1.5">
            <CheckCircle2 size={14} className="text-emerald-600" />
            <span>Last Synced: {new Date(dataMeta.lastSyncedAt).toLocaleString()}</span>
            <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-semibold border border-blue-200">
              Auto-Sync (Every 24h)
            </span>
          </div>
        </div>

        <FilterBar onFilterChange={handleFilterChange} />

        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">
            {loading ? 'Analyzing market data...' : `Showing ${properties.length} Verified Units across 24 Landmarks`}
          </h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapIcon size={16} /> Map
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List size={16} /> List
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : viewMode === 'map' ? (
          <MapComponent
            properties={properties}
            metricsMap={metricsMap}
            onMarkerClick={handleMarkerClick}
          />
        ) : (
          <ProjectList
            properties={properties}
            metricsMap={metricsMap}
            onSelectProject={handleSelectProjectFromCard}
          />
        )}
      </main>

      <ProjectDrawer
        isOpen={drawerState.isOpen}
        onClose={closeDrawer}
        projectName={drawerState.projectName}
        metrics={drawerState.metrics}
        properties={drawerState.properties}
      />

      {/* Live Feed / Supabase JSON Ingestion Modal */}
      {feedModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">Import Live Market Feed / JSON</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Paste an ADREC, Property Finder, Bayut, or Supabase JSON array to normalize and sync immediately.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setFeedModalOpen(false)}
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleIngestJson} className="space-y-4">
              <textarea
                rows={7}
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='[{"name": "Mamsha Al Saadiyat", "island": "Saadiyat Island", "developer": "Aldar", "bedrooms": "2BR", "areaSqFt": 2050, "transactionAmountAED": 6457500, "askingAED": 6150000, "serviceChargeSqFt": 24}]'
                className="w-full font-mono text-xs border border-gray-300 rounded-xl p-3 focus:ring-blue-500 focus:border-blue-500"
              />
              {feedError && <p className="text-xs text-rose-600 font-medium">{feedError}</p>}

              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleResetBaseline}
                  className="text-xs font-semibold text-gray-600 hover:text-gray-900 underline"
                >
                  Reset to Default ADREC Dataset
                </button>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFeedModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Apply & Sync
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500 text-sm">
          <p>&copy; {CURRENT_YEAR} Habibi Check • Abu Dhabi Freehold Analytics (Al Reem, Yas, Saadiyat).</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
