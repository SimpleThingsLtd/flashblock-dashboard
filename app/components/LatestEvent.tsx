'use client';

import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/app/contexts/WebSocketContext';
import { ActivityEvent, TxReceiptEvent, MarketCapEvent, EnhancedEvent } from '@/app/types/events';

export default function LatestEvent() {
  const { activityEvents, txReceiptEvents, marketCapEvents } = useWebSocket();
  const [latestEvent, setLatestEvent] = useState<EnhancedEvent | null>(null);
  const [isNew, setIsNew] = useState(false);
  
  useEffect(() => {
    // Get the most recent event from all types
    const getLatest = () => {
      const latest = {
        activity: activityEvents[0] || null,
        txReceipt: txReceiptEvents[0] || null,
        marketCap: marketCapEvents[0] || null,
      };
      
      // Compare timestamps and return the most recent
      let mostRecent: ActivityEvent | TxReceiptEvent | MarketCapEvent | null = null;
      let mostRecentType: 'activity' | 'txReceipt' | 'marketCap' | null = null;
      let mostRecentTimestamp = '';
      
      if (latest.activity) {
        mostRecent = latest.activity;
        mostRecentType = 'activity';
        mostRecentTimestamp = latest.activity.timestamp;
      }
      
      if (latest.txReceipt && (!mostRecent || new Date(latest.txReceipt.timestamp) > new Date(mostRecentTimestamp))) {
        mostRecent = latest.txReceipt;
        mostRecentType = 'txReceipt';
        mostRecentTimestamp = latest.txReceipt.timestamp;
      }
      
      if (latest.marketCap && (!mostRecent || (latest.marketCap.timestamp && new Date(latest.marketCap.timestamp) > new Date(mostRecentTimestamp)))) {
        mostRecent = latest.marketCap;
        mostRecentType = 'marketCap';
        mostRecentTimestamp = latest.marketCap.timestamp || '';
      }
      
      return { 
        event: mostRecent, 
        type: mostRecentType,
        timestamp: mostRecentTimestamp
      };
    };
    
    const { event, type, timestamp } = getLatest();
    
    if (event && type && (!latestEvent || (latestEvent.timestamp !== timestamp))) {
      setLatestEvent({ 
        event, 
        eventType: type,
        timestamp
      });
      setIsNew(true);
      
      // Reset the "new" flag after the animation duration
      const timeout = setTimeout(() => {
        setIsNew(false);
      }, 1000);
      
      return () => clearTimeout(timeout);
    }
  }, [activityEvents, txReceiptEvents, marketCapEvents, latestEvent]);
  
  if (!latestEvent) {
    return null;
  }
  
  const renderEventContent = () => {
    const { eventType, event } = latestEvent;
    
    if (eventType === 'activity') {
      const activityEvent = event as ActivityEvent;
      const { type, data } = activityEvent;
      
      switch (type) {
        case 'POOL_CREATED':
          return `New Pool: ${data?.symbol || 'Unknown'}`;
        case 'POOL_SWAP':
          return `${data?.operation || 'SWAP'}: ${data?.symbol || 'Unknown'}`;
        case 'USER_FEE_CLAIMED':
          return `Fee Claimed: ${data?.amount_eth ? `${(parseInt(data.amount_eth) / 1e18).toFixed(6)} ETH` : ''}`;
        case 'FAIR_LAUNCH_ENDED':
          return `Fair Launch Ended: ${data?.symbol || 'Unknown'}`;
        case 'SCHEDULED':
          return `Scheduled Launch: ${data?.symbol || 'Unknown'}`;
        default:
          return `Event: ${type}`;
      }
    } else if (eventType === 'txReceipt') {
      const txEvent = event as TxReceiptEvent;
      return `Transaction: ${txEvent.txHash.substring(0, 10)}...`;
    } else if (eventType === 'marketCap') {
      const mcapEvent = event as MarketCapEvent;
      return `Market Cap Update: ${mcapEvent.ticker || 'Unknown'} - $${(parseInt(mcapEvent.marketcapusdc || '0') / 1e6).toFixed(2)}`;
    }
    
    return 'New Event';
  };
  
  const getEventColor = () => {
    const { eventType, event } = latestEvent;
    
    if (eventType === 'activity') {
      const activityEvent = event as ActivityEvent;
      switch (activityEvent.type) {
        case 'POOL_CREATED':
          return 'bg-green-500';
        case 'POOL_SWAP':
          return 'bg-blue-500';
        case 'USER_FEE_CLAIMED':
          return 'bg-purple-500';
        case 'FAIR_LAUNCH_ENDED':
          return 'bg-red-500';
        case 'SCHEDULED':
          return 'bg-yellow-500';
        default:
          return 'bg-gray-500';
      }
    } else if (eventType === 'txReceipt') {
      return 'bg-blue-500';
    } else if (eventType === 'marketCap') {
      return 'bg-green-500';
    }
    
    return 'bg-gray-500';
  };
  
  return (
    <div className={`fixed top-1 right-2 z-50 ${getEventColor()} text-white px-3 py-1 text-xs rounded-lg shadow-lg ${isNew ? 'animate-pulse' : ''}`}>
      <div className="flex items-center">
        <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
        <span>{renderEventContent()}</span>
      </div>
    </div>
  );
}