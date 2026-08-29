import { api } from '@/lib/axios';
import { ApiResponse, User, Shop, Order } from '@/types';

export interface AdminDashboardData {
  totalUsers: number;
  totalShops: number;
  totalOrders: number;
  totalRevenue: number;
  recentUsers: User[];
  recentShops: Shop[];
}

export const adminService = {
  getDashboard: async () => {
    const res = await api.get<ApiResponse<AdminDashboardData>>('/admin/dashboard');
    return res.data.data;
  },

  listUsers: async () => {
    const res = await api.get<ApiResponse<User[]>>('/admin/users');
    return res.data.data;
  },

  listShops: async () => {
    const res = await api.get<ApiResponse<Shop[]>>('/admin/shops');
    return res.data.data;
  },

  verifyShop: async (shopId: string, isVerified: boolean) => {
    const res = await api.patch<ApiResponse<Shop>>(`/admin/shops/${shopId}/verify`, { isVerified });
    return res.data.data;
  },

  setShopStatus: async (shopId: string, isActive: boolean) => {
    const res = await api.patch<ApiResponse<Shop>>(`/admin/shops/${shopId}/status`, { isActive });
    return res.data.data;
  },

  getAuditLogs: async () => {
    const res = await api.get<ApiResponse<any[]>>('/admin/audit-logs');
    return res.data.data;
  },
};
