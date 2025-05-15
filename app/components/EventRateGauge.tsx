'use client';

import React from 'react';

interface EventRateGaugeProps {
  eventRate: number;
}

export default function EventRateGauge({ eventRate }: EventRateGaugeProps) {
  // Calculate percentage of gauge fill (max rate assumed to be 50 events/sec)
  const maxRate = 50;
  const percentage = Math.min(100, (eventRate / maxRate) * 100);
  
  // Determine color based on event rate
  const getColor = (rate: number): string => {
    if (rate < 5) return 'bg-blue-500';
    if (rate < 20) return 'bg-green-500';
    if (rate < 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const color = getColor(eventRate);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
      <h3 className="text-gray-800 text-sm font-medium mb-2">Event Rate</h3>
      
      <div className="text-gray-800 text-3xl font-bold mb-3">
        {eventRate.toFixed(1)} <span className="text-sm font-normal">events/sec</span>
      </div>
      
      <div className="w-full bg-gray-100 h-4 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="w-full flex justify-between mt-1 text-xs text-gray-500">
        <span>0</span>
        <span>{maxRate / 4}</span>
        <span>{maxRate / 2}</span>
        <span>{maxRate * 3 / 4}</span>
        <span>{maxRate}+</span>
      </div>
    </div>
  );
}