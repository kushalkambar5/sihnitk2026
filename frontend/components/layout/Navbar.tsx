'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Printer,
  Bell,
  Upload,
  Bot,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldAlert,
  Store,
  Truck,
  Sparkles,
  Search,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import { UserRole } from '@/types';

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout, setAuth } = useAuthStore();
  const { openUploadModal, toggleNotificationDrawer } = useUiStore();
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

  // Quick Demo Login helper for SIH evaluation
  const handleQuickLogin = (role: UserRole) => {
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
    setRoleDropdownOpen(false);

    if (role === 'CUSTOMER') router.push('/dashboard');
    else if (role === 'SHOP_OWNER' || role === 'SHOP_STAFF') router.push('/shop/dashboard');
    else if (role === 'DELIVERY_PARTNER') router.push('/delivery/jobs');
    else if (role === 'ADMIN') router.push('/admin/dashboard');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'CUSTOMER') return '/dashboard';
    if (user.role === 'SHOP_OWNER' || user.role === 'SHOP_STAFF') return '/shop/dashboard';
    if (user.role === 'DELIVERY_PARTNER') return '/delivery/jobs';
    if (user.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white transition-opacity hover:opacity-90">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-2 shadow-lg shadow-indigo-500/20">
              <Printer className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
              DocPrint<span className="text-cyan-400">.ai</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-zinc-400">
            <Link href="/shops" className="transition hover:text-white flex items-center gap-1.5">
              <Store className="h-4 w-4 text-zinc-400" />
              Find Shops
            </Link>
            <Link href="/services" className="transition hover:text-white">
              Services
            </Link>
            <Link href="/templates" className="transition hover:text-white">
              Templates
            </Link>
            <Link href="/ai" className="transition hover:text-indigo-400 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              AI Assistant
            </Link>
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Demo Role Switcher Badge */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20 transition shadow-sm"
              title="Switch role for demo"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              Role: <span className="text-white font-bold">{user?.role || 'Guest'}</span>
              <ChevronDown className="h-3.5 w-3.5 text-indigo-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-xl border border-zinc-800 bg-zinc-900 p-2 shadow-2xl z-50">
                <div className="px-2 py-1 text-[11px] font-semibold text-zinc-500 uppercase tracking-wider">
                  Quick Role Switch (Demo)
                </div>
                <button
                  onClick={() => handleQuickLogin('CUSTOMER')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <UserIcon className="h-3.5 w-3.5 text-indigo-400" />
                  Customer Experience
                </button>
                <button
                  onClick={() => handleQuickLogin('SHOP_OWNER')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Store className="h-3.5 w-3.5 text-cyan-400" />
                  Shop Owner Dashboard
                </button>
                <button
                  onClick={() => handleQuickLogin('DELIVERY_PARTNER')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <Truck className="h-3.5 w-3.5 text-emerald-400" />
                  Delivery Partner Jobs
                </button>
                <button
                  onClick={() => handleQuickLogin('ADMIN')}
                  className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-zinc-200 hover:bg-zinc-800 flex items-center gap-2"
                >
                  <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                  Admin Console
                </button>
              </div>
            )}
          </div>

          {/* Quick Upload CTA */}
          <button
            onClick={openUploadModal}
            className="hidden sm:flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/25 hover:from-indigo-500 hover:to-indigo-400 transition"
          >
            <Upload className="h-4 w-4" />
            Upload File
          </button>

          {/* Notifications Drawer Toggle */}
          {isAuthenticated && (
            <button
              onClick={toggleNotificationDrawer}
              className="relative p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400" />
            </button>
          )}

          {/* User Account Menu */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href={getDashboardPath()}
                className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 transition"
              >
                <div className="h-6 w-6 rounded-full bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-[10px] font-bold text-indigo-300">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="p-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-zinc-900 transition"
                title="Log out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-xl bg-zinc-900 border border-zinc-800 px-4 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
