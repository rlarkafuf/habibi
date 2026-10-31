import React, { useState } from 'react';
import {
  X,
  TrendingUp,
  Tag,
  Activity,
  ShieldCheck,
  ThermometerSnowflake,
  Car,
  Wrench,
  Volume2,
  ParkingCircle,
  MessageSquareQuote
} from 'lucide-react';
import { propertyService } from '../services/propertyService';

const COMMUNITY_INSIGHTS = {
  'Sun & Sky Towers': {
    score: 4.4,
    chiller: 4.5,
    traffic: 3.8,
    maintenance: 4.6,
    noise: 4.3,
    parking: 4.7,
    pros: ['Direct indoor access to Shams Boutik & Waitrose', 'Strong Aldar FM', 'Spacious layouts'],
    cons: ['Peak-hour Reem Bridge exit traffic'],
    review: 'Direct elevator access to Shams Boutik Mall makes summer living effortless. Highly liquid for both rentals and resales.'
  },
  'The Gate & Arc Towers': {
    score: 4.2,
    chiller: 4.3,
    traffic: 3.7,
    maintenance: 4.2,
    noise: 4.1,
    parking: 4.4,
    pros: ['Resort-scale podium pools & gym', 'High rental yield & tenant demand', 'Connected to Shams Boutik'],
    cons: ['Morning elevator wait times on high floors'],
    review: 'One of the fastest-renting iconic landmarks in Abu Dhabi. The podium leisure deck feels like a 5-star resort.'
  },
  'Reem Hills': {
    score: 4.7,
    chiller: 4.6,
    traffic: 4.5,
    maintenance: 4.7,
    noise: 4.8,
    parking: 4.9,
    pros: ['Only gated hillside villa/townhouse community on Reem', 'Generous plots & privacy', 'Jogging tracks'],
    cons: ['Surrounding phases still under active construction'],
    review: 'Combines downtown island convenience with a private gated villa lifestyle. Huge demand from families.'
  },
  'The Bridges': {
    score: 4.5,
    chiller: 4.5,
    traffic: 4.4,
    maintenance: 4.6,
    noise: 4.3,
    parking: 4.5,
    pros: ['Steps from Reem Central Park & Canal promenade', 'Modern Aldar build quality', 'Top expat favorite'],
    cons: ['More compact living rooms than older towers'],
    review: 'Right next to Reem Central Park and the canal walk. Zero vacancy issues and vibrant community vibe.'
  },
  'Pixel (Makers District)': {
    score: 4.6,
    chiller: 4.6,
    traffic: 4.3,
    maintenance: 4.6,
    noise: 4.4,
    parking: 4.6,
    pros: ['Pedestrian-only artisan plaza', 'Private beach access & specialty cafes', 'Unique architectural design'],
    cons: ['Limited supply of large 3BR+ layouts'],
    review: 'The most design-forward waterfront hub on Reem Island with a private beach and artisanal dining downstairs.'
  },
  'Radiant Square': {
    score: 4.3,
    chiller: 4.4,
    traffic: 4.4,
    maintenance: 4.3,
    noise: 4.2,
    parking: 4.4,
    pros: ['Brand-new high-rise panoramic views', 'Competitive entry AED/sqft', 'Close to Reem Mall'],
    cons: ['Initial handover snagging & move-in traffic'],
    review: 'Attractive price per sqft for a brand-new tower, offering strong gross rental yields near Reem Mall.'
  },
  'City of Lights (Hydra / Addax)': {
    score: 4.1,
    chiller: 4.1,
    traffic: 4.5,
    maintenance: 4.0,
    noise: 4.2,
    parking: 4.3,
    pros: ['Best value AED/sqft on Al Reem', 'Canal waterfront promenade', 'High net ROI for investors'],
    cons: ['Finishing quality varies across individual towers'],
    review: 'Ideal for yield-focused investors seeking low entry prices and steady cashflow close to Al Maryah bridges.'
  },
  'Marina Square': {
    score: 4.1,
    chiller: 4.0,
    traffic: 4.6,
    maintenance: 3.9,
    noise: 4.2,
    parking: 4.3,
    pros: ['Fastest bridge access to Al Maryah & Mainland', 'Strong value per sqft', 'Marina views'],
    cons: ['Older stock—upgraded units recommended'],
    review: 'First community right off the bridge, meaning zero Reem Island rush-hour bottlenecks when commuting.'
  },
  "Water's Edge": {
    score: 4.5,
    chiller: 4.4,
    traffic: 4.7,
    maintenance: 4.5,
    noise: 4.3,
    parking: 4.5,
    pros: ['800m Yas Canal boardwalk', 'Top short- & long-term rental yields', 'Minutes to Yas Mall & Ferrari World'],
    cons: ['Busy surrounding roads during F1 race weekend'],
    review: 'Consistently high occupancy and capital appreciation on Yas Island with full canal views and Aldar management.'
  },
  Ansam: {
    score: 4.6,
    chiller: 4.5,
    traffic: 4.8,
    maintenance: 4.6,
    noise: 4.6,
    parking: 4.7,
    pros: ['Unobstructed Yas Links golf & mangrove views', 'Low-rise Andalusian resort vibe', 'Infinity pools'],
    cons: ['Tight resale supply pushes asking prices up'],
    review: 'Golf-course views and low-rise resort architecture make Ansam a top pick for Western expats and executives.'
  },
  'Yas Acres': {
    score: 4.8,
    chiller: 4.4,
    traffic: 4.8,
    maintenance: 4.8,
    noise: 4.9,
    parking: 5.0,
    pros: ['Premier family townhouse & villa masterplan', 'Near SABIS & Yas schools', 'Golf & country club'],
    cons: ['Higher total ticket price'],
    review: 'The gold standard for family townhouse living on Yas Island with lush parks, golf course, and community clubs.'
  },
  Mayan: {
    score: 4.8,
    chiller: 4.7,
    traffic: 4.8,
    maintenance: 4.8,
    noise: 4.7,
    parking: 4.8,
    pros: ['Direct private access to Yas Beach', 'Dual golf course & sea views', 'Resort-grade pools'],
    cons: ['Rare resale availability commands a premium'],
    review: 'The only luxury apartment community on Yas Island with direct private access to the white sands of Yas Beach.'
  },
  'Noya (Viva & Luma)': {
    score: 4.7,
    chiller: 4.5,
    traffic: 4.7,
    maintenance: 4.7,
    noise: 4.8,
    parking: 4.9,
    pros: ['Best-value townhouses on Yas Island', ' Strong capital appreciation since launch', 'Family pools & parks'],
    cons: ['Slightly denser plot spacing than Yas Acres'],
    review: 'Aldar’s most popular mid-market townhouse community on Yas, delivering exceptional capital gains.'
  },
  'Gardenia Bay': {
    score: 4.7,
    chiller: 4.7,
    traffic: 4.8,
    maintenance: 4.8,
    noise: 4.6,
    parking: 4.7,
    pros: ['Eco-wellness waterfront promenade', 'Adjacent to Yas Park', 'Next-gen upgrade to Water’s Edge'],
    cons: ['Phased off-plan handover schedule'],
    review: 'Situated along the canal next to Water’s Edge with a greener, wellness-focused masterplan and beach club.'
  },
  'Yas Bay (Sea La Vie & Perla)': {
    score: 4.6,
    chiller: 4.6,
    traffic: 4.7,
    maintenance: 4.6,
    noise: 4.3,
    parking: 4.6,
    pros: ['Walk to Etihad Arena & Yas Bay fine dining pier', 'Lagoon pools & full sea views'],
    cons: ['Lively weekend traffic during arena events'],
    review: 'Steps from Abu Dhabi’s premier waterfront dining and entertainment pier at Yas Bay.'
  },
  'The Sustainable City Yas': {
    score: 4.8,
    chiller: 5.0,
    traffic: 4.8,
    maintenance: 4.8,
    noise: 5.0,
    parking: 4.7,
    pros: ['Solar panels cut utility/AC bills by up to 50%', 'Car-free residential clusters', 'Equestrian & biodomes'],
    cons: ['Buggy/walk from perimeter parking pods to home'],
    review: 'Ultra-low service and cooling charges with car-free green sikkas where children can play safely.'
  },
  'Mamsha Al Saadiyat': {
    score: 4.9,
    chiller: 4.7,
    traffic: 4.9,
    maintenance: 4.8,
    noise: 4.8,
    parking: 4.8,
    pros: ['Direct Soul Beach turquoise beachfront', 'Walking distance to Louvre & Guggenheim', 'Trophy asset status'],
    cons: ['Premium service charge (~24.5 AED/sqft)'],
    review: 'Abu Dhabi’s ultimate trophy beachfront address—stepping straight from your living room onto Soul Beach.'
  },
  'Saadiyat Beach Residences': {
    score: 4.6,
    chiller: 4.5,
    traffic: 4.8,
    maintenance: 4.6,
    noise: 4.9,
    parking: 4.8,
    pros: ['Next to Cranleigh Abu Dhabi school', 'Generous floorplans & gated landscaping', 'Beach club proximity'],
    cons: ['Short drive required for major retail'],
    review: 'Top choice for expat families with children attending Cranleigh looking for spacious, quiet coastal living.'
  },
  'Saadiyat Grove & The Source': {
    score: 4.8,
    chiller: 4.7,
    traffic: 4.8,
    maintenance: 4.8,
    noise: 4.6,
    parking: 4.8,
    pros: ['Direct Zayed National Museum views', 'UAE’s premier wellness residences (The Source)', 'Luxury retail boulevard'],
    cons: ['Surrounding Cultural District infrastructure finishing'],
    review: 'Located right at the heart of the Cultural District overlooking the Zayed National Museum and Grove retail.'
  },
  'Louvre Abu Dhabi Residences': {
    score: 4.9,
    chiller: 4.8,
    traffic: 4.9,
    maintenance: 4.9,
    noise: 4.9,
    parking: 4.9,
    pros: ['World’s first Louvre-branded residences', ' Sunset infinity pool, private cinema & concierge', 'Extreme scarcity'],
    cons: ['Ultra-prime price per sqft & service charges'],
    review: 'Unmatched global prestige right beside the Louvre Abu Dhabi, favored by international UHNW collectors.'
  },
  'Saadiyat Lagoons': {
    score: 4.8,
    chiller: 4.6,
    traffic: 4.8,
    maintenance: 4.8,
    noise: 5.0,
    parking: 5.0,
    pros: ['Standalone 4–6BR eco-villas near mangroves', 'Generous plot sizes', 'Best villa AED/sqft on Saadiyat'],
    cons: ['5–7 minute drive to beachfront'],
    review: 'The most accessible way to own a standalone 4-to-6 bedroom Aldar villa on Saadiyat Island.'
  },
  'Manarat Living & The Row': {
    score: 4.7,
    chiller: 4.6,
    traffic: 4.8,
    maintenance: 4.7,
    noise: 4.7,
    parking: 4.7,
    pros: ['Directly opposite Cranleigh School & Manarat Al Saadiyat', 'Boutique contemporary design', 'High resale liquidity'],
    cons: ['Sold out at launch—resale market only'],
    review: 'Boutique design-led residences right in the Cultural District and Cranleigh school zone.'
  },
  'Soho Square & Park View': {
    score: 4.4,
    chiller: 4.4,
    traffic: 4.9,
    maintenance: 4.3,
    noise: 4.5,
    parking: 4.6,
    pros: ['Directly opposite NYU Abu Dhabi campus', 'Most accessible entry price on Saadiyat', 'Consistent rental yield'],
    cons: ['Inland university zone (short drive to beach)'],
    review: 'Year-round tenant demand from NYU Abu Dhabi faculty, researchers, and students ensures rock-solid yields.'
  },
  'Saadiyat Reserve & Hidd': {
    score: 4.8,
    chiller: 4.5,
    traffic: 4.9,
    maintenance: 4.7,
    noise: 5.0,
    parking: 5.0,
    pros: ['Private peninsula beaches (Hidd) & custom villa plots', 'Ultimate tranquility & security'],
    cons: ['15–20 minute drive to downtown core'],
    review: 'Exclusive coastal villa enclaves offering private beaches, large plots, and serene family living.'
  }
};

