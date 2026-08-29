'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { BarChart3, TrendingUp, DollarSign, Layers } from 'lucide-react';

export default function ShopAnalyticsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Shop Revenue & Performance Analytics</h1>
            <p className="text-xs text-zinc-400 mt-1">Track order volume, paper usage, and revenue breakdown</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Weekly Revenue</span>
              <span className="text-2xl font-extrabold text-white">₹28,450</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Total Pages Printed</span>
              <span className="text-2xl font-extrabold text-white">12,420</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Queue Bypass Ratio</span>
              <span className="text-2xl font-extrabold text-emerald-400">98.4%</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
