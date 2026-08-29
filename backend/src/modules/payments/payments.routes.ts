import { Router } from 'express';
import { PaymentsController } from './payments.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const verifySchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

router.post('/payments/verify', authenticate, validate(verifySchema), PaymentsController.verify);
router.post('/payments/webhook/razorpay', PaymentsController.webhook);
router.post('/orders/:id/refund', authenticate, PaymentsController.refund);

export default router;
