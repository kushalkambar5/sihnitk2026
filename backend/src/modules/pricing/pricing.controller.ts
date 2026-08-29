import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { servicePricing, shopServices, documentVersions } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export interface PriceEstimateConfig {
  copies: number;
  pageRange?: string;
  colorMode: 'BLACK_WHITE' | 'COLOR';
  printSide: 'SINGLE_SIDED' | 'DOUBLE_SIDED';
  paperSize: 'A4' | 'A3' | 'A5' | 'LETTER' | 'LEGAL';
  paperType?: 'NORMAL' | 'GLOSSY' | 'MATTE' | 'PHOTO' | 'CARDSTOCK';
  bindingType?: 'NONE' | 'SPIRAL' | 'COMB' | 'STAPLE' | 'PERFECT_BINDING';
}

export class PricingService {
  static async addPricingRule(shopServiceId: string, data: {
    paperSize?: any;
    paperType?: any;
    colorMode?: any;
    sideMode?: any;
    basePrice: number;
    pricePerPage: number;
  }) {
    const [rule] = await db
      .insert(servicePricing)
      .values({
        shopServiceId,
        paperSize: data.paperSize,
        paperType: data.paperType,
        colorMode: data.colorMode,
        sideMode: data.sideMode,
        basePrice: data.basePrice.toString(),
        pricePerPage: data.pricePerPage.toString(),
      })
      .returning();

    return rule;
  }

  static async getPricingRules(shopServiceId: string) {
    return db.query.servicePricing.findMany({
      where: eq(servicePricing.shopServiceId, shopServiceId),
    });
  }

  static async updatePricingRule(pricingId: string, data: Partial<{ basePrice: number; pricePerPage: number }>) {
    const updatePayload: any = { updatedAt: new Date() };
    if (data.basePrice !== undefined) updatePayload.basePrice = data.basePrice.toString();
    if (data.pricePerPage !== undefined) updatePayload.pricePerPage = data.pricePerPage.toString();

    const [updated] = await db
      .update(servicePricing)
      .set(updatePayload)
      .where(eq(servicePricing.id, pricingId))
      .returning();

    return updated;
  }

  static async deletePricingRule(pricingId: string) {
    await db.delete(servicePricing).where(eq(servicePricing.id, pricingId));
  }

  // Price Calculation Engine according to README.md Module 7
  static async estimatePrice(payload: {
    shopId: string;
    documentVersionId?: string;
    pageCount?: number;
    configuration: PriceEstimateConfig;
  }) {
    let pages = payload.pageCount || 1;

    // Calculate pages if pageRange is specified or lookup documentVersion
    if (payload.documentVersionId) {
      const docVer = await db.query.documentVersions.findFirst({
        where: eq(documentVersions.id, payload.documentVersionId),
      });
      if (docVer && docVer.pageCount) {
        pages = docVer.pageCount;
      }
    }

    if (payload.configuration.pageRange) {
      // Parse page range e.g. "1-5" or "1,2,3"
      const rangeParts = payload.configuration.pageRange.split('-');
      if (rangeParts.length === 2) {
        const start = parseInt(rangeParts[0], 10);
        const end = parseInt(rangeParts[1], 10);
        if (!isNaN(start) && !isNaN(end) && end >= start) {
          pages = end - start + 1;
        }
      }
    }

    const copies = Math.max(1, payload.configuration.copies || 1);

    // Default rate multipliers if shop hasn't configured specific rule
    let basePrice = 2.0; // ₹2 base
    let pricePerPage = payload.configuration.colorMode === 'COLOR' ? 5.0 : 1.5;

    if (payload.configuration.printSide === 'DOUBLE_SIDED') {
      pricePerPage = pricePerPage * 0.85; // 15% discount for double-sided
    }

    // Binding cost estimation
    let bindingCost = 0;
    switch (payload.configuration.bindingType) {
      case 'SPIRAL':
        bindingCost = 30;
        break;
      case 'COMB':
        bindingCost = 25;
        break;
      case 'STAPLE':
        bindingCost = 5;
        break;
      case 'PERFECT_BINDING':
        bindingCost = 50;
        break;
      default:
        bindingCost = 0;
    }

    const printSubtotal = (basePrice + pricePerPage * pages) * copies;
    const estimatedTotal = Math.round((printSubtotal + bindingCost) * 100) / 100;

    return {
      shopId: payload.shopId,
      calculatedPages: pages,
      copies,
      basePrice,
      pricePerPage: Math.round(pricePerPage * 100) / 100,
      printSubtotal: Math.round(printSubtotal * 100) / 100,
      bindingCost,
      estimatedTotal,
      formula: `Estimated Price = Base Price (${basePrice}) + (Page Price (${pricePerPage.toFixed(2)}) × ${pages} pages × ${copies} copies) + Binding (${bindingCost})`,
    };
  }
}

export class PricingController {
  static async addRule(req: Request, res: Response, next: NextFunction) {
    try {
      const rule = await PricingService.addPricingRule(req.params.id as string, req.body);
      return sendResponse({ res, statusCode: 201, message: 'Pricing rule created', data: rule });
    } catch (error) {
      next(error);
    }
  }

  static async getRules(req: Request, res: Response, next: NextFunction) {
    try {
      const rules = await PricingService.getPricingRules(req.params.id as string);
      return sendResponse({ res, message: 'Pricing rules retrieved', data: rules });
    } catch (error) {
      next(error);
    }
  }

  static async updateRule(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await PricingService.updatePricingRule(req.params.id as string, req.body);
      return sendResponse({ res, message: 'Pricing rule updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteRule(req: Request, res: Response, next: NextFunction) {
    try {
      await PricingService.deletePricingRule(req.params.id as string);
      return sendResponse({ res, message: 'Pricing rule deleted' });
    } catch (error) {
      next(error);
    }
  }

  static async estimatePrice(req: Request, res: Response, next: NextFunction) {
    try {
      const estimate = await PricingService.estimatePrice(req.body);
      return sendResponse({ res, message: 'Price calculated successfully', data: estimate });
    } catch (error) {
      next(error);
    }
  }
}
