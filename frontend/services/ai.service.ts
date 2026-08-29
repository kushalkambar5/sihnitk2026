import { api } from '@/lib/axios';
import { ApiResponse, AiConversation, AiMessage } from '@/types';

export const aiService = {
  createConversation: async (title?: string) => {
    const res = await api.post<ApiResponse<AiConversation>>('/ai/conversations', { title });
    return res.data.data;
  },

  getConversations: async () => {
    const res = await api.get<ApiResponse<AiConversation[]>>('/ai/conversations');
    return res.data.data;
  },

  getConversation: async (id: string) => {
    const res = await api.get<ApiResponse<{ conversation: AiConversation; messages: AiMessage[] }>>(`/ai/conversations/${id}`);
    return res.data.data;
  },

  sendMessage: async (id: string, content: string) => {
    const res = await api.post<ApiResponse<{ userMessage: AiMessage; assistantMessage: AiMessage }>>(`/ai/conversations/${id}/messages`, { content });
    return res.data.data;
  },

  deleteConversation: async (id: string) => {
    const res = await api.delete<ApiResponse<void>>(`/ai/conversations/${id}`);
    return res.data;
  },
};
