'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery } from '@tanstack/react-query';
import { templatesService } from '@/services/templates.service';
import { FileText, Sparkles, ArrowRight, BookOpen, Award, FileSpreadsheet } from 'lucide-react';

export default function TemplatesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates', selectedCategory],
    queryFn: () => templatesService.listTemplates(selectedCategory),
  });

  const sampleTemplates = [
    {
      id: 'resume-standard',
      name: 'Standard Software Engineering Resume',
      category: 'RESUME',
      description: 'Clean ATS-optimized single-page resume layout with education, skills, and experience sections.',
    },
    {
      id: 'leave-letter',
      name: 'Official College Leave Application',
      category: 'LETTER',
      description: 'Pre-formatted leave request letter addressed to HOD / Warden with reason & dates fill-ins.',
    },
    {
      id: 'assignment-cover',
      name: 'Lab Report & Assignment Cover Page',
      category: 'ASSIGNMENT',
      description: 'Includes University logo header, Student Name, Roll No, Branch, Subject Code, and Submission date.',
    },
    {
      id: 'certificate-appreciation',
      name: 'Event Certificate of Appreciation',
      category: 'CERTIFICATE',
      description: 'High-resolution border layout for student club events and hackathons.',
    },
  ];

  const displayedTemplates = templates.length > 0 ? templates : sampleTemplates;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1 text-xs font-semibold text-indigo-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Instant Document Builder</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Pre-Configured Document Templates</h1>
          <p className="text-sm text-zinc-400 mt-2">Fill in your details, instantly generate a formatted document, and send directly to print.</p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-8">
          {['ALL', 'RESUME', 'LETTER', 'ASSIGNMENT', 'CERTIFICATE', 'REPORT'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'ALL' ? undefined : cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold whitespace-nowrap border transition ${
                (cat === 'ALL' && !selectedCategory) || selectedCategory === cat
                  ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedTemplates.map((t) => (
            <div key={t.id} className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 flex flex-col justify-between hover:border-indigo-500/40 transition">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 text-[10px] font-bold text-indigo-300">
                    {t.category}
                  </span>
                  <FileText className="h-5 w-5 text-zinc-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">{t.description}</p>
              </div>

              <Link
                href={`/templates/${t.id}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/30 hover:bg-indigo-500 transition"
              >
                Use Template & Generate PDF
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
