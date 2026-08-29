'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { shopsService } from '@/services/shops.service';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Clock, Printer, Star, Filter, ArrowRight, CheckCircle2, Store } from 'lucide-react';
import { Shop } from '@/types';

export default function ShopsDiscoveryPage() {
  const router = useRouter();
  const { setShop } = useCheckoutStore();
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState('ALL');

  const { data: shops = [], isLoading } = useQuery({
    queryKey: ['shops', search],
    queryFn: () => shopsService.listShops({ search: search || undefined }),
  });

  const handleSelectShop = (shop: Shop) => {
    setShop(shop);
    router.push(`/shops/${shop.id}`);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white">Find Nearby Print Shops</h1>
          <p className="text-sm text-zinc-400 mt-1">Discover verified campus print shops, check live queue times, and order online.</p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by shop name, landmark, or campus location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 pl-11 pr-4 py-3 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none transition"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['ALL', 'COLOR', 'BINDING', '3D_PRINTING'].map((service) => (
              <button
                key={service}
                onClick={() => setSelectedService(service)}
                className={`rounded-xl px-4 py-2.5 text-xs font-semibold whitespace-nowrap border transition ${
                  selectedService === service
                    ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {service.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Shop Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800">
            <Store className="mx-auto h-12 w-12 text-zinc-700 mb-3" />
            <h3 className="text-lg font-bold text-white">No Shops Found</h3>
            <p className="text-xs text-zinc-500 mt-1">Try adjusting your search query or filter keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="group relative rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition shadow-xl flex flex-col justify-between"
              >
                <div>
                  {/* Status & Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-400">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Accepting Orders
                    </span>

                    <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{shop.rating || '4.8'}</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition">{shop.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="h-3.5 w-3.5 text-zinc-500 shrink-0 mt-0.5" />
                    <span>{shop.address}</span>
                  </p>

                  {/* Highlights */}
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[11px] text-zinc-400 border-t border-b border-zinc-800/80 py-3">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      <span>Est. Wait: <strong>~5 mins</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Printer className="h-3.5 w-3.5 text-cyan-400" />
                      <span>Fleet: <strong>Active</strong></span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => handleSelectShop(shop)}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition"
                  >
                    View Details & Print
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
