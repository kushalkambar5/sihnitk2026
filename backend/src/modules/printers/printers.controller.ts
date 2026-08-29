import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import {
  printers,
  printerCapabilities,
  printerHealthLogs,
  printerFailureEvents,
  printJobs,
  reroutingEvents,
  printerAgents,
  orders,
} from '../../db/schema.js';
import { eq, and, inArray } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';
import { generateRandomToken, hashToken } from '../../utils/hash.js';
import { emitToShop, emitToUser } from '../../sockets/index.js';

export class PrintersService {
  static async addPrinter(shopId: string, data: {
    name: string;
    manufacturer?: string;
    model?: string;
    printerType: any;
    connectionType: any;
  }) {
    const [printer] = await db
      .insert(printers)
      .values({
        shopId,
        name: data.name,
        manufacturer: data.manufacturer,
        model: data.model,
        printerType: data.printerType,
        connectionType: data.connectionType,
        status: 'ONLINE',
      })
      .returning();

    return printer;
  }

  static async getShopPrinters(shopId: string) {
    const printerList = await db.query.printers.findMany({
      where: eq(printers.shopId, shopId),
    });

    const populated = await Promise.all(
      printerList.map(async (p) => {
        const caps = await db.query.printerCapabilities.findMany({
          where: eq(printerCapabilities.printerId, p.id),
        });
        return { ...p, capabilities: caps };
      })
    );

    return populated;
  }

  static async getPrinterById(printerId: string) {
    const printer = await db.query.printers.findFirst({
      where: eq(printers.id, printerId),
    });

    if (!printer) {
      throw new ApiError(404, 'Printer not found');
    }

    const caps = await db.query.printerCapabilities.findMany({
      where: eq(printerCapabilities.printerId, printerId),
    });

    return { ...printer, capabilities: caps };
  }

  static async updatePrinter(printerId: string, data: Partial<{ name: string; status: any; isActive: boolean }>) {
    const [updated] = await db
      .update(printers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(printers.id, printerId))
      .returning();

    return updated;
  }

  static async deletePrinter(printerId: string) {
    await db.delete(printers).where(eq(printers.id, printerId));
  }

  // Capability Matrix
  static async addCapability(printerId: string, capabilityType: any, isSupported: boolean = true) {
    const [cap] = await db
      .insert(printerCapabilities)
      .values({ printerId, capabilityType, isSupported })
      .returning();
    return cap;
  }

  static async getCapabilities(printerId: string) {
    return db.query.printerCapabilities.findMany({
      where: eq(printerCapabilities.printerId, printerId),
    });
  }

  // Printer Agent Daemon Registration (Generates Agent API Key)
  static async registerAgent(shopId: string, deviceName?: string) {
    const apiKey = `p_agent_${generateRandomToken(24)}`;
    const agentKeyHash = hashToken(apiKey);

    const [agent] = await db
      .insert(printerAgents)
      .values({
        shopId,
        agentKeyHash,
        deviceName: deviceName || 'Shop Printer Daemon Agent',
      })
      .returning();

    return {
      agentId: agent.id,
      shopId: agent.shopId,
      apiKey, // Returned ONLY once upon creation
      message: 'Store this X-Printer-Agent-Key safely. It will not be shown again.',
    };
  }

  // Health report & Automatic Failure Detection Engine
  static async reportHealth(printerId: string, healthData: {
    status: 'ONLINE' | 'OFFLINE' | 'BUSY' | 'ERROR' | 'MAINTENANCE';
    paperLevel?: number;
    inkLevel?: number;
    errorCode?: string;
    errorMessage?: string;
  }) {
    // 1. Log health entry
    const [log] = await db
      .insert(printerHealthLogs)
      .values({
        printerId,
        status: healthData.status,
        paperLevel: healthData.paperLevel,
        inkLevel: healthData.inkLevel,
        errorCode: healthData.errorCode,
        errorMessage: healthData.errorMessage,
      })
      .returning();

    // 2. Update printer status
    await db
      .update(printers)
      .set({ status: healthData.status, updatedAt: new Date() })
      .where(eq(printers.id, printerId));

    // 3. Automatic Failure Detection Check
    const isFailure =
      ['OFFLINE', 'ERROR'].includes(healthData.status) ||
      (healthData.paperLevel !== undefined && healthData.paperLevel <= 0) ||
      (healthData.inkLevel !== undefined && healthData.inkLevel <= 0);

    if (isFailure) {
      // Create failure event
      let failureType: any = 'UNKNOWN_ERROR';
      if (healthData.status === 'OFFLINE') failureType = 'OFFLINE';
      else if (healthData.paperLevel !== undefined && healthData.paperLevel <= 0) failureType = 'PAPER_EMPTY';
      else if (healthData.inkLevel !== undefined && healthData.inkLevel <= 0) failureType = 'INK_EMPTY';
      else failureType = 'HARDWARE_ERROR';

      const [failureEvent] = await db
        .insert(printerFailureEvents)
        .values({
          printerId,
          failureType,
          severity: 'HIGH',
          status: 'DETECTED',
          details: healthData,
        })
        .returning();

      // Get printer details to get shopId
      const printer = await this.getPrinterById(printerId);
      emitToShop(printer.shopId, 'printer:failure', { printerId, failureEvent });

      // Trigger Automatic Rerouting Engine for active jobs on this printer!
      await this.triggerAutomaticRerouting(printer.shopId, printerId);
    }

    return log;
  }

