'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { Settings, Save } from 'lucide-react';

export default function ShopSettingsPage() {
  const [name, setName] = useState('NITK Central Campus Print Shop');
  const [address, setAddress] = useState('Commercial Complex, NITK Surathkal, Karnataka 575025');
  const [phone, setPhone] = useState('+91 9876543210');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Shop Profile & Operating Settings</h1>
            <p className="text-xs text-zinc-400 mt-1">Configure shop name, operating hours, address, and contact details</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4 text-xs max-w-xl">
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Shop Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Address / Landmark</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="block text-zinc-400 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white outline-none"
              />
            </div>

            <button className="flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition">
              <Save className="h-4 w-4" /> Save Settings
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
