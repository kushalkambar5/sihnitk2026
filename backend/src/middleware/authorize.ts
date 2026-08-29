import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/apiError.js';
import { db } from '../db/index.js';
import { shopMembers, shops } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized', 'UNAUTHORIZED'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'Forbidden: Insufficient permissions', 'FORBIDDEN')
      );
    }

    next();
  };
};

export const authorizeShopAccess = (shopIdParamName: string = 'shopId') => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
      }

      // ADMIN has full access
      if (req.user.role === 'ADMIN') {
        return next();
      }

      const shopId = req.params[shopIdParamName] || req.body[shopIdParamName];
      if (!shopId) {
        throw new ApiError(400, 'Shop ID is required for authorization check');
      }

      // Check if user is shop owner
      const shop = await db.query.shops.findFirst({
        where: eq(shops.id, shopId),
      });

      if (shop && shop.ownerId === req.user.userId) {
        return next();
      }

      // Check if user is active staff member in shop_members table
      const member = await db.query.shopMembers.findFirst({
        where: and(
          eq(shopMembers.shopId, shopId),
          eq(shopMembers.userId, req.user.userId),
          eq(shopMembers.isActive, true)
        ),
      });

      if (member) {
        return next();
      }

      throw new ApiError(
        403,
        'Forbidden: You do not have access to manage this shop',
        'FORBIDDEN'
      );
    } catch (error) {
      next(error);
    }
  };
};
