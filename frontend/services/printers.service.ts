import { api } from '@/lib/axios';
import { ApiResponse, Printer, PrinterType, ConnectionType, PrinterStatus } from '@/types';

export interface AddPrinterPayload {
  name: string;
  manufacturer?: string;
  model?: string;
  printerType: PrinterType;
  connectionType: ConnectionType;
}

export const printersService = {
  getShopPrinters: async (shopId: string) => {
    const res = await api.get<ApiResponse<Printer[]>>(`/shops/${shopId}/printers`);
    return res.data.data;
  },

  addPrinter: async (shopId: string, payload: AddPrinterPayload) => {
    const res = await api.post<ApiResponse<Printer>>(`/shops/${shopId}/printers`, payload);
    return res.data.data;
  },

  getPrinter: async (printerId: string) => {
    const res = await api.get<ApiResponse<Printer>>(`/printers/${printerId}`);
    return res.data.data;
  },

  updatePrinter: async (printerId: string, data: Partial<Printer>) => {
    const res = await api.patch<ApiResponse<Printer>>(`/printers/${printerId}`, data);
    return res.data.data;
  },

  deletePrinter: async (printerId: string) => {
    const res = await api.delete<ApiResponse<void>>(`/printers/${printerId}`);
    return res.data;
  },

  reportHealth: async (healthData: {
    printerId: string;
    status: PrinterStatus;
    paperLevel?: number;
    inkLevel?: number;
    errorCode?: string;
    errorMessage?: string;
  }) => {
    const res = await api.post<ApiResponse<any>>('/printer-agent/health', healthData);
    return res.data.data;
  },
};
