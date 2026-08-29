'use client';

import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { queueService } from '@/services/queue.service';
import { Layers, Printer, RefreshCw, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SmartQueueBoardPage() {
  const shopId = 'demo-shop-id';
  const [reroutingJobId, setReroutingJobId] = useState<string | null>(null);

  const { data: queue = [], refetch } = useQuery({
    queryKey: ['shop-queue', shopId],
    queryFn: () => queueService.getShopQueue(shopId),
  });

  const mockJobs = queue.length > 0 ? queue : [
    { id: 'job-01', orderNumber: 'DP-00124', documentName: 'CS_Final_Assignment.pdf', pageCount: 12, printerName: 'HP LaserJet Pro M404', status: 'PROCESSING', position: 1, estimatedWaitMinutes: 2 },
    { id: 'job-02', orderNumber: 'DP-00125', documentName: 'Lab_Report_Cover.pdf', pageCount: 20, printerName: 'Canon ImageCLASS LBP226', status: 'WAITING', position: 2, estimatedWaitMinutes: 5 },
    { id: 'job-03', orderNumber: 'DP-00126', documentName: 'Software_Engineering_Resume.pdf', pageCount: 2, printerName: 'Epson EcoTank L3150', status: 'WAITING', position: 3, estimatedWaitMinutes: 7 },
  ];

  const handleSimulateReroute = (jobId: string) => {
    setReroutingJobId(jobId);
    setTimeout(() => {
      setReroutingJobId(null);
      alert('Job automatically rerouted to backup printer: Epson EcoTank L3150!');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-xs font-semibold text-purple-300 mb-2">
                <Layers className="h-3.5 w-3.5 text-purple-400" />
                Smart Load Balancing Queue
              </div>
              <h1 className="text-2xl font-extrabold text-white">Live Print Queue Manager</h1>
            </div>

            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition"
            >
              <RefreshCw className="h-4 w-4" /> Refresh Queue
            </button>
          </div>

          <div className="space-y-4">
            {mockJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-indigo-600/20 text-xs font-bold text-indigo-400 border border-indigo-500/30">
                      #{job.position}
                    </span>
                    <h3 className="text-sm font-bold text-white">{job.documentName}</h3>
                    <span className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                      Order #{job.orderNumber}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400">
                    Pages: {job.pageCount} • Assigned Printer: <strong className="text-zinc-200">{job.printerName}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleSimulateReroute(job.id)}
                    disabled={reroutingJobId === job.id}
                    className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-purple-500/10 px-3.5 py-2 text-xs font-bold text-purple-300 hover:bg-purple-500/20 transition"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${reroutingJobId === job.id ? 'animate-spin' : ''}`} />
                    {reroutingJobId === job.id ? 'Rerouting...' : 'Auto Reroute Job'}
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
