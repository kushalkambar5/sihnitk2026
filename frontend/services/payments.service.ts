import { api } from '@/lib/axios';
import { ApiResponse } from '@/types';

export const paymentsService = {
  verifyPayment: async (data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => {
    const res = await api.post<ApiResponse<any>>('/payments/verify', data);
    return res.data.data;
  },

  refundOrder: async (orderId: string, amount?: number, reason?: string) => {
    const res = await api.post<ApiResponse<any>>(`/orders/${orderId}/refund`, { amount, reason });
    return res.data.data;
  },
};
