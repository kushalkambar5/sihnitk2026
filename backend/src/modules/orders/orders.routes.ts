import { Router } from 'express';
import { OrdersController } from './orders.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorizeShopAccess } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const createOrderSchema = z.object({
  shopId: z.string().uuid(),
  fulfillmentType: z.enum(['PICKUP', 'DELIVERY']),
  items: z
    .array(
      z.object({
        documentVersionId: z.string().uuid(),
        quantity: z.number().positive().optional(),
        configuration: z.object({
          copies: z.number().positive(),
          pageRange: z.string().optional(),
          colorMode: z.enum(['BLACK_WHITE', 'COLOR']),
          printSide: z.enum(['SINGLE_SIDED', 'DOUBLE_SIDED']),
          paperSize: z.enum(['A4', 'A3', 'A5', 'LETTER', 'LEGAL']),
          paperType: z.enum(['NORMAL', 'GLOSSY', 'MATTE', 'PHOTO', 'CARDSTOCK']).optional(),
          bindingType: z.enum(['NONE', 'SPIRAL', 'COMB', 'STAPLE', 'PERFECT_BINDING']).optional(),
        }),
      })
    )
    .min(1),
});

const statusSchema = z.object({
  status: z.enum([
    'CREATED',
    'PAYMENT_PENDING',
    'PAID',
    'PROCESSING',
    'READY_FOR_PICKUP',
    'OUT_FOR_DELIVERY',
    'COMPLETED',
    'CANCELLED',
    'FAILED',
    'REFUNDED',
  ]),
});

router.use(authenticate);

router.post('/orders', validate(createOrderSchema), OrdersController.createOrder);
router.get('/orders', OrdersController.getUserOrders);
router.get('/orders/:id', OrdersController.getOrder);
router.post('/orders/:id/cancel', OrdersController.cancelOrder);

// Shop Orders
router.get('/shops/:shopId/orders', authorizeShopAccess('shopId'), OrdersController.getShopOrders);
router.patch('/shops/:shopId/orders/:orderId/status', authorizeShopAccess('shopId'), validate(statusSchema), OrdersController.updateStatus);

export default router;
