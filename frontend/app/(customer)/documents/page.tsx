'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useUiStore } from '@/stores/ui.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsService } from '@/services/documents.service';
import { FileText, Upload, Printer, Trash2, Eye, Download, Plus } from 'lucide-react';
import { DocumentItem } from '@/types';

export default function CustomerDocumentsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { openUploadModal } = useUiStore();
  const { setDocument } = useCheckoutStore();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsService.getUserDocuments,
  });

  const deleteMutation = useMutation({
    mutationFn: documentsService.deleteDocument,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['documents'] }),
  });

  const handleConfigurePrint = (doc: DocumentItem) => {
    setDocument(doc, doc.currentVersion);
    router.push('/print/configure');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-white">My Document Library</h1>
              <p className="text-xs text-zinc-400 mt-1">Manage your uploaded PDFs, Word files, images, and AI-generated files.</p>
            </div>

            <button
              onClick={openUploadModal}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <Plus className="h-4 w-4" />
              Upload Document
            </button>
          </div>

          {/* Documents Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 rounded-2xl bg-zinc-900/50 animate-pulse border border-zinc-800" />
              ))}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800">
              <FileText className="mx-auto h-12 w-12 text-zinc-700 mb-3" />
              <h3 className="text-lg font-bold text-white">Your library is empty</h3>
              <p className="text-xs text-zinc-500 mt-1">Upload a file to start customizing print configurations.</p>
              <button
                onClick={openUploadModal}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition"
              >
                <Upload className="h-4 w-4" />
                Upload First File
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5 flex flex-col justify-between hover:border-indigo-500/40 transition">
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 shrink-0">
                        <FileText className="h-5 w-5" />
                      </div>
                      <button
                        onClick={() => deleteMutation.mutate(doc.id)}
                        className="text-zinc-500 hover:text-rose-400 p-1"
                        title="Delete document"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">{doc.name}</h3>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      {doc.documentType} • Version {doc.currentVersion?.versionNumber || 1}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-800/80 flex gap-2">
                    <button
                      onClick={() => handleConfigurePrint(doc)}
                      className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition shadow-md shadow-indigo-600/20"
                    >
                      <Printer className="h-3.5 w-3.5" />
                      Configure Print
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
