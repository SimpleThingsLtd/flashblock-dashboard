'use client';

import React from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';

export default function ConnectionStatus() {
  const { isConnected, connectionError, latency } = useWebSocket();

  return (
    <div className="fixed top-4 right-4 z-50">
      <div className={`rounded-full px-4 py-2 flex items-center shadow-md ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
        <div className={`w-3 h-3 rounded-full mr-2 ${isConnected ? 'bg-white' : 'bg-red-300'} animate-pulse`} />
        <span className="text-white text-sm font-semibold">
          {isConnected ? 'Connected' : 'Disconnected'}
          {isConnected && latency && ` (${latency})`}
        </span>
      </div>
      
      {connectionError && (
        <div className="mt-2 bg-red-600 text-white text-sm p-3 rounded shadow-md">
          {connectionError}
        </div>
      )}
    </div>
  );
}