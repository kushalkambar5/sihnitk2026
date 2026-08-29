'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X, UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useUiStore } from '@/stores/ui.store';
import { useCheckoutStore } from '@/stores/checkout.store';
import { documentsService } from '@/services/documents.service';
import { DocumentItem } from '@/types';

export default function UploadModal() {
  const router = useRouter();
  const { isUploadModalOpen, closeUploadModal } = useUiStore();
  const { setDocument } = useCheckoutStore();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedDoc, setUploadedDoc] = useState<DocumentItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setProgress(10);

    try {
      const doc = await documentsService.upload(selectedFile, selectedFile.name, (pct) => setProgress(pct));
      setUploadedDoc(doc);
      setDocument(doc, doc.currentVersion);
      setProgress(100);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to upload document. Please log in or try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleProceedToPrint = () => {
    closeUploadModal();
    router.push('/print/configure');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={closeUploadModal}
          className="absolute top-4 right-4 rounded-xl p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Upload Document for Printing</h3>
            <p className="text-xs text-zinc-400">PDF, DOCX, Images up to 50MB supported</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {uploadedDoc ? (
          /* Success Screen */
          <div className="text-center py-6 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">Document Ready!</h4>
              <p className="text-xs text-zinc-400 mt-1">{uploadedDoc.name}</p>
            </div>
            <button
              onClick={handleProceedToPrint}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-400 transition"
            >
              Configure Print Settings
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        ) : (
          /* Upload Drop Zone */
          <div className="space-y-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition flex flex-col items-center justify-center gap-3 ${
                dragActive
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/80'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.pptx,.xlsx"
                onChange={handleFileChange}
              />
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400">
                <FileText className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-200">
                  {selectedFile ? selectedFile.name : 'Click to upload or drag & drop'}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : 'PDF, DOCX, PNG, JPG (Max 50MB)'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {uploading && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Uploading document...</span>
                  <span className="font-semibold text-indigo-400">{progress}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={closeUploadModal}
                className="rounded-xl px-4 py-2 text-xs font-semibold text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedFile || uploading}
                onClick={handleStartUpload}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 disabled:opacity-50 transition"
              >
                {uploading ? 'Processing...' : 'Upload File'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
