import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { users } from '../../db/schema.js';
import { eq } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class UsersService {
  static async getProfile(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const { passwordHash: _, ...result } = user;
    return result;
  }

  static async updateProfile(userId: string, data: { name?: string; phone?: string }) {
    const [updated] = await db
      .update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    const { passwordHash: _, ...result } = updated;
    return result;
  }

  static async deleteAccount(userId: string) {
    await db.delete(users).where(eq(users.id, userId));
  }
}

export class UsersController {
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UsersService.getProfile(req.user!.userId);
      return sendResponse({ res, message: 'User profile fetched successfully', data: user });
    } catch (error) {
      next(error);
    }
  }

  static async updateMe(req: Request, res: Response, next: NextFunction) {
    try {
      const updated = await UsersService.updateProfile(req.user!.userId, req.body);
      return sendResponse({ res, message: 'Profile updated successfully', data: updated });
    } catch (error) {
      next(error);
    }
  }

  static async deleteMe(req: Request, res: Response, next: NextFunction) {
    try {
      await UsersService.deleteAccount(req.user!.userId);
      return sendResponse({ res, message: 'User account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}
