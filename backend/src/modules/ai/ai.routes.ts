import { Router } from 'express';
import { AiController } from './ai.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const createConvSchema = z.object({
  title: z.string().optional(),
});

const msgSchema = z.object({
  content: z.string().min(1),
});

router.use(authenticate);

router.post('/ai/conversations', validate(createConvSchema), AiController.createConversation);
router.get('/ai/conversations', AiController.getConversations);
router.get('/ai/conversations/:id', AiController.getConversation);
router.post('/ai/conversations/:id/messages', validate(msgSchema), AiController.sendMessage);
router.delete('/ai/conversations/:id', AiController.deleteConversation);

export default router;
