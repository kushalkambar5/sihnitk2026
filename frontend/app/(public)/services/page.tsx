'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useUiStore } from '@/stores/ui.store';
import { Printer, Image as ImageIcon, BookOpen, ShieldCheck, Box, Sparkles, ArrowRight } from 'lucide-react';

export default function ServicesCatalogPage() {
  const { openUploadModal } = useUiStore();

  const services = [
    {
      title: 'Black & White Printing',
      desc: 'High-speed laser printing on crisp A4, A3, Legal, and Letter paper. Perfect for assignments, lab reports, and exam notes.',
      price: 'Starting at ₹2.00 / page',
      icon: Printer,
      tag: 'Most Popular',
    },
    {
      title: 'High-Resolution Color Printing',
      desc: 'Vibrant color reproduction for presentations, posters, diagrams, and photo-paper prints.',
      price: 'Starting at ₹10.00 / page',
      icon: ImageIcon,
      tag: 'High Quality',
    },
    {
      title: 'Spiral & Comb Binding',
      desc: 'Professional document binding with transparent front cover, hard back cover, and durable spiral spines.',
      price: 'Starting at ₹30.00 / document',
      icon: BookOpen,
      tag: 'Finishing',
    },
    {
      title: '3D Printing & Prototyping',
      desc: 'Rapid FDM 3D printing for engineering models, CAD prototypes, and custom student projects.',
      price: 'Starting at ₹15.00 / gram',
      icon: Box,
      tag: 'Specialty',
    },
    {
      title: 'Document Lamination',
      desc: 'Heavy-duty thermal pouch lamination for certificates, IDs, and official records.',
      price: 'Starting at ₹20.00 / sheet',
      icon: ShieldCheck,
      tag: 'Protection',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Full-Spectrum Print Capabilities</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">DocPrint Services & Pricing Catalog</h1>
          <p className="text-sm text-zinc-400 mt-2">Check base prices across verified partner print shops and order directly online.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                      <Icon className="h-6 w-6" />
                    </div>
                    <span className="rounded-full bg-zinc-800 px-3 py-1 text-[10px] font-bold text-zinc-300">{s.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">{s.desc}</p>
                </div>

                <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-indigo-300">{s.price}</span>
                  <button
                    onClick={openUploadModal}
                    className="flex items-center gap-1 text-xs font-bold text-white hover:text-indigo-400 transition"
                  >
                    Order Now <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
