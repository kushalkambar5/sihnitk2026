# 1. Overall Frontend Architecture-

You have **5 different user experiences**:

```
┌──────────────────────────────┐
│          CUSTOMER            │
│ Find → Upload → Configure   │
│ → Pay → Track → Pickup      │
└──────────────────────────────┘

┌──────────────────────────────┐
│         SHOP OWNER           │
│ Dashboard → Orders → Queue  │
│ → Printers → Analytics      │
└──────────────────────────────┘

┌──────────────────────────────┐
│         SHOP STAFF           │
│ Orders → Queue → Pickup     │
└──────────────────────────────┘

┌──────────────────────────────┐
│      DELIVERY PARTNER        │
│ Jobs → Pickup → Deliver     │
└──────────────────────────────┘

┌──────────────────────────────┐
│           ADMIN              │
│ Users → Shops → Monitoring  │
└──────────────────────────────┘
```

Do **not** put all of these into one dashboard with conditional rendering everywhere.

Use route groups.

---

# 2. Complete Next.js Route Planning

I recommend this structure:

```
src/
├── app/
│
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── shops/
│   │   │   ├── page.tsx
│   │   │   └── [shopId]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── services/
│   │   │   └── page.tsx
│   │   │
│   │   └── templates/
│   │       ├── page.tsx
│   │       └── [templateId]/
│   │           └── page.tsx
│   │
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── forgot-password/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   │
│   ├── (customer)/
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── documents/
│   │   ├── orders/
│   │   ├── checkout/
│   │   ├── addresses/
│   │   ├── notifications/
│   │   └── ai/
│   │
│   ├── (shop)/
│   │   ├── layout.tsx
│   │   ├── shop/
│   │   │   └── dashboard/
│   │   │
│   │   ├── orders/
│   │   ├── queue/
│   │   ├── printers/
│   │   ├── services/
│   │   ├── pricing/
│   │   ├── staff/
│   │   ├── settings/
│   │   └── analytics/
│   │
│   ├── (delivery)/
│   │   ├── layout.tsx
│   │   ├── delivery/
│   │   │   ├── jobs/
│   │   │   ├── active/
│   │   │   └── history/
│   │
│   └── (admin)/
│       ├── layout.tsx
│       └── admin/
│           ├── dashboard/
│           ├── users/
│           ├── shops/
│           ├── printers/
│           ├── orders/
│           └── audit-logs/
│
├── components/
├── features/
├── lib/
├── services/
├── hooks/
├── stores/
└── types/
```

---

# 3. Customer Frontend Pages

This is your primary product.

---

## `/` — Landing Page

### Purpose

Explain:

```
Upload Document
↓
Choose Nearby Shop
↓
Configure Printing
↓
Pay Online
↓
Skip Queue
↓
Pickup with QR
```

### Sections

```
Navbar

Hero
↓
Upload CTA
↓
How It Works
↓
Find Shops
↓
Features
↓
AI Document Generation
↓
Printer Smart Queue
↓
Footer
```

### APIs

```
GET /shops
GET /services
```

---

# 4. `/shops` — Shop Discovery

This is the marketplace page.

### UI

```
┌─────────────────────────────────────┐
│ Search                              │
├──────────────┬──────────────────────┤
│ Filters      │ Shop Cards           │
│              │                      │
│ Distance     │ Shop A               │
│ Services     │ ₹X estimate          │
│ Color        │ Queue: 10 mins       │
│ Paper Size   │                      │
│              │ Shop B               │
└──────────────┴──────────────────────┘
```

### Axios API

```
GET/shops
```

Query:

```
?latitude=
&longitude=
&service=
&colorMode=
&paperSize=
```

---

# 5. `/shops/[shopId]` — Shop Details

Shows:

```
Shop Information
Services
Pricing
Printer Availability
Queue Time
Ratings (future)
```

### APIs

```
GET /shops/:shopId
GET /shops/:shopId/services
GET /shops/:shopId/queue/prediction
```

### CTA

```
Upload & Print
```

---

# 6. Customer Dashboard

Route:

```
/dashboard
```

### UI

```
Welcome Kush

Active Orders
────────────────

Order #123
PRINTING
████████░░

Recent Documents

Quick Actions

[ Upload Document ]
[ Generate with AI ]
[ Find Shop ]
```

### APIs

```
GET /orders
GET /documents
GET /notifications
```

---

# 7. Documents Module

## `/documents`

Document library.

```
Documents

[ Upload ]

──────────────────────

📄 Assignment.pdf

📄 Resume.pdf

📄 Lab Report.pdf
```

