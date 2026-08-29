'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, getSession } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { Printer, LogIn, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError(res.error || 'Authentication failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      const session = await getSession();
      const role = session?.user?.role;

      if (role === 'CUSTOMER') router.push('/dashboard');
      else if (role === 'SHOP_OWNER' || role === 'SHOP_STAFF') router.push('/shop/dashboard');
      else if (role === 'DELIVERY_PARTNER') router.push('/delivery/jobs');
      else if (role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError('An unexpected error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <NotificationDrawer />

      <main className="mx-auto max-w-md px-4 py-16 flex-1 w-full flex flex-col justify-center">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Printer className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Sign In to DocPrint</h1>
            <p className="text-xs text-zinc-400 mt-1">Access your account, documents, and dashboard</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition disabled:opacity-50"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
              Create account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
