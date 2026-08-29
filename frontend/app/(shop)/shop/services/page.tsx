'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { servicesService } from '@/services/services.service';
import { Wrench, CheckCircle2, XCircle } from 'lucide-react';

export default function ShopServicesPage() {
  const shopId = 'demo-shop-id';

  const { data: services = [] } = useQuery({
    queryKey: ['shop-services', shopId],
    queryFn: () => servicesService.getShopServices(shopId),
  });

  const masterServices = [
    { id: 'ms-1', name: 'Black & White Printing', category: 'PRINTING', enabled: true },
    { id: 'ms-2', name: 'Color Printing', category: 'PRINTING', enabled: true },
    { id: 'ms-3', name: 'Spiral & Comb Binding', category: 'BINDING', enabled: true },
    { id: 'ms-4', name: 'High-Res Scanning', category: 'SCANNING', enabled: true },
    { id: 'ms-5', name: '3D FDM Prototyping', category: 'THREE_D_PRINTING', enabled: false },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Shop Offered Services</h1>
            <p className="text-xs text-zinc-400 mt-1">Enable or disable print services offered by your shop location.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masterServices.map((s) => (
              <div key={s.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">{s.name}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{s.category}</p>
                </div>

                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${s.enabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-800 text-zinc-500'}`}>
                  {s.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