### APIs

```
GET /documents
POST /documents/upload
```

---

## `/documents/upload`

Could also be a modal instead of a separate page.

### Flow

```
Select File
     ↓
Upload
     ↓
Processing
     ↓
Document Ready
```

### API

```
POST /documents/upload
```

Use:

```
multipart/form-data
```

---

## `/documents/[documentId]`

Shows:

```
Document Preview

Pages: 20
File Size
Created At

Actions:

[ Print ]
[ Edit ]
[ Download ]
[ Delete ]
```

### APIs

```
GET /documents/:id
GET /documents/:id/versions
GET /documents/:id/download
```

---

# 8. Print Configuration Page 🔥

This is one of the most important frontend pages.

Route:

```
/documents/[documentId]/print
```

or better:

```
/print/configure
```

with selected document state.

### UI

```
┌───────────────────────────────────────┐
│ DOCUMENT PREVIEW                      │
│                                       │
│              PDF                      │
│                                       │
├───────────────────────────────────────┤
│ PRINT SETTINGS                        │
│                                       │
│ Copies        [-]  2  [+]             │
│ Pages         All Pages               │
│ Color         ● B&W  ○ Color          │
│ Sides         ● Single ○ Double       │
│ Paper         A4                      │
│ Binding       Spiral                  │
│                                       │
├───────────────────────────────────────┤
│ ESTIMATED PRICE                       │
│ ₹ 24                                 │
│                                       │
│ [ Continue ]                          │
└───────────────────────────────────────┘
```

### API

Every time configuration changes:

```
POST /pricing/estimate
```

But **do not spam the backend on every click**.

Use debounce:

```
Configuration changes
        ↓
Wait 400–600ms
        ↓
POST /pricing/estimate
```

---

# 9. Checkout Flow

Route:

```
/checkout
```

## Step 1

```
Select Shop
```

## Step 2

```
Confirm Print Configuration
```

## Step 3

```
Pickup / Delivery
```

## Step 4

```
Payment
```

I recommend a multi-step UI:

```
[1 Shop] ── [2 Configure] ── [3 Delivery] ── [4 Pay]
```

---

# 10. Checkout State

Do not store checkout data only in component state.

Use Zustand.

```
checkoutStore
```

Example:

```
{shopId,documentVersionId,printConfiguration,fulfillmentType,addressId,estimatedPrice
}
```

This survives navigation between pages.

But remember:

> Zustand state is not the source of truth for prices.
> 

The backend always recalculates the final price.

---

# 11. Order Creation + Payment Flow

Frontend:

```
Checkout
   ↓
POST /orders
   ↓
Order Created
PAYMENT_PENDING
   ↓
POST /payments/create
   ↓
Open Razorpay
   ↓
Payment Success
   ↓
POST /payments/verify
   ↓
Redirect
   ↓
/orders/:orderId
```

---

# 12. `/orders`

Customer order history.

Tabs:

```
ACTIVE
COMPLETED
CANCELLED
```

### API

```
GET /orders
```

---

# 13. `/orders/[orderId]` 🔥

This should be a beautiful real-time tracking page.

```
Order #DP-00124

✓ Payment Complete

✓ Added to Queue

● Printing

○ Ready

○ Picked Up
```

### Real-time updates

Socket:

```
order:updated
```

Do not continuously poll the API.

Initial load:

```
GET /orders/:id
```

Then:

```
Socket.IO updates
```

---

# 14. QR Pickup Page

Could be inside:

```
/orders/[orderId]
```

When status becomes:

```
READY_FOR_PICKUP
```

Show:

```
┌──────────────────────┐
│                      │
│       QR CODE        │
│                      │
└──────────────────────┘

Show this QR at the shop
```

API:

```
GET /orders/:id/pickup-token
```

---

# 15. AI Document Assistant

Route:

```
/ai
```

UI:

```
┌────────────────────────────────────┐
│ AI Document Assistant              │
├────────────────────────────────────┤
│                                    │
│ AI: What document do you need?     │
│                                    │
│ You: Leave application             │
│                                    │
│ AI: Who is it addressed to?        │
│                                    │
├────────────────────────────────────┤
│ Type your message...       [Send]  │
└────────────────────────────────────┘
```

### APIs

```
POST /ai/conversations

GET /ai/conversations

GET /ai/conversations/:id

POST /ai/conversations/:id/messages
```

After generation:

```
[ Preview ]

[ Edit ]

[ Print Now ]
```

---

