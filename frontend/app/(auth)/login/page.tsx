'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Printer, LogIn, Lock, Mail, ShieldAlert, Store, Truck, User as UserIcon } from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await authService.login({ email, password });
      setAuth(data.user, data.accessToken, data.refreshToken);

      if (data.user.role === 'CUSTOMER') router.push('/dashboard');
      else if (data.user.role === 'SHOP_OWNER' || data.user.role === 'SHOP_STAFF') router.push('/shop/dashboard');
      else if (data.user.role === 'DELIVERY_PARTNER') router.push('/delivery/jobs');
      else if (data.user.role === 'ADMIN') router.push('/admin/dashboard');
      else router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Invalid email or password. You can also click a Quick Demo Login below.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (role: UserRole) => {
    const demoUser = {
      id: `demo-${role.toLowerCase()}-id`,
      name: `Demo ${role.replace('_', ' ')}`,
      email: `${role.toLowerCase()}@docprint.io`,
      role,
      isActive: true,
      isEmailVerified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setAuth(demoUser, `demo-${role}-access-token`, `demo-${role}-refresh-token`);

    if (role === 'CUSTOMER') router.push('/dashboard');
    else if (role === 'SHOP_OWNER' || role === 'SHOP_STAFF') router.push('/shop/dashboard');
    else if (role === 'DELIVERY_PARTNER') router.push('/delivery/jobs');
    else if (role === 'ADMIN') router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <NotificationDrawer />

      <main className="mx-auto max-w-md px-4 py-16 flex-1 w-full flex flex-col justify-center">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Printer className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Sign In to DocPrint</h1>
            <p className="text-xs text-zinc-400 mt-1">Access your documents, orders, and shop management</p>
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
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-xs font-bold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition"
            >
              <LogIn className="h-4 w-4" />
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Login Preset Bar */}
          <div className="mt-8 pt-6 border-t border-zinc-800">
            <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider block text-center mb-3">
              ⚡ Instant SIH Demo Login Presets
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoLogin('CUSTOMER')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-[11px] font-semibold text-indigo-300 hover:bg-zinc-800 transition"
              >
                <UserIcon className="h-3.5 w-3.5" /> Customer
              </button>
              <button
                onClick={() => handleDemoLogin('SHOP_OWNER')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-[11px] font-semibold text-cyan-300 hover:bg-zinc-800 transition"
              >
                <Store className="h-3.5 w-3.5" /> Shop Owner
              </button>
              <button
                onClick={() => handleDemoLogin('DELIVERY_PARTNER')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-[11px] font-semibold text-emerald-300 hover:bg-zinc-800 transition"
              >
                <Truck className="h-3.5 w-3.5" /> Delivery
              </button>
              <button
                onClick={() => handleDemoLogin('ADMIN')}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-950 p-2.5 text-[11px] font-semibold text-rose-300 hover:bg-zinc-800 transition"
              >
                <ShieldAlert className="h-3.5 w-3.5" /> Admin
              </button>
            </div>
          </div>

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
