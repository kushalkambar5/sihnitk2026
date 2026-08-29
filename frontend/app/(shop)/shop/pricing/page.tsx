'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { DollarSign, Edit2, Plus, Save } from 'lucide-react';

export default function ShopPricingPage() {
  const [rates, setRates] = useState([
    { id: 'p1', mode: 'Black & White (A4)', basePrice: 0, pricePerPage: 2.0 },
    { id: 'p2', mode: 'Full Color (A4)', basePrice: 0, pricePerPage: 10.0 },
    { id: 'p3', mode: 'Spiral Binding', basePrice: 30.0, pricePerPage: 0 },
    { id: 'p4', mode: 'Comb Binding', basePrice: 25.0, pricePerPage: 0 },
  ]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Dynamic Pricing Rules Engine</h1>
              <p className="text-xs text-zinc-400 mt-1">Configure base prices and per-page rates for your shop</p>
            </div>
          </div>

          <div className="space-y-4">
            {rates.map((r, idx) => (
              <div key={r.id} className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white">{r.mode}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Base Fee: ₹{r.basePrice} • Rate per page: ₹{r.pricePerPage}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.5"
                    value={r.pricePerPage || r.basePrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const copy = [...rates];
                      if (r.pricePerPage > 0) copy[idx].pricePerPage = val;
                      else copy[idx].basePrice = val;
                      setRates(copy);
                    }}
                    className="w-24 rounded-xl border border-zinc-800 bg-zinc-950 p-2 text-xs text-white text-center outline-none"
                  />
                  <button className="p-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition">
                    <Save className="h-4 w-4" />
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
