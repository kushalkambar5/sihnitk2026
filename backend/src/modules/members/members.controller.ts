import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { shopMembers, users } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class MembersService {
  static async addMember(shopId: string, email: string, role: any) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new ApiError(404, 'User with this email was not found');
    }

    const existingMember = await db.query.shopMembers.findFirst({
      where: and(
        eq(shopMembers.shopId, shopId),
        eq(shopMembers.userId, user.id)
      ),
    });

    if (existingMember) {
      throw new ApiError(400, 'User is already a member of this shop');
    }

    const [member] = await db
      .insert(shopMembers)
      .values({
        shopId,
        userId: user.id,
        role: role || 'STAFF',
      })
      .returning();

    return member;
  }

  static async getMembers(shopId: string) {
    const membersList = await db.query.shopMembers.findMany({
      where: eq(shopMembers.shopId, shopId),
    });

    // Populate user info
    const populated = await Promise.all(
      membersList.map(async (m) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, m.userId),
        });
        return {
          ...m,
          user: user ? { id: user.id, name: user.name, email: user.email, phone: user.phone } : null,
        };
      })
    );

    return populated;
  }

  static async updateMember(shopId: string, memberId: string, data: { role?: any; isActive?: boolean }) {
    const [updated] = await db
      .update(shopMembers)
      .set({ ...data })
      .where(and(eq(shopMembers.id, memberId), eq(shopMembers.shopId, shopId)))
      .returning();

    if (!updated) {
      throw new ApiError(404, 'Member not found');
    }

    return updated;
  }

  static async removeMember(shopId: string, memberId: string) {
    await db
      .delete(shopMembers)
      .where(and(eq(shopMembers.id, memberId), eq(shopMembers.shopId, shopId)));
  }
}

export class MembersController {
  static async addMember(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, role } = req.body;
      const member = await MembersService.addMember(req.params.shopId as string, email, role);
      return sendResponse({ res, statusCode: 201, message: 'Member added to shop', data: member });
    } catch (error) {
      next(error);
    }
  }

  static async getMembers(req: Request, res: Response, next: NextFunction) {
    try {
      const members = await MembersService.getMembers(req.params.shopId as string);
      return sendResponse({ res, message: 'Shop members retrieved', data: members });
    } catch (error) {
      next(error);
    }
  }

  static async updateMember(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await MembersService.updateMember(req.params.shopId as string, req.params.memberId as string, req.body);
      return sendResponse({ res, message: 'Shop member updated', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async removeMember(req: Request, res: Response, next: NextFunction) {
    try {
      await MembersService.removeMember(req.params.shopId as string, req.params.memberId as string);
      return sendResponse({ res, message: 'Shop member removed' });
    } catch (error) {
      next(error);
    }
  }
}
