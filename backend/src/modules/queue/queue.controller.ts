import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { printQueueEntries, printJobs, orderItems, printConfigurations, orders } from '../../db/schema.js';
import { eq, inArray, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { sortQueueByPriority } from '../../utils/queueAlgorithm.js';

export class QueueService {
  static async getShopQueue(shopId: string) {
    const activeJobs = await db.query.printJobs.findMany({
      where: and(
        eq(printJobs.shopId, shopId),
        inArray(printJobs.status, ['QUEUED', 'ASSIGNED', 'PROCESSING'])
      ),
    });

    const queueInputs = activeJobs.map((j) => ({
      jobId: j.id,
      pages: Math.max(1, j.estimatedDurationSeconds ? Math.floor(j.estimatedDurationSeconds / 2) : 5),
      copies: 1,
      createdAt: j.createdAt,
    }));

    const sortedQueue = sortQueueByPriority(queueInputs);

    return {
      shopId,
      totalActiveJobs: activeJobs.length,
      estimatedWaitTimeMinutes: Math.ceil(activeJobs.length * 2.5),
      queue: sortedQueue,
    };
  }

  static async getOrderEstimatedTime(orderId: string) {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
    });

    let totalPages = 0;
    for (const item of items) {
      const config = await db.query.printConfigurations.findFirst({
        where: eq(printConfigurations.orderItemId, item.id),
      });
      totalPages += (config?.copies || 1) * 5; // Default estimate
    }

    // Dynamic queue prediction
    const shopQueue = await this.getShopQueue(order.shopId);
    const estWaitMinutes = shopQueue.estimatedWaitTimeMinutes + Math.ceil(totalPages / 15);

    const estimatedReadyAt = new Date(Date.now() + estWaitMinutes * 60 * 1000);

    return {
      orderId,
      status: order.status,
      estimatedWaitMinutes: estWaitMinutes,
      estimatedReadyAt,
    };
  }

  static async getQueuePrediction(shopId: string) {
    const shopQueue = await this.getShopQueue(shopId);
    return {
      shopId,
      predictedWaitSeconds: shopQueue.estimatedWaitTimeMinutes * 60,
      predictedCompletionTime: new Date(Date.now() + shopQueue.estimatedWaitTimeMinutes * 60 * 1000),
      confidenceScore: 0.95,
      modelVersion: '1.0-deterministic',
    };
  }
}

export class QueueController {
  static async getShopQueue(req: Request, res: Response, next: NextFunction) {
    try {
      const queueData = await QueueService.getShopQueue(req.params.id as string);
      return sendResponse({ res, message: 'Shop queue retrieved', data: queueData });
    } catch (error) {
      next(error);
    }
  }

  static async getOrderEstimatedTime(req: Request, res: Response, next: NextFunction) {
    try {
      const estTime = await QueueService.getOrderEstimatedTime(req.params.id as string);
      return sendResponse({ res, message: 'Estimated order completion time retrieved', data: estTime });
    } catch (error) {
      next(error);
    }
  }

  static async getPrediction(req: Request, res: Response, next: NextFunction) {
    try {
      const prediction = await QueueService.getQueuePrediction(req.params.id as string);
      return sendResponse({ res, message: 'Queue prediction retrieved', data: prediction });
    } catch (error) {
      next(error);
    }
  }
}