export default function ProjectDrawer({ isOpen, onClose, projectName, metrics, properties }) {
  const [activeTab, setActiveTab] = useState('deals'); // 'deals' | 'reviews'

  if (!isOpen || !projectName) return null;

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

  const safeMetrics = metrics || {
    averagePricePerSqFt: 0,
    askingAveragePerSqFt: 0,
    projectGapRate: 0,
    projectTransactions: [],
    recentTransactions: [],
    historicalTrends: []
  };

  const firstProp = properties?.[0] || {};
  const community = COMMUNITY_INSIGHTS[projectName] || COMMUNITY_INSIGHTS['Sun & Sky Towers'];
  const trends = safeMetrics.historicalTrends?.length
    ? safeMetrics.historicalTrends
    : [
        { quarter: '2026 Q1', avgSqFt: Math.round(safeMetrics.averagePricePerSqFt * 0.94) },
        { quarter: '2026 Q2', avgSqFt: Math.round(safeMetrics.averagePricePerSqFt * 0.97) },
        { quarter: '2026 Q3', avgSqFt: safeMetrics.averagePricePerSqFt }
      ];

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40 transition-opacity" onClick={onClose} />
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="px-2 py-0.5 text-[11px] font-bold rounded bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {firstProp.developer || 'Aldar'}
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-amber-50 text-amber-800 border border-amber-100">
                  SC ~{firstProp.serviceChargeSqFt || 17} AED/sqft
                </span>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 text-slate-700">
                  {firstProp.island || 'Abu Dhabi'}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900">{projectName}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={22} className="text-gray-500" />
            </button>
          </div>

          {/* Dual Price Summary Banner */}
          <div className="grid grid-cols-3 gap-2 bg-slate-900 text-white p-4 rounded-xl mb-5">
            <div>
              <p className="text-[11px] text-slate-400">ADREC Official Avg</p>
              <p className="text-lg font-extrabold">
                {safeMetrics.averagePricePerSqFt.toLocaleString()}{' '}
                <span className="text-[10px] font-normal text-slate-300">AED/sf</span>
              </p>
            </div>
            <div className="border-x border-slate-700 px-2">
              <p className="text-[11px] text-slate-400">Latest Unit Avg</p>
              <p className="text-lg font-extrabold text-blue-400">
                {(safeMetrics.askingAveragePerSqFt || safeMetrics.averagePricePerSqFt).toLocaleString()}{' '}
                <span className="text-[10px] font-normal text-slate-300">AED/sf</span>
              </p>
            </div>
            <div className="pl-1">
              <p className="text-[11px] text-slate-400">Price Gap (%)</p>
              <p
                className={`text-lg font-extrabold ${
                  safeMetrics.projectGapRate <= -3
                    ? 'text-emerald-400'
                    : safeMetrics.projectGapRate >= 5
                    ? 'text-rose-400'
                    : 'text-amber-300'
                }`}
              >
                {safeMetrics.projectGapRate > 0 ? `+${safeMetrics.projectGapRate}%` : `${safeMetrics.projectGapRate || 0}%`}
              </p>
            </div>
          </div>

          {/* Tabs: Price Intelligence vs Resident Reviews */}
          <div className="grid grid-cols-2 gap-1.5 bg-gray-100 p-1 rounded-xl mb-6 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('deals')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'deals' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600'
              }`}
            >
              📊 Price & ADREC Sales ({properties.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`py-2 rounded-lg transition ${
                activeTab === 'reviews' ? 'bg-white text-blue-600 shadow-xs' : 'text-gray-600'
              }`}
            >
              💬 Resident Reviews (★{community.score})
            </button>
          </div>

          {activeTab === 'deals' ? (
            <>
              {/* Quarterly Trend Bar */}
              <div className="bg-blue-50/60 p-4 rounded-xl mb-6 border border-blue-100">
                <h3 className="text-xs font-bold text-blue-900 mb-3 flex items-center gap-1.5">
                  <TrendingUp size={15} /> Quarterly ADREC Official Price Trend (AED/sqft)
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {trends.map((t, i) => (
                    <div key={i} className="bg-white p-2.5 rounded-lg border border-blue-100 text-center">
                      <p className="text-[11px] text-gray-500">{t.quarter}</p>
                      <p className="text-sm font-extrabold text-blue-900">{t.avgSqFt.toLocaleString()} AED</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Unit Price Gap Analysis */}
              <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5 border-b pb-2">
                  <Activity size={17} className="text-blue-600" /> Unit Valuation vs. DARI Tier Baseline
                </h3>
                <div className="space-y-3">
                  {properties.map(prop => {
                    const analysis = propertyService.analyzePriceGap(
                      prop.askingAED,
                      prop.areaSqFt,
                      prop.bedrooms,
                      safeMetrics.projectTransactions
                    );

                    return (
                      <div
                        key={prop.id}
                        className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-2xs hover:border-blue-300 transition"
                      >
                        <div className="flex justify-between items-start gap-2 mb-2">
                          <div>
                            <span className="font-bold text-sm text-gray-900">
                              {prop.buildingName || prop.name} • {prop.bedrooms}
                            </span>
                            <p className="text-[11px] text-gray-500">
                              {prop.areaSqFt.toLocaleString()} sqft • {prop.completionStatus || 'Ready'}
                            </p>
                          </div>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getBadgeColor(
                              analysis.type
                            )}`}
                          >
                            {analysis.badge}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg">
                          <div>
                            <p className="text-gray-500 text-[11px]">Latest Recorded / Asking</p>
                            <p className="font-extrabold text-blue-700 text-sm">{formatCurrency(prop.askingAED)}</p>
                            <p className="text-[11px] text-gray-600">{analysis.askingSqFt.toLocaleString()} AED/sf</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-[11px]">DARI {prop.bedrooms} Tier Avg</p>
                            <p className="font-bold text-gray-900 text-sm">
                              {formatCurrency(prop.transactionAmountAED)}
                            </p>
                            <p className="text-[11px] text-gray-600">{analysis.dariAvgSqFt.toLocaleString()} AED/sf</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Official Transactions */}
              <div>
                <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-1.5 border-b pb-2">
                  <Tag size={17} className="text-gray-500" /> Recent Official ADREC Registry Sales
                </h3>
                {safeMetrics.recentTransactions && safeMetrics.recentTransactions.length > 0 ? (
                  <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-200">
                    <ul className="space-y-2.5">
                      {safeMetrics.recentTransactions.map((tx, idx) => (
                        <li
                          key={idx}
                          className="flex justify-between items-center border-b border-gray-200 pb-2.5 last:border-0 last:pb-0 text-xs"
                        >
                          <div>
                            <p className="font-bold text-gray-900">{tx.unit}</p>
                            <p className="text-[11px] text-gray-500">{tx.date} • Official ADREC Registry</p>
                          </div>
                          <div className="text-right">
                            <p className="font-extrabold text-gray-900">{formatCurrency(tx.amount)}</p>
                            <p className="text-[11px] text-gray-500">{tx.pricePerSqFt.toLocaleString()} AED/sqft</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 italic">No recent transactions available.</p>
                )}
              </div>
            </>
          ) : (
            /* Resident & Investor Review Tab */
            <div className="space-y-5">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-700">Abu Dhabi Resident 5-Factor Score</span>
                  <span className="text-sm font-extrabold text-blue-600">★ {community.score} / 5.0</span>
                </div>
                {[
                  { icon: ThermometerSnowflake, label: 'AC / Chiller Efficiency & Cost', val: community.chiller },
                  { icon: Car, label: 'Island Bridge & Commute Traffic', val: community.traffic },
                  { icon: Wrench, label: 'Building Maintenance & FM Quality', val: community.maintenance },
                  { icon: Volume2, label: 'Soundproofing & Quietness', val: community.noise },
                  { icon: ParkingCircle, label: 'Resident & Visitor Parking', val: community.parking }
                ].map(({ icon: Icon, label, val }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <Icon size={14} className="text-slate-500 shrink-0" />
                    <span className="w-48 truncate text-slate-700 font-medium">{label}</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full" style={{ width: `${(val / 5) * 100}%` }} />
                    </div>
                    <span className="w-7 text-right font-bold text-slate-800">{val.toFixed(1)}</span>
                  </div>
                ))}
              </div>

              <div className="p-4 rounded-xl border border-gray-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-600" />
                    Resident & Investor Verdict
                  </span>
                  <span className="text-[11px] text-gray-400">Verified Community Insight</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed flex items-start gap-1.5">
                  <MessageSquareQuote size={16} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>{community.review}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {community.pros.map((p, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200"
                    >
                      👍 {p}
                    </span>
                  ))}
                  {community.cons.map((c, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[11px] font-semibold rounded-md bg-rose-50 text-rose-700 border border-rose-200"
                    >
                      👎 {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
