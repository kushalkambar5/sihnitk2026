import { api } from '@/lib/axios';
import { ApiResponse, Order } from '@/types';

export const pickupService = {
  getPickupToken: async (orderId: string) => {
    const res = await api.get<ApiResponse<{ token: string; orderId: string }>>(`/orders/${orderId}/pickup-token`);
    return res.data.data;
  },

  verifyPickup: async (token: string) => {
    const res = await api.post<ApiResponse<Order>>('/pickup/verify', { token });
    return res.data.data;
  },
};
