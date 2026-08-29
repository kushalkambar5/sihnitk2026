import { Router } from 'express';
import { DocumentsController } from './documents.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { uploadMiddleware } from '../../config/storage.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const mergeSchema = z.object({
  documentIds: z.array(z.string().uuid()).min(2),
  name: z.string().optional(),
});

router.use(authenticate);

router.post('/upload', uploadMiddleware.single('file'), DocumentsController.upload);
router.get('/', DocumentsController.getUserDocuments);
router.get('/:id', DocumentsController.getDocument);
router.get('/:id/download', DocumentsController.getDownloadUrl);
router.delete('/:id', DocumentsController.deleteDocument);

router.post('/:id/versions', uploadMiddleware.single('file'), DocumentsController.addVersion);

// Editing operations
router.post('/:id/edit', DocumentsController.editDocument);
router.post('/merge', validate(mergeSchema), DocumentsController.mergeDocuments);

export default router;
