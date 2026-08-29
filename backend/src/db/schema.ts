import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  boolean,
  integer,
  numeric,
  timestamp,
  jsonb,
  inet,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// ==========================================
// ENUMS (According to README.md)
// ==========================================

export const userRoleEnum = pgEnum('user_role', [
  'CUSTOMER',
  'SHOP_OWNER',
  'SHOP_STAFF',
  'DELIVERY_PARTNER',
  'ADMIN',
]);

export const serviceCategoryEnum = pgEnum('service_category', [
  'PRINTING',
  'SCANNING',
  'PHOTOCOPY',
  'LAMINATION',
  'BINDING',
  'THREE_D_PRINTING',
]);

export const colorModeEnum = pgEnum('color_mode', [
  'BLACK_WHITE',
  'COLOR',
]);

export const printSideEnum = pgEnum('print_side', [
  'SINGLE_SIDED',
  'DOUBLE_SIDED',
]);

export const paperSizeEnum = pgEnum('paper_size', [
  'A4',
  'A3',
  'A5',
  'LETTER',
  'LEGAL',
]);

export const paperTypeEnum = pgEnum('paper_type', [
  'NORMAL',
  'GLOSSY',
  'MATTE',
  'PHOTO',
  'CARDSTOCK',
]);

export const bindingTypeEnum = pgEnum('binding_type', [
  'NONE',
  'SPIRAL',
  'COMB',
  'STAPLE',
  'PERFECT_BINDING',
]);

export const documentTypeEnum = pgEnum('document_type', [
  'PDF',
  'DOCX',
  'IMAGE',
  'PPTX',
  'XLSX',
  'OTHER',
]);

export const documentSourceTypeEnum = pgEnum('document_source_type', [
  'UPLOADED',
  'GENERATED',
  'TEMPLATE',
]);

export const templateCategoryEnum = pgEnum('template_category', [
  'RESUME',
  'LETTER',
  'CERTIFICATE',
  'ASSIGNMENT',
  'REPORT',
  'FORM',
  'OTHER',
]);

export const orderStatusEnum = pgEnum('order_status', [
  'CREATED',
  'PAYMENT_PENDING',
  'PAID',
  'PROCESSING',
  'READY_FOR_PICKUP',
  'OUT_FOR_DELIVERY',
  'COMPLETED',
  'CANCELLED',
  'FAILED',
  'REFUNDED',
]);

