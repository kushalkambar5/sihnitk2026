'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { Truck, MapPin, CheckCircle2, Navigation, ArrowRight } from 'lucide-react';

export default function ActiveDeliveryPage() {
  const [deliveryStep, setDeliveryStep] = useState(1);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div>
            <h1 className="text-2xl font-extrabold text-white">Active Delivery Navigation</h1>
            <p className="text-xs text-zinc-400 mt-1">Order #DP-00125 • Track live progress</p>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 space-y-6 max-w-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <span className="text-xs font-bold text-emerald-400">Status: In Progress</span>
              <span className="text-xs font-bold text-white">Earning: ₹40.00</span>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <span>1. Arrived at Shop</span>
                {deliveryStep >= 1 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <button
                    onClick={() => setDeliveryStep(1)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-white font-bold"
                  >
                    Mark Arrived
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <span>2. Picked up Package</span>
                {deliveryStep >= 2 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <button
                    onClick={() => setDeliveryStep(2)}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-white font-bold"
                  >
                    Confirm Pickup
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
                <span>3. Delivered to Customer</span>
                {deliveryStep >= 3 ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <button
                    onClick={() => setDeliveryStep(3)}
                    className="rounded-lg bg-emerald-600 px-3 py-1 text-white font-bold"
                  >
                    Complete Delivery
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
