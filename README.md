1. `users`

```jsx
users
------
id
name
email
phone
password_hash
role
created_at
updated_at
```

2. `shops`

```jsx
shops
------
id
owner_id → users.id

name
description

phone
email

address
latitude
longitude

is_verified
is_active

created_at
updated_at
```

3. `services`

```jsx
services
--------
id
name
category
description
```

shop_services

```jsx
shop_services
-------------
id

shop_id → shops.id
service_id → services.id

is_available

created_at
```

service_pricing

```jsx
service_pricing
---------------
id

shop_service_id

paper_size
paper_type

color_mode

side_mode

base_price
price_per_page

created_at
updated_at
```

**Document Management Schema**

`documents`

```jsx
documents
─────────
id
user_id → users.id

name
document_type
source_type

created_at
updated_at
deleted_at
```

document_versions (Cloudflare R2)

```jsx
document_versions
─────────────────
id
document_id → documents.id

storage_key
file_name
mime_type
file_size

page_count

version_number

created_at
```

document_templates

```jsx
document_templates
──────────────────
id

name
description

category

template_definition
preview_storage_key

is_active

created_at
updated_at
```

generated_documents

```jsx
generated_documents
───────────────────
id

user_id → users.id
template_id → document_templates.id

input_data JSONB

document_id → documents.id

created_at
```

**Print Order Schema**

orders

```jsx
orders
──────
id

user_id → users.id
shop_id → shops.id

status

total_amount

payment_status

fulfillment_type

created_at
updated_at
```

order_items

```jsx
order_items
───────────
id

order_id → orders.id
document_version_id → document_versions.id

quantity

status

created_at
```

print_configurations

```jsx
print_configurations
────────────────────
id

order_item_id → order_items.id

copies

page_range

color_mode

print_side

paper_size

paper_type

binding_type

created_at
```

order_status_history

```jsx
order_status_history
--------------------
id UUID PK

order_id UUID FK → orders.id

old_status
new_status

changed_by_user_id UUID FK → users.id NULL

reason TEXT NULL

created_at TIMESTAMP
```

6. Payments Architecture

payments

```jsx
payments
--------
id UUID PK

order_id UUID FK → orders.id

amount NUMERIC(10,2)
currency VARCHAR(10)

provider VARCHAR(50)
provider_order_id VARCHAR(255)

status payment_status

created_at
updated_at
```

payment_transactions

```jsx
payment_transactions
--------------------
id UUID PK

payment_id UUID FK → payments.id

provider_payment_id VARCHAR(255)

amount NUMERIC(10,2)

method VARCHAR(50)

status

failure_reason TEXT NULL

provider_response JSONB

created_at
```

refunds

```jsx
refunds
-------
id UUID PK

payment_id UUID FK → payments.id

amount NUMERIC(10,2)

reason TEXT

provider_refund_id VARCHAR(255)

status

created_at
updated_at
```

9. Printer Architecture

printers

```jsx
printers
--------
id UUID PK

shop_id UUID FK → shops.id

name VARCHAR(100)

manufacturer VARCHAR(100)
model VARCHAR(100)

printer_type

connection_type

status

is_active BOOLEAN

created_at
updated_at
```

printer_capabilities

```jsx
printer_capabilities
--------------------
id UUID PK

printer_id UUID FK → printers.id

capability_type

is_supported BOOLEAN

metadata JSONB
```

printer_health_logs

```jsx
printer_health_logs
-------------------
id UUID PK

printer_id UUID FK → printers.id

status

paper_level
ink_level

error_code VARCHAR(100)

error_message TEXT

metadata JSONB

recorded_at TIMESTAMP
```

printer_failure_events

```jsx
printer_failure_events
----------------------
id UUID PK

printer_id UUID FK → printers.id

failure_type

severity

status

detected_at
resolved_at NULL

details JSONB
```

print_jobs

```jsx
print_jobs
----------
id UUID PK

order_item_id UUID FK → order_items.id

shop_id UUID FK → shops.id

printer_id UUID FK → printers.id NULL

status

priority_score NUMERIC

estimated_duration_seconds INTEGER

estimated_start_time TIMESTAMP NULL
estimated_completion_time TIMESTAMP NULL

started_at TIMESTAMP NULL
completed_at TIMESTAMP NULL

created_at
updated_at
```

print_queue_entries

```jsx
print_queue_entries
-------------------
id UUID PK

print_job_id UUID FK → print_jobs.id

printer_id UUID FK → printers.id NULL

queue_position INTEGER NULL

priority_score NUMERIC

estimated_wait_seconds INTEGER

queued_at TIMESTAMP

status enum(WAITING
ASSIGNED
PROCESSING
REMOVED)
```

queue_predictions