export const orderItemStatusEnum = pgEnum('order_item_status', [
  'PENDING',
  'QUEUED',
  'PROCESSING',
  'PRINTED',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

export const fulfillmentTypeEnum = pgEnum('fulfillment_type', [
  'PICKUP',
  'DELIVERY',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'PENDING',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
  'CANCELLED',
  'PARTIALLY_REFUNDED',
  'REFUNDED',
]);

export const paymentProviderEnum = pgEnum('payment_provider', [
  'RAZORPAY',
  'STRIPE',
  'CASH',
  'OTHER',
]);

export const paymentMethodEnum = pgEnum('payment_method', [
  'UPI',
  'CARD',
  'NETBANKING',
  'WALLET',
  'CASH',
]);

export const refundStatusEnum = pgEnum('refund_status', [
  'PENDING',
  'PROCESSING',
  'SUCCESS',
  'FAILED',
  'CANCELLED',
]);

export const printerTypeEnum = pgEnum('printer_type', [
  'LASER',
  'INKJET',
  'THERMAL',
  'THREE_D',
]);

export const printerConnectionTypeEnum = pgEnum('printer_connection_type', [
  'USB',
  'WIFI',
  'ETHERNET',
  'BLUETOOTH',
]);

export const printerStatusEnum = pgEnum('printer_status', [
  'ONLINE',
  'OFFLINE',
  'BUSY',
  'ERROR',
  'MAINTENANCE',
]);

export const printerCapabilityTypeEnum = pgEnum('printer_capability_type', [
  'BLACK_WHITE_PRINTING',
  'COLOR_PRINTING',
  'DOUBLE_SIDED_PRINTING',
  'A3_PRINTING',
  'PHOTO_PRINTING',
]);

export const printerFailureTypeEnum = pgEnum('printer_failure_type', [
  'OFFLINE',
  'PAPER_EMPTY',
  'PAPER_JAM',
  'INK_LOW',
  'INK_EMPTY',
  'TONER_LOW',
  'TONER_EMPTY',
  'CONNECTION_FAILURE',
  'HARDWARE_ERROR',
  'UNKNOWN_ERROR',
]);

export const failureSeverityEnum = pgEnum('failure_severity', [
  'LOW',
  'MEDIUM',
  'HIGH',
  'CRITICAL',
]);

export const failureStatusEnum = pgEnum('failure_status', [
  'DETECTED',
  'ACKNOWLEDGED',
  'RESOLVED',
]);

export const printJobStatusEnum = pgEnum('print_job_status', [
  'PENDING',
  'QUEUED',
  'ASSIGNED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
  'REROUTING',
]);

export const queueStatusEnum = pgEnum('queue_status', [
  'WAITING',
  'ASSIGNED',
  'PROCESSING',
  'REMOVED',
]);

export const assignmentReasonEnum = pgEnum('assignment_reason', [
  'AUTOMATIC',
  'MANUAL',
  'LOAD_BALANCING',
  'REROUTING',
]);

export const assignmentStatusEnum = pgEnum('assignment_status', [
  'ACTIVE',
  'UNASSIGNED',
  'COMPLETED',
  'FAILED',
]);

export const reroutingReasonEnum = pgEnum('rerouting_reason', [
  'PRINTER_FAILURE',
  'PRINTER_OFFLINE',
  'QUEUE_OVERLOAD',
  'LONG_WAIT_TIME',
  'MANUAL',
]);

export const reroutingStatusEnum = pgEnum('rerouting_status', [
  'INITIATED',
  'IN_PROGRESS',
  'COMPLETED',
  'FAILED',
  'CANCELLED',
]);

export const pickupTokenStatusEnum = pgEnum('pickup_token_status', [
  'ACTIVE',
  'USED',
  'EXPIRED',
  'CANCELLED',
]);

export const pickupStatusEnum = pgEnum('pickup_status', [
  'PENDING',
  'VERIFIED',
  'COMPLETED',
  'FAILED',
]);

export const shopMemberRoleEnum = pgEnum('shop_member_role', [
  'OWNER',
  'MANAGER',
  'OPERATOR',
  'STAFF',
]);

export const deliveryStatusEnum = pgEnum('delivery_status', [
  'PENDING',
  'ASSIGNED',
  'PICKED_UP',
  'IN_TRANSIT',
  'DELIVERED',
  'FAILED',
  'CANCELLED',
]);

export const notificationTypeEnum = pgEnum('notification_type', [
  'ORDER_UPDATE',
  'PAYMENT_UPDATE',
  'PRINT_UPDATE',
  'PRINTER_ALERT',
  'PICKUP_READY',
  'DELIVERY_UPDATE',
  'SYSTEM',
]);

export const notificationChannelEnum = pgEnum('notification_channel', [
  'PUSH',
  'EMAIL',
  'SMS',
  'IN_APP',
]);

export const notificationDeliveryStatusEnum = pgEnum('notification_delivery_status', [
  'PENDING',
  'SENT',
  'DELIVERED',
  'FAILED',
]);

export const documentAccessTypeEnum = pgEnum('document_access_type', [
  'VIEW',
  'DOWNLOAD',
  'PRINT',
  'EDIT',
]);

export const documentAccessActionEnum = pgEnum('document_access_action', [
  'VIEW',
  'DOWNLOAD',
  'PRINT',
  'EDIT',
  'DELETE',
]);

export const aiMessageRoleEnum = pgEnum('ai_message_role', [
  'USER',
  'ASSISTANT',
  'SYSTEM',
]);

export const aiOutputTypeEnum = pgEnum('ai_output_type', [
  'DOCUMENT',
  'TEXT',
  'SUMMARY',
  'TEMPLATE',
  'OTHER',
]);

// ==========================================
// TABLES (40 Tables according to README.md)
// ==========================================

// 1. users
export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  phone: varchar('phone', { length: 20 }),
  passwordHash: text('password_hash').notNull(),
  role: userRoleEnum('role').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. shops
export const shops = pgTable('shops', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  phone: varchar('phone', { length: 20 }),
  email: text('email'),
  address: text('address').notNull(),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  isVerified: boolean('is_verified').default(false).notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. services
export const services = pgTable('services', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  category: serviceCategoryEnum('category').notNull(),
  description: text('description'),
});

// 4. shop_services
export const shopServices = pgTable('shop_services', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  serviceId: uuid('service_id').references(() => services.id, { onDelete: 'cascade' }).notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('shop_services_shop_id_service_id_idx').on(table.shopId, table.serviceId),
]);

// 5. service_pricing
export const servicePricing = pgTable('service_pricing', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopServiceId: uuid('shop_service_id').references(() => shopServices.id, { onDelete: 'cascade' }).notNull(),
  paperSize: paperSizeEnum('paper_size'),
  paperType: paperTypeEnum('paper_type'),
  colorMode: colorModeEnum('color_mode'),
  sideMode: printSideEnum('side_mode'),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  pricePerPage: numeric('price_per_page', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 6. documents
export const documents = pgTable('documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  documentType: documentTypeEnum('document_type').notNull(),
  sourceType: documentSourceTypeEnum('source_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  deletedAt: timestamp('deleted_at'),
});

// 7. document_versions
export const documentVersions = pgTable('document_versions', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
  storageKey: text('storage_key').notNull(),
  fileName: text('file_name').notNull(),
  mimeType: varchar('mime_type', { length: 100 }).notNull(),
  fileSize: integer('file_size').notNull(),
  pageCount: integer('page_count'),
  versionNumber: integer('version_number').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 8. document_templates
export const documentTemplates = pgTable('document_templates', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  category: templateCategoryEnum('category').notNull(),
  templateDefinition: jsonb('template_definition'),
  previewStorageKey: text('preview_storage_key'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 9. generated_documents
export const generatedDocuments = pgTable('generated_documents', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  templateId: uuid('template_id').references(() => documentTemplates.id, { onDelete: 'cascade' }).notNull(),
  inputData: jsonb('input_data'),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 10. orders
export const orders = pgTable('orders', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderNumber: varchar('order_number', { length: 50 }).notNull().unique(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  status: orderStatusEnum('status').notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  paymentStatus: paymentStatusEnum('payment_status').notNull(),
  fulfillmentType: fulfillmentTypeEnum('fulfillment_type').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 11. order_items
export const orderItems = pgTable('order_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  documentVersionId: uuid('document_version_id').references(() => documentVersions.id, { onDelete: 'cascade' }).notNull(),
  quantity: integer('quantity').notNull(),
  unitPrice: numeric('unit_price', { precision: 10, scale: 2 }),
  subtotal: numeric('subtotal', { precision: 10, scale: 2 }),
  pricingSnapshot: jsonb('pricing_snapshot'),
  status: orderItemStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 12. print_configurations
export const printConfigurations = pgTable('print_configurations', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id, { onDelete: 'cascade' }).notNull(),
  copies: integer('copies').default(1).notNull(),
  pageRange: varchar('page_range', { length: 100 }),
  colorMode: colorModeEnum('color_mode').notNull(),
  printSide: printSideEnum('print_side').notNull(),
  paperSize: paperSizeEnum('paper_size').notNull(),
  paperType: paperTypeEnum('paper_type').notNull(),
  bindingType: bindingTypeEnum('binding_type').default('NONE').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 13. order_status_history
export const orderStatusHistory = pgTable('order_status_history', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  oldStatus: orderStatusEnum('old_status'),
  newStatus: orderStatusEnum('new_status').notNull(),
  changedByUserId: uuid('changed_by_user_id').references(() => users.id, { onDelete: 'set null' }),
  reason: text('reason'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 14. payments
export const payments = pgTable('payments', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).default('INR').notNull(),
  provider: varchar('provider', { length: 50 }).notNull(),
  providerOrderId: varchar('provider_order_id', { length: 255 }),
  status: paymentStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 15. payment_transactions
export const paymentTransactions = pgTable('payment_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'cascade' }).notNull(),
  providerPaymentId: varchar('provider_payment_id', { length: 255 }),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  method: varchar('method', { length: 50 }),
  status: varchar('status', { length: 50 }).notNull(),
  failureReason: text('failure_reason'),
  providerResponse: jsonb('provider_response'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 16. refunds
export const refunds = pgTable('refunds', {
  id: uuid('id').defaultRandom().primaryKey(),
  paymentId: uuid('payment_id').references(() => payments.id, { onDelete: 'cascade' }).notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  reason: text('reason'),
  providerRefundId: varchar('provider_refund_id', { length: 255 }),
  status: refundStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 17. printers
export const printers = pgTable('printers', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  manufacturer: varchar('manufacturer', { length: 100 }),
  model: varchar('model', { length: 100 }),
  printerType: printerTypeEnum('printer_type').notNull(),
  connectionType: printerConnectionTypeEnum('connection_type').notNull(),
  status: printerStatusEnum('status').default('OFFLINE').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 18. printer_capabilities
export const printerCapabilities = pgTable('printer_capabilities', {
  id: uuid('id').defaultRandom().primaryKey(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'cascade' }).notNull(),
  capabilityType: printerCapabilityTypeEnum('capability_type').notNull(),
  isSupported: boolean('is_supported').default(true).notNull(),
  metadata: jsonb('metadata'),
}, (table) => [
  uniqueIndex('printer_capabilities_printer_id_capability_type_idx').on(table.printerId, table.capabilityType),
]);

// 19. printer_health_logs
export const printerHealthLogs = pgTable('printer_health_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'cascade' }).notNull(),
  status: printerStatusEnum('status').notNull(),
  paperLevel: integer('paper_level'),
  inkLevel: integer('ink_level'),
  errorCode: varchar('error_code', { length: 100 }),
  errorMessage: text('error_message'),
  metadata: jsonb('metadata'),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

// 20. printer_failure_events
export const printerFailureEvents = pgTable('printer_failure_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'cascade' }).notNull(),
  failureType: printerFailureTypeEnum('failure_type').notNull(),
  severity: failureSeverityEnum('severity').notNull(),
  status: failureStatusEnum('status').notNull(),
  detectedAt: timestamp('detected_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at'),
  details: jsonb('details'),
});

// 21. print_jobs
export const printJobs = pgTable('print_jobs', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderItemId: uuid('order_item_id').references(() => orderItems.id, { onDelete: 'cascade' }).notNull(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'set null' }),
  status: printJobStatusEnum('status').notNull(),
  priorityScore: numeric('priority_score').default('0').notNull(),
  estimatedDurationSeconds: integer('estimated_duration_seconds'),
  estimatedStartTime: timestamp('estimated_start_time'),
  estimatedCompletionTime: timestamp('estimated_completion_time'),
  startedAt: timestamp('started_at'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 22. print_queue_entries
export const printQueueEntries = pgTable('print_queue_entries', {
  id: uuid('id').defaultRandom().primaryKey(),
  printJobId: uuid('print_job_id').references(() => printJobs.id, { onDelete: 'cascade' }).notNull(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'set null' }),
  queuePosition: integer('queue_position'),
  priorityScore: numeric('priority_score').default('0').notNull(),
  estimatedWaitSeconds: integer('estimated_wait_seconds'),
  queuedAt: timestamp('queued_at').defaultNow().notNull(),
  status: queueStatusEnum('status').notNull(),
});

// 23. queue_predictions
export const queuePredictions = pgTable('queue_predictions', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'set null' }),
  predictedWaitSeconds: integer('predicted_wait_seconds').notNull(),
  predictedCompletionTime: timestamp('predicted_completion_time').notNull(),
  confidenceScore: numeric('confidence_score'),
  modelVersion: varchar('model_version', { length: 100 }),
  inputData: jsonb('input_data'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 24. print_job_assignments
export const printJobAssignments = pgTable('print_job_assignments', {
  id: uuid('id').defaultRandom().primaryKey(),
  printJobId: uuid('print_job_id').references(() => printJobs.id, { onDelete: 'cascade' }).notNull(),
  printerId: uuid('printer_id').references(() => printers.id, { onDelete: 'cascade' }).notNull(),
  assignedAt: timestamp('assigned_at').defaultNow().notNull(),
  unassignedAt: timestamp('unassigned_at'),
  assignmentReason: assignmentReasonEnum('assignment_reason').notNull(),
  status: assignmentStatusEnum('status').notNull(),
});

// 25. rerouting_events
export const reroutingEvents = pgTable('rerouting_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  printJobId: uuid('print_job_id').references(() => printJobs.id, { onDelete: 'cascade' }).notNull(),
  sourcePrinterId: uuid('source_printer_id').references(() => printers.id, { onDelete: 'cascade' }).notNull(),
  targetPrinterId: uuid('target_printer_id').references(() => printers.id, { onDelete: 'set null' }),
  reason: reroutingReasonEnum('reason').notNull(),
  status: reroutingStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  completedAt: timestamp('completed_at'),
});

// 26. addresses
export const addresses = pgTable('addresses', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  label: varchar('label', { length: 50 }).notNull(),
  recipientName: varchar('recipient_name', { length: 150 }).notNull(),
  phone: varchar('phone', { length: 20 }).notNull(),
  addressLine1: text('address_line1').notNull(),
  addressLine2: text('address_line2'),
  landmark: text('landmark'),
  city: varchar('city', { length: 100 }).notNull(),
  state: varchar('state', { length: 100 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  postalCode: varchar('postal_code', { length: 20 }).notNull(),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  isDefault: boolean('is_default').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 27. pickup_tokens
export const pickupTokens = pgTable('pickup_tokens', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  tokenHash: varchar('token_hash', { length: 255 }).notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  status: pickupTokenStatusEnum('status').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  usedAt: timestamp('used_at'),
});

// 28. pickup_events
export const pickupEvents = pgTable('pickup_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull(),
  pickupTokenId: uuid('pickup_token_id').references(() => pickupTokens.id, { onDelete: 'cascade' }).notNull(),
  verifiedByUserId: uuid('verified_by_user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  status: pickupStatusEnum('status').notNull(),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 29. shop_members
export const shopMembers = pgTable('shop_members', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  role: shopMemberRoleEnum('role').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  joinedAt: timestamp('joined_at').defaultNow().notNull(),
}, (table) => [
  uniqueIndex('shop_members_shop_id_user_id_idx').on(table.shopId, table.userId),
]);

// 30. deliveries
export const deliveries = pgTable('deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: uuid('order_id').references(() => orders.id, { onDelete: 'cascade' }).notNull().unique(),
  deliveryAddressId: uuid('delivery_address_id').references(() => addresses.id, { onDelete: 'cascade' }).notNull(),
  deliveryPartnerId: uuid('delivery_partner_id').references(() => users.id, { onDelete: 'set null' }),
  status: deliveryStatusEnum('status').notNull(),
  estimatedDeliveryTime: timestamp('estimated_delivery_time'),
  pickedUpAt: timestamp('picked_up_at'),
  deliveredAt: timestamp('delivered_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 31. delivery_tracking_events
export const deliveryTrackingEvents = pgTable('delivery_tracking_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  deliveryId: uuid('delivery_id').references(() => deliveries.id, { onDelete: 'cascade' }).notNull(),
  status: deliveryStatusEnum('status').notNull(),
  latitude: numeric('latitude'),
  longitude: numeric('longitude'),
  message: text('message'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 32. delivery_location_logs
export const deliveryLocationLogs = pgTable('delivery_location_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  deliveryId: uuid('delivery_id').references(() => deliveries.id, { onDelete: 'cascade' }).notNull(),
  latitude: numeric('latitude').notNull(),
  longitude: numeric('longitude').notNull(),
  accuracy: numeric('accuracy'),
  recordedAt: timestamp('recorded_at').defaultNow().notNull(),
});

// 33. notifications
export const notifications = pgTable('notifications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: notificationTypeEnum('type').notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  message: text('message').notNull(),
  data: jsonb('data'),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
});

// 34. notification_deliveries
export const notificationDeliveries = pgTable('notification_deliveries', {
  id: uuid('id').defaultRandom().primaryKey(),
  notificationId: uuid('notification_id').references(() => notifications.id, { onDelete: 'cascade' }).notNull(),
  channel: notificationChannelEnum('channel').notNull(),
  status: notificationDeliveryStatusEnum('status').notNull(),
  providerMessageId: varchar('provider_message_id', { length: 255 }),
  failureReason: text('failure_reason'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 35. document_access_grants
export const documentAccessGrants = pgTable('document_access_grants', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accessType: documentAccessTypeEnum('access_type').notNull(),
  grantedBy: uuid('granted_by').references(() => users.id, { onDelete: 'set null' }),
  expiresAt: timestamp('expires_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 36. document_access_logs
export const documentAccessLogs = pgTable('document_access_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'cascade' }).notNull(),
  documentVersionId: uuid('document_version_id').references(() => documentVersions.id, { onDelete: 'set null' }),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  action: documentAccessActionEnum('action').notNull(),
  ipAddress: inet('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 37. audit_logs
export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
  action: varchar('action', { length: 100 }).notNull(),
  entityType: varchar('entity_type', { length: 100 }).notNull(),
  entityId: uuid('entity_id').notNull(),
  oldData: jsonb('old_data'),
  newData: jsonb('new_data'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 38. ai_conversations
export const aiConversations = pgTable('ai_conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  title: varchar('title', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 39. ai_messages
export const aiMessages = pgTable('ai_messages', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => aiConversations.id, { onDelete: 'cascade' }).notNull(),
  role: aiMessageRoleEnum('role').notNull(),
  content: text('content').notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 40. ai_generated_outputs
export const aiGeneratedOutputs = pgTable('ai_generated_outputs', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => aiConversations.id, { onDelete: 'cascade' }).notNull(),
  documentId: uuid('document_id').references(() => documents.id, { onDelete: 'set null' }),
  outputType: aiOutputTypeEnum('output_type').notNull(),
  modelName: varchar('model_name', { length: 100 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 41. user_sessions
export const userSessions = pgTable('user_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  refreshTokenHash: text('refresh_token_hash').notNull(),
  deviceInfo: text('device_info'),
  ipAddress: text('ip_address'),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  revokedAt: timestamp('revoked_at'),
});

// 42. printer_agents
export const printerAgents = pgTable('printer_agents', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopId: uuid('shop_id').references(() => shops.id, { onDelete: 'cascade' }).notNull(),
  agentKeyHash: text('agent_key_hash').notNull(),
  deviceName: varchar('device_name', { length: 100 }),
  lastSeenAt: timestamp('last_seen_at'),
  isActive: boolean('is_active').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
