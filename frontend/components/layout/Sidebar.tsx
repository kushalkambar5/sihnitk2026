'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Sliders,
  ShoppingBag,
  MapPin,
  Bell,
  Bot,
  Store,
  Layers,
  Printer,
  Wrench,
  DollarSign,
  Users,
  Settings,
  BarChart3,
  Truck,
  History,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';
import { useAuthStore } from '@/stores/auth.store';

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const role = user?.role || 'CUSTOMER';

  const customerNav = [
    { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { label: 'My Documents', href: '/documents', icon: FileText },
    { label: 'Print Config Studio', href: '/print/configure', icon: Sliders },
    { label: 'My Orders', href: '/orders', icon: ShoppingBag },
    { label: 'Saved Addresses', href: '/addresses', icon: MapPin },
    { label: 'AI Document Assistant', href: '/ai', icon: Bot },
    { label: 'Notifications', href: '/notifications', icon: Bell },
  ];

  const shopNav = [
    { label: 'Shop Dashboard', href: '/shop/dashboard', icon: LayoutDashboard },
    { label: 'Shop Orders', href: '/shop/orders', icon: ShoppingBag },
    { label: 'Smart Queue Board', href: '/shop/queue', icon: Layers },
    { label: 'Printer Fleet', href: '/shop/printers', icon: Printer },
    { label: 'Shop Services', href: '/shop/services', icon: Wrench },
    { label: 'Pricing Rules', href: '/shop/pricing', icon: DollarSign },
    { label: 'Staff Management', href: '/shop/staff', icon: Users },
    { label: 'Analytics', href: '/shop/analytics', icon: BarChart3 },
    { label: 'Shop Settings', href: '/shop/settings', icon: Settings },
  ];

  const deliveryNav = [
    { label: 'Available Jobs', href: '/delivery/jobs', icon: Truck },
    { label: 'Active Delivery', href: '/delivery/active', icon: MapPin },
    { label: 'Delivery History', href: '/delivery/history', icon: History },
  ];

  const adminNav = [
    { label: 'Admin Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Manage Users', href: '/admin/users', icon: Users },
    { label: 'Manage Shops', href: '/admin/shops', icon: Store },
    { label: 'Global Printers', href: '/admin/printers', icon: Printer },
    { label: 'Global Orders', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Security & Audit Logs', href: '/admin/audit-logs', icon: Activity },
  ];

  let currentNav = customerNav;
  if (role === 'SHOP_OWNER' || role === 'SHOP_STAFF') currentNav = shopNav;
  else if (role === 'DELIVERY_PARTNER') currentNav = deliveryNav;
  else if (role === 'ADMIN') currentNav = adminNav;

  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 p-4 hidden md:block min-h-[calc(100vh-4rem)]">
      <div className="mb-4 px-3 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
        <span className="text-[10px] font-bold tracking-wider text-zinc-500 uppercase">Active Workspace</span>
        <div className="text-xs font-semibold text-zinc-200 mt-0.5 flex items-center justify-between">
          <span>{role.replace('_', ' ')} Workspace</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
        </div>
      </div>

      <nav className="space-y-1">
        {currentNav.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80'
              }`}
            >
              <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-zinc-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