```jsx
queue_predictions
-----------------
id UUID PK

shop_id UUID FK → shops.id

printer_id UUID FK → printers.id NULL

predicted_wait_seconds INTEGER

predicted_completion_time TIMESTAMP

confidence_score NUMERIC NULL

model_version VARCHAR(100) NULL

input_data JSONB

created_at
```

Automatic Order Rerouting 🔥

print_job_assignments

```jsx
print_job_assignments
---------------------
id UUID PK

print_job_id UUID FK → print_jobs.id

printer_id UUID FK → printers.id

assigned_at TIMESTAMP

unassigned_at TIMESTAMP NULL

assignment_reason

status
```

Rerouting Events

```jsx
rerouting_events
----------------
id UUID PK

print_job_id UUID FK → print_jobs.id

source_printer_id UUID FK → printers.id

target_printer_id UUID FK → printers.id NULL

reason

status

created_at
completed_at NULL
```

addresses

```jsx
addresses
---------
id UUID PK

user_id UUID FK → users.id NULL

label VARCHAR(50)

recipient_name VARCHAR(150)
phone VARCHAR(20)

address_line1 TEXT
address_line2 TEXT NULL

landmark TEXT NULL

city VARCHAR(100)
state VARCHAR(100)
country VARCHAR(100)

postal_code VARCHAR(20)

latitude DECIMAL NULL
longitude DECIMAL NULL

is_default BOOLEAN

created_at TIMESTAMP
updated_at TIMESTAMP
```

## `pickup_tokens`

```
pickup_tokens-------------
id UUID PK

order_id UUID FK → orders.id

token_hashVARCHAR(255)

expires_atTIMESTAMP

status pickup_token_status

created_atTIMESTAMP
used_atTIMESTAMPNULL
```

## `pickup_events`

```
pickup_events-------------
id UUID PK

order_id UUID FK → orders.id

pickup_token_id UUID FK → pickup_tokens.id

verified_by_user_id UUID FK → users.id

status

notes TEXTNULL

created_atTIMESTAMP
```

## `shop_members`

```
shop_members------------
id UUID PK

shop_id UUID FK → shops.id

user_id UUID FK → users.idrole shop_member_role

is_activeBOOLEAN

joined_atTIMESTAMP
```

## `deliveries`

```
deliveries----------
id UUID PK

order_id UUID FK → orders.idUNIQUE

delivery_address_id UUID FK → addresses.id

delivery_partner_id UUID FK → users.idNULL

status delivery_status

estimated_delivery_timeTIMESTAMPNULL

picked_up_atTIMESTAMPNULL
delivered_atTIMESTAMPNULL

created_atTIMESTAMP
updated_atTIMESTAMP
```

## `delivery_tracking_events`

```
delivery_tracking_events------------------------
id UUID PK

delivery_id UUID FK → deliveries.id

status

latitudeDECIMALNULL
longitudeDECIMALNULL

message TEXTNULL

created_atTIMESTAMP
```

## `delivery_location_logs`

```
delivery_location_logs----------------------
id UUID PK

delivery_id UUID FK → deliveries.id

latitudeDECIMAL

longitudeDECIMAL

accuracyDECIMALNULL

recorded_atTIMESTAMP
```

## `notifications`

```
notifications-------------
id UUID PK

user_id UUID FK → users.id

type notification_type

titleVARCHAR(255)

message TEXTdata JSONB

is_readBOOLEANDEFAULTFALSE

created_atTIMESTAMP
read_atTIMESTAMPNULL
```

## `notification_deliveries`

```
notification_deliveries-----------------------
id UUID PK

notification_id UUID FK → notifications.id

channel

status

provider_message_idVARCHAR(255)NULL

failure_reason TEXTNULL

sent_atTIMESTAMPNULL

created_atTIMESTAMP
```

## `document_access_grants`

```
document_access_grants----------------------
id UUID PK

document_id UUID FK → documents.id

user_id UUID FK → users.id

access_type

granted_by UUID FK → users.idNULL

expires_atTIMESTAMPNULL

created_atTIMESTAMP
```

## `document_access_logs`

```
document_access_logs--------------------
id UUID PK

document_id UUID FK → documents.id

document_version_id UUID FK → document_versions.idNULL

user_id UUID FK → users.idNULLaction

ip_address INETNULL

user_agent TEXTNULL

created_atTIMESTAMP
```

## `audit_logs`

```
audit_logs----------
id UUID PK

actor_user_id UUID FK → users.idNULLactionVARCHAR(100)

entity_typeVARCHAR(100)

entity_id UUID

old_data JSONBNULL
new_data JSONBNULL

metadata JSONB

created_atTIMESTAMP
```

## `ai_conversations`

```
ai_conversations----------------
id UUID PK

user_id UUID FK → users.id

titleVARCHAR(255)NULL

created_atTIMESTAMP
updated_atTIMESTAMP
```

---

