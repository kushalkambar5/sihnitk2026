'use client';

import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import UploadModal from '@/components/layout/UploadModal';
import NotificationDrawer from '@/components/layout/NotificationDrawer';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications.service';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getNotifications,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      <Navbar />
      <UploadModal />
      <NotificationDrawer />

      <div className="flex flex-1 mx-auto max-w-7xl w-full">
        <Sidebar />

        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-white">Notifications Center</h1>
              <p className="text-xs text-zinc-400 mt-1">Real-time alerts for print job progress, queue updates, and rerouting.</p>
            </div>

            {notifications.length > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
              >
                <CheckCheck className="h-4 w-4" /> Mark All Read
              </button>
            )}
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-4 rounded-2xl border transition ${
                  n.isRead ? 'border-zinc-800/80 bg-zinc-900/30 text-zinc-400' : 'border-indigo-500/30 bg-indigo-950/20 text-white'
                }`}
              >
                <h4 className="text-xs font-bold text-white">{n.title}</h4>
                <p className="text-xs text-zinc-400 mt-1">{n.message}</p>
                <span className="text-[10px] text-zinc-500 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
