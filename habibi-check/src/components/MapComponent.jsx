import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default leaflet icons not showing up due to webpack issues with images
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to recenter map when properties change
function ChangeView({ center, zoom }) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

export default function MapComponent({ properties, metricsMap, onMarkerClick }) {
  // Aggregate projects for the map
  const projects = useMemo(() => {
    const projMap = new Map();

    properties.forEach(prop => {
      if (!projMap.has(prop.projectName)) {
        projMap.set(prop.projectName, {
          projectName: prop.projectName,
          coordinates: prop.coordinates,
          properties: []
        });
      }
      projMap.get(prop.projectName).properties.push(prop);
    });

    return Array.from(projMap.values());
  }, [properties]);

  const defaultCenter = [24.4539, 54.3773]; // Abu Dhabi Center

  const mapCenter = projects.length > 0 && projects[0].coordinates
    ? [projects[0].coordinates.lat, projects[0].coordinates.lng]
    : defaultCenter;

  const createCustomIcon = (metrics) => {
    const avgPrice = metrics?.averagePricePerSqFt || 0;
    const formattedPrice = Math.round(avgPrice).toLocaleString();

    const htmlString = `
      <div style="
        background-color: white;
        border: 2px solid #2563eb;
        border-radius: 20px;
        padding: 4px 8px;
        font-weight: bold;
        color: #1e3a8a;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
        text-align: center;
        white-space: nowrap;
        font-size: 12px;
      ">
        ${formattedPrice} AED/sqft
      </div>
    `;

    return L.divIcon({
      className: 'custom-div-icon',
      html: htmlString,
      iconSize: [100, 30],
      iconAnchor: [50, 15]
    });
  };

  return (
    <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-md border border-gray-200 relative z-0">
      <MapContainer
        center={mapCenter}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={11} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {projects.map((project, idx) => {
          const metrics = metricsMap[project.projectName];
          if (!project.coordinates) return null;

          return (
            <Marker
              key={`${project.projectName}-${idx}`}
              position={[project.coordinates.lat, project.coordinates.lng]}
              icon={createCustomIcon(metrics)}
              eventHandlers={{
                click: () => onMarkerClick(project.projectName, metrics, project.properties)
              }}
            >
              <Popup>
                <div className="text-center font-bold">
                  {project.projectName}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
