'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { printersService } from '@/services/printers.service';
import { Printer as PrinterIcon, AlertTriangle, CheckCircle2, RefreshCw, Zap, Plus, ShieldAlert } from 'lucide-react';
import { Printer, PrinterStatus } from '@/types';

export default function PrinterFleetPage() {
  const shopId = 'demo-shop-id';
  const queryClient = useQueryClient();

  const [simulatedFailure, setSimulatedFailure] = useState(false);

  const { data: printers = [] } = useQuery({
    queryKey: ['shop-printers', shopId],
    queryFn: () => printersService.getShopPrinters(shopId),
  });

  const reportHealthMutation = useMutation({
    mutationFn: printersService.reportHealth,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['shop-printers'] }),
  });

  const mockPrinters: Printer[] = printers.length > 0 ? printers : [
    {
      id: 'p-01',
      shopId,
      name: 'HP LaserJet Pro M404',
      manufacturer: 'HP',
      model: 'M404dn',
      printerType: 'LASER',
      connectionType: 'ETHERNET',
      status: simulatedFailure ? 'ERROR' : 'ONLINE',
      paperLevel: simulatedFailure ? 0 : 85,
      inkLevel: 90,
      errorCode: simulatedFailure ? 'PAPER_JAM' : undefined,
      errorMessage: simulatedFailure ? 'Paper Jam in Tray 2' : undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p-02',
      shopId,
      name: 'Canon ImageCLASS LBP226',
      manufacturer: 'Canon',
      model: 'LBP226dw',
      printerType: 'LASER',
      connectionType: 'WIFI',
      status: 'BUSY',
      paperLevel: 60,
      inkLevel: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'p-03',
      shopId,
      name: 'Epson EcoTank L3150 Color',
      manufacturer: 'Epson',
      model: 'L3150',
      printerType: 'INKJET',
      connectionType: 'USB',
      status: 'ONLINE',
      paperLevel: 95,
      inkLevel: 80,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  const handleToggleFailureDemo = () => {
    const nextState = !simulatedFailure;
    setSimulatedFailure(nextState);

    reportHealthMutation.mutate({
      printerId: 'p-01',
      status: nextState ? 'ERROR' : 'ONLINE',
      paperLevel: nextState ? 0 : 85,
      errorCode: nextState ? 'PAPER_JAM' : undefined,
      errorMessage: nextState ? 'Paper Jam detected' : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 mb-2">
                <PrinterIcon className="h-3.5 w-3.5 text-cyan-400" />
                Hardware Fleet Monitoring
              </div>
              <h1 className="text-2xl font-extrabold text-white">Printer Fleet & Hardware Status</h1>
            </div>

            {/* SIH Killer Demo Action: Simulate Printer Failure */}
            <button
              onClick={handleToggleFailureDemo}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition shadow-xl ${
                simulatedFailure
                  ? 'bg-rose-600 text-white hover:bg-rose-500 shadow-rose-600/30'
                  : 'bg-gradient-to-r from-amber-600 to-rose-600 text-white hover:from-amber-500 hover:to-rose-500 shadow-amber-600/30'
              }`}
            >
              <AlertTriangle className="h-4 w-4" />
              {simulatedFailure ? 'Resolve Simulated Failure' : '⚡ Simulate Hardware Printer Failure'}
            </button>
          </div>

          {/* Alert Banner when failure simulated */}
          {simulatedFailure && (
            <div className="rounded-3xl border border-rose-500/40 bg-rose-950/30 p-6 shadow-2xl space-y-3 animate-pulse">
              <div className="flex items-center gap-3">
                <ShieldAlert className="h-6 w-6 text-rose-400 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-rose-200">Hardware Failure Alert Triggered: Paper Jam</h3>
                  <p className="text-xs text-rose-300/80 mt-0.5">
                    HP LaserJet Pro M404 has encountered a hardware paper jam. Affected jobs are being automatically rerouted to Epson EcoTank L3150!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Printer Fleet Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockPrinters.map((p) => {
              const isError = p.status === 'ERROR';
              const isBusy = p.status === 'BUSY';
              const isOnline = p.status === 'ONLINE';

              return (
                <div
                  key={p.id}
                  className={`rounded-3xl border p-6 flex flex-col justify-between transition shadow-xl ${
                    isError
                      ? 'border-rose-500/50 bg-rose-950/20'
                      : isBusy
                      ? 'border-amber-500/30 bg-amber-950/10'
                      : 'border-zinc-800 bg-zinc-900/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${
                          isError
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : isBusy
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            isError ? 'bg-rose-400 animate-ping' : isBusy ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                        />
                        {p.status}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500">{p.connectionType}</span>
                    </div>

                    <h3 className="text-base font-bold text-white mb-1">{p.name}</h3>
                    <p className="text-xs text-zinc-400 mb-4">{p.manufacturer} {p.model}</p>

                    {/* Paper & Ink Levels */}
                    <div className="space-y-3 border-t border-zinc-800/80 pt-4 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Paper Level</span>
                          <span className="font-bold text-white">{p.paperLevel}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${isError ? 'bg-rose-500' : 'bg-indigo-500'}`}
                            style={{ width: `${p.paperLevel}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] text-zinc-400 mb-1">
                          <span>Toner / Ink Level</span>
                          <span className="font-bold text-white">{p.inkLevel}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-500" style={{ width: `${p.inkLevel}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {isError && (
                    <div className="mt-4 pt-3 border-t border-rose-500/30 text-rose-300 text-[11px]">
                      <strong>Error Code:</strong> {p.errorCode || 'HARDWARE_ERROR'}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}
