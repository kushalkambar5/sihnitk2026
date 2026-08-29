import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { services, shopServices } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class ServicesService {
  // Master Services (Admin)
  static async createService(data: { name: string; category: any; description?: string }) {
    const [svc] = await db.insert(services).values(data).returning();
    return svc;
  }

  static async listServices() {
    return db.query.services.findMany();
  }

  static async updateService(id: string, data: { name?: string; category?: any; description?: string }) {
    const [updated] = await db.update(services).set(data).where(eq(services.id, id)).returning();
    return updated;
  }

  static async deleteService(id: string) {
    await db.delete(services).where(eq(services.id, id));
  }

  // Shop Services
  static async addShopService(shopId: string, serviceId: string, isAvailable: boolean = true) {
    const existing = await db.query.shopServices.findFirst({
      where: and(eq(shopServices.shopId, shopId), eq(shopServices.serviceId, serviceId)),
    });

    if (existing) {
      throw new ApiError(400, 'Service is already added to this shop');
    }

    const [shopSvc] = await db
      .insert(shopServices)
      .values({ shopId, serviceId, isAvailable })
      .returning();

    return shopSvc;
  }

  static async getShopServices(shopId: string) {
    const list = await db.query.shopServices.findMany({
      where: eq(shopServices.shopId, shopId),
    });

    const populated = await Promise.all(
      list.map(async (item) => {
        const masterSvc = await db.query.services.findFirst({
          where: eq(services.id, item.serviceId),
        });
        return { ...item, service: masterSvc };
      })
    );

    return populated;
  }

  static async updateShopService(id: string, isAvailable: boolean) {
    const [updated] = await db
      .update(shopServices)
      .set({ isAvailable })
      .where(eq(shopServices.id, id))
      .returning();
    return updated;
  }

  static async deleteShopService(id: string) {
    await db.delete(shopServices).where(eq(shopServices.id, id));
  }
}

export class ServicesController {
  static async createMasterService(req: Request, res: Response, next: NextFunction) {
    try {
      const svc = await ServicesService.createService(req.body);
      return sendResponse({ res, statusCode: 201, message: 'Master service created', data: svc });
    } catch (error) {
      next(error);
    }
  }

  static async listMasterServices(_req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ServicesService.listServices();
      return sendResponse({ res, message: 'Master services retrieved', data: list });
    } catch (error) {
      next(error);
    }
  }

  static async updateMasterService(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await ServicesService.updateService(req.params.id as string, req.body);
      return sendResponse({ res, message: 'Master service updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMasterService(req: Request, res: Response, next: NextFunction) {
    try {
      await ServicesService.deleteService(req.params.id as string);
      return sendResponse({ res, message: 'Master service deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async addShopService(req: Request, res: Response, next: NextFunction) {
    try {
      const { serviceId, isAvailable } = req.body;
      const shopSvc = await ServicesService.addShopService(req.params.id as string, serviceId, isAvailable);
      return sendResponse({ res, statusCode: 201, message: 'Shop service added', data: shopSvc });
    } catch (error) {
      next(error);
    }
  }

  static async getShopServices(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await ServicesService.getShopServices(req.params.id as string);
      return sendResponse({ res, message: 'Shop services retrieved', data: list });
    } catch (error) {
      next(error);
    }
  }

  static async updateShopService(req: Request, res: Response, next: NextFunction) {
    try {
      const { isAvailable } = req.body;
      const updated = await ServicesService.updateShopService(req.params.id as string, isAvailable);
      return sendResponse({ res, message: 'Shop service updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteShopService(req: Request, res: Response, next: NextFunction) {
    try {
      await ServicesService.deleteShopService(req.params.id as string);
      return sendResponse({ res, message: 'Shop service removed' });
    } catch (error) {
      next(error);
    }
  }
}
