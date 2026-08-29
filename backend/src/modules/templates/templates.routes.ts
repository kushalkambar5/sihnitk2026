import { Router } from 'express';
import { TemplatesController } from './templates.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorize } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const createTemplateSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  category: z.enum(['RESUME', 'LETTER', 'CERTIFICATE', 'ASSIGNMENT', 'REPORT', 'FORM', 'OTHER']),
  templateDefinition: z.record(z.string(), z.any()).optional(),
});

const generateSchema = z.object({
  inputData: z.record(z.string(), z.any()),
});

router.get('/templates', TemplatesController.listTemplates);
router.get('/templates/:id', TemplatesController.getTemplate);

router.post('/templates', authenticate, authorize(['ADMIN']), validate(createTemplateSchema), TemplatesController.createTemplate);
router.patch('/templates/:id', authenticate, authorize(['ADMIN']), TemplatesController.updateTemplate);
router.delete('/templates/:id', authenticate, authorize(['ADMIN']), TemplatesController.deleteTemplate);

router.post('/templates/:id/generate', authenticate, validate(generateSchema), TemplatesController.generate);

export default router;
