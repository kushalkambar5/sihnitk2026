import { Router } from 'express';
import { AdminController } from './admin.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const verifySchema = z.object({
  isVerified: z.boolean(),
});

const statusSchema = z.object({
  isActive: z.boolean(),
});

router.use(authenticate, authorize(['ADMIN']));

router.get('/admin/dashboard', AdminController.getDashboard);
router.get('/admin/users', AdminController.listUsers);
router.get('/admin/shops', AdminController.listShops);
router.patch('/admin/shops/:id/verify', validate(verifySchema), AdminController.verifyShop);
router.patch('/admin/shops/:id/status', validate(statusSchema), AdminController.setShopStatus);
router.get('/admin/audit-logs', AdminController.getAuditLogs);

export default router;
