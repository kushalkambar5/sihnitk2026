import { api } from '@/lib/axios';
import { ApiResponse, User } from '@/types';

export const authService = {
  register: async (data: { name: string; email: string; phone?: string; password: string; role?: string }) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/register', data);
    return res.data.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<ApiResponse<{ user: User; accessToken: string; refreshToken: string }>>('/auth/login', data);
    return res.data.data;
  },

  refresh: async (refreshToken: string) => {
    const res = await api.post<ApiResponse<{ accessToken: string; refreshToken: string }>>('/auth/refresh', { refreshToken });
    return res.data.data;
  },

  logout: async (refreshToken?: string) => {
    const res = await api.post<ApiResponse<void>>('/auth/logout', { refreshToken });
    return res.data;
  },

  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const res = await api.post<ApiResponse<void>>('/auth/change-password', data);
    return res.data;
  },
};
