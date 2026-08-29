import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { users, shops, orders, printers, auditLogs } from '../../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { sendResponse } from '../../utils/apiResponse.js';

export class AdminService {
  static async getDashboardMetrics() {
    const allUsers = await db.query.users.findMany();
    const allShops = await db.query.shops.findMany();
    const allOrders = await db.query.orders.findMany();
    const allPrinters = await db.query.printers.findMany();

    const totalRevenue = allOrders
      .filter((o) => o.paymentStatus === 'SUCCESS' || o.status === 'PAID')
      .reduce((sum, o) => sum + parseFloat(o.totalAmount || '0'), 0);

    const activePrinters = allPrinters.filter((p) => p.status === 'ONLINE').length;
    const failedPrinters = allPrinters.filter((p) => p.status === 'ERROR' || p.status === 'OFFLINE').length;

    return {
      totalUsers: allUsers.length,
      totalShops: allShops.length,
      totalOrders: allOrders.length,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      activePrinters,
      failedPrinters,
    };
  }

  static async listUsers() {
    return db.query.users.findMany({
      orderBy: [desc(users.createdAt)],
    });
  }

  static async listShops() {
    return db.query.shops.findMany({
      orderBy: [desc(shops.createdAt)],
    });
  }

  static async verifyShop(shopId: string, isVerified: boolean) {
    const [updated] = await db
      .update(shops)
      .set({ isVerified, updatedAt: new Date() })
      .where(eq(shops.id, shopId))
      .returning();
    return updated;
  }

  static async setShopStatus(shopId: string, isActive: boolean) {
    const [updated] = await db
      .update(shops)
      .set({ isActive, updatedAt: new Date() })
      .where(eq(shops.id, shopId))
      .returning();
    return updated;
  }

  static async getAuditLogs() {
    return db.query.auditLogs.findMany({
      orderBy: [desc(auditLogs.createdAt)],
      limit: 100,
    });
  }
}

export class AdminController {
  static async getDashboard(_req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await AdminService.getDashboardMetrics();
      return sendResponse({ res, message: 'Admin dashboard metrics retrieved', data: metrics });
    } catch (error) {
      next(error);
    }
  }

  static async listUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const userList = await AdminService.listUsers();
      return sendResponse({ res, message: 'Users list retrieved', data: userList });
    } catch (error) {
      next(error);
    }
  }

  static async listShops(_req: Request, res: Response, next: NextFunction) {
    try {
      const shopList = await AdminService.listShops();
      return sendResponse({ res, message: 'Shops list retrieved', data: shopList });
    } catch (error) {
      next(error);
    }
  }

  static async verifyShop(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AdminService.verifyShop(req.params.id as string, req.body.isVerified);
      return sendResponse({ res, message: 'Shop verification status updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async setShopStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await AdminService.setShopStatus(req.params.id as string, req.body.isActive);
      return sendResponse({ res, message: 'Shop status updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(_req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await AdminService.getAuditLogs();
      return sendResponse({ res, message: 'System audit logs retrieved', data: logs });
    } catch (error) {
      next(error);
    }
  }
}