# 16. Shop Owner Dashboard

Route:

```
/shop/dashboard
```

### Dashboard

```
Today's Orders: 42

Revenue: ₹4,200

Active Printers: 3/4

Queue: 8 jobs

Recent Orders
────────────────

DP-00124     PRINTING

DP-00125     QUEUED

DP-00126     READY
```

### APIs

Ideally:

```
GET /shop/dashboard
```

I recommend adding this backend endpoint instead of making 8 API calls.

Response:

```
{
  "todayOrders":42,
  "todayRevenue":4200,
  "activePrinters":3,
  "totalPrinters":4,
  "queueLength":8,
  "recentOrders": []
}
```

---

# 17. Shop Orders

Route:

```
/shop/orders
```

### UI

```
Filters:

[ All ]
[ Paid ]
[ Queued ]
[ Printing ]
[ Ready ]
[ Completed ]
```

API:

```
GET /shops/:shopId/orders
```

Query:

```
?status=PRINTING
&page=1
&limit=20
```

---

# 18. Smart Queue Page 🔥

Route:

```
/shop/queue
```

### UI

```
CURRENT QUEUE

1. Assignment.pdf
   3 pages
   Printer A

2. Lab Report.pdf
   15 pages
   Waiting

3. Project.pdf
   50 pages
   Waiting
```

Real-time:

```
queue:updated
```

API:

```
GET /shops/:shopId/queue
```

---

# 19. Printers Page 🔥

Route:

```
/shop/printers
```

UI:

```
Printer A
🟢 ONLINE
Queue: 2 jobs

Printer B
🔴 ERROR
Paper Jam

Printer C
🟢 ONLINE
Queue: 5 jobs
```

### APIs

```
GET /shops/:shopId/printers

POST /shops/:shopId/printers

PATCH /printers/:printerId
```

Real-time:

```
printer:updated
printer:failure
```

---

# 20. Printer Details

Route:

```
/shop/printers/[printerId]
```

Shows:

```
Status

Capabilities

Current Job

Queue

Health History

Failure History
```

APIs:

```
GET /printers/:id

GET /printers/:id/health

GET /printers/:id/failures

GET /printers/:id/queue/prediction
```

---

# 21. Shop Services Page

```
/shop/services
```

UI:

```
Services

☑ Black & White Printing

☑ Color Printing

☑ Binding

☑ Scanning

☐ 3D Printing
```

API:

```
GET /shops/:shopId/services

POST /shops/:shopId/services

PATCH /shop-services/:id
```

---

# 22. Pricing Management

Route:

```
/shop/pricing
```

UI:

```
Black & White

A4
₹2 / page

[ Edit ]

────────────────

Color

A4
₹10 / page
```

APIs:

```
GET /shop-services/:id/pricing

POST /shop-services/:id/pricing

PATCH /pricing/:id
```

---

# 23. Shop Staff Page

```
/shop/staff
```

```
Staff Members

Kush
OWNER

John
STAFF

[ Add Staff ]
```

APIs:

```
GET /shops/:shopId/members

POST /shops/:shopId/members

PATCH /shops/:shopId/members/:memberId

DELETE /shops/:shopId/members/:memberId
```

---

# 24. Delivery Partner Frontend

Routes:

```
/delivery/jobs

/delivery/active

/delivery/history
```

---

## `/delivery/jobs`

```
Available Jobs

Order #124

Pickup:
NITK Printing Shop

Delivery:
Hostel Block C

[ Accept Job ]
```

---

## `/delivery/active`

```
CURRENT DELIVERY

Pickup Location

↓ Map

Customer Location

[ Start Pickup ]

[ Start Delivery ]

[ Mark Delivered ]
```

APIs:

```
GET /delivery-partner/jobs

POST /deliveries/:id/accept

POST /deliveries/:id/pickup

POST /deliveries/:id/complete
```

---

# 25. Admin Frontend

Routes:

```
/admin/dashboard

/admin/users

/admin/shops

/admin/printers

/admin/orders

/admin/audit-logs
```

Keep this simple for SIH.

Don't waste too much development time on an enterprise-level admin panel.

---

# 26. Complete Frontend Route Map

