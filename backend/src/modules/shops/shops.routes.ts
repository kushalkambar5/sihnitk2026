import { Router } from 'express';
import { ShopsController } from './shops.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize, authorizeShopAccess } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const createShopSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().min(5),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const updateShopSchema = createShopSchema.partial();

router.get('/', ShopsController.listShops);
router.get('/:id', ShopsController.getShop);

router.use(authenticate);

router.get('/my/shops', authorize(['SHOP_OWNER', 'ADMIN']), ShopsController.getMyShops);
router.post('/', authorize(['SHOP_OWNER', 'ADMIN']), validate(createShopSchema), ShopsController.createShop);
router.patch('/:id', authorizeShopAccess('id'), validate(updateShopSchema), ShopsController.updateShop);
router.delete('/:id', authorizeShopAccess('id'), ShopsController.deleteShop);

export default router;
