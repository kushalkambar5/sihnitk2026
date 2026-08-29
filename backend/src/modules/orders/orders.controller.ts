import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import {
  orders,
  orderItems,
  printConfigurations,
  orderStatusHistory,
  payments,
  documentVersions,
  shops,
} from '../../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { PricingService } from '../pricing/pricing.controller.js';
import { RazorpayService } from '../../config/razorpay.js';
import { emitToUser, emitToShop } from '../../sockets/index.js';

export interface CreateOrderItemInput {
  documentVersionId: string;
  quantity?: number;
  configuration: {
    copies: number;
    pageRange?: string;
    colorMode: 'BLACK_WHITE' | 'COLOR';
    printSide: 'SINGLE_SIDED' | 'DOUBLE_SIDED';
    paperSize: 'A4' | 'A3' | 'A5' | 'LETTER' | 'LEGAL';
    paperType?: 'NORMAL' | 'GLOSSY' | 'MATTE' | 'PHOTO' | 'CARDSTOCK';
    bindingType?: 'NONE' | 'SPIRAL' | 'COMB' | 'STAPLE' | 'PERFECT_BINDING';
  };
}

export class OrdersService {
  static async createOrder(
    userId: string,
    data: {
      shopId: string;
      fulfillmentType: 'PICKUP' | 'DELIVERY';
      items: CreateOrderItemInput[];
    }
  ) {
    // 1. Verify shop existence
    const shop = await db.query.shops.findFirst({
      where: eq(shops.id, data.shopId),
    });

    if (!shop || !shop.isActive) {
      throw new ApiError(404, 'Shop not found or inactive');
    }

    // 2. Generate unique order number (e.g. DP-20260829-91823)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomSeq = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `DP-${dateStr}-${randomSeq}`;

    let totalAmount = 0;
    const processedItems: any[] = [];

    // 3. Calculate price for each item and snapshot prices
    for (const item of data.items) {
      const docVer = await db.query.documentVersions.findFirst({
        where: eq(documentVersions.id, item.documentVersionId),
      });

      if (!docVer) {
        throw new ApiError(404, `Document version ${item.documentVersionId} not found`);
      }

      const estimate = await PricingService.estimatePrice({
        shopId: data.shopId,
        documentVersionId: docVer.id,
        configuration: item.configuration,
      });

      totalAmount += estimate.estimatedTotal;

      processedItems.push({
        item,
        docVer,
        estimate,
      });
    }

    // 4. Create main order record
    const [newOrder] = await db
      .insert(orders)
      .values({
        orderNumber,
        userId,
        shopId: data.shopId,
        status: 'PAYMENT_PENDING',
        totalAmount: totalAmount.toFixed(2),
        paymentStatus: 'PENDING',
        fulfillmentType: data.fulfillmentType,
      })
      .returning();

    // 5. Create order items and print configurations
    for (const p of processedItems) {
      const [orderItem] = await db
        .insert(orderItems)
        .values({
          orderId: newOrder.id,
          documentVersionId: p.docVer.id,
          quantity: p.item.quantity || 1,
          unitPrice: p.estimate.estimatedTotal.toFixed(2),
          subtotal: p.estimate.estimatedTotal.toFixed(2),
          pricingSnapshot: p.estimate,
          status: 'PENDING',
        })
        .returning();

      await db.insert(printConfigurations).values({
        orderItemId: orderItem.id,
        copies: p.item.configuration.copies || 1,
        pageRange: p.item.configuration.pageRange,
        colorMode: p.item.configuration.colorMode,
        printSide: p.item.configuration.printSide,
        paperSize: p.item.configuration.paperSize,
        paperType: p.item.configuration.paperType || 'NORMAL',
        bindingType: p.item.configuration.bindingType || 'NONE',
      });
    }

    // 6. Record order status history
    await db.insert(orderStatusHistory).values({
      orderId: newOrder.id,
      oldStatus: null,
      newStatus: 'PAYMENT_PENDING',
      changedByUserId: userId,
      reason: 'Order created',
    });

    // 7. Create payment record and Razorpay order
    const rzpOrder = RazorpayService.createOrder({
      amount: Math.round(totalAmount * 100),
      currency: 'INR',
      receipt: newOrder.orderNumber,
    });

    const [paymentRecord] = await db
      .insert(payments)
      .values({
        orderId: newOrder.id,
        amount: totalAmount.toFixed(2),
        currency: 'INR',
        provider: 'RAZORPAY',
        providerOrderId: rzpOrder.id,
        status: 'PENDING',
      })
      .returning();

    // Notify shop and user via WebSockets
    emitToUser(userId, 'order:updated', { orderId: newOrder.id, status: 'PAYMENT_PENDING' });
    emitToShop(data.shopId, 'order:new', { orderId: newOrder.id, orderNumber });

    return {
      order: newOrder,
      payment: paymentRecord,
      razorpayOrder: rzpOrder,
    };
  }

