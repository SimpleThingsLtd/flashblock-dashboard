'use client';

import React from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';
import { ActivityEvent, PoolCreatedEvent, PoolSwapEvent, UserFeeClaimedEvent, FairLaunchEndedEvent, ScheduledEvent } from '@/app/types/events';

export default function ActivityEventList() {
  const { activityEvents, formatRelativeTime } = useWebSocket();

  const getEventColor = (type: string): string => {
    switch (type) {
      case 'POOL_CREATED':
        return 'border-green-500 bg-green-500/10';
      case 'POOL_SWAP':
        return 'border-blue-500 bg-blue-500/10';
      case 'USER_FEE_CLAIMED':
        return 'border-purple-500 bg-purple-500/10';
      case 'FAIR_LAUNCH_ENDED':
        return 'border-red-500 bg-red-500/10';
      case 'SCHEDULED':
        return 'border-yellow-500 bg-yellow-500/10';
      default:
        return 'border-gray-500 bg-gray-500/10';
    }
  };

  const renderEventContent = (event: ActivityEvent) => {
    const { type } = event;
    
    switch (type) {
      case 'POOL_CREATED': {
        const poolEvent = event as PoolCreatedEvent;
        return (
          <>
            <div className="font-medium text-gray-800">New Pool Created: {poolEvent.data?.symbol || 'Unknown'}</div>
            <div className="text-gray-400 text-sm mt-1">
              Maker: {poolEvent.data?.maker_short || 'Unknown'}
            </div>
          </>
        );
      }
      case 'POOL_SWAP': {
        const swapEvent = event as PoolSwapEvent;
        return (
          <>
            <div className="font-medium text-gray-800">
              {swapEvent.data?.operation || 'SWAP'}: {swapEvent.data?.symbol || 'Unknown'}
            </div>
            <div className="text-gray-400 text-sm mt-1">
              {swapEvent.data?.amount_eth ? `${(parseInt(swapEvent.data.amount_eth) / 1e18).toFixed(6)} ETH` : ''} 
              {swapEvent.data?.value_usdc ? ` ($${(parseInt(swapEvent.data.value_usdc) / 1e6).toFixed(2)})` : ''}
            </div>
          </>
        );
      }
      case 'USER_FEE_CLAIMED': {
        const feeEvent = event as UserFeeClaimedEvent;
        return (
          <>
            <div className="font-medium text-gray-800">Fee Claimed</div>
            <div className="text-gray-400 text-sm mt-1">
              Recipient: {feeEvent.data?.recipient ? `${feeEvent.data.recipient.substring(0, 6)}...${feeEvent.data.recipient.substring(feeEvent.data.recipient.length - 4)}` : 'Unknown'}
              <br />
              Amount: {feeEvent.data?.amount_eth ? `${(parseInt(feeEvent.data.amount_eth) / 1e18).toFixed(6)} ETH` : ''} 
              {feeEvent.data?.amount_usdc ? ` ($${(parseInt(feeEvent.data.amount_usdc) / 1e6).toFixed(2)})` : ''}
            </div>
          </>
        );
      }
      case 'FAIR_LAUNCH_ENDED': {
        const endEvent = event as FairLaunchEndedEvent;
        return (
          <>
            <div className="font-medium text-gray-800">Fair Launch Ended: {endEvent.data?.symbol || 'Unknown'}</div>
            <div className="text-gray-400 text-sm mt-1">
              Revenue: {endEvent.data?.revenue ? `${(parseInt(endEvent.data.revenue) / 1e18).toFixed(6)} ETH` : 'N/A'}
              <br />
              Address: {endEvent.data?.memecoinaddress ? `${endEvent.data.memecoinaddress.substring(0, 6)}...${endEvent.data.memecoinaddress.substring(endEvent.data.memecoinaddress.length - 4)}` : 'Unknown'}
            </div>
          </>
        );
      }
      case 'SCHEDULED': {
        const schedEvent = event as ScheduledEvent;
        return (
          <>
            <div className="font-medium text-gray-800">Scheduled Launch: {schedEvent.data?.symbol || 'Unknown'}</div>
            <div className="text-gray-400 text-sm mt-1">
              Maker: {schedEvent.data?.maker_short || 'Unknown'}
              <br />
              Starts: {schedEvent.data?.starts_at ? new Date(schedEvent.data.starts_at).toLocaleString() : 'Unknown'}
            </div>
          </>
        );
      }
      default:
        return <div className="font-medium">Unknown Event: {type}</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Feed</h2>
      <div className="overflow-y-auto max-h-[500px]">
        {activityEvents.length > 0 ? (
          activityEvents.map((event, index) => (
            <div 
              key={`${event.type}-${event.timestamp}-${index}`} 
              className={`border-l-4 pl-4 py-3 mb-4 ${getEventColor(event.type)} rounded-r-lg`}
            >
              <div className="flex justify-between items-start px-2">
                <div className="flex-1">
                  {renderEventContent(event)}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap ml-2">
                  <div className="bg-gray-100 rounded px-2 py-1">
                    {event.type}
                  </div>
                  <div className="text-center mt-1">
                    {formatRelativeTime(event.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-6">No activity events received yet</div>
        )}
      </div>
    </div>
  );
}