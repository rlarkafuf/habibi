import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { propertyService } from '../services/propertyService';
import { TrendingUp, History } from 'lucide-react';

export default function MapComponent({ properties }) {
  const [metricsMap, setMetricsMap] = useState({});
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      const newMetricsMap = {};
      const uniqueProjectRooms = [...new Set(properties.map(p => `${p.projectName}-${p.bedrooms}`))];

      for (const key of uniqueProjectRooms) {
        if (!metricsMap[key]) {
           const [projectName, bedrooms] = key.split('-');
           const metrics = await propertyService.calculateProjectMetrics(projectName, bedrooms);
           newMetricsMap[key] = metrics;
        } else {
           newMetricsMap[key] = metricsMap[key];
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(amount);
  };

  const createBubbleIcon = (pricePerSqFt, projectName) => {
    return L.divIcon({
      className: 'custom-bubble-icon',
      html: `
        <div class="bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-lg border-2 border-white whitespace-nowrap transform -translate-y-full hover:scale-110 transition-transform">
          <div class="text-xs opacity-90">${projectName}</div>
          <div class="text-sm">${formatCurrency(pricePerSqFt)}/sqft</div>
          <div class="w-3 h-3 bg-blue-600 absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 rotate-45 border-r-2 border-b-2 border-white"></div>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  const mapCenter = [24.505, 54.455]; // Centered around Abu Dhabi Islands

  // Group properties by coordinates to avoid overlapping markers
  const groupedProperties = properties.reduce((acc, curr) => {
      const key = `${curr.lat},${curr.lng}`;
      if (!acc[key]) {
          acc[key] = { lat: curr.lat, lng: curr.lng, projects: [] };
      }
      acc[key].projects.push(curr);
      return acc;
  }, {});


  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden border border-gray-200 shadow-sm z-0">
      <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {Object.values(groupedProperties).map((group, idx) => {
           // Display the first project in the group as the main bubble, or aggregate
           const mainProp = group.projects[0];
           const metricKey = `${mainProp.projectName}-${mainProp.bedrooms}`;
           const avgPrice = metricsMap[metricKey]?.averagePricePerSqFt || 0;

           if (!mainProp.lat || !mainProp.lng) return null;

           return (
             <Marker
               key={idx}
               position={[mainProp.lat, mainProp.lng]}
               icon={createBubbleIcon(avgPrice, mainProp.projectName)}
               eventHandlers={{
                 click: () => setSelectedProject({ property: mainProp, metrics: metricsMap[metricKey] })
               }}
             />
           )
        })}
      </MapContainer>

      {/* Slide-over Detail Modal */}
      {selectedProject && (
        <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-2xl p-5 z-[1000] overflow-y-auto animate-fade-in transition-all">
          <button
            onClick={() => setSelectedProject(null)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
          >
            ✕
          </button>
          <h3 className="text-lg font-bold text-gray-900 mt-2">{selectedProject.property.projectName}</h3>
          <p className="text-sm text-gray-500 mb-4">{selectedProject.property.location}</p>

          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-blue-500" />
              Avg Price: {formatCurrency(selectedProject.metrics?.averagePricePerSqFt || 0)}/sqft
            </h4>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-500 flex items-center gap-1 mb-2">
                <History size={12} /> Recent Transactions
              </p>
              {selectedProject.metrics?.recentTransactions?.length > 0 ? (
                <ul className="text-xs text-gray-600 space-y-2">
                  {selectedProject.metrics.recentTransactions.map((tx, i) => (
                    <li key={i} className="flex flex-col border-b border-gray-50 pb-2 last:border-0">
                      <div className="flex justify-between font-semibold text-gray-800">
                        <span>{tx.unit}</span>
                        <span>{formatCurrency(tx.amount)}</span>
                      </div>
                      <span className="text-gray-400">{new Date(tx.date).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400">No recent transactions found.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
