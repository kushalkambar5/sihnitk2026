'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useAuthStore } from '@/stores/auth.store';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { printersService } from '@/services/printers.service';
import { queueService } from '@/services/queue.service';
import {
  ShoppingBag,
  IndianRupee,
  Printer,
  Layers,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

export default function ShopDashboardPage() {
  const { user } = useAuthStore();
  const shopId = 'demo-shop-id';

  const { data: orders = [] } = useQuery({
    queryKey: ['shop-orders', shopId],
    queryFn: () => ordersService.getShopOrders(shopId),
  });

  const { data: printers = [] } = useQuery({
    queryKey: ['shop-printers', shopId],
    queryFn: () => printersService.getShopPrinters(shopId),
  });

  const { data: queue = [] } = useQuery({
    queryKey: ['shop-queue', shopId],
    queryFn: () => queueService.getShopQueue(shopId),
  });

  const activePrinters = printers.filter((p) => p.status === 'ONLINE' || p.status === 'BUSY');

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Shop Owner Operational Control Center</h1>
              <p className="text-xs text-zinc-400 mt-1">Live queue status, printer health monitoring, and order fulfillment</p>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Today's Orders</span>
                <span className="text-2xl font-extrabold text-white">{orders.length || 42}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <IndianRupee className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Today's Revenue</span>
                <span className="text-2xl font-extrabold text-white">₹4,280</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Printer className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Active Printers</span>
                <span className="text-2xl font-extrabold text-white">{activePrinters.length || 3} / 4</span>
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                <Layers className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs text-zinc-500 block">Queued Jobs</span>
                <span className="text-2xl font-extrabold text-white">{queue.length || 5}</span>
              </div>
            </div>
          </div>

          {/* Recent Orders Stream */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Incoming Order Queue Stream</h3>
              <Link href="/shop/orders" className="text-xs text-indigo-400 hover:underline">
                View All Shop Orders
              </Link>
            </div>

            <div className="space-y-3">
              {[
                { id: 'DP-00124', doc: 'Assignment.pdf', pages: 12, status: 'PRINTING', amount: 54 },
                { id: 'DP-00125', doc: 'Lab_Report.pdf', pages: 20, status: 'QUEUED', amount: 70 },
                { id: 'DP-00126', doc: 'Resume_2026.pdf', pages: 2, status: 'READY_FOR_PICKUP', amount: 15 },
              ].map((o) => (
                <div
                  key={o.id}
                  className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">Order #{o.id}</span>
                      <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                        {o.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Document: {o.doc} • {o.pages} Pages • Amount: ₹{o.amount}
                    </p>
                  </div>

                  <Link
                    href={`/shop/orders`}
                    className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition"
                  >
                    Manage Order <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
