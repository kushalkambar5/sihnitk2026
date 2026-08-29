import { api } from '@/lib/axios';
import { ApiResponse, DocumentItem } from '@/types';

export interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  templateDefinition?: Record<string, any>;
  createdAt: string;
}

export const templatesService = {
  listTemplates: async (category?: string) => {
    const res = await api.get<ApiResponse<TemplateItem[]>>('/templates', { params: { category } });
    return res.data.data;
  },

  getTemplate: async (templateId: string) => {
    const res = await api.get<ApiResponse<TemplateItem>>(`/templates/${templateId}`);
    return res.data.data;
  },

  generate: async (templateId: string, inputData: Record<string, any>) => {
    const res = await api.post<ApiResponse<DocumentItem>>(`/templates/${templateId}/generate`, { inputData });
    return res.data.data;
  },
};
