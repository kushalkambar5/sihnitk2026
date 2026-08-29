import { Router } from 'express';
import { PickupController } from './pickup.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const verifyPickupSchema = z.object({
  token: z.string().min(1),
});

router.use(authenticate);

router.get('/orders/:id/pickup-token', PickupController.getPickupToken);
router.post('/pickup/verify', validate(verifyPickupSchema), PickupController.verifyPickup);

export default router;
