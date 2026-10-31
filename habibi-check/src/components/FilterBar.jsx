import React, { useState } from 'react';
import { Search, RotateCcw } from 'lucide-react';

const INITIAL_FILTERS = {
  island: 'All',
  location: 'All',
  developer: 'All',
  completionStatus: 'All',
  unitType: 'All',
  bedrooms: 'All',
  minPrice: '',
  maxPrice: ''
};

export default function FilterBar({ onFilterChange }) {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value,
      ...(name === 'island' ? { location: value } : {})
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleApply = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    onFilterChange(INITIAL_FILTERS);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
      <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Island (지역)</label>
          <select
            name="island"
            value={filters.island}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="All">All Islands</option>
            <option value="Al Reem Island">Al Reem Island</option>
            <option value="Yas Island">Yas Island</option>
            <option value="Saadiyat Island">Saadiyat Island</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Developer (시공사)</label>
          <select
            name="developer"
            value={filters.developer}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="All">All Developers</option>
            <option value="Aldar">Aldar</option>
            <option value="Tamouh">Tamouh</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Status (준공 여부)</label>
          <select
            name="completionStatus"
            value={filters.completionStatus}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="All">Ready & Off-plan</option>
            <option value="Ready">Ready</option>
            <option value="Off-plan">Off-plan</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Bedrooms</label>
          <select
            name="bedrooms"
            value={filters.bedrooms}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="All">All Sizes</option>
            <option value="Studio">Studio</option>
            <option value="1BR">1BR</option>
            <option value="2BR">2BR</option>
            <option value="3BR">3BR</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Min Asking (AED)</label>
          <input
            type="number"
            name="minPrice"
            value={filters.minPrice}
            onChange={handleChange}
            placeholder="e.g. 1000000"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">Max Asking (AED)</label>
          <input
            type="number"
            name="maxPrice"
            value={filters.maxPrice}
            onChange={handleChange}
            placeholder="e.g. 5000000"
            className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Search size={16} />
            Search
          </button>
          <button
            type="button"
            onClick={handleReset}
            title="Reset Filters"
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-lg transition-colors"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