  // Automatic Job Rerouting Engine according to README.md Module 18
  static async triggerAutomaticRerouting(shopId: string, failedPrinterId: string) {
    // 1. Find all active/queued jobs on failed printer
    const activeJobs = await db.query.printJobs.findMany({
      where: and(
        eq(printJobs.shopId, shopId),
        eq(printJobs.printerId, failedPrinterId),
        inArray(printJobs.status, ['QUEUED', 'ASSIGNED', 'PROCESSING'])
      ),
    });

    if (activeJobs.length === 0) return;

    // 2. Find alternative compatible active printers in shop
    const shopPrinters = await db.query.printers.findMany({
      where: and(eq(printers.shopId, shopId), eq(printers.isActive, true)),
    });

    const candidatePrinters = shopPrinters.filter(
      (p) => p.id !== failedPrinterId && p.status === 'ONLINE'
    );

    for (const job of activeJobs) {
      if (candidatePrinters.length > 0) {
        // Assign to best available target printer
        const targetPrinter = candidatePrinters[0];

        await db
          .update(printJobs)
          .set({
            printerId: targetPrinter.id,
            status: 'QUEUED',
            updatedAt: new Date(),
          })
          .where(eq(printJobs.id, job.id));

        // Create rerouting event audit log
        await db.insert(reroutingEvents).values({
          printJobId: job.id,
          sourcePrinterId: failedPrinterId,
          targetPrinterId: targetPrinter.id,
          reason: 'PRINTER_FAILURE',
          status: 'COMPLETED',
          completedAt: new Date(),
        });

        console.log(`🚀 Job ${job.id} automatically rerouted from ${failedPrinterId} -> ${targetPrinter.id}`);
      } else {
        // No alternative printer available in shop
        await db
          .update(printJobs)
          .set({ status: 'REROUTING', updatedAt: new Date() })
          .where(eq(printJobs.id, job.id));

        await db.insert(reroutingEvents).values({
          printJobId: job.id,
          sourcePrinterId: failedPrinterId,
          targetPrinterId: null,
          reason: 'PRINTER_FAILURE',
          status: 'FAILED',
        });
      }
    }
  }

  static async getNextJobForPrinter(printerId: string) {
    const nextJob = await db.query.printJobs.findFirst({
      where: and(eq(printJobs.printerId, printerId), eq(printJobs.status, 'QUEUED')),
      orderBy: (jobs, { asc }) => [asc(jobs.priorityScore)],
    });
    return nextJob || null;
  }
}

export class PrintersController {
  static async addPrinter(req: Request, res: Response, next: NextFunction) {
    try {
      const printer = await PrintersService.addPrinter(req.params.id as string, req.body);
      return sendResponse({ res, statusCode: 201, message: 'Printer added to shop', data: printer });
    } catch (error) {
      next(error);
    }
  }

  static async getShopPrinters(req: Request, res: Response, next: NextFunction) {
    try {
      const printerList = await PrintersService.getShopPrinters(req.params.id as string);
      return sendResponse({ res, message: 'Shop printers retrieved', data: printerList });
    } catch (error) {
      next(error);
    }
  }

  static async getPrinter(req: Request, res: Response, next: NextFunction) {
    try {
      const printer = await PrintersService.getPrinterById(req.params.id as string);
      return sendResponse({ res, message: 'Printer details retrieved', data: printer });
    } catch (error) {
      next(error);
    }
  }

  static async updatePrinter(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await PrintersService.updatePrinter(req.params.id as string, req.body);
      return sendResponse({ res, message: 'Printer updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deletePrinter(req: Request, res: Response, next: NextFunction) {
    try {
      await PrintersService.deletePrinter(req.params.id as string);
      return sendResponse({ res, message: 'Printer deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async addCapability(req: Request, res: Response, next: NextFunction) {
    try {
      const { capabilityType, isSupported } = req.body;
      const cap = await PrintersService.addCapability(req.params.id as string, capabilityType, isSupported);
      return sendResponse({ res, statusCode: 201, message: 'Printer capability added', data: cap });
    } catch (error) {
      next(error);
    }
  }

  static async getCapabilities(req: Request, res: Response, next: NextFunction) {
    try {
      const caps = await PrintersService.getCapabilities(req.params.id as string);
      return sendResponse({ res, message: 'Capabilities retrieved', data: caps });
    } catch (error) {
      next(error);
    }
  }

  // Agent Hardware endpoints
  static async registerAgent(req: Request, res: Response, next: NextFunction) {
    try {
      const { shopId, deviceName } = req.body;
      const result = await PrintersService.registerAgent(shopId, deviceName);
      return sendResponse({ res, statusCode: 201, message: 'Printer Agent registered', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async reportHealth(req: Request, res: Response, next: NextFunction) {
    try {
      const { printerId, status, paperLevel, inkLevel, errorCode, errorMessage } = req.body;
      const log = await PrintersService.reportHealth(printerId, { status, paperLevel, inkLevel, errorCode, errorMessage });
      return sendResponse({ res, message: 'Printer health reported', data: log });
    } catch (error) {
      next(error);
    }
  }

  static async getNextJob(req: Request, res: Response, next: NextFunction) {
    try {
      const job = await PrintersService.getNextJobForPrinter(req.params.id as string);
      return sendResponse({ res, message: 'Next job retrieved', data: job });
    } catch (error) {
      next(error);
    }
  }
}
