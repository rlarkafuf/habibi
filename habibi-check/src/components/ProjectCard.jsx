import React from 'react';
import { propertyService } from '../services/propertyService';
import { MapPin, Home, TrendingUp, History, Tag } from 'lucide-react';

export default function ProjectCard({ property, metrics }) {
  const {
    projectName,
    buildingName,
    location,
    unitType,
    bedrooms,
    areaSqFt,
    transactionAmountAED,
    transactionDate,
    propertyClass
  } = property;

  const evaluation = propertyService.evaluateDeal(property, metrics);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);
  };

  const getBadgeColor = (type) => {
    switch(type) {
      case 'below': return 'bg-green-100 text-green-800 border-green-200';
      case 'premium': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{projectName}</h3>
            <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
              <MapPin size={14} /> {buildingName}, {location}
            </p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(evaluation.type)}`}>
            {evaluation.badge}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Home size={12} /> Unit Details</p>
            <p className="font-semibold text-sm">{unitType} • {bedrooms}</p>
            <p className="text-sm text-gray-700">{areaSqFt} sqft • {propertyClass}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Tag size={12} /> Transaction (AED)</p>
            <p className="font-bold text-blue-700 text-lg">{formatCurrency(transactionAmountAED)}</p>
            <p className="text-xs text-gray-500">{new Date(transactionDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <TrendingUp size={16} className="text-blue-500" />
            Project Analytics (Avg: {formatCurrency(metrics.averagePricePerSqFt)}/sqft)
          </h4>

          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-2">
              <History size={12} /> Recent Transactions in Project
            </p>
            {metrics.recentTransactions && metrics.recentTransactions.length > 0 ? (
              <ul className="text-xs text-gray-600 space-y-1">
                {metrics.recentTransactions.slice(0, 3).map((tx, idx) => (
                  <li key={idx} className="flex justify-between border-b border-gray-50 pb-1 last:border-0">
                    <span>{new Date(tx.date).toLocaleDateString()} - {tx.unit}</span>
                    <span className="font-semibold">{formatCurrency(tx.amount)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-gray-400">No recent transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
