import React, { useState, useEffect, useCallback } from 'react';
import { propertyService } from './services/propertyService';
import FilterBar from './components/FilterBar';
import ProjectList from './components/ProjectList';
import MapComponent from './components/MapComponent';
import ProjectDrawer from './components/ProjectDrawer';
import { Building2, Map as MapIcon, List } from 'lucide-react';
import './index.css';

const CURRENT_YEAR = new Date().getFullYear();

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [metricsMap, setMetricsMap] = useState({});
  const [viewMode, setViewMode] = useState('map'); // 'map' or 'list'
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
    unitType: 'All',
    bedrooms: 'All',
    minPrice: '',
    maxPrice: ''
  });

  useEffect(() => {
    const fetchFilteredProperties = async () => {
      setLoading(true);
      try {
        const data = await propertyService.getProperties(filters);
        setProperties(data);
      } catch (error) {
        console.error('Failed to fetch properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [filters]);

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

  const closeDrawer = () => {
    setDrawerState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-xs sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Habibi Check</h1>
              <p className="text-xs text-gray-500">Abu Dhabi Real Estate Intelligence (DARI vs Portal Asking)</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Al Reem • Yas • Saadiyat
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              v2.0 Market Data
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Abu Dhabi Freehold Market Explorer</h2>
          <p className="text-sm text-gray-600">
            Compare official DARI transaction baselines (실거래가) against active portal asking prices (현재 호가) across Al Reem, Yas, and Saadiyat Islands.
          </p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} />

        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-base font-semibold text-gray-800">
            {loading ? 'Analyzing market data...' : `Showing ${properties.length} Verified Units`}
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
          <ProjectList properties={properties} metricsMap={metricsMap} />
        )}
      </main>

      <ProjectDrawer
        isOpen={drawerState.isOpen}
        onClose={closeDrawer}
        projectName={drawerState.projectName}
        metrics={drawerState.metrics}
        properties={drawerState.properties}
      />

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
