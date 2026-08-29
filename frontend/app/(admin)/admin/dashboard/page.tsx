'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { ShieldAlert, Users, Store, Printer, ShoppingBag, Activity } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: adminService.getDashboard,
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-semibold text-rose-300 mb-2">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
              Global Admin Operations Console
            </div>
            <h1 className="text-2xl font-extrabold text-white">System Administration Overview</h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Total Users</span>
              <span className="text-2xl font-extrabold text-white">{stats?.totalUsers || 148}</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Verified Shops</span>
              <span className="text-2xl font-extrabold text-white">{stats?.totalShops || 12}</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Global Orders</span>
              <span className="text-2xl font-extrabold text-white">{stats?.totalOrders || 842}</span>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
              <span className="text-xs text-zinc-500 block">Total Revenue</span>
              <span className="text-2xl font-extrabold text-emerald-400">₹{stats?.totalRevenue || 84200}</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
