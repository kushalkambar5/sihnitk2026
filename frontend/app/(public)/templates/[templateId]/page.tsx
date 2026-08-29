'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useCheckoutStore } from '@/stores/checkout.store';
import { Sparkles, ArrowRight, FileText, CheckCircle2 } from 'lucide-react';

export default function TemplateGeneratePage() {
  const params = useParams();
  const router = useRouter();
  const templateId = params.templateId as string;
  const { setDocument } = useCheckoutStore();

  const [formData, setFormData] = useState({
    title: 'Formal College Leave Application',
    studentName: 'Kushal Kambar',
    rollNumber: '211CS124',
    department: 'Computer Science & Engineering',
    reason: 'Attending SIH National Finals Hackathon 2026',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
  });

  const [generating, setGenerating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);

    setTimeout(() => {
      setGenerating(false);
      setSuccess(true);
      // Mock generated document
      const mockDoc = {
        id: `gen-doc-${Date.now()}`,
        userId: 'demo-user',
        name: `${formData.title}.pdf`,
        documentType: 'PDF' as const,
        sourceType: 'GENERATED' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentVersion: {
          id: `gen-ver-${Date.now()}`,
          documentId: `gen-doc-${Date.now()}`,
          versionNumber: 1,
          fileUrl: '/uploads/sample.pdf',
          filePath: 'sample.pdf',
          fileName: `${formData.title}.pdf`,
          fileSize: 1048576,
          mimeType: 'application/pdf',
          pageCount: 2,
          createdAt: new Date().toISOString(),
        },
      };
      setDocument(mockDoc, mockDoc.currentVersion);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Generate Document from Template</h1>
              <p className="text-xs text-zinc-400">Fill in the parameters to generate a formatted PDF</p>
            </div>
          </div>

          {success ? (
            <div className="text-center py-10 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold text-white">Document Generated Successfully!</h2>
              <p className="text-xs text-zinc-400">{formData.title}.pdf is ready for printing.</p>
              <button
                onClick={() => router.push('/print/configure')}
                className="mt-4 flex items-center justify-center gap-2 mx-auto rounded-xl bg-indigo-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
              >
                Proceed to Print Studio
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Document Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Full Student Name</label>
                  <input
                    type="text"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Roll / Registration No.</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({ ...formData, rollNumber: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 font-semibold mb-1">Department / Branch</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white focus:border-indigo-500 outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-semibold mb-1">Reason / Content Details</label>
                <textarea
                  rows={4}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 p-3 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={generating}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition"
                >
                  {generating ? 'Building PDF...' : 'Generate PDF & Send to Print'}
                  <Sparkles className="h-4 w-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
