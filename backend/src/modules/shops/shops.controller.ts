import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { shops, shopServices, services, printers, printJobs } from '../../db/schema.js';
import { eq, and, inArray } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { calculateDistanceKm } from '../../utils/distance.js';

export class ShopsService {
  static async createShop(ownerId: string, data: { name: string; description?: string; phone?: string; email?: string; address: string; latitude?: number; longitude?: number }) {
    const [shop] = await db
      .insert(shops)
      .values({
        ownerId,
        name: data.name,
        description: data.description,
        phone: data.phone,
        email: data.email,
        address: data.address,
        latitude: data.latitude !== undefined ? data.latitude.toString() : null,
        longitude: data.longitude !== undefined ? data.longitude.toString() : null,
      })
      .returning();

    return shop;
  }

  static async getMyShops(ownerId: string) {
    return db.query.shops.findMany({
      where: eq(shops.ownerId, ownerId),
    });
  }

  static async getShopById(shopId: string) {
    const shop = await db.query.shops.findFirst({
      where: eq(shops.id, shopId),
      with: {
        // Fetch active shop printers
      },
    });

    if (!shop) {
      throw new ApiError(404, 'Shop not found');
    }

    const shopPrinters = await db.query.printers.findMany({
      where: eq(printers.shopId, shopId),
    });

    const activeJobs = await db.query.printJobs.findMany({
      where: and(
        eq(printJobs.shopId, shopId),
        inArray(printJobs.status, ['QUEUED', 'ASSIGNED', 'PROCESSING'])
      ),
    });

    return {
      ...shop,
      printers: shopPrinters,
      activeQueueLength: activeJobs.length,
      estimatedQueueWaitMinutes: Math.ceil(activeJobs.length * 2.5),
    };
  }

  static async searchShops(query: { latitude?: number; longitude?: number; service?: string; isAvailable?: boolean }) {
    const allShops = await db.query.shops.findMany({
      where: eq(shops.isActive, true),
    });

    let results = allShops.map((s) => {
      let distanceKm: number | null = null;
      if (query.latitude && query.longitude && s.latitude && s.longitude) {
        distanceKm = calculateDistanceKm(
          query.latitude,
          query.longitude,
          parseFloat(s.latitude),
          parseFloat(s.longitude)
        );
      }

      return {
        ...s,
        distanceKm,
      };
    });

    if (query.latitude && query.longitude) {
      results.sort((a, b) => (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999));
    }

    return results;
  }

  static async updateShop(shopId: string, data: Partial<{ name: string; description: string; phone: string; email: string; address: string; isActive: boolean }>) {
    const [updated] = await db
      .update(shops)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(shops.id, shopId))
      .returning();

    return updated;
  }

  static async deleteShop(shopId: string) {
    await db.delete(shops).where(eq(shops.id, shopId));
  }
}

export class ShopsController {
  static async createShop(req: Request, res: Response, next: NextFunction) {
    try {
      const shop = await ShopsService.createShop(req.user!.userId, req.body);
      return sendResponse({ res, statusCode: 201, message: 'Shop created successfully', data: shop });
    } catch (error) {
      next(error);
    }
  }

  static async getMyShops(req: Request, res: Response, next: NextFunction) {
    try {
      const myShops = await ShopsService.getMyShops(req.user!.userId);
      return sendResponse({ res, message: 'My shops retrieved', data: myShops });
    } catch (error) {
      next(error);
    }
  }

  static async getShop(req: Request, res: Response, next: NextFunction) {
    try {
      const shop = await ShopsService.getShopById(req.params.id as string);
      return sendResponse({ res, message: 'Shop details retrieved', data: shop });
    } catch (error) {
      next(error);
    }
  }

  static async listShops(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude, service } = req.query;
      const parsedLat = latitude ? parseFloat(latitude as string) : undefined;
      const parsedLon = longitude ? parseFloat(longitude as string) : undefined;

      const shopList = await ShopsService.searchShops({
        latitude: parsedLat,
        longitude: parsedLon,
        service: service as string,
      });

      return sendResponse({ res, message: 'Shops listed successfully', data: shopList });
    } catch (error) {
      next(error);
    }
  }

  static async updateShop(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ShopsService.updateShop(req.params.id as string, req.body);
      return sendResponse({ res, message: 'Shop updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteShop(req: Request, res: Response, next: NextFunction) {
    try {
      await ShopsService.deleteShop(req.params.id as string);
      return sendResponse({ res, message: 'Shop deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
