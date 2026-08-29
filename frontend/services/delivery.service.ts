import { api } from '@/lib/axios';
import { ApiResponse, Address, DeliveryJob } from '@/types';

export const deliveryService = {
  getAddresses: async () => {
    const res = await api.get<ApiResponse<Address[]>>('/addresses');
    return res.data.data;
  },

  addAddress: async (data: Omit<Address, 'id' | 'userId'>) => {
    const res = await api.post<ApiResponse<Address>>('/addresses', data);
    return res.data.data;
  },

  updateAddress: async (id: string, data: Partial<Address>) => {
    const res = await api.patch<ApiResponse<Address>>(`/addresses/${id}`, data);
    return res.data.data;
  },

  deleteAddress: async (id: string) => {
    const res = await api.delete<ApiResponse<void>>(`/addresses/${id}`);
    return res.data;
  },

  getJobs: async () => {
    const res = await api.get<ApiResponse<DeliveryJob[]>>('/delivery-partner/jobs');
    return res.data.data;
  },

  acceptJob: async (deliveryId: string) => {
    const res = await api.post<ApiResponse<DeliveryJob>>(`/deliveries/${deliveryId}/accept`);
    return res.data.data;
  },

  pickupJob: async (deliveryId: string) => {
    const res = await api.post<ApiResponse<DeliveryJob>>(`/deliveries/${deliveryId}/pickup`);
    return res.data.data;
  },

  completeJob: async (deliveryId: string) => {
    const res = await api.post<ApiResponse<DeliveryJob>>(`/deliveries/${deliveryId}/complete`);
    return res.data.data;
  },

  postLocation: async (deliveryId: string, location: { latitude: number; longitude: number; accuracy?: number }) => {
    const res = await api.post<ApiResponse<void>>(`/deliveries/${deliveryId}/location`, location);
    return res.data;
  },

  getTracking: async (deliveryId: string) => {
    const res = await api.get<ApiResponse<DeliveryJob>>(`/deliveries/${deliveryId}/tracking`);
    return res.data.data;
  },
};
