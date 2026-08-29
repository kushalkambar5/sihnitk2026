import { Router } from 'express';
import { DeliveryController } from './delivery.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const addressSchema = z.object({
  label: z.string().min(1),
  recipientName: z.string().min(2),
  phone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  landmark: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  country: z.string().default('India'),
  postalCode: z.string().min(5),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  isDefault: z.boolean().optional(),
});

const locationSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  accuracy: z.number().optional(),
});

router.use(authenticate);

// Addresses
router.get('/addresses', DeliveryController.getAddresses);
router.post('/addresses', validate(addressSchema), DeliveryController.addAddress);
router.patch('/addresses/:id', validate(addressSchema.partial()), DeliveryController.updateAddress);
router.delete('/addresses/:id', DeliveryController.deleteAddress);

// Delivery Partner & Jobs
router.get('/delivery-partner/jobs', authorize(['DELIVERY_PARTNER', 'ADMIN']), DeliveryController.getJobs);
router.post('/deliveries/:id/accept', authorize(['DELIVERY_PARTNER', 'ADMIN']), DeliveryController.accept);
router.post('/deliveries/:id/pickup', authorize(['DELIVERY_PARTNER', 'ADMIN']), DeliveryController.pickup);
router.post('/deliveries/:id/complete', authorize(['DELIVERY_PARTNER', 'ADMIN']), DeliveryController.complete);

// Tracking
router.post('/deliveries/:id/location', validate(locationSchema), DeliveryController.postLocation);
router.get('/deliveries/:id', DeliveryController.getTracking);
router.get('/deliveries/:id/tracking', DeliveryController.getTracking);

export default router;