## `ai_messages`

```
ai_messages-----------
id UUID PK

conversation_id UUID FK → ai_conversations.idrole

content TEXT

metadata JSONB

created_atTIMESTAMP
```

## `ai_generated_outputs`

```
ai_generated_outputs--------------------
id UUID PK

conversation_id UUID FK → ai_conversations.id

document_id UUID FK → documents.idNULL

output_type

model_name

metadata JSONB

created_atTIMESTAMP
```

```jsx
                              USERS
                                │
          ┌─────────────────────┼────────────────────┐
          │                     │                    │
          ▼                     ▼                    ▼
       DOCUMENTS              SHOPS            NOTIFICATIONS
          │                     │
          ▼                     ▼
 DOCUMENT_VERSIONS       SHOP_MEMBERS
          │                     │
          │                     ├──────────► PRINTERS
          │                     │                │
          │                     │         ┌──────┼──────┐
          │                     │         ▼      ▼      ▼
          │                     │      HEALTH  QUEUE  FAILURES
          │                     │
          ▼                     ▼
      ORDER_ITEMS ◄────────── ORDERS ──────────► PAYMENTS
          │                     │                    │
          ▼                     │                    ├── TRANSACTIONS
      PRINT_CONFIG              │                    │
          │                     │                    └── REFUNDS
          ▼                     │
       PRINT_JOBS               │
          │                     │
          ├── QUEUE_ENTRIES     │
          │                     │
          ├── ASSIGNMENTS       │
          │                     │
          └── REROUTING_EVENTS  │
                                │
                     ┌──────────┴──────────┐
                     ▼                     ▼
                  PICKUP                DELIVERY
                     │                     │
                 QR TOKENS          TRACKING EVENTS
                                           │
                                     LOCATION LOGS
```







## 1. User & Shop

```
CREATE TYPE user_roleAS ENUM ('CUSTOMER','SHOP_OWNER','SHOP_STAFF','DELIVERY_PARTNER','ADMIN'
);
```

```
CREATE TYPE service_categoryAS ENUM ('PRINTING','SCANNING','PHOTOCOPY','LAMINATION','BINDING','THREE_D_PRINTING'
);
```

---

# 2. Services & Printing

### Color mode

```
CREATE TYPE color_modeAS ENUM ('BLACK_WHITE','COLOR'
);
```

### Print side

```
CREATE TYPE print_sideAS ENUM ('SINGLE_SIDED','DOUBLE_SIDED'
);
```

### Paper size

```
CREATE TYPE paper_sizeAS ENUM ('A4','A3','A5','LETTER','LEGAL'
);
```

### Paper type

```
CREATE TYPE paper_typeAS ENUM ('NORMAL','GLOSSY','MATTE','PHOTO','CARDSTOCK'
);
```

### Binding

```
CREATE TYPE binding_typeAS ENUM ('NONE','SPIRAL','COMB','STAPLE','PERFECT_BINDING'
);
```

---

# 3. Documents

### Document type

```
CREATE TYPE document_typeAS ENUM ('PDF','DOCX','IMAGE','PPTX','XLSX','OTHER'
);
```

### Document source

```
CREATE TYPE document_source_typeAS ENUM ('UPLOADED','GENERATED','TEMPLATE'
);
```

### Template category

```
CREATE TYPE template_categoryAS ENUM ('RESUME','LETTER','CERTIFICATE','ASSIGNMENT','REPORT','FORM','OTHER'
);
```

---

# 4. Orders

### Order status

This is one of the most important enums.

```
CREATE TYPE order_statusAS ENUM ('CREATED','PAYMENT_PENDING','PAID','PROCESSING','READY_FOR_PICKUP','OUT_FOR_DELIVERY','COMPLETED','CANCELLED','FAILED','REFUNDED'
);
```

### Order item status

```
CREATE TYPE order_item_statusAS ENUM ('PENDING','QUEUED','PROCESSING','PRINTED','COMPLETED','FAILED','CANCELLED'
);
```

### Fulfillment type

```
CREATE TYPE fulfillment_typeAS ENUM ('PICKUP','DELIVERY'
);
```

---

# 5. Payments

### Payment status

```
CREATE TYPE payment_statusAS ENUM ('PENDING','PROCESSING','SUCCESS','FAILED','CANCELLED','PARTIALLY_REFUNDED','REFUNDED'
);
```

### Payment provider

If you're only using Razorpay initially, **don't create an enum yet**. Use `VARCHAR`.

But if multiple providers are planned:

```
CREATE TYPE payment_providerAS ENUM ('RAZORPAY','STRIPE','CASH','OTHER'
);
```

### Payment method

```
CREATE TYPE payment_methodAS ENUM ('UPI','CARD','NETBANKING','WALLET','CASH'
);
```

### Refund status

