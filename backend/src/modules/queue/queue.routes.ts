import { Router } from 'express';
import { QueueController } from './queue.controller.js';

const router = Router();

router.get('/shops/:id/queue', QueueController.getShopQueue);
router.get('/orders/:id/estimated-time', QueueController.getOrderEstimatedTime);
router.get('/shops/:id/queue/prediction', QueueController.getPrediction);

export default router;
