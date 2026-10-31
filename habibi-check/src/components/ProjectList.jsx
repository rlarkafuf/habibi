import React from 'react';
import ProjectCard from './ProjectCard';

export default function ProjectList({ properties, metricsMap = {} }) {
  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
        <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map(property => {
        const key = property.projectName || property.name;
        return (
          <ProjectCard
            key={property.id}
            property={property}
            metrics={metricsMap[key] || { averagePricePerSqFt: 0, projectTransactions: [], recentTransactions: [] }}
          />
        );
      })}
    </div>
  );
}
