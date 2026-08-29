'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useUiStore } from '@/stores/ui.store';
import {
  Upload,
  QrCode,
  Zap,
  ShieldCheck,
  Sparkles,
  Store,
  Clock,
  Printer,
  ChevronRight,
  Bot,
  Layers,
  ArrowRight,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function LandingPage() {
  const { openUploadModal } = useUiStore();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32 border-b border-zinc-900">
        {/* Glowing backdrop Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-600/20 via-cyan-500/15 to-purple-600/20 blur-[130px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
                <span>Automated Cloud Printing & Smart Queue System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
                Upload. Configure.{' '}
                <span className="bg-gradient-to-r from-indigo-400 via-cyan-300 to-indigo-200 bg-clip-text text-transparent">
                  Skip the Queue.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                DocPrint connects campus students and customers directly to nearby smart print shops. Upload files, customize print configurations, pay online, and pick up instantly with a QR code or request hostel delivery.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={openUploadModal}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 px-7 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <Upload className="h-5 w-5" />
                  Upload & Print Now
                </button>

                <Link
                  href="/shops"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl border border-zinc-800 bg-zinc-900/80 px-6 py-4 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition"
                >
                  <Store className="h-4 w-4 text-zinc-400" />
                  Explore Nearby Shops
                </Link>
              </div>

              {/* Stats Bar */}
              <div className="pt-8 border-t border-zinc-900 grid grid-cols-3 gap-6 max-w-lg mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-extrabold text-white">100%</div>
                  <div className="text-xs text-zinc-500 font-medium">Queue Bypass</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">&lt; 5 mins</div>
                  <div className="text-xs text-zinc-500 font-medium">Avg Pickup Time</div>
                </div>
                <div>
                  <div className="text-2xl font-extrabold text-white">0%</div>
                  <div className="text-xs text-zinc-500 font-medium">Printer Downtime</div>
                </div>
              </div>
            </div>

            {/* Hero Right Visual: Live Quick Print Studio Preview */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border border-zinc-800/80 bg-zinc-900/60 p-6 shadow-2xl backdrop-blur-xl">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-zinc-500">Live Print Configuration</span>
                </div>

                {/* Simulated Document Preview */}
                <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4 mb-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">CS_Final_Assignment.pdf</h4>
                      <p className="text-[11px] text-zinc-500">12 Pages • 2.4 MB</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-[10px] font-bold text-emerald-400">
                    Parsed
                  </span>
                </div>

                {/* Simulated Controls */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Color Mode</span>
                    <div className="flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-indigo-600 font-semibold text-white">B&W (₹2/pg)</span>
                      <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-400">Color (₹10/pg)</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Binding</span>
                    <span className="font-semibold text-zinc-200">Spiral Binding (+₹30)</span>
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950/60 p-3 rounded-xl border border-zinc-800/50">
                    <span className="text-zinc-400 font-medium">Copies</span>
                    <span className="font-semibold text-zinc-200">2 Copies</span>
                  </div>
                </div>

                {/* Total Price Estimate */}
                <div className="mt-5 rounded-2xl bg-gradient-to-r from-indigo-950/50 to-zinc-900 p-4 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-indigo-300 font-medium uppercase tracking-wider block">Estimated Price</span>
                    <span className="text-2xl font-extrabold text-white">₹ 78.00</span>
                  </div>
                  <button
                    onClick={openUploadModal}
                    className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/30"
                  >
                    Try It Now
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-zinc-950 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-white">How DocPrint Works</h2>
            <p className="text-sm text-zinc-400 mt-2">Zero lines, zero waiting time. Print documents seamlessly in 4 simple steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Upload File',
                desc: 'Upload your PDF, Word, or image file directly from phone or laptop.',
                icon: Upload,
              },
              {
                step: '02',
                title: 'Configure & Pay',
                desc: 'Select color, paper size, spiral binding, and view real-time prices.',
                icon: Zap,
              },
              {
                step: '03',
                title: 'Smart Queueing',
                desc: 'Job is automatically assigned to the fastest online shop printer.',
                icon: Layers,
              },
              {
                step: '04',
                title: 'QR Pickup / Delivery',
                desc: 'Scan your QR code at the shop counter or get instant hostel delivery.',
                icon: QrCode,
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-6 hover:border-indigo-500/40 transition group">
                  <span className="text-3xl font-extrabold text-zinc-800 group-hover:text-indigo-500/30 transition block mb-4">
                    {item.step}
                  </span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 mb-4">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* AI Document Generation & Hardware Rerouting Highlight */}
      <section className="py-20 bg-gradient-to-b from-zinc-950 via-zinc-900/50 to-zinc-950 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* AI Assistant */}
            <div className="rounded-3xl border border-indigo-500/20 bg-indigo-950/20 p-8 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-4">
                <Bot className="h-3.5 w-3.5 text-indigo-400" />
                <span>AI Document Assistant</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Generate Resumes & Reports via Conversational AI</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                Don't have a document ready? Chat with our built-in AI assistant to draft leave applications, project cover pages, or resumes, and send them straight to print.
              </p>
              <Link
                href="/ai"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 transition"
              >
                Try AI Assistant
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Smart Hardware Rerouting */}
            <div className="rounded-3xl border border-cyan-500/20 bg-cyan-950/20 p-8 relative overflow-hidden">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-4">
                <Printer className="h-3.5 w-3.5 text-cyan-400" />
                <span>Smart Hardware Rerouting</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Zero-Downtime Printing Fleet</h3>
              <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                If a printer runs out of paper or experiences a paper jam, DocPrint's real-time hardware monitoring automatically reroutes your job to the next available printer without delays.
              </p>
              <Link
                href="/shops"
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-5 py-2.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition"
              >
                View Live Shop Fleet
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-zinc-950 border-t border-zinc-900 mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Printer className="h-4 w-4" />
            </div>
            <span className="text-sm font-bold text-white">DocPrint Ecosystem © 2026</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-500">
            <Link href="/shops" className="hover:text-zinc-300 transition">Marketplace</Link>
            <Link href="/services" className="hover:text-zinc-300 transition">Services</Link>
            <Link href="/templates" className="hover:text-zinc-300 transition">Templates</Link>
            <Link href="/login" className="hover:text-zinc-300 transition">Partner Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
