CREATE TABLE "printer_agents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shop_id" uuid NOT NULL,
	"agent_key_hash" text NOT NULL,
	"device_name" varchar(100),
	"last_seen_at" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"refresh_token_hash" text NOT NULL,
	"device_info" text,
	"ip_address" text,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"revoked_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "unit_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "subtotal" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "order_items" ADD COLUMN "pricing_snapshot" jsonb;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "order_number" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "printer_agents" ADD CONSTRAINT "printer_agents_shop_id_shops_id_fk" FOREIGN KEY ("shop_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "printer_capabilities_printer_id_capability_type_idx" ON "printer_capabilities" USING btree ("printer_id","capability_type");--> statement-breakpoint
CREATE UNIQUE INDEX "shop_members_shop_id_user_id_idx" ON "shop_members" USING btree ("shop_id","user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "shop_services_shop_id_service_id_idx" ON "shop_services" USING btree ("shop_id","service_id");--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_order_number_unique" UNIQUE("order_number");