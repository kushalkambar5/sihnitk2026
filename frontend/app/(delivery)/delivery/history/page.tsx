'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';

export default function DeliveryHistoryPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Delivery Job History & Earnings</h1>
            <p className="text-xs text-zinc-400 mt-1">Review completed deliveries and payout logs</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 max-w-xl">
            <span className="text-xs text-zinc-500 block">Total Earnings This Week</span>
            <span className="text-3xl font-extrabold text-white">₹1,480.00</span>
          </div>
        </main>
      </div>
    </div>
  );
}
