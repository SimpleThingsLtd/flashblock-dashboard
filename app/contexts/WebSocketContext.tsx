`use client`;

import React, {
  createContext,
  useContext,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useMemo,
  useState,
} from 'react';
import { formatDistance } from 'date-fns';
import {
  ActivityEvent,
  TxReceiptEvent,
  MarketCapEvent,
  WebSocketContextType,
  SubscribeMessage,
  PingMessage,
  CustomWebSocket,
  EventStats,
} from '@/app/types/events';

// Maximum number of events to keep
const MAX_EVENTS = 100;
// WebSocket URL
const WS_URL = 'wss://base-mainnet-feed.flaunch.gg/ws';
// Timeouts & reconnection
const CONNECTION_TIMEOUT = 5000;
const MAX_RECONNECT_ATTEMPTS = 5;

// Action types for reducer
type Action =
  | { type: 'ADD_ACTIVITY'; payload: ActivityEvent }
  | { type: 'ADD_TX_RECEIPT'; payload: TxReceiptEvent }
  | { type: 'ADD_MCAP'; payload: MarketCapEvent }
  | { type: 'PONG'; latency: number }
  | { type: 'RESET' };

// State shape for events, stats, and lists
interface State extends EventStats {
  lastEventTime: number;
  latency?: number;
  activityEvents: ActivityEvent[];
  txReceiptEvents: TxReceiptEvent[];
  marketCapEvents: MarketCapEvent[];
}

const initialState: State = {
  totalEvents: 0,
  eventCounts: {
    POOL_CREATED: 0,
    POOL_SWAP: 0,
    USER_FEE_CLAIMED: 0,
    FAIR_LAUNCH_ENDED: 0,
    SCHEDULED: 0,
    MCAP_UPDATE: 0,
    TX_RECEIPT: 0,
    BIDWALL_UPDATE: 0,
  },
  eventRate: 0,
  recentTransactions: new Set<string>(),
  lastEventTime: Date.now(),
  latency: undefined,
  activityEvents: [],
  txReceiptEvents: [],
  marketCapEvents: [],
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'RESET':
      return { ...initialState, lastEventTime: Date.now() };
    case 'PONG':
      return { ...state, latency: action.latency };
    case 'ADD_ACTIVITY': {
      const ev = action.payload;
      const newCounts = {
        ...state.eventCounts,
        [ev.type]: (state.eventCounts[ev.type] || 0) + 1,
      };
      const newList = [ev, ...state.activityEvents].slice(0, MAX_EVENTS);
      return {
        ...state,
        totalEvents: state.totalEvents + 1,
        eventCounts: newCounts,
        activityEvents: newList,
      };
    }
    case 'ADD_TX_RECEIPT': {
      const ev = action.payload;
      const now = Date.now();
      const txId = ev.txHash;
      const recent = new Set(state.recentTransactions);
      let lastEventTime = state.lastEventTime;
      let eventRate = state.eventRate;
      if (txId) {
        if (now - lastEventTime >= 1000) {
          eventRate = recent.size / ((now - lastEventTime) / 1000);
          recent.clear();
          lastEventTime = now;
        }
        recent.add(txId);
      }
      const newCounts = {
        ...state.eventCounts,
        TX_RECEIPT: state.eventCounts.TX_RECEIPT + 1,
      };
      const newList = [ev, ...state.txReceiptEvents].slice(0, MAX_EVENTS);
      return {
        ...state,
        totalEvents: state.totalEvents + 1,
        eventCounts: newCounts,
        eventRate,
        recentTransactions: recent,
        lastEventTime,
        txReceiptEvents: newList,
      };
    }
    case 'ADD_MCAP': {
      const ev = action.payload;
      const newCounts = {
        ...state.eventCounts,
        MCAP_UPDATE: state.eventCounts.MCAP_UPDATE + 1,
      };
      const newList = [ev, ...state.marketCapEvents].slice(0, MAX_EVENTS);
      return {
        ...state,
        totalEvents: state.totalEvents + 1,
        eventCounts: newCounts,
        marketCapEvents: newList,
      };
    }
    default:
      return state;
  }
}

