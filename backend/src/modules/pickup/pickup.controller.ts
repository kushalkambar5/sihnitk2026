import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { pickupTokens, pickupEvents, orders, orderStatusHistory } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { generateRandomToken, hashToken } from '../../utils/hash.js';
import QRCode from 'qrcode';
import { emitToUser, emitToShop } from '../../sockets/index.js';

export class PickupService {
  static async generatePickupToken(userId: string, orderId: string) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const rawToken = `pk_${generateRandomToken(16)}`;
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h

    const [tokenRecord] = await db
      .insert(pickupTokens)
      .values({
        orderId,
        tokenHash,
        expiresAt,
        status: 'ACTIVE',
      })
      .returning();

    // Generate QR Code data URL
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify({
      orderId,
      token: rawToken,
      orderNumber: order.orderNumber,
    }));

    return {
      pickupToken: tokenRecord,
      rawToken,
      qrDataUrl,
    };
  }

  static async verifyPickup(verifiedByUserId: string, rawToken: string) {
    const tokenHash = hashToken(rawToken);

    const tokenRecord = await db.query.pickupTokens.findFirst({
      where: eq(pickupTokens.tokenHash, tokenHash),
    });

    if (!tokenRecord || tokenRecord.status !== 'ACTIVE' || new Date() > tokenRecord.expiresAt) {
      throw new ApiError(400, 'Invalid or expired pickup token');
    }

    const order = await db.query.orders.findFirst({
      where: eq(orders.id, tokenRecord.orderId),
    });

    if (!order) {
      throw new ApiError(404, 'Order for this pickup token was not found');
    }

    // 1. Log pickup event
    const [event] = await db
      .insert(pickupEvents)
      .values({
        orderId: order.id,
        pickupTokenId: tokenRecord.id,
        verifiedByUserId,
        status: 'VERIFIED',
        notes: 'QR Pickup verified successfully by staff',
      })
      .returning();

    // 2. Mark token USED
    await db
      .update(pickupTokens)
      .set({ status: 'USED', usedAt: new Date() })
      .where(eq(pickupTokens.id, tokenRecord.id));

    // 3. Mark order COMPLETED
    await db
      .update(orders)
      .set({ status: 'COMPLETED', updatedAt: new Date() })
      .where(eq(orders.id, order.id));

    await db.insert(orderStatusHistory).values({
      orderId: order.id,
      oldStatus: order.status,
      newStatus: 'COMPLETED',
      changedByUserId: verifiedByUserId,
      reason: 'QR Pickup completed',
    });

    emitToUser(order.userId, 'order:updated', { orderId: order.id, status: 'COMPLETED' });
    emitToShop(order.shopId, 'order:updated', { orderId: order.id, status: 'COMPLETED' });

    return { pickupEvent: event, orderId: order.id, orderNumber: order.orderNumber };
  }
}

export class PickupController {
  static async getPickupToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PickupService.generatePickupToken(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Pickup QR token generated', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async verifyPickup(req: Request, res: Response, next: NextFunction) {
    try {
      const { token } = req.body;
      const result = await PickupService.verifyPickup(req.user!.userId, token);
      return sendResponse({ res, message: 'Pickup QR verified and order completed', data: result });
    } catch (error) {
      next(error);
    }
  }
}
