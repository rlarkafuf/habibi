import React, { useState, useEffect, useCallback } from 'react';
import { propertyService } from './services/propertyService';
import FilterBar from './components/FilterBar';
import ProjectList from './components/ProjectList';
import MapComponent from './components/MapComponent';
import ProjectDrawer from './components/ProjectDrawer';
import { Building2, Map as MapIcon, List } from 'lucide-react';
import './index.css';

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
    developer: 'All',
    completionStatus: 'All',
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
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [filters]);

  // Fetch metrics when properties change
  useEffect(() => {
    let isMounted = true;
    const fetchMetrics = async () => {
      const newMetricsMap = {};
      const projectNames = [...new Set(properties.map(p => p.projectName))];

      for (const name of projectNames) {
        if (!metricsMap[name]) {
           const metrics = await propertyService.calculateProjectMetrics(name);
           newMetricsMap[name] = metrics;
        } else {
           newMetricsMap[name] = metricsMap[name];
        }
      }

      if (isMounted) {
        setMetricsMap(prev => ({ ...prev, ...newMetricsMap }));
      }
    };

    if (properties.length > 0) {
      fetchMetrics();
    }

    return () => { isMounted = false; };
  }, [properties]); // removed metricsMap from dependency to avoid loop

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
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <Building2 size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-gray-900">Habibi Check</h1>
              <p className="text-xs text-gray-500">Abu Dhabi Real Estate Intelligence</p>
            </div>
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              MVP Version
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Market Explorer</h2>
          <p className="text-gray-600">Analyze transactions in Al Reem, Yas, and Saadiyat Islands.</p>
        </div>

        <FilterBar onFilterChange={handleFilterChange} />

        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {loading ? 'Searching...' : `Found ${properties.length} Properties`}
          </h3>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapIcon size={16} /> Map
            </button>
            <button
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
          <p>&copy; {new Date().getFullYear()} Habibi Check. For MVP demonstration purposes only.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
