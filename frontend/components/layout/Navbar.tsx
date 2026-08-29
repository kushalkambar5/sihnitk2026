'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';
import {
  Printer,
  Bell,
  Upload,
  LogOut,
  Store,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';
import { useUiStore } from '@/stores/ui.store';
import { notificationsService } from '@/services/notifications.service';

export default function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { user: storeUser, isAuthenticated: storeAuth, logout: storeLogout } = useAuthStore();
  const { openUploadModal, toggleNotificationDrawer } = useUiStore();

  const currentUser = (session?.user as any) || storeUser;
  const isAuthenticated = status === 'authenticated' || storeAuth;

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getNotifications,
    enabled: isAuthenticated,
    staleTime: 1000 * 30,
  });

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => !n.isRead).length
    : 0;

  const handleLogout = async () => {
    storeLogout();
    await signOut({ callbackUrl: '/' });
  };

  const getDashboardPath = () => {
    if (!currentUser) return '/login';
    if (currentUser.role === 'CUSTOMER') return '/dashboard';
    if (currentUser.role === 'SHOP_OWNER' || currentUser.role === 'SHOP_STAFF') return '/shop/dashboard';
    if (currentUser.role === 'DELIVERY_PARTNER') return '/delivery/jobs';
    if (currentUser.role === 'ADMIN') return '/admin/dashboard';
    return '/dashboard';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md font-sans">
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
              title="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              )}
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
                  {currentUser?.name?.charAt(0) || 'U'}
                </div>
                <span className="hidden sm:inline">{currentUser?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
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
