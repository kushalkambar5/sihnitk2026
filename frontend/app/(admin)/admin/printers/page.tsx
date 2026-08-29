'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { Printer } from 'lucide-react';

export default function AdminPrintersPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Global Printer Fleet Health</h1>
            <p className="text-xs text-zinc-400 mt-1">Platform-wide hardware status and failure monitoring</p>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-xs text-zinc-400">
            All 32 registered shop hardware printers online across 12 partner locations.
          </div>
        </main>
      </div>
    </div>
  );
}