```
PUBLIC
│
├── /
├── /shops
├── /shops/:shopId
├── /services
└── /templates

AUTH
│
├── /login
├── /register
├── /forgot-password
└── /reset-password

CUSTOMER
│
├── /dashboard
│
├── /documents
├── /documents/:documentId
├── /documents/upload
│
├── /print/configure
│
├── /checkout
│
├── /orders
├── /orders/:orderId
│
├── /addresses
│
├── /notifications
│
└── /ai

SHOP
│
├── /shop/dashboard
│
├── /shop/orders
├── /shop/orders/:orderId
│
├── /shop/queue
│
├── /shop/printers
├── /shop/printers/:printerId
│
├── /shop/services
├── /shop/pricing
├── /shop/staff
├── /shop/settings
└── /shop/analytics

DELIVERY
│
├── /delivery/jobs
├── /delivery/active
└── /delivery/history

ADMIN
│
├── /admin/dashboard
├── /admin/users
├── /admin/shops
├── /admin/printers
├── /admin/orders
└── /admin/audit-logs
```

---

# 27. Axios Architecture 🔥

Now the important part.

**Do not write Axios calls directly inside React components.**

Bad:

```
useEffect(() => {axios.get("/orders");
}, []);
```

This will become a mess.

Instead:

```
Component
    ↓
React Query Hook
    ↓
Service/API Layer
    ↓
Axios Instance
    ↓
Backend
```

---

# 28. Axios Folder Structure

```
src/
├── lib/
│   └── axios.ts
│
├── services/
│   ├── auth.service.ts
│   ├── users.service.ts
│   ├── shops.service.ts
│   ├── services.service.ts
│   ├── pricing.service.ts
│   ├── documents.service.ts
│   ├── orders.service.ts
│   ├── payments.service.ts
│   ├── printers.service.ts
│   ├── queue.service.ts
│   ├── delivery.service.ts
│   ├── notifications.service.ts
│   ├── ai.service.ts
│   └── admin.service.ts
│
├── hooks/
│   ├── queries/
│   │   ├── useShops.ts
│   │   ├── useDocuments.ts
│   │   ├── useOrders.ts
│   │   └── ...
│   │
│   └── mutations/
│       ├── useCreateOrder.ts
│       ├── useUploadDocument.ts
│       └── ...
```

---

# 29. Axios Instance

```
// lib/axios.tsimportaxiosfrom"axios";exportconstapi=axios.create({
  baseURL:process.env.NEXT_PUBLIC_API_URL,
  withCredentials:true,
  headers: {"Content-Type":"application/json",
  },
});
```

---

# 30. Request Interceptor

If using Bearer access tokens:

```
api.interceptors.request.use((config) => {consttoken=getAccessToken();if (token) {config.headers.Authorization=`Bearer${token}`;
  }returnconfig;
});
```

# 31. Response Interceptor — Token Refresh

When:

```
401 Unauthorized
```

Flow:

```
API Request
    ↓
401
    ↓
POST /auth/refresh
    ↓
Get New Access Token
    ↓
Retry Original Request
```

Important: prevent infinite refresh loops.

Use:

```
_isRetry
```

logic.

---

# 32. Better Authentication Recommendation

For security, I recommend:

```
Access Token
→ Short lived
→ Memory

Refresh Token
→ HttpOnly Cookie
→ Secure
→ SameSite
```

Avoid storing refresh tokens in:

```
localStorage
```

because XSS can steal them.

---

# 33. Service Layer Example

## `orders.service.ts`

```
import {api }from"@/lib/axios";exportconstorderService= {
  create:async (data:CreateOrderRequest) => {constresponse=awaitapi.post("/orders",data);returnresponse.data;
  },

  getAll:async (params?:OrderFilters) => {constresponse=awaitapi.get("/orders", {
      params,
    });returnresponse.data;
  },

  getById:async (orderId:string) => {constresponse=awaitapi.get(`/orders/${orderId}`);returnresponse.data;
  },

  cancel:async (orderId:string) => {constresponse=awaitapi.post(`/orders/${orderId}/cancel`
    );returnresponse.data;
  },
};
```

---

# 34. TanStack Query Planning

Axios handles HTTP.

TanStack Query handles:

```
Caching
Loading
Errors
Refetching
Mutations
Cache invalidation
```

Use it.

---

## Example

```
exportfunctionuseOrders() {returnuseQuery({
    queryKey: ["orders"],
    queryFn: () =>orderService.getAll(),
  });
}
```

Component:

```
const { data, isLoading, error }=useOrders();
```

---

# 35. Query Key Architecture

Use centralized keys.

```
exportconstqueryKeys= {
  shops: {
    all: ["shops"],
    detail: (id:string) => ["shops",id],
  },

  documents: {
    all: ["documents"],
    detail: (id:string) => ["documents",id],
  },

  orders: {
    all: ["orders"],
    detail: (id:string) => ["orders",id],
  },

  printers: {
    all: ["printers"],
    detail: (id:string) => ["printers",id],
  },
};
```

