'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { deliveryService } from '@/services/delivery.service';
import { useRouter } from 'next/navigation';
import { Truck, MapPin, Navigation, ArrowRight, DollarSign } from 'lucide-react';

export default function DeliveryJobsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: jobs = [] } = useQuery({
    queryKey: ['delivery-jobs'],
    queryFn: deliveryService.getJobs,
  });

  const acceptMutation = useMutation({
    mutationFn: deliveryService.acceptJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['delivery-jobs'] });
      router.push('/delivery/active');
    },
  });

  const mockJobs = jobs.length > 0 ? jobs : [
    {
      id: 'del-01',
      orderId: 'DP-00125',
      status: 'PENDING',
      pickupAddress: 'NITK Surathkal Commercial Complex, Shop #4',
      deliveryAddress: 'Hostel Block 7, Room 204, NITK Campus',
      distanceKm: 1.2,
      earningAmount: 40,
    },
    {
      id: 'del-02',
      orderId: 'DP-00128',
      status: 'PENDING',
      pickupAddress: 'Campus Express Printers, Main Gate',
      deliveryAddress: 'Lecturers Quarters 12A, NITK Campus',
      distanceKm: 2.1,
      earningAmount: 60,
    },
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
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 mb-2">
                <Truck className="h-3.5 w-3.5 text-emerald-400" />
                Delivery Partner Portal
              </div>
              <h1 className="text-2xl font-extrabold text-white">Available Print Delivery Jobs</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockJobs.map((j) => (
              <div key={j.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-emerald-500/40 transition shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Order #{j.orderId}</span>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 text-xs font-extrabold text-emerald-400">
                      Earn ₹{j.earningAmount}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs border-t border-b border-zinc-800/80 py-3">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Pickup Location</span>
                        <span className="text-zinc-200">{j.pickupAddress}</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 pt-2">
                      <Navigation className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Delivery Location</span>
                        <span className="text-zinc-200">{j.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => acceptMutation.mutate(j.id)}
                  className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-500 transition"
                >
                  Accept Delivery Job ({j.distanceKm} km)
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
