import React, { useState, useEffect } from 'react';
import { propertyService } from './services/propertyService';
import FilterBar from './components/FilterBar';
import ProjectList from './components/ProjectList';
import { Building2 } from 'lucide-react';
import './index.css';

function App() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: 'All',
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
        console.error("Failed to fetch properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilteredProperties();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
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
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <ProjectList properties={properties} />
        )}
      </main>

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
