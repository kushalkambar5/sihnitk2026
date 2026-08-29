import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { addresses, deliveries, deliveryLocationLogs, deliveryTrackingEvents, orders } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { emitToDelivery, emitToUser } from '../../sockets/index.js';

export class DeliveryService {
  // Address Management
  static async addAddress(userId: string, data: any) {
    const [addr] = await db
      .insert(addresses)
      .values({ ...data, userId })
      .returning();
    return addr;
  }

  static async getUserAddresses(userId: string) {
    return db.query.addresses.findMany({
      where: eq(addresses.userId, userId),
    });
  }

  static async updateAddress(userId: string, addressId: string, data: any) {
    const [updated] = await db
      .update(addresses)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)))
      .returning();
    return updated;
  }

  static async deleteAddress(userId: string, addressId: string) {
    await db.delete(addresses).where(and(eq(addresses.id, addressId), eq(addresses.userId, userId)));
  }

  // Delivery Execution
  static async getDeliveryJobs() {
    return db.query.deliveries.findMany({
      where: eq(deliveries.status, 'PENDING'),
    });
  }

  static async acceptDelivery(partnerId: string, deliveryId: string) {
    const [updated] = await db
      .update(deliveries)
      .set({
        deliveryPartnerId: partnerId,
        status: 'ASSIGNED',
        updatedAt: new Date(),
      })
      .where(eq(deliveries.id, deliveryId))
      .returning();

    if (!updated) {
      throw new ApiError(404, 'Delivery job not found');
    }

    emitToDelivery(deliveryId, 'delivery:status', { deliveryId, status: 'ASSIGNED' });
    return updated;
  }

  static async pickupDelivery(partnerId: string, deliveryId: string) {
    const [updated] = await db
      .update(deliveries)
      .set({
        status: 'PICKED_UP',
        pickedUpAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(deliveries.id, deliveryId), eq(deliveries.deliveryPartnerId, partnerId)))
      .returning();

    emitToDelivery(deliveryId, 'delivery:status', { deliveryId, status: 'PICKED_UP' });
    return updated;
  }

  static async completeDelivery(partnerId: string, deliveryId: string) {
    const [updated] = await db
      .update(deliveries)
      .set({
        status: 'DELIVERED',
        deliveredAt: new Date(),
        updatedAt: new Date(),
      })
      .where(and(eq(deliveries.id, deliveryId), eq(deliveries.deliveryPartnerId, partnerId)))
      .returning();

    if (updated) {
      await db.update(orders).set({ status: 'COMPLETED' }).where(eq(orders.id, updated.orderId));
    }

    emitToDelivery(deliveryId, 'delivery:status', { deliveryId, status: 'DELIVERED' });
    return updated;
  }

  // Live GPS Tracking Log
  static async updateLocation(partnerId: string, deliveryId: string, lat: number, lon: number, accuracy?: number) {
    const [log] = await db
      .insert(deliveryLocationLogs)
      .values({
        deliveryId,
        latitude: lat.toString(),
        longitude: lon.toString(),
        accuracy: accuracy ? accuracy.toString() : null,
      })
      .returning();

    emitToDelivery(deliveryId, 'delivery:location', {
      deliveryId,
      latitude: lat,
      longitude: lon,
      recordedAt: log.recordedAt,
    });

    return log;
  }

  static async getDeliveryTracking(deliveryId: string) {
    const delivery = await db.query.deliveries.findFirst({
      where: eq(deliveries.id, deliveryId),
    });

    if (!delivery) {
      throw new ApiError(404, 'Delivery not found');
    }

    const latestLogs = await db.query.deliveryLocationLogs.findMany({
      where: eq(deliveryLocationLogs.deliveryId, deliveryId),
      orderBy: (logs, { desc }) => [desc(logs.recordedAt)],
      limit: 20,
    });

    return { delivery, latestLocations: latestLogs };
  }
}

export class DeliveryController {
  // Addresses
  static async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const addr = await DeliveryService.addAddress(req.user!.userId, req.body);
      return sendResponse({ res, statusCode: 201, message: 'Address created', data: addr });
    } catch (error) {
      next(error);
    }
  }

  static async getAddresses(req: Request, res: Response, next: NextFunction) {
    try {
      const addrs = await DeliveryService.getUserAddresses(req.user!.userId);
      return sendResponse({ res, message: 'Addresses retrieved', data: addrs });
    } catch (error) {
      next(error);
    }
  }

  static async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DeliveryService.updateAddress(req.user!.userId, req.params.id as string, req.body);
      return sendResponse({ res, message: 'Address updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteAddress(req: Request, res: Response, next: NextFunction) {
    try {
      await DeliveryService.deleteAddress(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Address deleted' });
    } catch (error) {
      next(error);
    }
  }

  // Delivery
  static async getJobs(_req: Request, res: Response, next: NextFunction) {
    try {
      const jobs = await DeliveryService.getDeliveryJobs();
      return sendResponse({ res, message: 'Delivery jobs retrieved', data: jobs });
    } catch (error) {
      next(error);
    }
  }

  static async accept(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DeliveryService.acceptDelivery(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Delivery job accepted', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async pickup(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DeliveryService.pickupDelivery(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Delivery picked up', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async complete(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await DeliveryService.completeDelivery(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Delivery completed', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async postLocation(req: Request, res: Response, next: NextFunction) {
    try {
      const { latitude, longitude, accuracy } = req.body;
      const log = await DeliveryService.updateLocation(req.user!.userId, req.params.id as string, latitude, longitude, accuracy);
      return sendResponse({ res, message: 'Delivery location updated', data: log });
    } catch (error) {
      next(error);
    }
  }

  static async getTracking(req: Request, res: Response, next: NextFunction) {
    try {
      const tracking = await DeliveryService.getDeliveryTracking(req.params.id as string);
      return sendResponse({ res, message: 'Delivery tracking data retrieved', data: tracking });
    } catch (error) {
      next(error);
    }
  }
}
