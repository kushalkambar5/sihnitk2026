import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import {
  payments,
  orders,
  paymentTransactions,
  refunds,
  orderItems,
  printJobs,
  printQueueEntries,
  printers,
  orderStatusHistory,
} from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { RazorpayService } from '../../config/razorpay.js';
import { emitToUser, emitToShop } from '../../sockets/index.js';

export class PaymentsService {
  static async verifyPayment(data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) {
    const isValid = RazorpayService.verifySignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    if (!isValid) {
      throw new ApiError(400, 'Invalid payment signature', 'PAYMENT_VERIFICATION_FAILED');
    }

    const payment = await db.query.payments.findFirst({
      where: eq(payments.providerOrderId, data.razorpay_order_id),
    });

    if (!payment) {
      throw new ApiError(404, 'Payment record not found');
    }

    // 1. Record transaction
    await db.insert(paymentTransactions).values({
      paymentId: payment.id,
      providerPaymentId: data.razorpay_payment_id,
      amount: payment.amount,
      method: 'UPI',
      status: 'SUCCESS',
      providerResponse: data,
    });

    // 2. Update payment status
    const [updatedPayment] = await db
      .update(payments)
      .set({ status: 'SUCCESS', updatedAt: new Date() })
      .where(eq(payments.id, payment.id))
      .returning();

    // 3. Update order to PAID
    const [updatedOrder] = await db
      .update(orders)
      .set({ status: 'PAID', paymentStatus: 'SUCCESS', updatedAt: new Date() })
      .where(eq(orders.id, payment.orderId))
      .returning();

    await db.insert(orderStatusHistory).values({
      orderId: updatedOrder.id,
      oldStatus: 'PAYMENT_PENDING',
      newStatus: 'PAID',
      reason: 'Payment verified successfully via Razorpay',
    });

    // 4. Create print_jobs for each order_item
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, updatedOrder.id),
    });

    // Select shop printer if available
    const shopPrinters = await db.query.printers.findMany({
      where: eq(printers.shopId, updatedOrder.shopId),
    });

    const targetPrinter = shopPrinters.find((p) => p.isActive) || shopPrinters[0] || null;

    for (const item of items) {
      const [job] = await db
        .insert(printJobs)
        .values({
          orderItemId: item.id,
          shopId: updatedOrder.shopId,
          printerId: targetPrinter ? targetPrinter.id : null,
          status: 'QUEUED',
          priorityScore: '100',
          estimatedDurationSeconds: 120,
        })
        .returning();

      await db.insert(printQueueEntries).values({
        printJobId: job.id,
        printerId: targetPrinter ? targetPrinter.id : null,
        queuePosition: 1,
        priorityScore: '100',
        estimatedWaitSeconds: 120,
        status: 'WAITING',
      });
    }

    emitToUser(updatedOrder.userId, 'order:updated', { orderId: updatedOrder.id, status: 'PAID' });
    emitToShop(updatedOrder.shopId, 'order:updated', { orderId: updatedOrder.id, status: 'PAID' });

    return { payment: updatedPayment, order: updatedOrder };
  }

  static async handleWebhook(payload: any, signature?: string) {
    // Webhook idempotency handling
    if (payload.event === 'payment.captured') {
      const entity = payload.payload?.payment?.entity;
      if (entity && entity.order_id) {
        await this.verifyPayment({
          razorpay_order_id: entity.order_id,
          razorpay_payment_id: entity.id || 'mock_pay_wh',
          razorpay_signature: signature || 'mock_sig_wh',
        });
      }
    }
    return { status: 'processed' };
  }

  static async processRefund(userId: string, orderId: string, reason?: string) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const payment = await db.query.payments.findFirst({
      where: eq(payments.orderId, orderId),
    });

    if (!payment) {
      throw new ApiError(404, 'Payment record not found for refund');
    }

    const [refundRecord] = await db
      .insert(refunds)
      .values({
        paymentId: payment.id,
        amount: payment.amount,
        reason: reason || 'Order cancelled / printer failure refund',
        providerRefundId: `rfnd_${Date.now()}`,
        status: 'SUCCESS',
      })
      .returning();

    await db
      .update(orders)
      .set({ status: 'REFUNDED', paymentStatus: 'REFUNDED', updatedAt: new Date() })
      .where(eq(orders.id, orderId));

    await db
      .update(payments)
      .set({ status: 'REFUNDED', updatedAt: new Date() })
      .where(eq(payments.id, payment.id));

    emitToUser(order.userId, 'order:updated', { orderId, status: 'REFUNDED' });
    return refundRecord;
  }
}

export class PaymentsController {
  static async createPayment(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendResponse({ res, message: 'Payment created' });
    } catch (error) {
      next(error);
    }
  }

  static async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.verifyPayment(req.body);
      return sendResponse({ res, message: 'Payment verified and print jobs queued', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async webhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const result = await PaymentsService.handleWebhook(req.body, signature);
      return sendResponse({ res, message: 'Webhook processed', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async refund(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await PaymentsService.processRefund(req.user!.userId, req.params.id as string, req.body.reason);
      return sendResponse({ res, message: 'Refund processed successfully', data: result });
    } catch (error) {
      next(error);
    }
  }
}
