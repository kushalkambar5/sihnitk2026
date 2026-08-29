import { Router } from 'express';
import { SecurityController } from './security.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const grantSchema = z.object({
  targetUserId: z.string().uuid(),
  accessType: z.enum(['VIEW', 'DOWNLOAD', 'PRINT', 'EDIT']),
});

router.use(authenticate);

router.post('/documents/:id/access', validate(grantSchema), SecurityController.grantAccess);
router.delete('/document-access/:grantId', SecurityController.revokeAccess);
router.get('/documents/:id/audit-logs', SecurityController.getAuditLogs);

export default router;
