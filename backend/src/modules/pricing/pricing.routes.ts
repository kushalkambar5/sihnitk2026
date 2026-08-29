import { Router } from 'express';
import { PricingController } from './pricing.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const pricingRuleSchema = z.object({
  paperSize: z.enum(['A4', 'A3', 'A5', 'LETTER', 'LEGAL']).optional(),
  paperType: z.enum(['NORMAL', 'GLOSSY', 'MATTE', 'PHOTO', 'CARDSTOCK']).optional(),
  colorMode: z.enum(['BLACK_WHITE', 'COLOR']).optional(),
  sideMode: z.enum(['SINGLE_SIDED', 'DOUBLE_SIDED']).optional(),
  basePrice: z.number().nonnegative(),
  pricePerPage: z.number().nonnegative(),
});

const estimateSchema = z.object({
  shopId: z.string().uuid(),
  documentVersionId: z.string().uuid().optional(),
  pageCount: z.number().optional(),
  configuration: z.object({
    copies: z.number().positive(),
    pageRange: z.string().optional(),
    colorMode: z.enum(['BLACK_WHITE', 'COLOR']),
    printSide: z.enum(['SINGLE_SIDED', 'DOUBLE_SIDED']),
    paperSize: z.enum(['A4', 'A3', 'A5', 'LETTER', 'LEGAL']),
    paperType: z.enum(['NORMAL', 'GLOSSY', 'MATTE', 'PHOTO', 'CARDSTOCK']).optional(),
    bindingType: z.enum(['NONE', 'SPIRAL', 'COMB', 'STAPLE', 'PERFECT_BINDING']).optional(),
  }),
});

router.post('/shop-services/:id/pricing', authenticate, validate(pricingRuleSchema), PricingController.addRule);
router.get('/shop-services/:id/pricing', PricingController.getRules);
router.patch('/pricing/:id', authenticate, PricingController.updateRule);
router.delete('/pricing/:id', authenticate, PricingController.deleteRule);

router.post('/pricing/estimate', validate(estimateSchema), PricingController.estimatePrice);

export default router;
