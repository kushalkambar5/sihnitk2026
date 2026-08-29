'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useCheckoutStore } from '@/stores/checkout.store';
import { Bot, Send, Sparkles, FileText, Printer, User as UserIcon } from 'lucide-react';

export default function AiAssistantPage() {
  const router = useRouter();
  const { setDocument } = useCheckoutStore();

  const [messages, setMessages] = useState<Array<{ sender: 'USER' | 'ASSISTANT'; text: string; document?: any }>>([
    {
      sender: 'ASSISTANT',
      text: 'Hello! I am your AI Document Assistant. Tell me what document you need (e.g. Leave Application, Resume, Cover Page), and I will generate a formatted PDF ready for instant printing.',
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = { sender: 'USER' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      const mockDoc = {
        id: `ai-doc-${Date.now()}`,
        userId: 'demo-user',
        name: `Generated_${query.slice(0, 15).replace(/\s+/g, '_')}.pdf`,
        documentType: 'PDF' as const,
        sourceType: 'GENERATED' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentVersion: {
          id: `ai-ver-${Date.now()}`,
          documentId: `ai-doc-${Date.now()}`,
          versionNumber: 1,
          fileUrl: '/uploads/sample.pdf',
          filePath: 'sample.pdf',
          fileName: `Generated_${query.slice(0, 15).replace(/\s+/g, '_')}.pdf`,
          fileSize: 524288,
          mimeType: 'application/pdf',
          pageCount: 1,
          createdAt: new Date().toISOString(),
        },
      };

      const aiMsg = {
        sender: 'ASSISTANT' as const,
        text: `I have formatted and generated your document: "${mockDoc.name}". You can preview it below or send it directly to the Print Studio!`,
        document: mockDoc,
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const handlePrintGenerated = (doc: any) => {
    setDocument(doc, doc.currentVersion);
    router.push('/print/configure');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6 flex flex-col h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white">AI Document Assistant</h1>
              <p className="text-xs text-zinc-400">Generate formatted PDF documents through conversational AI prompts</p>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              'Draft a College Leave Application',
              'Generate CS Assignment Cover Page',
              'Format ATS Software Engineer Resume',
            ].map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(prompt)}
                className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 px-3.5 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition whitespace-nowrap flex items-center gap-1.5"
              >
                <Sparkles className="h-3 w-3 text-cyan-400" />
                {prompt}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 ${m.sender === 'USER' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-xl shrink-0 text-xs font-bold ${
                    m.sender === 'USER'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-indigo-950 border border-indigo-500/30 text-indigo-400'
                  }`}
                >
                  {m.sender === 'USER' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-md rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                    m.sender === 'USER'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                  }`}
                >
                  <p>{m.text}</p>

                  {m.document && (
                    <div className="rounded-xl border border-indigo-500/30 bg-zinc-950 p-3 flex items-center justify-between gap-3 mt-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                        <span className="font-bold text-white truncate">{m.document.name}</span>
                      </div>
                      <button
                        onClick={() => handlePrintGenerated(m.document)}
                        className="flex items-center gap-1 rounded-lg bg-indigo-600 px-3 py-1.5 text-[11px] font-bold text-white hover:bg-indigo-500 transition shrink-0"
                      >
                        <Printer className="h-3 w-3" /> Print Studio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono">
                <Bot className="h-4 w-4 animate-spin" /> AI is formatting your document...
              </div>
            )}
          </div>

          {/* Input Box */}
          <div className="relative">
            <input
              type="text"
              placeholder="Describe the document you need..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 pl-4 pr-12 py-3.5 text-xs text-white placeholder-zinc-500 focus:border-indigo-500 outline-none"
            />
            <button
              onClick={() => handleSend()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-500 transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
