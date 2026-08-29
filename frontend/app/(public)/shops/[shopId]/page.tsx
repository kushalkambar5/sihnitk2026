'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { shopsService } from '@/services/shops.service';
import { servicesService } from '@/services/services.service';
import { queueService } from '@/services/queue.service';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useUiStore } from '@/stores/ui.store';
import { MapPin, Phone, Mail, Clock, Printer, Layers, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function ShopDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.shopId as string;

  const { setShop } = useCheckoutStore();
  const { openUploadModal } = useUiStore();

  const { data: shop, isLoading: shopLoading } = useQuery({
    queryKey: ['shop', shopId],
    queryFn: () => shopsService.getShop(shopId),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['shop-services', shopId],
    queryFn: () => servicesService.getShopServices(shopId),
    enabled: !!shopId,
  });

  const { data: queueInfo } = useQuery({
    queryKey: ['shop-queue-prediction', shopId],
    queryFn: () => queueService.getPrediction(shopId),
    enabled: !!shopId,
  });

  const handleStartPrint = () => {
    if (shop) setShop(shop);
    openUploadModal();
  };

  if (shopLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center">
        <div className="text-xs font-mono text-zinc-500 animate-pulse">Loading shop details...</div>
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center">
        <h2 className="text-xl font-bold">Shop Not Found</h2>
        <button onClick={() => router.push('/shops')} className="mt-4 text-indigo-400 underline text-xs">
          Back to Shops Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-8">
        {/* Shop Header Banner */}
        <div className="rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/60 to-zinc-950 p-8 shadow-2xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-3">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                Verified Campus Partner
              </div>
              <h1 className="text-3xl font-extrabold text-white">{shop.name}</h1>
              <p className="text-xs text-zinc-400 mt-2 flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                {shop.address}
              </p>
            </div>

            <button
              onClick={handleStartPrint}
              className="flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-xl shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition"
            >
              Upload & Print Here
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Live Queue & Fleet Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">Est. Queue Wait</span>
              <span className="text-lg font-extrabold text-white">
                {queueInfo ? `${queueInfo.estimatedWaitMinutes} Mins` : '~5 Mins'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
              <Layers className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">Queued Print Jobs</span>
              <span className="text-lg font-extrabold text-white">
                {queueInfo ? queueInfo.totalQueuedJobs : '2 Active Jobs'}
              </span>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Printer className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-zinc-500 block">Active Printers</span>
              <span className="text-lg font-extrabold text-white">
                {queueInfo ? `${queueInfo.activePrintersCount} Online` : '3 Online'}
              </span>
            </div>
          </div>
        </div>

        {/* Available Services */}
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
          <h3 className="text-lg font-bold text-white mb-4">Available Print & Finishing Services</h3>
          {services.length === 0 ? (
            <div className="text-xs text-zinc-500 py-4">Standard Black & White (A4), Color (A4), and Spiral Binding available.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {services.map((svc) => (
                <div key={svc.id} className="rounded-xl border border-zinc-800 bg-zinc-950 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">{svc.service?.name || 'Service'}</h4>
                      <p className="text-[11px] text-zinc-500">{svc.service?.category}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-indigo-400">Available</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
