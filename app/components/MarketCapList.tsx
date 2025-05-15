'use client';

import React from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';

export default function MarketCapList() {
  const { marketCapEvents } = useWebSocket();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Market Cap Updates</h2>
      <div className="overflow-y-auto max-h-[300px]">
        {marketCapEvents.length > 0 ? (
          marketCapEvents.map((event, index) => (
            <div key={`${event.memecoin}-${index}`} className="border-l-4 border-blue-500 bg-blue-100 pl-4 py-3 mb-4 rounded-r-lg">
              <div className="font-medium text-gray-900">
                {event.ticker || 'Unknown'}
              </div>
              <div className="text-gray-600 text-sm mt-2 px-2">
                <div className="flex justify-between">
                  <span>Market Cap (USDC):</span>
                  <span className="font-medium">${(parseInt(event.marketcapusdc || '0') / 1e6).toFixed(2)}</span>
                </div>
                <div className="flex justify-between mt-2">
                  <span>Market Cap (ETH):</span>
                  <span className="font-medium">{(parseInt(event.marketcapeth || '0') / 1e18).toFixed(6)} ETH</span>
                </div>
                <div className="text-xs mt-2 text-gray-500 break-all">
                  {event.memecoin}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">No market cap updates received yet</div>
        )}
      </div>
    </div>
  );
}