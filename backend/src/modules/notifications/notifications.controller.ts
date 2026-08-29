import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { notifications } from '../../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { sendResponse } from '../../utils/apiResponse.js';
import { emitToUser } from '../../sockets/index.js';

export class NotificationsService {
  static async getUserNotifications(userId: string) {
    return db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
    });
  }

  static async markAsRead(userId: string, notificationId: string) {
    const [updated] = await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)))
      .returning();
    return updated;
  }

  static async markAllAsRead(userId: string) {
    await db
      .update(notifications)
      .set({ isRead: true, readAt: new Date() })
      .where(eq(notifications.userId, userId));
  }

  static async deleteNotification(userId: string, notificationId: string) {
    await db
      .delete(notifications)
      .where(and(eq(notifications.id, notificationId), eq(notifications.userId, userId)));
  }

  static async sendNotification(data: {
    userId: string;
    type: any;
    title: string;
    message: string;
    data?: any;
  }) {
    const [notif] = await db
      .insert(notifications)
      .values({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data,
      })
      .returning();

    emitToUser(data.userId, 'notification:new', notif);
    return notif;
  }
}

export class NotificationsController {
  static async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await NotificationsService.getUserNotifications(req.user!.userId);
      return sendResponse({ res, message: 'Notifications retrieved', data: list });
    } catch (error) {
      next(error);
    }
  }

  static async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await NotificationsService.markAsRead(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Notification marked as read', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationsService.markAllAsRead(req.user!.userId);
      return sendResponse({ res, message: 'All notifications marked as read' });
    } catch (error) {
      next(error);
    }
  }

  static async deleteNotification(req: Request, res: Response, next: NextFunction) {
    try {
      await NotificationsService.deleteNotification(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Notification deleted' });
    } catch (error) {
      next(error);
    }
  }
}
