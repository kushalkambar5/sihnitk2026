import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import Module Routers
import authRoutes from './modules/auth/auth.routes.js';
import usersRoutes from './modules/users/users.routes.js';
import shopsRoutes from './modules/shops/shops.routes.js';
import membersRoutes from './modules/members/members.routes.js';
import servicesRoutes from './modules/services/services.routes.js';
import pricingRoutes from './modules/pricing/pricing.routes.js';
import documentsRoutes from './modules/documents/documents.routes.js';
import templatesRoutes from './modules/templates/templates.routes.js';
import ordersRoutes from './modules/orders/orders.routes.js';
import paymentsRoutes from './modules/payments/payments.routes.js';
import printersRoutes from './modules/printers/printers.routes.js';
import queueRoutes from './modules/queue/queue.routes.js';
import pickupRoutes from './modules/pickup/pickup.routes.js';
import deliveryRoutes from './modules/delivery/delivery.routes.js';
import notificationsRoutes from './modules/notifications/notifications.routes.js';
import aiRoutes from './modules/ai/ai.routes.js';
import securityRoutes from './modules/security/security.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded document files
const uploadsPath = path.resolve(env.STORAGE_DIR);
app.use('/uploads', express.static(uploadsPath));

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'DocPrint Backend API',
    timestamp: new Date().toISOString(),
  });
});

// Mount Base API v1 Router
const apiV1 = express.Router();

apiV1.use('/auth', authRoutes);
apiV1.use('/users', usersRoutes);
apiV1.use('/', shopsRoutes);
apiV1.use('/shops/:shopId/members', membersRoutes);
apiV1.use('/', servicesRoutes);
apiV1.use('/', pricingRoutes);
apiV1.use('/documents', documentsRoutes);
apiV1.use('/', templatesRoutes);
apiV1.use('/', ordersRoutes);
apiV1.use('/', paymentsRoutes);
apiV1.use('/', printersRoutes);
apiV1.use('/', queueRoutes);
apiV1.use('/', pickupRoutes);
apiV1.use('/', deliveryRoutes);
apiV1.use('/', notificationsRoutes);
apiV1.use('/', aiRoutes);
apiV1.use('/', securityRoutes);
apiV1.use('/', adminRoutes);

app.use('/api/v1', apiV1);

// Global Error Handler
app.use(errorHandler);

export default app;
