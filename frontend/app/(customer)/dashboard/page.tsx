'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import { useQuery } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { documentsService } from '@/services/documents.service';
import {
  Upload,
  Bot,
  Store,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Printer,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

export default function CustomerDashboardPage() {
  const { user } = useAuthStore();
  const { openUploadModal } = useUiStore();

  const { data: orders = [] } = useQuery({
    queryKey: ['orders'],
    queryFn: ordersService.getUserOrders,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsService.getUserDocuments,
  });

  const activeOrders = orders.filter((o) => ['CREATED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY'].includes(o.status));

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-8">
          {/* Welcome Header */}
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-indigo-950/30 to-zinc-950 p-6 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
                Customer Workspace
              </div>
              <h1 className="text-2xl font-extrabold text-white">Welcome back, {user?.name || 'Customer'} 👋</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage your print documents, track active jobs, or chat with AI Assistant.</p>
            </div>

            <button
              onClick={openUploadModal}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <Upload className="h-4 w-4" />
              Upload New File
            </button>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={openUploadModal}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-left hover:border-indigo-500/40 hover:bg-zinc-900/80 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-3 group-hover:scale-110 transition">
                <Upload className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Upload Document</h3>
              <p className="text-[11px] text-zinc-400 mt-1">PDF, DOCX, images up to 50MB</p>
            </button>

            <Link
              href="/ai"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-left hover:border-indigo-500/40 hover:bg-zinc-900/80 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 mb-3 group-hover:scale-110 transition">
                <Bot className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">AI Assistant</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Generate resumes, letters & reports</p>
            </Link>

            <Link
              href="/shops"
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-left hover:border-indigo-500/40 hover:bg-zinc-900/80 transition group"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-3 group-hover:scale-110 transition">
                <Store className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-white">Find Print Shop</h3>
              <p className="text-[11px] text-zinc-400 mt-1">Locate nearby verified shops</p>
            </Link>
          </div>

          {/* Active Orders Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-indigo-400" />
                Active Print Orders
              </h2>
              <Link href="/orders" className="text-xs text-indigo-400 hover:underline">
                View All Orders
              </Link>
            </div>

            {activeOrders.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-8 text-center">
                <Printer className="mx-auto h-10 w-10 text-zinc-700 mb-2" />
                <p className="text-xs font-semibold text-zinc-400">No active print jobs in progress</p>
                <button
                  onClick={openUploadModal}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                >
                  Start a new print job <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">Order #{order.orderNumber || order.id.slice(0, 8)}</span>
                        <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-400">Total Amount: ₹{order.totalAmount} • {order.fulfillmentType}</p>
                    </div>

                    <Link
                      href={`/orders/${order.id}`}
                      className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition"
                    >
                      Track Order Live
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Documents */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-cyan-400" />
                Recent Documents
              </h2>
              <Link href="/documents" className="text-xs text-indigo-400 hover:underline">
                View All Documents
              </Link>
            </div>

            {documents.length === 0 ? (
              <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-8 text-center">
                <FileText className="mx-auto h-10 w-10 text-zinc-700 mb-2" />
                <p className="text-xs font-semibold text-zinc-400">No uploaded documents found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.slice(0, 3).map((doc) => (
                  <div key={doc.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-xs font-bold text-white truncate">{doc.name}</h4>
                        <p className="text-[10px] text-zinc-500">{doc.documentType}</p>
                      </div>
                    </div>

                    <Link
                      href="/print/configure"
                      className="w-full text-center rounded-xl border border-zinc-800 bg-zinc-950 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition"
                    >
                      Print Document
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
