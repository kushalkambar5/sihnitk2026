import { api } from '@/lib/axios';
import { ApiResponse, User } from '@/types';

export const usersService = {
  getMe: async () => {
    const res = await api.get<ApiResponse<User>>('/users/me');
    return res.data.data;
  },

  updateMe: async (data: { name?: string; phone?: string }) => {
    const res = await api.patch<ApiResponse<User>>('/users/me', data);
    return res.data.data;
  },

  deleteMe: async () => {
    const res = await api.delete<ApiResponse<void>>('/users/me');
    return res.data;
  },
};
