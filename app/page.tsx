'use client';

import ConnectionStatus from '@/app/components/ConnectionStatus';
import LatestEvent from '@/app/components/LatestEvent';
// import ConnectionControls from '@/app/components/ConnectionControls';
import DashboardStats from '@/app/components/DashboardStats';
import ActivityEventList from '@/app/components/ActivityEventList';
import TxReceiptList from '@/app/components/TxReceiptList';
import MarketCapList from '@/app/components/MarketCapList';

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <ConnectionStatus />
      <LatestEvent />

      <header className="py-6 px-4 md:px-8 bg-gray-100 mb-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold text-gray-800">Flaunch Feed Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time visualization of Flaunch Feed events</p>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-8 pb-12">
        <div className="grid grid-cols-1 gap-6">
          {/* Connection Controls */}
          {/* <ConnectionControls /> */}
          
          {/* Stats Section */}
          <section>
            <DashboardStats />
          </section>
          
          {/* Activity Feed */}
          <section>
            <ActivityEventList />
          </section>
          
          {/* Two-column layout for smaller components */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TxReceiptList />
            <MarketCapList />
          </section>
        </div>
      </main>
      
      <footer className="py-6 px-4 md:px-8 bg-gray-100 text-center text-gray-600">
        <div className="container mx-auto">
          <p>Flaunch Feed Dashboard &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}