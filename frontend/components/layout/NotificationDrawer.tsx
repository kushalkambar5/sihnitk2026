'use client';

import React from 'react';
import { X, Bell, Check, CheckCheck, Trash2, ShieldAlert } from 'lucide-react';
import { useUiStore } from '@/stores/ui.store';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsService } from '@/services/notifications.service';
import { NotificationItem } from '@/types';

export default function NotificationDrawer() {
  const { isNotificationDrawerOpen, toggleNotificationDrawer } = useUiStore();
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: notificationsService.getNotifications,
    enabled: isNotificationDrawerOpen,
  });

  const markAllMutation = useMutation({
    mutationFn: notificationsService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markReadMutation = useMutation({
    mutationFn: notificationsService.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md border-l border-zinc-800 bg-zinc-950 p-6 text-zinc-100 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                <Bell className="h-4 w-4" />
              </div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
            </div>
            <button
              onClick={toggleNotificationDrawer}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center justify-between py-3">
            <span className="text-xs text-zinc-400">{notifications.length} total alerts</span>
            {notifications.length > 0 && (
              <button
                onClick={() => markAllMutation.mutate()}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center text-zinc-500">
                <Bell className="h-10 w-10 text-zinc-700 mb-2" />
                <p className="text-sm font-medium">No new notifications</p>
                <p className="text-xs text-zinc-600">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n: NotificationItem) => (
                <div
                  key={n.id}
                  className={`p-3.5 rounded-xl border transition ${
                    n.isRead
                      ? 'border-zinc-800/60 bg-zinc-900/40 text-zinc-400'
                      : 'border-indigo-500/30 bg-indigo-950/20 text-zinc-100 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="text-xs font-bold text-zinc-200">{n.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-zinc-500 mt-2 block">
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {!n.isRead && (
                      <button
                        onClick={() => markReadMutation.mutate(n.id)}
                        className="text-indigo-400 hover:text-indigo-300 p-1"
                        title="Mark read"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