// Hook: manages socket lifecycle, reconnection, ping
function useWebSocketConnection() {
  const socketRef = useRef<CustomWebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const timeoutRef = useRef<number>();
  const pingIntervalRef = useRef<number>();

  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [, forceRender] = useState({});

  const connect = useCallback(() => {
    if (socketRef.current) return;
    const ws = new WebSocket(WS_URL) as CustomWebSocket;
    socketRef.current = ws;

    const onOpen = () => {
      clearTimeout(timeoutRef.current);
      reconnectAttempts.current = 0;
      setIsConnected(true);
      setConnectionError(null);
      ['activity', 'tx-receipts', 'mcap-updates'].forEach(channel => {
        ws.send(JSON.stringify({ action: 'subscribe', channel } as SubscribeMessage));
      });
      pingIntervalRef.current = window.setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          (ws as any)._lastPing = new Date();
          ws.send(JSON.stringify({ action: 'ping', timestamp: new Date().toISOString() } as PingMessage));
        }
      }, 5000);
    };

    const onClose = (event: CloseEvent) => {
      window.clearInterval(pingIntervalRef.current);
      clearTimeout(timeoutRef.current);
      ws.removeEventListener('open', onOpen);
      ws.removeEventListener('close', onClose);
      ws.removeEventListener('error', onError);
      ws.removeEventListener('message', onMessage);
      socketRef.current = null;
      setIsConnected(false);
      if (event.code !== 1000 && reconnectAttempts.current < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts.current += 1;
        const delay = Math.min(1000 * 2 ** (reconnectAttempts.current - 1), 30000);
        timeoutRef.current = window.setTimeout(connect, delay);
      } else if (reconnectAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
        setConnectionError('Max reconnect attempts reached');
      }
    };

    const onError = () => {
      clearTimeout(timeoutRef.current);
      setConnectionError('WebSocket error');
    };

    const onMessage = () => {
      forceRender({});
    };

    ws.addEventListener('open', onOpen);
    ws.addEventListener('close', onClose);
    ws.addEventListener('error', onError);
    ws.addEventListener('message', onMessage);

    timeoutRef.current = window.setTimeout(() => {
      if (ws.readyState !== WebSocket.OPEN) {
        ws.close();
        setConnectionError('Connection timeout');
      }
    }, CONNECTION_TIMEOUT);
  }, []);

  const disconnect = useCallback(() => {
    const ws = socketRef.current;
    if (ws) {
      window.clearInterval(pingIntervalRef.current);
      clearTimeout(timeoutRef.current);
      ws.close();
      socketRef.current = null;
      reconnectAttempts.current = 0;
      setIsConnected(false);
    }
  }, []);

  const manualReconnect = useCallback(() => {
    disconnect();
    window.setTimeout(connect, 1000);
  }, [disconnect, connect]);

  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  return {
    socket: socketRef.current,
    isConnected,
    connectionError,
    manualReconnect,
  };
}

// Hook: dispatches incoming messages to reducer
function useWebSocketEvents(socket: CustomWebSocket | null) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!socket) return;
    const handle = (event: MessageEvent) => {
      let data: any;
      try { data = JSON.parse(event.data); } catch { return; }
      if (data.action === 'pong' && (socket as any)._lastPing) {
        const latency = Date.now() - (socket as any)._lastPing.getTime();
        if (latency > 0 && latency < 3000) dispatch({ type: 'PONG', latency });
        return;
      }
      const normalizeTs = (ts?: string) => {
        if (!ts) return new Date().toISOString();
        const hasOffset = /Z|[+-]\d{2}:\d{2}$/.test(ts);
        return hasOffset ? ts : `${ts}Z`;
      };
      if (data.type && ['POOL_CREATED', 'POOL_SWAP', 'USER_FEE_CLAIMED', 'FAIR_LAUNCH_ENDED', 'SCHEDULED', 'BIDWALL_UPDATE'].includes(data.type)) {
        dispatch({ type: 'ADD_ACTIVITY', payload: { ...data, timestamp: normalizeTs(data.timestamp) } });
      } else if (data.type === 'MCAP_UPDATE') {
        dispatch({ type: 'ADD_MCAP', payload: { ...data, timestamp: normalizeTs(data.timestamp) } });
      } else if (data.txHash) {
        dispatch({ type: 'ADD_TX_RECEIPT', payload: { ...data, timestamp: normalizeTs(data.timestamp) } });
      }
    };
    socket.addEventListener('message', handle);
    return () => socket.removeEventListener('message', handle);
  }, [socket]);

  const clear = useCallback(() => dispatch({ type: 'RESET' }), []);
  return { state, clear };
}

// Context & Provider
const WebSocketContext = createContext<WebSocketContextType | null>(null);

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { socket, isConnected, connectionError, manualReconnect } = useWebSocketConnection();
  const { state, clear } = useWebSocketEvents(socket);

  const formatRelativeTime = useCallback((timestamp: string) => {
    if (!timestamp) return 'N/A';
    const date = (() => {
      const ts = timestamp;
      const hasOffset = /Z|[+-]\d{2}:\d{2}$/.test(ts);
      return new Date(hasOffset ? ts : `${ts}Z`);
    })();
    const now = new Date();
    if (isNaN(date.getTime())) return 'N/A';
    const full = date.toLocaleString('en-GB', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false
    });
    const diff = now.getTime() - date.getTime();
    if (diff < 0) return `${full}\njust now`;
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return `${full}\n${secs} seconds ago`;
    if (secs < 120) return `${full}\n1 minute ago`;
    return `${full}\n${formatDistance(date, now, { addSuffix: true })}`;
  }, []);

  const value = useMemo<import('@/app/types/events').WebSocketContextType>(() => ({
    isConnected,
    connectionError,
    latency: state.latency != null ? `${state.latency}ms` : 'N/A',
    activityEvents: state.activityEvents,
    txReceiptEvents: state.txReceiptEvents,
    marketCapEvents: state.marketCapEvents,
    stats: state,
    formatRelativeTime,
    connect: manualReconnect,
    disconnect: clear,
    clearEvents: clear,
    manualReconnect,
  }), [isConnected, connectionError, state, formatRelativeTime, manualReconnect, clear]);

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket(): WebSocketContextType {
  const ctx = useContext(WebSocketContext);
  if (!ctx) throw new Error('useWebSocket must be used within WebSocketProvider');
  return ctx;
}
