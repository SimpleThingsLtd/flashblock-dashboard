'use client';

import React, { useState, useEffect } from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';
import StatsCard from './StatsCard';
import EventRateGauge from './EventRateGauge';
import { FiActivity, FiClock, FiDatabase, FiDollarSign, FiPieChart, FiCheckCircle } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface EventRateDataPoint {
  time: number;
  value: number;
}

export default function DashboardStats() {
  const { stats, isConnected, latency } = useWebSocket();
  
  // Data for the event rate chart
  const [eventRateData, setEventRateData] = useState<EventRateDataPoint[]>(
    Array(30).fill(0).map((_, i) => ({ time: i, value: 0 }))
  );
  
  // Update the event rate chart data when stats.eventRate changes
  useEffect(() => {
    if (stats.eventRate > 0) {
      setEventRateData(prev => {
        const newData = [...prev.slice(1), { time: prev[prev.length - 1].time + 1, value: stats.eventRate }];
        return newData;
      });
    }
  }, [stats.eventRate]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard Statistics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <StatsCard 
          title="Connection Status" 
          value={isConnected ? "Connected" : "Disconnected"}
          icon={<FiActivity className={isConnected ? "text-green-500" : "text-red-500"} />}
          className={isConnected ? "border-l-4 border-green-500" : "border-l-4 border-red-500"}
        />
        
        <StatsCard 
          title="Latency" 
          value={latency ? `${latency}ms` : "N/A"}
          icon={<FiClock />}
          className="border-l-4 border-blue-500"
        />
        
        <StatsCard 
          title="Total Events" 
          value={stats.totalEvents.toLocaleString()}
          icon={<FiDatabase />}
          className="border-l-4 border-purple-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="text-gray-800 text-lg font-medium mb-2">Events per Second</h3>
          <div className="bg-gray-100 p-3 rounded-lg" style={{ height: '150px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={eventRateData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="time" stroke="#4a5568" tick={false} />
                <YAxis stroke="#4a5568" />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <EventRateGauge eventRate={stats.eventRate || 0} />
      </div>
      
      <div>
        <h3 className="text-gray-800 text-lg font-medium mb-2">Event Type Distribution</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <StatsCard 
            title="Pool Created" 
            value={stats.eventCounts.POOL_CREATED}
            icon={<FiPieChart />}
            className="border-l-4 border-green-500"
          />
          
          <StatsCard 
            title="Pool Swap" 
            value={stats.eventCounts.POOL_SWAP}
            icon={<FiDollarSign />}
            className="border-l-4 border-blue-500"
          />
          
          <StatsCard 
            title="Fee Claimed" 
            value={stats.eventCounts.USER_FEE_CLAIMED}
            icon={<FiCheckCircle />}
            className="border-l-4 border-purple-500"
          />
          
          <StatsCard 
            title="Fair Launch Ended" 
            value={stats.eventCounts.FAIR_LAUNCH_ENDED}
            icon={<FiActivity />}
            className="border-l-4 border-red-500"
          />
          
          <StatsCard 
            title="Scheduled" 
            value={stats.eventCounts.SCHEDULED}
            icon={<FiClock />}
            className="border-l-4 border-yellow-500"
          />
          
          <StatsCard 
            title="Market Cap Updates" 
            value={stats.eventCounts.MCAP_UPDATE}
            icon={<FiPieChart />}
            className="border-l-4 border-green-500"
          />
          
          <StatsCard 
            title="Transaction Receipts" 
            value={stats.eventCounts.TX_RECEIPT}
            icon={<FiCheckCircle />}
            className="border-l-4 border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}