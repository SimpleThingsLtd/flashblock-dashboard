'use client';

import React from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';

export default function ConnectionStatus() {
  const { isConnected, connectionError, latency } = useWebSocket();

  return (
    <div className="fixed top-1 left-1 -z-1">
      <div className={`rounded-full px-3 opacity-50 py-1 flex items-center shadow-md ${isConnected ? 'bg-green-600' : 'bg-red-600'}`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-white' : 'bg-red-300'} animate-pulse`} />
        <span className="text-white text-xs font-semibold">
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