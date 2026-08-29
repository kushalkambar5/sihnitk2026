import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { documentAccessGrants, documentAccessLogs, documents } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class SecurityService {
  static async grantAccess(ownerId: string, documentId: string, targetUserId: string, accessType: any) {
    const doc = await db.query.documents.findFirst({
      where: and(eq(documents.id, documentId), eq(documents.userId, ownerId)),
    });

    if (!doc) {
      throw new ApiError(404, 'Document not found or you are not the owner');
    }

    const [grant] = await db
      .insert(documentAccessGrants)
      .values({
        documentId,
        userId: targetUserId,
        accessType,
        grantedBy: ownerId,
      })
      .returning();

    return grant;
  }

  static async revokeAccess(grantId: string) {
    await db.delete(documentAccessGrants).where(eq(documentAccessGrants.id, grantId));
  }

  static async logAccess(documentId: string, userId: string | undefined, action: any, req: Request) {
    const [log] = await db
      .insert(documentAccessLogs)
      .values({
        documentId,
        userId: userId || null,
        action,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.headers['user-agent'] || 'Unknown',
      })
      .returning();
    return log;
  }

  static async getAuditLogs(documentId: string) {
    return db.query.documentAccessLogs.findMany({
      where: eq(documentAccessLogs.documentId, documentId),
      orderBy: (logs, { desc }) => [desc(logs.createdAt)],
    });
  }
}

export class SecurityController {
  static async grantAccess(req: Request, res: Response, next: NextFunction) {
    try {
      const { targetUserId, accessType } = req.body;
      const grant = await SecurityService.grantAccess(req.user!.userId, req.params.id as string, targetUserId, accessType);
      return sendResponse({ res, statusCode: 201, message: 'Document access granted', data: grant });
    } catch (error) {
      next(error);
    }
  }

  static async revokeAccess(req: Request, res: Response, next: NextFunction) {
    try {
      await SecurityService.revokeAccess(req.params.grantId as string);
      return sendResponse({ res, message: 'Access grant revoked' });
    } catch (error) {
      next(error);
    }
  }

  static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const logs = await SecurityService.getAuditLogs(req.params.id as string);
      return sendResponse({ res, message: 'Document audit logs retrieved', data: logs });
    } catch (error) {
      next(error);
    }
  }
}
