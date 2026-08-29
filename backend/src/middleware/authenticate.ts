import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.js';
import { ApiError } from '../utils/apiError.js';
import { db } from '../db/index.js';
import { printerAgents } from '../db/schema.js';
import { eq } from 'drizzle-orm';
import { hashToken } from '../utils/hash.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized: Missing or invalid token', 'UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error: any) {
    if (error instanceof ApiError) {
      return next(error);
    }
    return next(new ApiError(401, 'Unauthorized: Invalid token', 'UNAUTHORIZED'));
  }
};

export const authenticatePrinterAgent = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const apiKey = req.headers['x-printer-agent-key'] as string;
    if (!apiKey) {
      throw new ApiError(401, 'Unauthorized: Missing Printer Agent Key', 'UNAUTHORIZED');
    }

    const keyHash = hashToken(apiKey);
    const agent = await db.query.printerAgents.findFirst({
      where: eq(printerAgents.agentKeyHash, keyHash),
    });

    if (!agent || !agent.isActive) {
      throw new ApiError(401, 'Unauthorized: Invalid or inactive Printer Agent Key', 'UNAUTHORIZED');
    }

    req.printerAgent = {
      agentId: agent.id,
      shopId: agent.shopId,
    };
    next();
  } catch (error) {
    next(error);
  }
};
