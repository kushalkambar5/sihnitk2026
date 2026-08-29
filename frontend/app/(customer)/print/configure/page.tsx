'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useUiStore } from '@/stores/ui.store';
import { pricingService } from '@/services/pricing.service';
import { documentsService } from '@/services/documents.service';
import { useQuery } from '@tanstack/react-query';
import {
  FileText,
  Minus,
  Plus,
  Zap,
  Sliders,
  CheckCircle2,
  ArrowRight,
  Upload,
  BookOpen,
  Sparkles,
  Info,
} from 'lucide-react';
import { ColorMode, PrintSide, PaperSize, PaperType, BindingType, DocumentItem } from '@/types';

export default function PrintConfigurePage() {
  const router = useRouter();
  const { openUploadModal } = useUiStore();
  const {
    document: selectedDoc,
    documentVersion,
    configuration,
    setDocument,
    setConfiguration,
    setEstimatedPrice,
    estimatedPrice,
    shop,
  } = useCheckoutStore();

  const { data: userDocuments = [] } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsService.getUserDocuments,
  });

  const [debouncedLoading, setDebouncedLoading] = useState(false);

  // Debounced Pricing Estimate
  useEffect(() => {
    const handler = setTimeout(async () => {
      setDebouncedLoading(true);
      try {
        const estimate = await pricingService.estimatePrice({
          shopId: shop?.id || '00000000-0000-0000-0000-000000000000',
          documentVersionId: documentVersion?.id,
          pageCount: documentVersion?.pageCount || 10,
          configuration,
        });
        setEstimatedPrice(estimate);
      } catch (err) {
        // Fallback local estimation calculation for smooth UI feedback
        const pageCount = documentVersion?.pageCount || 10;
        const pricePerPage = configuration.colorMode === 'COLOR' ? 10 : 2;
        const bindingFee =
          configuration.bindingType === 'SPIRAL'
            ? 30
            : configuration.bindingType === 'COMB'
            ? 25
            : configuration.bindingType === 'STAPLE'
            ? 5
            : 0;
        const total = (pageCount * pricePerPage + bindingFee) * configuration.copies;

        setEstimatedPrice({
          totalPages: pageCount,
          copies: configuration.copies,
          pricePerPage,
          basePrice: 0,
          bindingPrice: bindingFee,
          totalPrice: total,
          breakdown: `${pageCount} pages × ₹${pricePerPage}/pg + ₹${bindingFee} binding × ${configuration.copies} copies`,
        });
      } finally {
        setDebouncedLoading(false);
      }
    }, 400);

    return () => clearTimeout(handler);
  }, [configuration, documentVersion, shop, setEstimatedPrice]);

  const handleDocSelect = (docId: string) => {
    const found = userDocuments.find((d) => d.id === docId);
    if (found) setDocument(found, found.currentVersion);
  };

  const handleProceedToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-2">
                <Sliders className="h-3.5 w-3.5 text-cyan-400" />
                Print Configuration Studio
              </div>
              <h1 className="text-2xl font-extrabold text-white">Customize Job Settings</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Document Selection & Preview */}
            <div className="lg:col-span-5 space-y-6">
              {/* Document Selection Card */}
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl space-y-4">
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  Selected Document
                </label>

                {userDocuments.length > 0 && (
                  <select
                    value={selectedDoc?.id || ''}
                    onChange={(e) => handleDocSelect(e.target.value)}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-white outline-none focus:border-indigo-500"
                  >
                    <option value="" disabled>
                      Select from uploaded documents...
                    </option>
                    {userDocuments.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.documentType})
                      </option>
                    ))}
                  </select>
                )}

                {selectedDoc ? (
                  <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                        <FileText className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{selectedDoc.name}</h4>
                        <p className="text-[10px] text-zinc-400 mt-0.5">
                          {documentVersion?.pageCount || 10} Pages • Version {documentVersion?.versionNumber || 1}
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                      Loaded
                    </span>
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-950/40">
                    <FileText className="mx-auto h-8 w-8 text-zinc-700 mb-2" />
                    <p className="text-xs font-semibold text-zinc-400">No document selected</p>
                    <button
                      onClick={openUploadModal}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-indigo-400 hover:text-indigo-300"
                    >
                      <Upload className="h-3.5 w-3.5" /> Upload File Now
                    </button>
                  </div>
                )}
              </div>

              {/* Simulated Document Preview Sheet */}
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col items-center justify-center min-h-[280px]">
                <div className="w-48 h-64 rounded-xl bg-white shadow-2xl p-4 text-zinc-900 flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-2">
                    <div className="h-3 w-3/4 bg-zinc-300 rounded" />
                    <div className="h-2 w-full bg-zinc-200 rounded" />
                    <div className="h-2 w-full bg-zinc-200 rounded" />
                    <div className="h-2 w-2/3 bg-zinc-200 rounded" />
                  </div>
                  <div className="border-t border-zinc-200 pt-2 flex justify-between text-[8px] text-zinc-400">
                    <span>Page 1 of {documentVersion?.pageCount || 10}</span>
                    <span>{configuration.colorMode}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Settings Studio & Price Card */}
            <div className="lg:col-span-7 space-y-6">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-xl space-y-6">

                {/* Copies Counter */}
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-5">
                  <div>
                    <h3 className="text-sm font-bold text-white">Number of Copies</h3>
                    <p className="text-xs text-zinc-400">Set total duplicate prints needed</p>
                  </div>
                  <div className="flex items-center gap-3 bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                    <button
                      onClick={() => setConfiguration({ copies: Math.max(1, configuration.copies - 1) })}
                      className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 transition"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-white">{configuration.copies}</span>
                    <button
                      onClick={() => setConfiguration({ copies: configuration.copies + 1 })}
                      className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-300 transition"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Color Mode Selection */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Color Mode</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setConfiguration({ colorMode: 'BLACK_WHITE' })}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        configuration.colorMode === 'BLACK_WHITE'
                          ? 'border-indigo-500 bg-indigo-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-xs block font-bold text-white">● Black & White</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">₹2.00 / page</span>
                    </button>

                    <button
                      onClick={() => setConfiguration({ colorMode: 'COLOR' })}
                      className={`p-3.5 rounded-2xl border text-left transition ${
                        configuration.colorMode === 'COLOR'
                          ? 'border-indigo-500 bg-indigo-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-xs block font-bold text-white">○ Full Color</span>
                      <span className="text-[10px] text-zinc-500 mt-0.5 block">₹10.00 / page</span>
                    </button>
                  </div>
                </div>

                {/* Side Mode Selection */}
                <div>
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">Printing Side</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setConfiguration({ printSide: 'SINGLE_SIDED' })}
                      className={`p-3 rounded-2xl border text-left transition ${
                        configuration.printSide === 'SINGLE_SIDED'
                          ? 'border-indigo-500 bg-indigo-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">Single Sided</span>
                    </button>

                    <button
                      onClick={() => setConfiguration({ printSide: 'DOUBLE_SIDED' })}
                      className={`p-3 rounded-2xl border text-left transition ${
                        configuration.printSide === 'DOUBLE_SIDED'
                          ? 'border-indigo-500 bg-indigo-600/15 text-white font-bold'
                          : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                      }`}
                    >
                      <span className="text-xs font-bold text-white">Double Sided (Duplex)</span>
                    </button>
                  </div>
                </div>

                {/* Paper Size & Binding */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Paper Size
                    </label>
                    <select
                      value={configuration.paperSize}
                      onChange={(e) => setConfiguration({ paperSize: e.target.value as PaperSize })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-white outline-none focus:border-indigo-500"
                    >
                      <option value="A4">A4 Standard</option>
                      <option value="A3">A3 Large Poster</option>
                      <option value="A5">A5 Booklet</option>
                      <option value="LETTER">Letter</option>
                      <option value="LEGAL">Legal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      Binding & Finishing
                    </label>
                    <select
                      value={configuration.bindingType}
                      onChange={(e) => setConfiguration({ bindingType: e.target.value as BindingType })}
                      className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-xs text-white outline-none focus:border-indigo-500"
                    >
                      <option value="NONE">No Binding</option>
                      <option value="SPIRAL">Spiral Binding (+₹30)</option>
                      <option value="COMB">Comb Binding (+₹25)</option>
                      <option value="STAPLE">Corner Staple (+₹5)</option>
                      <option value="PERFECT_BINDING">Perfect Book Binding (+₹50)</option>
                    </select>
                  </div>
                </div>

                {/* Live Estimated Price Breakdown */}
                <div className="mt-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-zinc-900 to-zinc-950 p-5 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider block">
                      Estimated Cost Breakdown
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-extrabold text-white">
                        ₹ {estimatedPrice?.totalPrice || 24}.00
                      </span>
                      {debouncedLoading && <span className="text-[10px] text-indigo-400 animate-pulse">Calculating...</span>}
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-1">{estimatedPrice?.breakdown}</p>
                  </div>

                  <button
                    onClick={handleProceedToCheckout}
                    className="flex items-center gap-2 rounded-2xl bg-indigo-600 px-6 py-3.5 text-xs font-bold text-white shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 transition shrink-0"
                  >
                    Select Shop & Checkout
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
