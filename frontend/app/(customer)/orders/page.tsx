'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { ShoppingBag, Clock, CheckCircle2, QrCode, ArrowRight, Printer } from 'lucide-react';
import { OrderStatus } from '@/types';

export default function CustomerOrdersPage() {
  const [activeTab, setActiveTab] = useState<'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ACTIVE');

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getUserOrders,
  });

  const filteredOrders = orders.filter((o) => {
    if (activeTab === 'ACTIVE') return ['CREATED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status);
    if (activeTab === 'COMPLETED') return o.status === 'COMPLETED';
    if (activeTab === 'CANCELLED') return ['CANCELLED', 'FAILED', 'REFUNDED'].includes(o.status);
    return true;
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Order History & Tracking</h1>
              <p className="text-xs text-zinc-400 mt-1">Track live print statuses and generate pickup QR tokens.</p>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex gap-2 border-b border-zinc-800 pb-3">
            {(['ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                  activeTab === tab
                    ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {tab} Orders
              </button>
            ))}
          </div>

          {/* Orders List */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-28 rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800">
              <ShoppingBag className="mx-auto h-12 w-12 text-zinc-700 mb-3" />
              <h3 className="text-lg font-bold text-white">No {activeTab.toLowerCase()} orders found</h3>
              <p className="text-xs text-zinc-500 mt-1">Your order activity will appear here in real time.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-indigo-500/40 transition shadow-xl"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">Order #{order.orderNumber || order.id.slice(0, 8)}</span>
                      <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-0.5 text-[10px] font-bold text-indigo-300">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400">
                      Total: ₹{order.totalAmount} • Fulfillment: {order.fulfillmentType}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      Placed on {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <Link
                    href={`/orders/${order.id}`}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
                  >
                    View Real-Time Tracking
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
