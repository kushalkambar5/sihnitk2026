import { api } from '@/lib/axios';
import { ApiResponse, Shop } from '@/types';

export const shopsService = {
  listShops: async (params?: { latitude?: number; longitude?: number; search?: string }) => {
    const res = await api.get<ApiResponse<Shop[]>>('/shops', { params });
    return res.data.data;
  },

  getShop: async (shopId: string) => {
    const res = await api.get<ApiResponse<Shop>>(`/shops/${shopId}`);
    return res.data.data;
  },

  getMyShops: async () => {
    const res = await api.get<ApiResponse<Shop[]>>('/my/shops');
    return res.data.data;
  },

  createShop: async (data: {
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    address: string;
    latitude?: number;
    longitude?: number;
  }) => {
    const res = await api.post<ApiResponse<Shop>>('/shops', data);
    return res.data.data;
  },

  updateShop: async (shopId: string, data: Partial<Shop>) => {
    const res = await api.patch<ApiResponse<Shop>>(`/shops/${shopId}`, data);
    return res.data.data;
  },

  deleteShop: async (shopId: string) => {
    const res = await api.delete<ApiResponse<void>>(`/shops/${shopId}`);
    return res.data;
  },
};
