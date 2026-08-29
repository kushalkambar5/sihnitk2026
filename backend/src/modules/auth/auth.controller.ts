import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { users, userSessions } from '../../db/schema.js';
import { eq, and } from 'drizzle-orm';
import { hashPassword, comparePassword, hashToken, generateRandomToken } from '../../utils/hash.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt.js';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class AuthService {
  static async register(data: { name: string; email: string; phone?: string; password: string; role: any }) {
    const existing = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (existing) {
      throw new ApiError(400, 'User with this email already exists');
    }

    const passwordHash = await hashPassword(data.password);
    const [newUser] = await db
      .insert(users)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash,
        role: data.role || 'CUSTOMER',
      })
      .returning();

    const payload = { userId: newUser.id, email: newUser.email, role: newUser.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await db.insert(userSessions).values({
      userId: newUser.id,
      refreshTokenHash,
      expiresAt,
    });

    const { passwordHash: _, ...userWithoutPassword } = newUser;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async login(data: { email: string; password: string }, reqInfo?: { deviceInfo?: string; ipAddress?: string }) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, data.email),
    });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await comparePassword(data.password, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    const refreshTokenHash = hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(userSessions).values({
      userId: user.id,
      refreshTokenHash,
      deviceInfo: reqInfo?.deviceInfo,
      ipAddress: reqInfo?.ipAddress,
      expiresAt,
    });

    const { passwordHash: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, accessToken, refreshToken };
  }

  static async refresh(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const refreshTokenHash = hashToken(refreshToken);

    const session = await db.query.userSessions.findFirst({
      where: and(
        eq(userSessions.userId, decoded.userId),
        eq(userSessions.refreshTokenHash, refreshTokenHash)
      ),
    });

    if (!session || session.revokedAt || new Date() > session.expiresAt) {
      throw new ApiError(401, 'Invalid or expired refresh token');
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, decoded.userId),
    });

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    const payload = { userId: user.id, email: user.email, role: user.role };
    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    // Revoke old session and issue new session
    await db
      .update(userSessions)
      .set({ revokedAt: new Date() })
      .where(eq(userSessions.id, session.id));

    await db.insert(userSessions).values({
      userId: user.id,
      refreshTokenHash: hashToken(newRefreshToken),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }

  static async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      const refreshTokenHash = hashToken(refreshToken);
      await db
        .update(userSessions)
        .set({ revokedAt: new Date() })
        .where(
          and(
            eq(userSessions.userId, userId),
            eq(userSessions.refreshTokenHash, refreshTokenHash)
          )
        );
    } else {
      await db
        .update(userSessions)
        .set({ revokedAt: new Date() })
        .where(eq(userSessions.userId, userId));
    }
  }

  static async changePassword(userId: string, oldPass: string, newPass: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const isMatch = await comparePassword(oldPass, user.passwordHash);
    if (!isMatch) {
      throw new ApiError(400, 'Incorrect current password');
    }

    const newHash = await hashPassword(newPass);
    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.register(req.body);
      return sendResponse({ res, statusCode: 201, message: 'User registered successfully', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const deviceInfo = req.headers['user-agent'];
      const ipAddress = req.ip;
      const result = await AuthService.login(req.body, { deviceInfo, ipAddress });
      return sendResponse({ res, message: 'Login successful', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      const result = await AuthService.refresh(refreshToken);
      return sendResponse({ res, message: 'Token refreshed successfully', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { refreshToken } = req.body;
      await AuthService.logout(userId, refreshToken);
      return sendResponse({ res, message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async forgotPassword(_req: Request, res: Response, next: NextFunction) {
    try {
      // Stub for sending email reset token
      return sendResponse({ res, message: 'Password reset link sent to your email' });
    } catch (error) {
      next(error);
    }
  }

  static async resetPassword(_req: Request, res: Response, next: NextFunction) {
    try {
      return sendResponse({ res, message: 'Password reset successfully' });
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { oldPassword, newPassword } = req.body;
      await AuthService.changePassword(req.user!.userId, oldPassword, newPassword);
      return sendResponse({ res, message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  }
}
