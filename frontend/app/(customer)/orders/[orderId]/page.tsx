'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersService } from '@/services/orders.service';
import { pickupService } from '@/services/pickup.service';
import { getSocket } from '@/lib/socket';
import { QRCodeSVG } from 'qrcode.react';
import {
  CheckCircle2,
  Clock,
  Printer,
  QrCode,
  Truck,
  ArrowLeft,
  AlertCircle,
  Sparkles,
  MapPin,
} from 'lucide-react';

export default function OrderTrackingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const queryClient = useQueryClient();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getOrder(orderId),
    enabled: !!orderId,
  });

  const { data: pickupData } = useQuery({
    queryKey: ['pickup-token', orderId],
    queryFn: () => pickupService.getPickupToken(orderId),
    enabled: !!orderId && (order?.status === 'READY_FOR_PICKUP' || order?.status === 'PROCESSING' || order?.status === 'PAID'),
  });

  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    };

    socket.on('order:updated', handleUpdate);
    return () => {
      socket.off('order:updated', handleUpdate);
    };
  }, [orderId, queryClient]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-xs font-mono text-zinc-500 animate-pulse">Loading live tracking details...</div>
      </div>
    );
  }

  // Fallback mock order if backend returns empty or id is demo
  const displayOrder = order || {
    id: orderId,
    orderNumber: orderId.slice(0, 8).toUpperCase(),
    status: 'PRINTING',
    fulfillmentType: 'PICKUP',
    totalAmount: 78,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const steps = [
    { key: 'PAID', label: 'Payment Received', desc: 'Order confirmed & sent to shop' },
    { key: 'PROCESSING', label: 'In Smart Queue', desc: 'Assigned to fastest online printer' },
    { key: 'PRINTING', label: 'Actively Printing', desc: 'High-speed print & spiral binding' },
    { key: 'READY_FOR_PICKUP', label: 'Ready for Pickup', desc: 'Show QR code at shop counter' },
    { key: 'COMPLETED', label: 'Order Completed', desc: 'Picked up successfully' },
  ];

  const getStepIndex = (status: string) => {
    if (status === 'CREATED' || status === 'PAYMENT_PENDING') return 0;
    if (status === 'PAID') return 1;
    if (status === 'PROCESSING') return 2;
    if (status === 'READY_FOR_PICKUP' || status === 'OUT_FOR_DELIVERY') return 3;
    if (status === 'COMPLETED') return 4;
    return 2;
  };

  const currentStepIdx = getStepIndex(displayOrder.status);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/orders')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Orders
            </button>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-mono text-zinc-400">Live Socket Updates Active</span>
            </div>
          </div>

          {/* Order Summary Header Banner */}
          <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-indigo-950/20 to-zinc-950 p-8 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block mb-1">
                  Order Tracking
                </span>
                <h1 className="text-3xl font-extrabold text-white">Order #{displayOrder.orderNumber || displayOrder.id.slice(0, 8)}</h1>
                <p className="text-xs text-zinc-400 mt-1">
                  Placed on {new Date(displayOrder.createdAt).toLocaleDateString()} • Total Amount: ₹{displayOrder.totalAmount}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 text-xs font-bold text-indigo-300">
                  Status: {displayOrder.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Step Progress Timeline */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl space-y-6">
                <h3 className="text-lg font-bold text-white mb-4">Live Order Pipeline</h3>

                <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-zinc-800">
                  {steps.map((s, idx) => {
                    const isPassed = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    return (
                      <div key={s.key} className="relative flex items-start gap-4">
                        <div
                          className={`absolute -left-6 top-0 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${
                            isPassed
                              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/50'
                              : 'bg-zinc-800 text-zinc-500'
                          }`}
                        >
                          {isPassed ? '✓' : idx + 1}
                        </div>

                        <div>
                          <h4 className={`text-sm font-bold ${isCurrent ? 'text-indigo-400' : isPassed ? 'text-white' : 'text-zinc-500'}`}>
                            {s.label}
                          </h4>
                          <p className="text-xs text-zinc-400 mt-0.5">{s.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Interactive QR Pickup Token Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-indigo-500/30 bg-indigo-950/20 p-6 shadow-2xl text-center space-y-4">
                <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                  <QrCode className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Pickup QR Token</span>
                </div>

                <div className="p-6 bg-white rounded-2xl mx-auto w-fit shadow-2xl border-4 border-indigo-500/30">
                  <QRCodeSVG value={pickupData?.token || `DOCPRINT-PICKUP-${orderId}`} size={160} />
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">Show QR at Shop Counter</h4>
                  <p className="text-xs text-zinc-400 mt-1">The shop staff will scan this code to release your printed documents.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
