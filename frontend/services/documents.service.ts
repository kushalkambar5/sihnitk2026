import { api } from '@/lib/axios';
import { ApiResponse, DocumentItem, DocumentVersion } from '@/types';

export const documentsService = {
  upload: async (file: File, name?: string, onProgress?: (percent: number) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    if (name) formData.append('name', name);

    const res = await api.post<ApiResponse<DocumentItem>>('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percent);
        }
      },
    });
    return res.data.data;
  },

  getUserDocuments: async () => {
    const res = await api.get<ApiResponse<DocumentItem[]>>('/documents');
    return res.data.data;
  },

  getDocument: async (documentId: string) => {
    const res = await api.get<ApiResponse<DocumentItem>>(`/documents/${documentId}`);
    return res.data.data;
  },

  getDownloadUrl: async (documentId: string) => {
    const res = await api.get<ApiResponse<{ downloadUrl: string }>>(`/documents/${documentId}/download`);
    return res.data.data;
  },

  deleteDocument: async (documentId: string) => {
    const res = await api.delete<ApiResponse<void>>(`/documents/${documentId}`);
    return res.data;
  },

  addVersion: async (documentId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await api.post<ApiResponse<DocumentVersion>>(`/documents/${documentId}/versions`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data.data;
  },

  editDocument: async (documentId: string, options: Record<string, any>) => {
    const res = await api.post<ApiResponse<DocumentVersion>>(`/documents/${documentId}/edit`, options);
    return res.data.data;
  },

  mergeDocuments: async (documentIds: string[], name?: string) => {
    const res = await api.post<ApiResponse<DocumentItem>>('/documents/merge', { documentIds, name });
    return res.data.data;
  },
};
