import { Request, Response, NextFunction } from 'express';
import { db } from '../../db/index.js';
import { aiConversations, aiMessages, aiGeneratedOutputs } from '../../db/schema.js';
import { eq, and, desc } from 'drizzle-orm';
import { ApiError } from '../../utils/apiError.js';
import { sendResponse } from '../../utils/apiResponse.js';

export class AiService {
  static async createConversation(userId: string, title?: string) {
    const [conv] = await db
      .insert(aiConversations)
      .values({
        userId,
        title: title || 'New AI Document Assistance Session',
      })
      .returning();
    return conv;
  }

  static async getUserConversations(userId: string) {
    return db.query.aiConversations.findMany({
      where: eq(aiConversations.userId, userId),
      orderBy: [desc(aiConversations.createdAt)],
    });
  }

  static async getConversationById(userId: string, conversationId: string) {
    const conv = await db.query.aiConversations.findFirst({
      where: and(eq(aiConversations.id, conversationId), eq(aiConversations.userId, userId)),
    });

    if (!conv) {
      throw new ApiError(404, 'AI Conversation not found');
    }

    const messages = await db.query.aiMessages.findMany({
      where: eq(aiMessages.conversationId, conversationId),
      orderBy: (msgs, { asc }) => [asc(msgs.createdAt)],
    });

    return { ...conv, messages };
  }

  static async sendMessage(userId: string, conversationId: string, content: string) {
    const conv = await this.getConversationById(userId, conversationId);

    // 1. Save user message
    const [userMsg] = await db
      .insert(aiMessages)
      .values({
        conversationId,
        role: 'USER',
        content,
      })
      .returning();

    // 2. Simulate AI response logic (e.g. intent detection for document generation)
    let aiResponseText = `I understand you need assistance with: "${content}". I can help generate or format your campus document.`;
    if (content.toLowerCase().includes('leave')) {
      aiResponseText = `I can help you draft a formal Leave Application for your department. Please provide your USN/Roll No., Leave dates, and Reason.`;
    } else if (content.toLowerCase().includes('resume')) {
      aiResponseText = `I will help optimize your Resume format according to campus placement standards.`;
    }

    // 3. Save assistant message
    const [assistantMsg] = await db
      .insert(aiMessages)
      .values({
        conversationId,
        role: 'ASSISTANT',
        content: aiResponseText,
      })
      .returning();

    return {
      userMessage: userMsg,
      assistantMessage: assistantMsg,
    };
  }

  static async deleteConversation(userId: string, conversationId: string) {
    await db
      .delete(aiConversations)
      .where(and(eq(aiConversations.id, conversationId), eq(aiConversations.userId, userId)));
  }
}

export class AiController {
  static async createConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conv = await AiService.createConversation(req.user!.userId, req.body.title);
      return sendResponse({ res, statusCode: 201, message: 'AI session started', data: conv });
    } catch (error) {
      next(error);
    }
  }

  static async getConversations(req: Request, res: Response, next: NextFunction) {
    try {
      const list = await AiService.getUserConversations(req.user!.userId);
      return sendResponse({ res, message: 'AI conversations retrieved', data: list });
    } catch (error) {
      next(error);
    }
  }

  static async getConversation(req: Request, res: Response, next: NextFunction) {
    try {
      const conv = await AiService.getConversationById(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'AI conversation details retrieved', data: conv });
    } catch (error) {
      next(error);
    }
  }

  static async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AiService.sendMessage(req.user!.userId, req.params.id as string, req.body.content);
      return sendResponse({ res, message: 'AI message processed', data: result });
    } catch (error) {
      next(error);
    }
  }

  static async deleteConversation(req: Request, res: Response, next: NextFunction) {
    try {
      await AiService.deleteConversation(req.user!.userId, req.params.id as string);
      return sendResponse({ res, message: 'AI conversation deleted' });
    } catch (error) {
      next(error);
    }
  }
}
