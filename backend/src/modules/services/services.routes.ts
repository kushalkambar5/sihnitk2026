import { Router } from 'express';
import { ServicesController } from './services.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize, authorizeShopAccess } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const masterServiceSchema = z.object({
  name: z.string().min(2),
  category: z.enum(['PRINTING', 'SCANNING', 'PHOTOCOPY', 'LAMINATION', 'BINDING', 'THREE_D_PRINTING']),
  description: z.string().optional(),
});

const shopServiceSchema = z.object({
  serviceId: z.string().uuid(),
  isAvailable: z.boolean().optional(),
});

// Master services
router.get('/services', ServicesController.listMasterServices);
router.post('/services', authenticate, authorize(['ADMIN']), validate(masterServiceSchema), ServicesController.createMasterService);
router.patch('/services/:id', authenticate, authorize(['ADMIN']), ServicesController.updateMasterService);
router.delete('/services/:id', authenticate, authorize(['ADMIN']), ServicesController.deleteMasterService);

// Shop specific services
router.get('/shops/:id/services', ServicesController.getShopServices);
router.post('/shops/:id/services', authenticate, authorizeShopAccess('id'), validate(shopServiceSchema), ServicesController.addShopService);
router.patch('/shop-services/:id', authenticate, ServicesController.updateShopService);
router.delete('/shop-services/:id', authenticate, ServicesController.deleteShopService);

export default router;
