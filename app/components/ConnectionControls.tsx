'use client';

import React from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';

export default function ConnectionControls() {
  const { connect, disconnect, clearEvents } = useWebSocket();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Connection Controls</h2>
      
      <div className="flex space-x-4">
        <button 
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
          onClick={connect}
        >
          Connect
        </button>
        
        <button 
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
          onClick={disconnect}
        >
          Disconnect
        </button>
        
        <button 
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
          onClick={clearEvents}
        >
          Clear Events
        </button>
      </div>
      
      <div className="mt-4 p-3 bg-gray-100 rounded">
        <h3 className="text-gray-800 text-sm font-medium mb-2">WebSocket URL</h3>
        <div className="flex">
          <input
            type="text"
            value="wss://dev-feed.flayerlabs.xyz:443/ws"
            readOnly
            className="flex-1 px-3 py-2 bg-white text-gray-800 border border-gray-300 rounded-l focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button 
            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-r transition"
            onClick={() => {
              navigator.clipboard.writeText('wss://dev-feed.flayerlabs.xyz:443/ws');
              alert('WebSocket URL copied to clipboard!');
            }}
          >
            Copy
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-2">
          Connect using: <code className="bg-gray-100 p-1 rounded">websocat wss://dev-feed.flayerlabs.xyz:443/ws</code>
        </p>
      </div>
    </div>
  );
}