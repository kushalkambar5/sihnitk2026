import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'DocPrint | Automated Cloud Printing & Smart Queue Ecosystem',
  description: 'Upload documents, configure print jobs, skip queues with QR pickup or hyper-local delivery.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-100 font-sans selection:bg-indigo-500 selection:text-white">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
