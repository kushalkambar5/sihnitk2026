import { api } from '@/lib/axios';
import { ApiResponse, QueuePrediction } from '@/types';

export interface QueueItem {
  id: string;
  shopId: string;
  orderId: string;
  orderNumber?: string;
  documentName?: string;
  pageCount?: number;
  assignedPrinterId?: string;
  printerName?: string;
  status: string;
  position: number;
  estimatedWaitMinutes: number;
  createdAt: string;
}

export const queueService = {
  getShopQueue: async (shopId: string) => {
    const res = await api.get<ApiResponse<QueueItem[]>>(`/shops/${shopId}/queue`);
    return res.data.data;
  },

  getOrderEstimatedTime: async (orderId: string) => {
    const res = await api.get<ApiResponse<{ estimatedMinutes: number; position: number }>>(`/orders/${orderId}/estimated-time`);
    return res.data.data;
  },

  getPrediction: async (shopId: string) => {
    const res = await api.get<ApiResponse<QueuePrediction>>(`/shops/${shopId}/queue/prediction`);
    return res.data.data;
  },
};
