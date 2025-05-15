import React from 'react';

const DashboardPreview = () => {
  return (
    <svg width="100%" height="600" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="1200" height="800" fill="#0f172a" />
      
      {/* Header */}
      <rect x="0" y="0" width="1200" height="80" fill="#1e293b" />
      <text x="30" y="45" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="white">Flaunch Feed Dashboard</text>
      <text x="30" y="65" fontFamily="Arial" fontSize="14" fill="#94a3b8">Real-time visualization of Flaunch Feed events</text>
      
      {/* Connection Status */}
      <rect x="1050" y="20" rx="15" ry="15" width="120" height="30" fill="#10b981" />
      <circle cx="1070" cy="35" r="5" fill="white" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite" />
      </circle>
      <text x="1080" y="38" fontFamily="Arial" fontSize="12" fill="white">Connected</text>
      
      {/* Connection Controls */}
      <rect x="30" y="100" width="1140" height="80" rx="5" ry="5" fill="#1e293b" />
      <text x="45" y="130" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="white">Connection Controls</text>
      <rect x="45" y="145" width="100" height="30" rx="3" ry="3" fill="#10b981" />
      <text x="75" y="165" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Connect</text>
      <rect x="155" y="145" width="100" height="30" rx="3" ry="3" fill="#ef4444" />
      <text x="205" y="165" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Disconnect</text>
      <rect x="265" y="145" width="100" height="30" rx="3" ry="3" fill="#3b82f6" />
      <text x="315" y="165" fontFamily="Arial" fontSize="12" fill="white" textAnchor="middle">Clear Events</text>
      
      {/* Dashboard Stats */}
      <rect x="30" y="200" width="1140" height="300" rx="5" ry="5" fill="#1e293b" />
      <text x="45" y="230" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="white">Dashboard Statistics</text>
      
      {/* Stats Cards */}
      <rect x="45" y="245" width="350" height="70" rx="3" ry="3" fill="#1e293b" stroke="#10b981" strokeWidth="4" />
      <text x="60" y="270" fontFamily="Arial" fontSize="12" fill="#94a3b8">Connection Status</text>
      <text x="60" y="295" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="white">Connected</text>
      
      <rect x="405" y="245" width="350" height="70" rx="3" ry="3" fill="#1e293b" stroke="#3b82f6" strokeWidth="4" />
      <text x="420" y="270" fontFamily="Arial" fontSize="12" fill="#94a3b8">Latency</text>
      <text x="420" y="295" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="white">42ms</text>
      
      <rect x="765" y="245" width="350" height="70" rx="3" ry="3" fill="#1e293b" stroke="#8b5cf6" strokeWidth="4" />
      <text x="780" y="270" fontFamily="Arial" fontSize="12" fill="#94a3b8">Total Events</text>
      <text x="780" y="295" fontFamily="Arial" fontSize="20" fontWeight="bold" fill="white">1,234</text>
      
      {/* Event Rate Chart */}
      <rect x="45" y="325" width="540" height="160" rx="3" ry="3" fill="#0f172a" />
      <text x="60" y="345" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="white">Events per Second</text>
      
      {/* Simple line chart */}
      <polyline 
        points="60,445 100,420 140,430 180,410 220,425 260,415 300,390 340,400 380,385 420,370 460,380 500,350 540,365" 
        fill="none" 
        stroke="#10b981" 
        strokeWidth="2" 
      />
      
      {/* Event Rate Gauge */}
      <rect x="595" y="325" width="520" height="160" rx="3" ry="3" fill="#1e293b" />
      <text x="855" y="365" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="white" textAnchor="middle">Event Rate</text>
      <text x="855" y="405" fontFamily="Arial" fontSize="24" fontWeight="bold" fill="white" textAnchor="middle">12.5 <tspan fontSize="12" fontWeight="normal">events/sec</tspan></text>
      
      <rect x="655" y="435" width="400" height="15" rx="7.5" ry="7.5" fill="#0f172a" />
      <rect x="655" y="435" width="200" height="15" rx="7.5" ry="7.5" fill="#10b981" />
      
      {/* Activity Feed */}
      <rect x="30" y="520" width="1140" height="160" rx="5" ry="5" fill="#1e293b" />
      <text x="45" y="550" fontFamily="Arial" fontSize="18" fontWeight="bold" fill="white">Activity Feed</text>
      
      {/* Activity Event */}
      <rect x="45" y="565" width="1110" height="50" rx="3" ry="3" fill="rgba(14, 165, 233, 0.1)" stroke="#0ea5e9" strokeWidth="4" />
      <text x="60" y="585" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="white">BUY: TOKEN</text>
      <text x="60" y="605" fontFamily="Arial" fontSize="12" fill="#94a3b8">0.5 ETH ($1,200)</text>
      <text x="1120" y="585" fontFamily="Arial" fontSize="12" fill="#94a3b8" textAnchor="end">POOL_SWAP</text>
      <text x="1120" y="605" fontFamily="Arial" fontSize="12" fill="#94a3b8" textAnchor="end">2 mins ago</text>
      
      {/* Activity Event */}
      <rect x="45" y="625" width="1110" height="50" rx="3" ry="3" fill="rgba(134, 239, 172, 0.1)" stroke="#22c55e" strokeWidth="4" />
      <text x="60" y="645" fontFamily="Arial" fontSize="14" fontWeight="bold" fill="white">New Pool Created: PEPE</text>
      <text x="60" y="665" fontFamily="Arial" fontSize="12" fill="#94a3b8">Maker: 0xDa81...BB10</text>
      <text x="1120" y="645" fontFamily="Arial" fontSize="12" fill="#94a3b8" textAnchor="end">POOL_CREATED</text>
      <text x="1120" y="665" fontFamily="Arial" fontSize="12" fill="#94a3b8" textAnchor="end">5 mins ago</text>
      
      {/* Latest Event Notification */}
      <rect x="950" y="740" width="220" height="40" rx="5" ry="5" fill="#3b82f6">
        <animate attributeName="opacity" values="1;0.7;1" dur="3s" repeatCount="indefinite" />
      </rect>
      <circle cx="970" cy="760" r="5" fill="white" />
      <text x="985" y="765" fontFamily="Arial" fontSize="14" fill="white">Market Cap Update: TOKEN</text>
      
      {/* Footer */}
      <rect x="0" y="760" width="1200" height="40" fill="#1e293b" />
      <text x="600" y="785" fontFamily="Arial" fontSize="14" fill="#94a3b8" textAnchor="middle">Flaunch Feed Dashboard © 2025</text>
    </svg>
  );
};

export default DashboardPreview;