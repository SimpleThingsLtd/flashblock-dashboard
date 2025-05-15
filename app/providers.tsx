'use client';

import { ReactNode } from 'react';
import { WebSocketProvider } from '@/app/contexts/WebSocketContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <WebSocketProvider>
      {children}
    </WebSocketProvider>
  );
}