```
CREATE TYPE refund_statusAS ENUM ('PENDING','PROCESSING','SUCCESS','FAILED','CANCELLED'
);
```

---

# 6. Printers

### Printer type

```
CREATE TYPE printer_typeAS ENUM ('LASER','INKJET','THERMAL','THREE_D'
);
```

### Connection type

```
CREATE TYPE printer_connection_typeAS ENUM ('USB','WIFI','ETHERNET','BLUETOOTH'
);
```

### Printer status

```
CREATE TYPE printer_statusAS ENUM ('ONLINE','OFFLINE','BUSY','ERROR','MAINTENANCE'
);
```

### Printer capability

```
CREATE TYPE printer_capability_typeAS ENUM ('BLACK_WHITE_PRINTING','COLOR_PRINTING','DOUBLE_SIDED_PRINTING','A3_PRINTING','PHOTO_PRINTING'
);
```

### Printer failure type

```
CREATE TYPE printer_failure_typeAS ENUM ('OFFLINE','PAPER_EMPTY','PAPER_JAM','INK_LOW','INK_EMPTY','TONER_LOW','TONER_EMPTY','CONNECTION_FAILURE','HARDWARE_ERROR','UNKNOWN_ERROR'
);
```

### Failure severity

```
CREATE TYPE failure_severityAS ENUM ('LOW','MEDIUM','HIGH','CRITICAL'
);
```

### Failure event status

```
CREATE TYPE failure_statusAS ENUM ('DETECTED','ACKNOWLEDGED','RESOLVED'
);
```

---

# 7. Print Jobs & Queue

### Print job status

```
CREATE TYPE print_job_statusAS ENUM ('PENDING','QUEUED','ASSIGNED','PROCESSING','COMPLETED','FAILED','CANCELLED','REROUTING'
);
```

### Queue status

You already identified this one:

```
CREATE TYPE queue_statusAS ENUM ('WAITING','ASSIGNED','PROCESSING','REMOVED'
);
```

### Assignment reason

```
CREATE TYPE assignment_reasonAS ENUM ('AUTOMATIC','MANUAL','LOAD_BALANCING','REROUTING'
);
```

### Assignment status

```
CREATE TYPE assignment_statusAS ENUM ('ACTIVE','UNASSIGNED','COMPLETED','FAILED'
);
```

### Rerouting reason

```
CREATE TYPE rerouting_reasonAS ENUM ('PRINTER_FAILURE','PRINTER_OFFLINE','QUEUE_OVERLOAD','LONG_WAIT_TIME','MANUAL'
);
```

### Rerouting status

```
CREATE TYPE rerouting_statusAS ENUM ('INITIATED','IN_PROGRESS','COMPLETED','FAILED','CANCELLED'
);
```

---

# 8. Pickup

### Pickup token status

```
CREATE TYPE pickup_token_statusAS ENUM ('ACTIVE','USED','EXPIRED','CANCELLED'
);
```

### Pickup event status

```
CREATE TYPE pickup_statusAS ENUM ('PENDING','VERIFIED','COMPLETED','FAILED'
);
```

---

# 9. Shop Members

```
CREATE TYPE shop_member_roleAS ENUM ('OWNER','MANAGER','OPERATOR','STAFF'
);
```

---

# 10. Delivery

### Delivery status

```
CREATE TYPE delivery_statusAS ENUM ('PENDING','ASSIGNED','PICKED_UP','IN_TRANSIT','DELIVERED','FAILED','CANCELLED'
);
```

For `delivery_tracking_events.status`, **reuse `delivery_status`** instead of creating another enum.

---

# 11. Notifications

### Notification type

```
CREATE TYPE notification_typeAS ENUM ('ORDER_UPDATE','PAYMENT_UPDATE','PRINT_UPDATE','PRINTER_ALERT','PICKUP_READY','DELIVERY_UPDATE','SYSTEM'
);
```

### Notification channel

```
CREATE TYPE notification_channelAS ENUM ('PUSH','EMAIL','SMS','IN_APP'
);
```

### Notification delivery status

```
CREATE TYPE notification_delivery_statusAS ENUM ('PENDING','SENT','DELIVERED','FAILED'
);
```

---

# 12. Document Access & Security

### Access type

```
CREATE TYPE document_access_typeAS ENUM ('VIEW','DOWNLOAD','PRINT','EDIT'
);
```

### Document access action

```
CREATE TYPE document_access_actionAS ENUM ('VIEW','DOWNLOAD','PRINT','EDIT','DELETE'
);
```

---

# 13. AI

### AI message role

```
CREATE TYPE ai_message_roleAS ENUM ('USER','ASSISTANT','SYSTEM'
);
```

### AI output type

```
CREATE TYPE ai_output_typeAS ENUM ('DOCUMENT','TEXT','SUMMARY','TEMPLATE','OTHER'
);
```