import { api } from '@/lib/axios';
import { ApiResponse, MasterService, ShopService } from '@/types';

export const servicesService = {
  listMasterServices: async () => {
    const res = await api.get<ApiResponse<MasterService[]>>('/services');
    return res.data.data;
  },

  createMasterService: async (data: { name: string; category: string; description?: string }) => {
    const res = await api.post<ApiResponse<MasterService>>('/services', data);
    return res.data.data;
  },

  getShopServices: async (shopId: string) => {
    const res = await api.get<ApiResponse<ShopService[]>>(`/shops/${shopId}/services`);
    return res.data.data;
  },

  addShopService: async (shopId: string, data: { serviceId: string; isAvailable?: boolean }) => {
    const res = await api.post<ApiResponse<ShopService>>(`/shops/${shopId}/services`, data);
    return res.data.data;
  },

  updateShopService: async (shopServiceId: string, data: { isAvailable?: boolean }) => {
    const res = await api.patch<ApiResponse<ShopService>>(`/shop-services/${shopServiceId}`, data);
    return res.data.data;
  },

  deleteShopService: async (shopServiceId: string) => {
    const res = await api.delete<ApiResponse<void>>(`/shop-services/${shopServiceId}`);
    return res.data;
  },
};