This matters when you start invalidating caches.

---

# 36. Mutation Flow

Example:

```
Create Order
     ↓
POST /orders
     ↓
Success
     ↓
Invalidate orders cache
     ↓
Redirect to payment
```

Example:

```
useMutation({
  mutationFn:orderService.create,

  onSuccess: () => {queryClient.invalidateQueries({
      queryKey: ["orders"],
    });
  },
});
```

---

# 37. Upload Architecture

For large files, don't use the normal JSON Axios configuration.

Use:

```
constformData=newFormData();formData.append("file",file);awaitapi.post("/documents/upload",formData,
  {
    headers: {"Content-Type":"multipart/form-data",
    },

    onUploadProgress: (progressEvent) => {// calculate upload percentage
    },
  }
);
```

UI:

```
Uploading...

████████████░░░░

78%
```

---

# 38. Real-Time Socket Architecture

Create:

```
src/
└── lib/
    └── socket.ts
```

Connection:

```
User Login
    ↓
Connect Socket
    ↓
Authenticate
    ↓
Join user room
```

---

## Events

### Customer

```
order:updated

notification:new
```

### Shop

```
order:new

queue:updated

printer:updated

printer:failure
```

### Delivery

```
delivery:location

delivery:status
```

---

# 39. Socket + React Query Integration

When socket receives:

```
order:updated
```

Don't manually update 10 components.

Instead:

```
Socket Event
      ↓
Invalidate React Query
      ↓
Relevant components update
```

Or optimistically update the cached order if the payload is complete.

For MVP, invalidation is simpler and safer.

---

# 40. Zustand Planning

Use Zustand only for **client UI state**.

Good uses:

```
Checkout configuration

Sidebar state

Selected shop

Temporary filters

Document editor state
```

Bad uses:

```
Orders database

Users database

Shop list
```

That belongs in TanStack Query.

---

# 41. Zustand Stores

```
stores/
├── checkout.store.ts
├── ui.store.ts
├── document-editor.store.ts
└── auth.store.ts
```

Potentially avoid `auth.store` if you use server-side session/me fetching.

---

# 42. Complete Data Flow

Your frontend architecture should be:

```
                    USER ACTION
                         │
                         ▼
                     COMPONENT
                         │
                         ▼
                  REACT QUERY HOOK
                         │
                         ▼
                    API SERVICE
                         │
                         ▼
                  AXIOS INSTANCE
                         │
                         ▼
                     BACKEND
                         │
                         ▼
                    DATABASE
```

For real-time:

```
DATABASE
    ↓
Backend Event
    ↓
Socket.IO
    ↓
React Query Cache
    ↓
Updated UI
```

---

# 43. Role-Based Routing

You need route protection.

Example:

```
CUSTOMER
→ /dashboard

SHOP_OWNER
→ /shop/dashboard

DELIVERY_PARTNER
→ /delivery/jobs

ADMIN
→ /admin/dashboard
```

After login:

```
Get User Role
       ↓
Redirect to Correct Dashboard
```

But **frontend role protection alone is not security**.

The backend must still enforce:

```
authorize("SHOP_OWNER")
```

---

# 44. Frontend Middleware

Next.js middleware can handle basic redirects:

```
User not logged in
      ↓
Redirect /login

Logged in but visits /login
      ↓
Redirect dashboard
```

But don't rely on middleware as your only authorization mechanism.

---

# 45. MVP Frontend Build Order

Don't create all pages immediately.

## Phase 1 — Foundation

```
1. Next.js Setup
2. Tailwind
3. shadcn/ui
4. Axios
5. TanStack Query
6. Auth
7. Layouts
```

---

## Phase 2 — Core Customer Flow

```
1. Landing Page
2. Login/Register
3. Shop Discovery
4. Shop Details
5. Document Upload
6. Print Configuration
7. Price Estimate
8. Checkout
```

---

## Phase 3 — Order

```
1. Create Order
2. Razorpay
3. Order Tracking
4. Real-Time Status
```

---

## Phase 4 — Shop Dashboard

```
1. Dashboard
2. Orders
3. Queue
4. Printers
```

---

## Phase 5 — Killer Demo

```
Printer Failure
       ↓
UI changes RED
       ↓
Affected Job
       ↓
Automatic Rerouting
       ↓
Queue Updates
       ↓
Customer Notification
```

This should be visually impressive during SIH judging.