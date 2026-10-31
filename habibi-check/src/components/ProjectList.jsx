import React, { useEffect, useState } from 'react';
import ProjectCard from './ProjectCard';
import { propertyService } from '../services/propertyService';

export default function ProjectList({ properties }) {
  const [metricsMap, setMetricsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMetrics = async () => {
      setLoading(true);
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
        setLoading(false);
      }
    };

    if (properties.length > 0) {
      fetchMetrics();
    } else {
      setLoading(false);
    }

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties]);

  if (loading) {
    return <div className="text-center py-10 text-gray-500">Loading project analytics...</div>;
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
        <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => (
        <ProjectCard
          key={property.id}
          property={property}
          metrics={metricsMap[`${property.projectName}-${property.bedrooms}`] || { averagePricePerSqFt: 0, recentTransactions: [] }}
        />
      ))}
    </div>
  );
}
