'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '@/services/admin.service';
import { CheckCircle2, XCircle, Store, ShieldCheck } from 'lucide-react';

export default function AdminShopsPage() {
  const queryClient = useQueryClient();

  const { data: shops = [] } = useQuery({
    queryKey: ['admin-shops'],
    queryFn: adminService.listShops,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ shopId, isVerified }: { shopId: string; isVerified: boolean }) =>
      adminService.verifyShop(shopId, isVerified),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-shops'] }),
  });

  const mockShops = shops.length > 0 ? shops : [
    { id: 's-1', name: 'NITK Central Campus Print Shop', address: 'Commercial Complex, Surathkal', isVerified: true, isActive: true },
    { id: 's-2', name: 'Campus Express Printers', address: 'Main Gate NITK', isVerified: false, isActive: true },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Shop Verification & Partner Control</h1>
            <p className="text-xs text-zinc-400 mt-1">Approve campus shop partners and toggle active platform status</p>
          </div>

          <div className="space-y-4">
            {mockShops.map((s) => (
              <div key={s.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {s.name}
                    {s.isVerified && <ShieldCheck className="h-4 w-4 text-emerald-400" />}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{s.address}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => verifyMutation.mutate({ shopId: s.id, isVerified: !s.isVerified })}
                    className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                      s.isVerified ? 'bg-zinc-800 text-zinc-300' : 'bg-emerald-600 text-white hover:bg-emerald-500'
                    }`}
                  >
                    {s.isVerified ? 'Revoke Verification' : 'Verify Shop Partner'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
