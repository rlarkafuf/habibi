import React, { useMemo } from 'react';
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

export default function MapComponent({ properties, metricsMap, onMarkerClick }) {
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

  // Hogangnono-style floating speech-bubble marker
  const createHogangnonoIcon = (project, metrics) => {
    const avgPrice = metrics?.averagePricePerSqFt || 0;
    const formattedPrice = Math.round(avgPrice).toLocaleString();

    // Find best deal in this project
    const txPool = metrics?.projectTransactions?.length ? metrics.projectTransactions : project.properties;
    const evaluations = project.properties.map(p =>
      analyzePriceGap(p.askingAED, p.areaSqFt, p.bedrooms, txPool)
    );
    const bestEval = evaluations.sort((a, b) => a.gapRate - b.gapRate)[0] || { gapRate: 0, type: 'fair' };

    const isBelow = bestEval.type === 'below';
    const isPremium = bestEval.type === 'premium';

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
