import { Router } from 'express';
import { NotificationsController } from './notifications.controller.js';
import { authenticate } from '../../middleware/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/notifications', NotificationsController.getNotifications);
router.patch('/notifications/read-all', NotificationsController.markAllAsRead);
router.patch('/notifications/:id/read', NotificationsController.markAsRead);
router.delete('/notifications/:id', NotificationsController.deleteNotification);

export default router;
