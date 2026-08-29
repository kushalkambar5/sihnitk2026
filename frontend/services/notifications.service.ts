import { api } from '@/lib/axios';
import { ApiResponse, NotificationItem } from '@/types';

export const notificationsService = {
  getNotifications: async () => {
    const res = await api.get<ApiResponse<NotificationItem[]>>('/notifications');
    return res.data.data;
  },

  markAllAsRead: async () => {
    const res = await api.patch<ApiResponse<void>>('/notifications/read-all');
    return res.data;
  },

  markAsRead: async (id: string) => {
    const res = await api.patch<ApiResponse<void>>(`/notifications/${id}/read`);
    return res.data;
  },

  deleteNotification: async (id: string) => {
    const res = await api.delete<ApiResponse<void>>(`/notifications/${id}`);
    return res.data;
  },
};
