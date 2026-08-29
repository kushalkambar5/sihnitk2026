import { api } from '@/lib/axios';
import { ApiResponse, PricingRule, PriceEstimateRequest, PriceEstimateResponse } from '@/types';

export const pricingService = {
  getRules: async (shopServiceId: string) => {
    const res = await api.get<ApiResponse<PricingRule[]>>(`/shop-services/${shopServiceId}/pricing`);
    return res.data.data;
  },

  addRule: async (shopServiceId: string, rule: Partial<PricingRule>) => {
    const res = await api.post<ApiResponse<PricingRule>>(`/shop-services/${shopServiceId}/pricing`, rule);
    return res.data.data;
  },

  updateRule: async (pricingRuleId: string, rule: Partial<PricingRule>) => {
    const res = await api.patch<ApiResponse<PricingRule>>(`/pricing/${pricingRuleId}`, rule);
    return res.data.data;
  },

  deleteRule: async (pricingRuleId: string) => {
    const res = await api.delete<ApiResponse<void>>(`/pricing/${pricingRuleId}`);
    return res.data;
  },

  estimatePrice: async (data: PriceEstimateRequest) => {
    const res = await api.post<ApiResponse<PriceEstimateResponse>>('/pricing/estimate', data);
    return res.data.data;
  },
};
