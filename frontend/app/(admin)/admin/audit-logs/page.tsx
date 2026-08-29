'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { Activity, Shield } from 'lucide-react';

export default function AdminAuditLogsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Security & System Audit Logs</h1>
            <p className="text-xs text-zinc-400 mt-1">Audit trail of administrative actions, auth logins, and printer events</p>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { event: 'USER_LOGIN', user: 'customer@docprint.io', ip: '192.168.1.10', time: '2 mins ago' },
              { event: 'PRINTER_HEALTH_REPORT', user: 'hardware-agent-01', ip: '10.0.0.5', time: '5 mins ago' },
              { event: 'SHOP_VERIFIED', user: 'admin@docprint.io', ip: '127.0.0.1', time: '1 hour ago' },
            ].map((log, idx) => (
              <div key={idx} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between font-mono">
                <div>
                  <span className="text-indigo-400 font-bold">{log.event}</span>
                  <span className="text-zinc-500 ml-2">by {log.user} ({log.ip})</span>
                </div>
                <span className="text-[10px] text-zinc-500">{log.time}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