  static async getUserOrders(userId: string) {
    const userOrders = await db.query.orders.findMany({
      where: eq(orders.userId, userId),
      orderBy: [desc(orders.createdAt)],
    });

    return userOrders;
  }

  static async getOrderById(userId: string, orderId: string) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
    });

    const itemsWithConfig = await Promise.all(
      items.map(async (it) => {
        const config = await db.query.printConfigurations.findFirst({
          where: eq(printConfigurations.orderItemId, it.id),
        });
        return { ...it, configuration: config };
      })
    );

    const history = await db.query.orderStatusHistory.findMany({
      where: eq(orderStatusHistory.orderId, orderId),
    });

    return { ...order, items: itemsWithConfig, statusHistory: history };
  }

  static async cancelOrder(userId: string, orderId: string) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.userId, userId)),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    if (['COMPLETED', 'OUT_FOR_DELIVERY'].includes(order.status)) {
      throw new ApiError(400, 'Cannot cancel order in current state');
    }

    const [updated] = await db
      .update(orders)
      .set({ status: 'CANCELLED', updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    await db.insert(orderStatusHistory).values({
      orderId,
      oldStatus: order.status,
      newStatus: 'CANCELLED',
      changedByUserId: userId,
      reason: 'Cancelled by user',
    });

    emitToUser(userId, 'order:updated', { orderId, status: 'CANCELLED' });
    emitToShop(order.shopId, 'order:updated', { orderId, status: 'CANCELLED' });

    return updated;
  }

  static async getShopOrders(shopId: string) {
    return db.query.orders.findMany({
      where: eq(orders.shopId, shopId),
      orderBy: [desc(orders.createdAt)],
    });
  }

  static async updateOrderStatus(shopId: string, orderId: string, newStatus: any, changedByUserId: string) {
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.shopId, shopId)),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found for this shop');
    }

    const [updated] = await db
      .update(orders)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(orders.id, orderId))
      .returning();

    await db.insert(orderStatusHistory).values({
      orderId,
      oldStatus: order.status,
      newStatus,
      changedByUserId,
      reason: 'Updated by shop staff',
    });

    emitToUser(order.userId, 'order:updated', { orderId, status: newStatus });
    emitToShop(shopId, 'order:updated', { orderId, status: newStatus });

    return updated;
  }
}

export class OrdersController {
  static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await OrdersService.createOrder(req.user!.userId, req.body);
      return sendResponse({ res, statusCode: 201, message: 'Order created successfully', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const userOrders = await OrdersService.getUserOrders(req.user!.userId);
      return sendResponse({ res, message: 'Orders retrieved', data: userOrders });
    } catch (error) {
      next(error);
    }
  }

  static async getOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrdersService.getOrderById(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Order details retrieved', data: order });
    } catch (error) {
      next(error);
    }
  }

  static async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await OrdersService.cancelOrder(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'Order cancelled successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async getShopOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const shopOrders = await OrdersService.getShopOrders(req.params.shopId as string);
      return sendResponse({ res, message: 'Shop orders retrieved', data: shopOrders });
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await OrdersService.updateOrderStatus(
        req.params.shopId as string,
        req.params.orderId as string,
        req.body.status,
        req.user!.userId
      );
      return sendResponse({ res, message: 'Order status updated', data: updated });
    } catch (error) {
      next(error);
    }
  }
}
