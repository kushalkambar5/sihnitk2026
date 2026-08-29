import { api } from '@/lib/axios';
import { ApiResponse, Order, PrintConfiguration, FulfillmentType, OrderStatus } from '@/types';

export interface CreateOrderPayload {
  shopId: string;
  fulfillmentType: FulfillmentType;
  items: Array<{
    documentVersionId: string;
    quantity?: number;
    configuration: PrintConfiguration;
  }>;
}

export const ordersService = {
  createOrder: async (payload: CreateOrderPayload) => {
    const res = await api.post<ApiResponse<Order>>('/orders', payload);
    return res.data.data;
  },

  getUserOrders: async () => {
    const res = await api.get<ApiResponse<Order[]>>('/orders');
    return res.data.data;
  },

  getOrder: async (orderId: string) => {
    const res = await api.get<ApiResponse<Order>>(`/orders/${orderId}`);
    return res.data.data;
  },

  cancelOrder: async (orderId: string) => {
    const res = await api.post<ApiResponse<Order>>(`/orders/${orderId}/cancel`);
    return res.data.data;
  },

  getShopOrders: async (shopId: string, status?: OrderStatus) => {
    const res = await api.get<ApiResponse<Order[]>>(`/shops/${shopId}/orders`, {
      params: status ? { status } : undefined,
    });
    return res.data.data;
  },

  updateStatus: async (shopId: string, orderId: string, status: OrderStatus) => {
    const res = await api.patch<ApiResponse<Order>>(`/shops/${shopId}/orders/${orderId}/status`, { status });
    return res.data.data;
  },
};
