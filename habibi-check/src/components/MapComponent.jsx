import React, { useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { analyzePriceGap } from '../services/propertyService';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const DEFAULT_CENTER = [24.5050, 54.4800]; // Centered between Al Reem, Saadiyat, and Yas

function formatAEDCompact(num) {
  if (!num || isNaN(num)) return '';
  if (num >= 1000000) {
    const val = (num / 1000000).toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1');
    return `${val}M`;
  }
  if (num >= 1000) {
    return `${Math.round(num / 1000)}K`;
  }
  return String(num);
}

export default function MapComponent({ properties, metricsMap, onMarkerClick }) {
  // Marker display mode: 'keyUnit' (default Hogangnono pill) | 'minimal' (no price balloons) | 'detailed'
  const [markerMode, setMarkerMode] = useState('keyUnit');

  // Aggregate projects for the map
  const projects = useMemo(() => {
    const projMap = new Map();

    properties.forEach(prop => {
      const key = prop.projectName || prop.name;
      if (!projMap.has(key)) {
        projMap.set(key, {
          projectName: key,
          developer: prop.developer,
          island: prop.island || prop.location,
          coordinates: prop.coordinates,
          properties: []
        });
      }
      projMap.get(key).properties.push(prop);
    });

    return Array.from(projMap.values());
  }, [properties]);

  // Compute centroid of visible projects so the camera frames all markers cleanly
  const mapCenter = useMemo(() => {
    const valid = projects.filter(p => p.coordinates);
    if (valid.length === 0) return DEFAULT_CENTER;
    const avgLat = valid.reduce((s, p) => s + p.coordinates.lat, 0) / valid.length;
    const avgLng = valid.reduce((s, p) => s + p.coordinates.lng, 0) / valid.length;
    return [avgLat, avgLng];
  }, [projects]);

  const mapZoom = useMemo(() => {
    const uniqueIslands = new Set(projects.map(p => p.island));
    if (uniqueIslands.size === 1) return 13;
    return 11;
  }, [projects]);

  // Hogangnono-style marker generator based on active mode
  const createHogangnonoIcon = (project, metrics) => {
    const txPool = metrics?.projectTransactions?.length ? metrics.projectTransactions : project.properties;
    const evaluations = project.properties.map(p =>
      analyzePriceGap(p.askingAED, p.areaSqFt, p.bedrooms, txPool)
    );
    const bestEval = evaluations.sort((a, b) => a.gapRate - b.gapRate)[0] || { gapRate: 0, type: 'fair' };
    const isBelow = bestEval.type === 'below';
    const isPremium = bestEval.type === 'premium';

    // 1. Minimal Mode: Clean Landmark Pin without price balloons
    if (markerMode === 'minimal') {
      const dotColor = isBelow ? '#059669' : isPremium ? '#e11d48' : '#2563eb';
      const htmlString = `
        <div style="
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: pointer;
          filter: drop-shadow(0 2px 4px rgba(15, 23, 42, 0.25));
        ">
          <div style="
            background: #ffffff;
            color: #0f172a;
            border: 1.5px solid #cbd5e1;
            border-radius: 9999px;
            padding: 3px 9px;
            display: inline-flex;
            align-items: center;
            gap: 5px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
          ">
            <span style="width: 7px; height: 7px; border-radius: 50%; background: ${dotColor};"></span>
            <span>${project.projectName}</span>
          </div>
          <div style="
            width: 6px;
            height: 6px;
            background: #ffffff;
            border-right: 1.5px solid #cbd5e1;
            border-bottom: 1.5px solid #cbd5e1;
            transform: rotate(45deg);
            margin-top: -3px;
          "></div>
        </div>
      `;
      return L.divIcon({
        className: 'hogangnono-marker-minimal',
        html: htmlString,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
    }

    // 2. Key Unit Mode (Default): Authentic Hogangnono single-line horizontal capsule
    if (markerMode === 'keyUnit') {
      const coreUnit =
        project.properties.find(p => p.bedrooms === '2BR') ||
        project.properties.find(p => p.bedrooms === '1BR') ||
        project.properties[0];

      const priceLabel = coreUnit
        ? `${coreUnit.bedrooms} ${formatAEDCompact(coreUnit.askingAED)}`
        : `${Math.round(metrics?.averagePricePerSqFt || 0)} AED/sf`;

      const bgGradient = isBelow
        ? 'linear-gradient(135deg, #059669 0%, #047857 100%)'
        : isPremium
        ? 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)'
        : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)';

      const htmlString = `
        <div style="
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          transform: translate(-50%, -100%);
          cursor: pointer;
          filter: drop-shadow(0 4px 8px rgba(15, 23, 42, 0.35));
          transition: transform 0.15s ease;
        ">
          <div style="
            background: ${bgGradient};
            color: #ffffff;
            border: 1.5px solid rgba(255, 255, 255, 0.28);
            border-radius: 9999px;
            padding: 3px 10px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-family: system-ui, -apple-system, sans-serif;
            font-size: 11px;
            font-weight: 700;
            white-space: nowrap;
          ">
            ${isBelow ? '<span style="font-size: 10px;">🔥</span>' : ''}
            <span style="font-weight: 600; color: #f8fafc;">${project.projectName}</span>
            <span style="width: 1px; height: 10px; background: rgba(255, 255, 255, 0.3);"></span>
            <span style="font-weight: 800; color: #fbbf24;">${priceLabel}</span>
          </div>
          <div style="
            width: 6px;
            height: 6px;
            background: ${isBelow ? '#047857' : isPremium ? '#be123c' : '#0f172a'};
            transform: rotate(45deg);
            margin-top: -3px;
          "></div>
        </div>
      `;

      return L.divIcon({
        className: 'hogangnono-marker-keyunit',
        html: htmlString,
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      });
    }

    // 3. Detailed Mode: Full 2-tier breakdown balloon
    const avgPrice = metrics?.averagePricePerSqFt || 0;
    const formattedPrice = Math.round(avgPrice).toLocaleString();
    const headerBg = isBelow ? '#059669' : isPremium ? '#e11d48' : '#2563eb';
    const badgeText = isBelow
      ? `🔥 ${bestEval.gapRate}% Deal`
      : isPremium
      ? `📈 +${bestEval.gapRate}%`
      : `⚖️ Fair`;

    const htmlString = `
      <div style="
        display: inline-flex;
        flex-direction: column;
        align-items: center;
        transform: translate(-50%, -100%);
        cursor: pointer;
        filter: drop-shadow(0 6px 10px rgba(15, 23, 42, 0.22));
      ">
        <div style="
          background: #ffffff;
          border: 2px solid ${headerBg};
          border-radius: 12px;
          overflow: hidden;
          min-width: 128px;
          font-family: system-ui, -apple-system, sans-serif;
        ">
          <div style="
            background: ${headerBg};
            color: #ffffff;
            font-size: 10px;
            font-weight: 800;
            padding: 3px 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 6px;
            white-space: nowrap;
          ">
            <span>${project.projectName}</span>
            <span style="background: rgba(255,255,255,0.22); padding: 1px 5px; border-radius: 999px;">${badgeText}</span>
          </div>
          <div style="
            padding: 4px 8px;
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 6px;
            background: #ffffff;
            white-space: nowrap;
          ">
            <span style="font-size: 13px; font-weight: 900; color: #0f172a;">
              ${formattedPrice} <span style="font-size: 10px; font-weight: 600; color: #64748b;">AED/sf</span>
            </span>
            <span style="font-size: 10px; font-weight: 700; color: #475569;">
              ${project.properties.length} units
            </span>
          </div>
        </div>
        <div style="
          width: 10px;
          height: 10px;
          background: #ffffff;
          border-right: 2px solid ${headerBg};
          border-bottom: 2px solid ${headerBg};
          transform: rotate(45deg);
          margin-top: -6px;
        "></div>
      </div>
    `;

    return L.divIcon({
      className: 'hogangnono-marker-icon',
      html: htmlString,
      iconSize: [0, 0],
      iconAnchor: [0, 0]
    });
  };

  return (
    <div className="h-[560px] w-full rounded-2xl overflow-hidden shadow-md border border-gray-200 relative z-0">
      {/* Map Marker Display Mode Switcher */}
      <div className="absolute top-3 right-3 z-[1000] bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-gray-200 p-1 flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => setMarkerMode('keyUnit')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            markerMode === 'keyUnit'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Show key bedroom unit price capsule per community (Hogangnono style)"
        >
          Key Unit (Core)
        </button>
        <button
          type="button"
          onClick={() => setMarkerMode('minimal')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            markerMode === 'minimal'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Hide price balloons, show clean pins only"
        >
          Pins Only
        </button>
        <button
          type="button"
          onClick={() => setMarkerMode('detailed')}
          className={`px-3 py-1.5 rounded-lg font-semibold transition ${
            markerMode === 'detailed'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Show full price per sqft balloon"
        >
          Detailed
        </button>
      </div>

      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={mapZoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {projects.map((project, idx) => {
          const metrics = metricsMap[project.projectName];
          if (!project.coordinates) return null;

          return (
            <Marker
              key={`${project.projectName}-${idx}`}
              position={[project.coordinates.lat, project.coordinates.lng]}
              icon={createHogangnonoIcon(project, metrics)}
              eventHandlers={{
                click: () => onMarkerClick(project.projectName, metrics, project.properties)
              }}
            >
              <Popup>
                <div className="text-center font-bold text-xs">
                  {project.projectName} ({project.island})
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
