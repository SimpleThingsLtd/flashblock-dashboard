// Types for WebSocket events

// Custom WebSocket type with additional properties
export interface CustomWebSocket extends WebSocket {
  pingInterval?: NodeJS.Timeout;
}

// Base event interface
export interface BaseEvent {
    chainid?: string;
    timestamp: string;
  }
  
  // Activity Event Types
  export type ActivityEventType = 
    | 'POOL_CREATED' 
    | 'POOL_SWAP' 
    | 'USER_FEE_CLAIMED' 
    | 'FAIR_LAUNCH_ENDED' 
    | 'SCHEDULED'
    | 'MCAP_UPDATE';
  
  // Pool Created Event
  export interface PoolCreatedData {
    symbol: string;
    name?: string;
    image: string;
    maker: string;
    maker_short: string;
    pmversion: string;
    memecoinaddress: string;
  }
  
  export interface PoolCreatedEvent extends BaseEvent {
    type: 'POOL_CREATED';
    data: PoolCreatedData;
  }
  
  // Pool Swap Event
  export interface PoolSwapData {
    symbol: string;
    image: string;
    maker: string;
    maker_short: string;
    operation: string;
    amount_eth: string;
    amount_token: string;
    value_usdc: string;
  }
  
  export interface PoolSwapEvent extends BaseEvent {
    type: 'POOL_SWAP';
    data: PoolSwapData;
  }
  
  // User Fee Claimed Event
  export interface UserFeeClaimedData {
    recipient: string;
    amount_eth: string;
    amount_usdc: string;
  }
  
  export interface UserFeeClaimedEvent extends BaseEvent {
    type: 'USER_FEE_CLAIMED';
    data: UserFeeClaimedData;
  }
  
  // Fair Launch Ended Event
  export interface FairLaunchEndedData {
    name: string;
    symbol: string;
    image: string;
    revenue: string;
    supply: string;
    ended_at: string;
    memecoinaddress: string;
  }
  
  export interface FairLaunchEndedEvent extends BaseEvent {
    type: 'FAIR_LAUNCH_ENDED';
    data: FairLaunchEndedData;
  }
  
  // Scheduled Event
  export interface ScheduledData {
    symbol: string;
    name: string;
    image: string;
    maker: string;
    maker_short: string;
    pmversion: string;
    memecoinaddress: string;
    starts_at: string;
  }
  
  export interface ScheduledEvent extends BaseEvent {
    type: 'SCHEDULED';
    data: ScheduledData;
  }
  
  // Transaction Receipt Event
  export interface TxReceiptEvent {
    txHash: string;
    timestamp: string;
  }
  
  // Market Cap Update Event
  export interface MarketCapEvent {
    type: 'MCAP_UPDATE';
    ticker: string;
    memecoin: string;
    marketcapusdc: string;
    marketcapeth: string;
    timestamp?: string; // Adding timestamp for consistency
  }
  
  // Union type for all activity events
  export type ActivityEvent = 
    | PoolCreatedEvent 
    | PoolSwapEvent 
    | UserFeeClaimedEvent 
    | FairLaunchEndedEvent 
    | ScheduledEvent;
  
  // Ping/Pong messages
  export interface PingMessage {
    action: 'ping';
    timestamp: string;
  }
  
  export interface PongMessage {
    action: 'pong';
    timestamp: string;
  }
  
  // WebSocket subscription messages
  export interface SubscribeMessage {
    action: 'subscribe';
    channel: string;
  }
  
  export interface UnsubscribeMessage {
    action: 'unsubscribe';
    channel: string;
  }
  
  // Stats tracking
  export interface EventStats {
    totalEvents: number;
    eventCounts: {
      POOL_CREATED: number;
      POOL_SWAP: number;
      USER_FEE_CLAIMED: number;
      FAIR_LAUNCH_ENDED: number;
      SCHEDULED: number;
      MCAP_UPDATE: number;
      TX_RECEIPT: number;
    };
    eventRate: number;
    lastEventTime?: number;
    recentTransactions: Set<string>;
  }
  
  // WebSocket context type
  export interface WebSocketContextType {
    isConnected: boolean;
    connectionError: string | null;
    latency: string;  // Always formatted as a string
    activityEvents: ActivityEvent[];
    txReceiptEvents: TxReceiptEvent[];
    marketCapEvents: MarketCapEvent[];
    stats: EventStats;
    formatRelativeTime: (timestamp: string) => string;
    connect: () => void;
    disconnect: () => void;
    clearEvents: () => void;
    manualReconnect: () => void;
  }
  
  // Enhanced event type with metadata for UI
  export interface EnhancedEvent {
    event: ActivityEvent | TxReceiptEvent | MarketCapEvent;
    eventType: 'activity' | 'txReceipt' | 'marketCap';
    timestamp: string;
  }