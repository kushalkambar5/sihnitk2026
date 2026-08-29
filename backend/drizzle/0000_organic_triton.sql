CREATE TYPE "public"."ai_message_role" AS ENUM('USER', 'ASSISTANT', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."ai_output_type" AS ENUM('DOCUMENT', 'TEXT', 'SUMMARY', 'TEMPLATE', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."assignment_reason" AS ENUM('AUTOMATIC', 'MANUAL', 'LOAD_BALANCING', 'REROUTING');--> statement-breakpoint
CREATE TYPE "public"."assignment_status" AS ENUM('ACTIVE', 'UNASSIGNED', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."binding_type" AS ENUM('NONE', 'SPIRAL', 'COMB', 'STAPLE', 'PERFECT_BINDING');--> statement-breakpoint
CREATE TYPE "public"."color_mode" AS ENUM('BLACK_WHITE', 'COLOR');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('PENDING', 'ASSIGNED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."document_access_action" AS ENUM('VIEW', 'DOWNLOAD', 'PRINT', 'EDIT', 'DELETE');--> statement-breakpoint
CREATE TYPE "public"."document_access_type" AS ENUM('VIEW', 'DOWNLOAD', 'PRINT', 'EDIT');--> statement-breakpoint
CREATE TYPE "public"."document_source_type" AS ENUM('UPLOADED', 'GENERATED', 'TEMPLATE');--> statement-breakpoint
CREATE TYPE "public"."document_type" AS ENUM('PDF', 'DOCX', 'IMAGE', 'PPTX', 'XLSX', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."failure_severity" AS ENUM('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."failure_status" AS ENUM('DETECTED', 'ACKNOWLEDGED', 'RESOLVED');--> statement-breakpoint
CREATE TYPE "public"."fulfillment_type" AS ENUM('PICKUP', 'DELIVERY');--> statement-breakpoint
CREATE TYPE "public"."notification_channel" AS ENUM('PUSH', 'EMAIL', 'SMS', 'IN_APP');--> statement-breakpoint
CREATE TYPE "public"."notification_delivery_status" AS ENUM('PENDING', 'SENT', 'DELIVERED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('ORDER_UPDATE', 'PAYMENT_UPDATE', 'PRINT_UPDATE', 'PRINTER_ALERT', 'PICKUP_READY', 'DELIVERY_UPDATE', 'SYSTEM');--> statement-breakpoint
CREATE TYPE "public"."order_item_status" AS ENUM('PENDING', 'QUEUED', 'PROCESSING', 'PRINTED', 'COMPLETED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('CREATED', 'PAYMENT_PENDING', 'PAID', 'PROCESSING', 'READY_FOR_PICKUP', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED', 'FAILED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."paper_size" AS ENUM('A4', 'A3', 'A5', 'LETTER', 'LEGAL');--> statement-breakpoint
CREATE TYPE "public"."paper_type" AS ENUM('NORMAL', 'GLOSSY', 'MATTE', 'PHOTO', 'CARDSTOCK');--> statement-breakpoint
CREATE TYPE "public"."payment_method" AS ENUM('UPI', 'CARD', 'NETBANKING', 'WALLET', 'CASH');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('RAZORPAY', 'STRIPE', 'CASH', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED');--> statement-breakpoint
CREATE TYPE "public"."pickup_status" AS ENUM('PENDING', 'VERIFIED', 'COMPLETED', 'FAILED');--> statement-breakpoint
CREATE TYPE "public"."pickup_token_status" AS ENUM('ACTIVE', 'USED', 'EXPIRED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."print_job_status" AS ENUM('PENDING', 'QUEUED', 'ASSIGNED', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED', 'REROUTING');--> statement-breakpoint
CREATE TYPE "public"."print_side" AS ENUM('SINGLE_SIDED', 'DOUBLE_SIDED');--> statement-breakpoint
CREATE TYPE "public"."printer_capability_type" AS ENUM('BLACK_WHITE_PRINTING', 'COLOR_PRINTING', 'DOUBLE_SIDED_PRINTING', 'A3_PRINTING', 'PHOTO_PRINTING');--> statement-breakpoint
CREATE TYPE "public"."printer_connection_type" AS ENUM('USB', 'WIFI', 'ETHERNET', 'BLUETOOTH');--> statement-breakpoint
CREATE TYPE "public"."printer_failure_type" AS ENUM('OFFLINE', 'PAPER_EMPTY', 'PAPER_JAM', 'INK_LOW', 'INK_EMPTY', 'TONER_LOW', 'TONER_EMPTY', 'CONNECTION_FAILURE', 'HARDWARE_ERROR', 'UNKNOWN_ERROR');--> statement-breakpoint
CREATE TYPE "public"."printer_status" AS ENUM('ONLINE', 'OFFLINE', 'BUSY', 'ERROR', 'MAINTENANCE');--> statement-breakpoint
CREATE TYPE "public"."printer_type" AS ENUM('LASER', 'INKJET', 'THERMAL', 'THREE_D');--> statement-breakpoint
CREATE TYPE "public"."queue_status" AS ENUM('WAITING', 'ASSIGNED', 'PROCESSING', 'REMOVED');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."rerouting_reason" AS ENUM('PRINTER_FAILURE', 'PRINTER_OFFLINE', 'QUEUE_OVERLOAD', 'LONG_WAIT_TIME', 'MANUAL');--> statement-breakpoint
CREATE TYPE "public"."rerouting_status" AS ENUM('INITIATED', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."service_category" AS ENUM('PRINTING', 'SCANNING', 'PHOTOCOPY', 'LAMINATION', 'BINDING', 'THREE_D_PRINTING');--> statement-breakpoint
CREATE TYPE "public"."shop_member_role" AS ENUM('OWNER', 'MANAGER', 'OPERATOR', 'STAFF');--> statement-breakpoint
CREATE TYPE "public"."template_category" AS ENUM('RESUME', 'LETTER', 'CERTIFICATE', 'ASSIGNMENT', 'REPORT', 'FORM', 'OTHER');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('CUSTOMER', 'SHOP_OWNER', 'SHOP_STAFF', 'DELIVERY_PARTNER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "addresses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"label" varchar(50) NOT NULL,
	"recipient_name" varchar(150) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"address_line1" text NOT NULL,
	"address_line2" text,
	"landmark" text,
	"city" varchar(100) NOT NULL,
	"state" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"postal_code" varchar(20) NOT NULL,
	"latitude" numeric,
	"longitude" numeric,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_generated_outputs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"document_id" uuid,
	"output_type" "ai_output_type" NOT NULL,
	"model_name" varchar(100),
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "ai_message_role" NOT NULL,
	"content" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_user_id" uuid,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" uuid NOT NULL,
	"old_data" jsonb,
	"new_data" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"delivery_address_id" uuid NOT NULL,
	"delivery_partner_id" uuid,
	"status" "delivery_status" NOT NULL,
	"estimated_delivery_time" timestamp,
	"picked_up_at" timestamp,
	"delivered_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "deliveries_order_id_unique" UNIQUE("order_id")
);
--> statement-breakpoint
CREATE TABLE "delivery_location_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_id" uuid NOT NULL,
	"latitude" numeric NOT NULL,
	"longitude" numeric NOT NULL,
	"accuracy" numeric,
	"recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_tracking_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"delivery_id" uuid NOT NULL,
	"status" "delivery_status" NOT NULL,
	"latitude" numeric,
	"longitude" numeric,
	"message" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_access_grants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"access_type" "document_access_type" NOT NULL,
	"granted_by" uuid,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_access_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"document_version_id" uuid,
	"user_id" uuid,
	"action" "document_access_action" NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" "template_category" NOT NULL,
	"template_definition" jsonb,
	"preview_storage_key" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"file_name" text NOT NULL,
	"mime_type" varchar(100) NOT NULL,
	"file_size" integer NOT NULL,
	"page_count" integer,
	"version_number" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"document_type" "document_type" NOT NULL,
	"source_type" "document_source_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "generated_documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"template_id" uuid NOT NULL,
	"input_data" jsonb,
	"document_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification_deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"notification_id" uuid NOT NULL,
	"channel" "notification_channel" NOT NULL,
	"status" "notification_delivery_status" NOT NULL,
	"provider_message_id" varchar(255),
	"failure_reason" text,
	"sent_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"data" jsonb,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"document_version_id" uuid NOT NULL,
	"quantity" integer NOT NULL,
	"status" "order_item_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"old_status" "order_status",
	"new_status" "order_status" NOT NULL,
	"changed_by_user_id" uuid,
	"reason" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"shop_id" uuid NOT NULL,
	"status" "order_status" NOT NULL,
	"total_amount" numeric(10, 2) NOT NULL,
	"payment_status" "payment_status" NOT NULL,
	"fulfillment_type" "fulfillment_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"provider_payment_id" varchar(255),
	"amount" numeric(10, 2) NOT NULL,
	"method" varchar(50),
	"status" varchar(50) NOT NULL,
	"failure_reason" text,
	"provider_response" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"provider" varchar(50) NOT NULL,
	"provider_order_id" varchar(255),
	"status" "payment_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"pickup_token_id" uuid NOT NULL,
	"verified_by_user_id" uuid NOT NULL,
	"status" "pickup_status" NOT NULL,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pickup_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid NOT NULL,
	"token_hash" varchar(255) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"status" "pickup_token_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "print_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_item_id" uuid NOT NULL,
	"copies" integer DEFAULT 1 NOT NULL,
	"page_range" varchar(100),
	"color_mode" "color_mode" NOT NULL,
	"print_side" "print_side" NOT NULL,
	"paper_size" "paper_size" NOT NULL,
	"paper_type" "paper_type" NOT NULL,
	"binding_type" "binding_type" DEFAULT 'NONE' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "print_job_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"print_job_id" uuid NOT NULL,
	"printer_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"unassigned_at" timestamp,
	"assignment_reason" "assignment_reason" NOT NULL,
	"status" "assignment_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "print_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_item_id" uuid NOT NULL,
	"shop_id" uuid NOT NULL,
	"printer_id" uuid,
	"status" "print_job_status" NOT NULL,
	"priority_score" numeric DEFAULT '0' NOT NULL,
	"estimated_duration_seconds" integer,
	"estimated_start_time" timestamp,
	"estimated_completion_time" timestamp,
	"started_at" timestamp,
	"completed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "print_queue_entries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"print_job_id" uuid NOT NULL,
	"printer_id" uuid,
	"queue_position" integer,
	"priority_score" numeric DEFAULT '0' NOT NULL,
	"estimated_wait_seconds" integer,
	"queued_at" timestamp DEFAULT now() NOT NULL,
	"status" "queue_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "printer_capabilities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"printer_id" uuid NOT NULL,
	"capability_type" "printer_capability_type" NOT NULL,
	"is_supported" boolean DEFAULT true NOT NULL,
	"metadata" jsonb
);
--> statement-breakpoint
CREATE TABLE "printer_failure_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"printer_id" uuid NOT NULL,
	"failure_type" "printer_failure_type" NOT NULL,
	"severity" "failure_severity" NOT NULL,
	"status" "failure_status" NOT NULL,
	"detected_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"details" jsonb
);
--> statement-breakpoint
CREATE TABLE "printer_health_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"printer_id" uuid NOT NULL,
	"status" "printer_status" NOT NULL,
	"paper_level" integer,
	"ink_level" integer,
	"error_code" varchar(100),
	"error_message" text,
	"metadata" jsonb,
	"recorded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "printers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"name" varchar(100) NOT NULL,
	"manufacturer" varchar(100),
	"model" varchar(100),
	"printer_type" "printer_type" NOT NULL,
	"connection_type" "printer_connection_type" NOT NULL,
	"status" "printer_status" DEFAULT 'OFFLINE' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "queue_predictions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"printer_id" uuid,
	"predicted_wait_seconds" integer NOT NULL,
	"predicted_completion_time" timestamp NOT NULL,
	"confidence_score" numeric,
	"model_version" varchar(100),
	"input_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" uuid NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"reason" text,
	"provider_refund_id" varchar(255),
	"status" "refund_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rerouting_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"print_job_id" uuid NOT NULL,
	"source_printer_id" uuid NOT NULL,
	"target_printer_id" uuid,
	"reason" "rerouting_reason" NOT NULL,
	"status" "rerouting_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"completed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "service_pricing" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_service_id" uuid NOT NULL,
	"paper_size" "paper_size",
	"paper_type" "paper_type",
	"color_mode" "color_mode",
	"side_mode" "print_side",
	"base_price" numeric(10, 2) NOT NULL,
	"price_per_page" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"category" "service_category" NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "shop_members" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" "shop_member_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shop_services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"service_id" uuid NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"owner_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"phone" varchar(20),
	"email" text,
	"address" text NOT NULL,
	"latitude" numeric,
	"longitude" numeric,
	"is_verified" boolean DEFAULT false NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" varchar(20),
	"password_hash" text NOT NULL,
	"role" "user_role" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generated_outputs" ADD CONSTRAINT "ai_generated_outputs_conversation_id_ai_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_generated_outputs" ADD CONSTRAINT "ai_generated_outputs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversation_id_ai_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_users_id_fk" FOREIGN KEY ("actor_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_delivery_address_id_addresses_id_fk" FOREIGN KEY ("delivery_address_id") REFERENCES "public"."addresses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_delivery_partner_id_users_id_fk" FOREIGN KEY ("delivery_partner_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_location_logs" ADD CONSTRAINT "delivery_location_logs_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_tracking_events" ADD CONSTRAINT "delivery_tracking_events_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grants" ADD CONSTRAINT "document_access_grants_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grants" ADD CONSTRAINT "document_access_grants_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_grants" ADD CONSTRAINT "document_access_grants_granted_by_users_id_fk" FOREIGN KEY ("granted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_logs" ADD CONSTRAINT "document_access_logs_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_logs" ADD CONSTRAINT "document_access_logs_document_version_id_document_versions_id_fk" FOREIGN KEY ("document_version_id") REFERENCES "public"."document_versions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_access_logs" ADD CONSTRAINT "document_access_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_template_id_document_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."document_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_documents" ADD CONSTRAINT "generated_documents_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_notification_id_notifications_id_fk" FOREIGN KEY ("notification_id") REFERENCES "public"."notifications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_document_version_id_document_versions_id_fk" FOREIGN KEY ("document_version_id") REFERENCES "public"."document_versions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_status_history" ADD CONSTRAINT "order_status_history_changed_by_user_id_users_id_fk" FOREIGN KEY ("changed_by_user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_events" ADD CONSTRAINT "pickup_events_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_events" ADD CONSTRAINT "pickup_events_pickup_token_id_pickup_tokens_id_fk" FOREIGN KEY ("pickup_token_id") REFERENCES "public"."pickup_tokens"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_events" ADD CONSTRAINT "pickup_events_verified_by_user_id_users_id_fk" FOREIGN KEY ("verified_by_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pickup_tokens" ADD CONSTRAINT "pickup_tokens_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_configurations" ADD CONSTRAINT "print_configurations_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_job_assignments" ADD CONSTRAINT "print_job_assignments_print_job_id_print_jobs_id_fk" FOREIGN KEY ("print_job_id") REFERENCES "public"."print_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_job_assignments" ADD CONSTRAINT "print_job_assignments_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_jobs" ADD CONSTRAINT "print_jobs_order_item_id_order_items_id_fk" FOREIGN KEY ("order_item_id") REFERENCES "public"."order_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_jobs" ADD CONSTRAINT "print_jobs_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_jobs" ADD CONSTRAINT "print_jobs_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_queue_entries" ADD CONSTRAINT "print_queue_entries_print_job_id_print_jobs_id_fk" FOREIGN KEY ("print_job_id") REFERENCES "public"."print_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "print_queue_entries" ADD CONSTRAINT "print_queue_entries_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "printer_capabilities" ADD CONSTRAINT "printer_capabilities_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "printer_failure_events" ADD CONSTRAINT "printer_failure_events_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "printer_health_logs" ADD CONSTRAINT "printer_health_logs_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "printers" ADD CONSTRAINT "printers_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_predictions" ADD CONSTRAINT "queue_predictions_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "queue_predictions" ADD CONSTRAINT "queue_predictions_printer_id_printers_id_fk" FOREIGN KEY ("printer_id") REFERENCES "public"."printers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rerouting_events" ADD CONSTRAINT "rerouting_events_print_job_id_print_jobs_id_fk" FOREIGN KEY ("print_job_id") REFERENCES "public"."print_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rerouting_events" ADD CONSTRAINT "rerouting_events_source_printer_id_printers_id_fk" FOREIGN KEY ("source_printer_id") REFERENCES "public"."printers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rerouting_events" ADD CONSTRAINT "rerouting_events_target_printer_id_printers_id_fk" FOREIGN KEY ("target_printer_id") REFERENCES "public"."printers"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_pricing" ADD CONSTRAINT "service_pricing_shop_service_id_shop_services_id_fk" FOREIGN KEY ("shop_service_id") REFERENCES "public"."shop_services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_members" ADD CONSTRAINT "shop_members_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_members" ADD CONSTRAINT "shop_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_services" ADD CONSTRAINT "shop_services_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shop_services" ADD CONSTRAINT "shop_services_service_id_services_id_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shops" ADD CONSTRAINT "shops_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;