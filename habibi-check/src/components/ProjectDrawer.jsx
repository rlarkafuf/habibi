import React from 'react';
import { X, TrendingUp, Tag, Activity } from 'lucide-react';
import { propertyService } from '../services/propertyService';

export default function ProjectDrawer({ isOpen, onClose, projectName, metrics, properties }) {
  if (!isOpen || !projectName) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);
  };

  const getBadgeColor = (type) => {
    switch(type) {
      case 'below': return 'bg-blue-100 text-blue-800 border-blue-200'; // Hogangnono style: cheap is blue
      case 'premium': return 'bg-red-100 text-red-800 border-red-200'; // expensive is red
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-black/40 z-40 transition-opacity"
        onClick={onClose}
      />
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} overflow-y-auto`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{projectName}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-500" />
            </button>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl mb-8 border border-blue-100">
            <h3 className="text-sm font-semibold text-blue-800 mb-1 flex items-center gap-2">
              <TrendingUp size={16} /> Project Average
            </h3>
            <p className="text-3xl font-bold text-blue-900">
              {formatCurrency(metrics.averagePricePerSqFt)} <span className="text-sm font-normal text-blue-700">/ sqft</span>
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Activity size={20} className="text-gray-500" /> Deal Analysis & Asking Prices
            </h3>
            <div className="space-y-4">
              {properties.map(prop => {
                const analysis = propertyService.analyzePriceGap(prop.askingAED, prop.areaSqFt, prop.bedrooms, metrics.projectTransactions);

                return (
                  <div key={prop.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-gray-900">{prop.name} - {prop.bedrooms}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getBadgeColor(analysis.type)}`}>
                        {analysis.badge}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">Asking Price</p>
                        <p className="font-bold text-gray-900">{formatCurrency(prop.askingAED)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Official Tx (Avg)</p>
                        <p className="font-semibold text-gray-700">{formatCurrency(prop.transactionAmountAED)}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
              <Tag size={20} className="text-gray-500" /> Recent Official Transactions
            </h3>
            {metrics.recentTransactions && metrics.recentTransactions.length > 0 ? (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <ul className="space-y-3">
                  {metrics.recentTransactions.map((tx, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{tx.unit}</p>
                        <p className="text-xs text-gray-500">{tx.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(tx.amount)}</p>
                        <p className="text-xs text-gray-500">{formatCurrency(tx.pricePerSqFt)} / sqft</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No recent transactions available.</p>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
