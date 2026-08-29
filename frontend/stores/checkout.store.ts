import { create } from 'zustand';
import { PrintConfiguration, FulfillmentType, Shop, DocumentItem, DocumentVersion, PriceEstimateResponse } from '@/types';

interface CheckoutState {
  shop: Shop | null;
  document: DocumentItem | null;
  documentVersion: DocumentVersion | null;
  configuration: PrintConfiguration;
  fulfillmentType: FulfillmentType;
  selectedAddressId: string | null;
  estimatedPrice: PriceEstimateResponse | null;
  
  setShop: (shop: Shop | null) => void;
  setDocument: (doc: DocumentItem | null, version?: DocumentVersion | null) => void;
  setConfiguration: (config: Partial<PrintConfiguration>) => void;
  setFulfillmentType: (type: FulfillmentType) => void;
  setSelectedAddressId: (addressId: string | null) => void;
  setEstimatedPrice: (estimate: PriceEstimateResponse | null) => void;
  resetCheckout: () => void;
}

const defaultConfig: PrintConfiguration = {
  copies: 1,
  colorMode: 'BLACK_WHITE',
  printSide: 'SINGLE_SIDED',
  paperSize: 'A4',
  paperType: 'NORMAL',
  bindingType: 'NONE',
  pageRange: '',
};

export const useCheckoutStore = create<CheckoutState>((set) => ({
  shop: null,
  document: null,
  documentVersion: null,
  configuration: defaultConfig,
  fulfillmentType: 'PICKUP',
  selectedAddressId: null,
  estimatedPrice: null,

  setShop: (shop) => set({ shop }),
  setDocument: (doc, version) =>
    set({
      document: doc,
      documentVersion: version || doc?.currentVersion || null,
    }),
  setConfiguration: (config) =>
    set((state) => ({
      configuration: { ...state.configuration, ...config },
    })),
  setFulfillmentType: (fulfillmentType) => set({ fulfillmentType }),
  setSelectedAddressId: (selectedAddressId) => set({ selectedAddressId }),
  setEstimatedPrice: (estimatedPrice) => set({ estimatedPrice }),
  resetCheckout: () =>
    set({
      shop: null,
      document: null,
      documentVersion: null,
      configuration: defaultConfig,
      fulfillmentType: 'PICKUP',
      selectedAddressId: null,
      estimatedPrice: null,
    }),
}));
