'use client';

import React from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';

export default function TxReceiptList() {
  const { txReceiptEvents, formatRelativeTime } = useWebSocket();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Transaction Receipts</h2>
      <div className="overflow-y-auto max-h-[300px]">
        {txReceiptEvents.length > 0 ? (
          txReceiptEvents.map((tx, index) => (
            <div key={`${tx.txHash}-${index}`} className="border-l-4 border-blue-500 bg-blue-100 pl-4 py-3 mb-4 rounded-r-lg">
              <div className="font-medium text-gray-900 overflow-hidden text-ellipsis">
                {tx.txHash}
              </div>
              <div className="text-gray-600 text-sm mt-2 flex justify-between px-2">
                <span>Confirmed</span>
                <span>{formatRelativeTime(tx.timestamp)}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">No transaction receipts received yet</div>
        )}
      </div>
    </div>
  );
}