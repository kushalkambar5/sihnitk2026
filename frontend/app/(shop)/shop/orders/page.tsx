'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { ShoppingBag, CheckCircle2, Clock, Printer, ArrowRight } from 'lucide-react';
import { OrderStatus } from '@/types';

export default function ShopOrdersPage() {
  const shopId = 'demo-shop-id';
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data: orders = [] } = useQuery({
    queryKey: ['shop-orders', shopId],
    queryFn: () => ordersService.getShopOrders(shopId),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      ordersService.updateStatus(shopId, orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shop-orders'] }),
  });

  const mockOrders = orders.length > 0 ? orders : [
    { id: 'dp-ord-001', orderNumber: 'DP-00124', status: 'PAID' as OrderStatus, totalAmount: 54, fulfillmentType: 'PICKUP', createdAt: new Date().toISOString() },
    { id: 'dp-ord-002', orderNumber: 'DP-00125', status: 'PROCESSING' as OrderStatus, totalAmount: 70, fulfillmentType: 'DELIVERY', createdAt: new Date().toISOString() },
    { id: 'dp-ord-003', orderNumber: 'DP-00126', status: 'READY_FOR_PICKUP' as OrderStatus, totalAmount: 15, fulfillmentType: 'PICKUP', createdAt: new Date().toISOString() },
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
              <h1 className="text-2xl font-extrabold text-white">Shop Order Queue Management</h1>
              <p className="text-xs text-zinc-400 mt-1">Review incoming print jobs and update fulfillment status</p>
            </div>
          </div>

          {/* Filter Bar */}
          <div className="flex gap-2 border-b border-zinc-800 pb-3 overflow-x-auto">
            {['ALL', 'PAID', 'PROCESSING', 'READY_FOR_PICKUP', 'COMPLETED'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition ${
                  statusFilter === st
                    ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-300'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mockOrders.map((o) => (
              <div
                key={o.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-white">Order #{o.orderNumber}</span>
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">Total: ₹{o.totalAmount} • {o.fulfillmentType}</p>
                </div>

                <div className="flex items-center gap-2">
                  {o.status === 'PAID' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: o.id, status: 'PROCESSING' })}
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition"
                    >
                      Start Printing
                    </button>
                  )}
                  {o.status === 'PROCESSING' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: o.id, status: 'READY_FOR_PICKUP' })}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-500 transition"
                    >
                      Mark Ready for Pickup
                    </button>
                  )}
                  {o.status === 'READY_FOR_PICKUP' && (
                    <button
                      onClick={() => updateStatusMutation.mutate({ orderId: o.id, status: 'COMPLETED' })}
                      className="rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
