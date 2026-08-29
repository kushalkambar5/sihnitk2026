export type UserRole =
  | 'CUSTOMER'
  | 'SHOP_OWNER'
  | 'SHOP_STAFF'
  | 'DELIVERY_PARTNER'
  | 'ADMIN';

export type ServiceCategory =
  | 'PRINTING'
  | 'SCANNING'
  | 'PHOTOCOPY'
  | 'LAMINATION'
  | 'BINDING'
  | 'THREE_D_PRINTING';

export type ColorMode = 'BLACK_WHITE' | 'COLOR';
export type PrintSide = 'SINGLE_SIDED' | 'DOUBLE_SIDED';
export type PaperSize = 'A4' | 'A3' | 'A5' | 'LETTER' | 'LEGAL';
export type PaperType = 'NORMAL' | 'GLOSSY' | 'MATTE' | 'PHOTO' | 'CARDSTOCK';
export type BindingType = 'NONE' | 'SPIRAL' | 'COMB' | 'STAPLE' | 'PERFECT_BINDING';

export type DocumentType = 'PDF' | 'DOCX' | 'IMAGE' | 'PPTX' | 'XLSX' | 'OTHER';
export type DocumentSourceType = 'UPLOADED' | 'GENERATED' | 'TEMPLATE';
export type TemplateCategory =
  | 'RESUME'
  | 'LETTER'
  | 'CERTIFICATE'
  | 'ASSIGNMENT'
  | 'REPORT'
  | 'FORM'
  | 'OTHER';

export type OrderStatus =
  | 'CREATED'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'OUT_FOR_DELIVERY'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'FAILED'
  | 'REFUNDED';

export type FulfillmentType = 'PICKUP' | 'DELIVERY';
export type PrinterType = 'LASER' | 'INKJET' | 'THERMAL' | 'THREE_D';
export type ConnectionType = 'USB' | 'WIFI' | 'ETHERNET' | 'BLUETOOTH';
export type PrinterStatus = 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ERROR' | 'MAINTENANCE';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Shop {
  id: string;
  ownerId: string;
  name: string;
  description?: string;
  phone?: string;
  email?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  isVerified: boolean;
  isActive: boolean;
  rating?: number;
  totalOrders?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PrintConfiguration {
  copies: number;
  pageRange?: string;
  colorMode: ColorMode;
  printSide: PrintSide;
  paperSize: PaperSize;
  paperType?: PaperType;
  bindingType?: BindingType;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNumber: number;
  fileUrl: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  pageCount: number;
  createdAt: string;
}

export interface DocumentItem {
  id: string;
  userId: string;
  name: string;
  documentType: DocumentType;
  sourceType: DocumentSourceType;
  currentVersionId?: string;
  currentVersion?: DocumentVersion;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  documentVersionId: string;
  documentVersion?: DocumentVersion;
  quantity: number;
  configuration: PrintConfiguration;
  itemPrice: number;
  status: string;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  shopId: string;
  shop?: Shop;
  user?: User;
  status: OrderStatus;
  fulfillmentType: FulfillmentType;
  totalAmount: number;
  estimatedCompletionTime?: string;
  deliveryAddressId?: string;
  deliveryAddress?: Address;
  pickupToken?: string;
  items?: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Printer {
  id: string;
  shopId: string;
  name: string;
  manufacturer?: string;
  model?: string;
  printerType: PrinterType;
  connectionType: ConnectionType;
  status: PrinterStatus;
  paperLevel?: number;
  inkLevel?: number;
  errorCode?: string;
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueuePrediction {
  shopId: string;
  totalQueuedJobs: number;
  estimatedWaitMinutes: number;
  activePrintersCount: number;
}

export interface MasterService {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  isActive: boolean;
}

export interface ShopService {
  id: string;
  shopId: string;
  serviceId: string;
  service?: MasterService;
  isAvailable: boolean;
  createdAt: string;
}

export interface PricingRule {
  id: string;
  shopServiceId: string;
  paperSize?: PaperSize;
  paperType?: PaperType;
  colorMode?: ColorMode;
  sideMode?: PrintSide;
  basePrice: number;
  pricePerPage: number;
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  isDefault: boolean;
}

export interface DeliveryJob {
  id: string;
  orderId: string;
  order?: Order;
  deliveryPartnerId?: string;
  status: 'PENDING' | 'ACCEPTED' | 'PICKED_UP' | 'DELIVERED' | 'CANCELLED';
  pickupAddress: string;
  deliveryAddress: string;
  distanceKm?: number;
  earningAmount?: number;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface AiConversation {
  id: string;
  userId: string;
  title?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AiMessage {
  id: string;
  conversationId: string;
  sender: 'USER' | 'ASSISTANT';
  content: string;
  documentId?: string;
  createdAt: string;
}

export interface PriceEstimateRequest {
  shopId: string;
  documentVersionId?: string;
  pageCount?: number;
  configuration: PrintConfiguration;
}

export interface PriceEstimateResponse {
  totalPages: number;
  copies: number;
  pricePerPage: number;
  basePrice: number;
  bindingPrice: number;
  totalPrice: number;
  breakdown: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: Record<string, any>;
}
