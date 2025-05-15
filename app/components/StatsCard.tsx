import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  className?: string;
}

export default function StatsCard({ title, value, icon, className = '' }: StatsCardProps) {
  return (
    <div className={`bg-white rounded-lg p-4 shadow-md ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-gray-800 text-sm font-medium">{title}</h3>
          <p className="text-gray-800 text-2xl font-bold">{value}</p>
        </div>
        <div className="text-xl text-gray-500">{icon}</div>
      </div>
    </div>
  );
}