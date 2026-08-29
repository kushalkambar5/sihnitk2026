'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { Users, Plus, Shield, User } from 'lucide-react';

export default function ShopStaffPage() {
  const staffMembers = [
    { id: 'u-1', name: 'Kushal Kambar', email: 'kushal@docprint.io', role: 'SHOP_OWNER' },
    { id: 'u-2', name: 'John Doe', email: 'john@docprint.io', role: 'SHOP_STAFF' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Shop Staff & Team Members</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage shop staff permissions and operator accounts</p>
            </div>
            <button className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition">
              <Plus className="h-4 w-4" /> Add Staff Member
            </button>
          </div>

          <div className="space-y-3">
            {staffMembers.map((m) => (
              <div key={m.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 font-bold">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{m.name}</h4>
                    <p className="text-[10px] text-zinc-500">{m.email}</p>
                  </div>
                </div>
                <span className="rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-[10px] font-bold text-zinc-300">
                  {m.role}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
