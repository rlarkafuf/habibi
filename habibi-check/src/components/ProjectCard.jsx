import React from 'react';
import { analyzePriceGap } from '../services/propertyService';
import { MapPin, Home, TrendingUp, History, Tag, ShieldCheck } from 'lucide-react';

export default function ProjectCard({ property, metrics }) {
  const {
    name,
    projectName,
    buildingName,
    island,
    location,
    developer,
    unitType,
    bedrooms,
    areaSqFt,
    transactionAmountAED,
    askingAED,
    serviceChargeSqFt,
    transactionDate,
    completionStatus,
    propertyClass
  } = property;

  const displayName = projectName || name;
  const displayBuilding = buildingName || name;
  const displayIsland = island || location;
  const displayStatus = completionStatus || propertyClass || 'Ready';
  const txPool = metrics?.projectTransactions?.length ? metrics.projectTransactions : [property];

  const evaluation = analyzePriceGap(askingAED, areaSqFt, bedrooms, txPool);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'below':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'premium':
        return 'bg-rose-50 text-rose-800 border-rose-200';
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col justify-between">
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start gap-2 mb-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                <ShieldCheck size={12} /> {developer}
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-100">
                SC ~{serviceChargeSqFt} AED/sqft
              </span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate">{displayName}</h3>
            <p className="text-gray-500 text-xs flex items-center gap-1 mt-0.5 truncate">
              <MapPin size={13} /> {displayBuilding} • {displayIsland}
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-bold border whitespace-nowrap ${getBadgeColor(evaluation.type)}`}>
            {evaluation.badge}
          </span>
        </div>

        {/* Unit & Dual-Price Intelligence Box */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
              <Tag size={12} /> 현재 매물 호가 (Asking)
            </p>
            <p className="font-extrabold text-blue-700 text-base">{formatCurrency(askingAED)}</p>
            <p className="text-xs font-medium text-gray-600">
              {evaluation.askingSqFt.toLocaleString()} AED/sqft
            </p>
          </div>

          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-[11px] text-gray-500 mb-1 flex items-center gap-1">
              <Home size={12} /> DARI 실거래 기준 ({bedrooms})
            </p>
            <p className="font-bold text-gray-900 text-base">{formatCurrency(transactionAmountAED)}</p>
            <p className="text-xs text-gray-600">
              {evaluation.dariAvgSqFt.toLocaleString()} AED/sqft • {areaSqFt.toLocaleString()} sf
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 bg-slate-50 px-3 py-2 rounded-lg mb-4">
          <span>유형: <strong className="text-gray-800">{unitType || 'Apartment'} ({bedrooms})</strong></span>
          <span>상태: <strong className="text-gray-800">{displayStatus}</strong></span>
          <span>호가 갭: <strong className={evaluation.gapRate <= -3 ? 'text-emerald-700' : evaluation.gapRate >= 5 ? 'text-rose-700' : 'text-blue-700'}>
            {evaluation.gapRate > 0 ? `+${evaluation.gapRate}%` : `${evaluation.gapRate}%`}
          </strong></span>
        </div>

        <div className="border-t border-gray-100 pt-3">
          <h4 className="text-xs font-semibold text-gray-700 flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-blue-600" />
              단지 실거래 평균 단가
            </span>
            <span className="text-blue-700 font-bold">
              {metrics?.averagePricePerSqFt ? `${metrics.averagePricePerSqFt.toLocaleString()} AED/sqft` : 'N/A'}
            </span>
          </h4>

          <div className="space-y-1.5">
            <p className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
              <History size={11} /> 최근 DARI 실거래 내역 ({transactionDate})
            </p>
            {metrics?.recentTransactions && metrics.recentTransactions.length > 0 ? (
              <ul className="text-xs text-gray-600 space-y-1">
                {metrics.recentTransactions.slice(0, 3).map((tx, idx) => (
                  <li key={idx} className="flex justify-between border-b border-gray-50 pb-1 last:border-0">
                    <span className="truncate pr-2">{tx.date} • {tx.unit}</span>
                    <span className="font-semibold text-gray-800 whitespace-nowrap">
                      {formatCurrency(tx.amount)} ({Math.round(tx.pricePerSqFt).toLocaleString()} AED/sf)
                    </span>
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
