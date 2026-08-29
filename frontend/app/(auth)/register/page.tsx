'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Navbar from '@/components/layout/Navbar';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/stores/auth.store';
import { Printer, UserPlus, Lock, Mail, User as UserIcon, Phone } from 'lucide-react';
import { UserRole } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('CUSTOMER');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const cleanPhone = phone.trim() ? phone.trim() : undefined;
      const data = await authService.register({ name, email, phone: cleanPhone, password, role });
      
      setAuth(data.user, data.accessToken, data.refreshToken);

      // Sign in to NextAuth session
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        console.warn('NextAuth session sync warning:', res.error);
      }

      if (role === 'CUSTOMER') router.push('/dashboard');
      else if (role === 'SHOP_OWNER') router.push('/shop/dashboard');
      else if (role === 'DELIVERY_PARTNER') router.push('/delivery/jobs');
      else router.push('/dashboard');
    } catch (err: any) {
      console.error(err);
      const serverMsg = err?.response?.data?.message;
      const serverDetails = err?.response?.data?.errors;
      if (Array.isArray(serverDetails) && serverDetails.length > 0) {
        setError(`${serverMsg || 'Validation Error'}: ${serverDetails.map((d: any) => d.message || d.field).join(', ')}`);
      } else {
        setError(serverMsg || 'Registration failed. Please check inputs.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      <Navbar />
      <NotificationDrawer />

      <main className="mx-auto max-w-md px-4 py-12 flex-1 w-full flex flex-col justify-center">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-6">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Printer className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold text-white">Create DocPrint Account</h1>
            <p className="text-xs text-zinc-400 mt-1">Select your role and start using cloud print services</p>
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-950/30 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Account Role</label>
              <div className="grid grid-cols-3 gap-2">
                {(['CUSTOMER', 'SHOP_OWNER', 'DELIVERY_PARTNER'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`p-2.5 rounded-xl border font-semibold text-[11px] transition ${
                      role === r
                        ? 'border-indigo-500 bg-indigo-600/20 text-indigo-300'
                        : 'border-zinc-800 bg-zinc-950 text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {r.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Kushal Kambar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

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
              <label className="block font-semibold text-zinc-400 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-zinc-800 bg-zinc-950 pl-10 pr-4 py-3 text-white focus:border-indigo-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-zinc-400 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  placeholder="At least 6 characters"
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
              <UserPlus className="h-4 w-4" />
              {loading ? 'Registering...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-zinc-500 mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
