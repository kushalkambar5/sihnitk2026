import { Router } from 'express';
import { PrintersController } from './printers.controller.js';
import { authenticate, authenticatePrinterAgent } from '../../middleware/authenticate.js';
import { authorizeShopAccess } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router();

const addPrinterSchema = z.object({
  name: z.string().min(2),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  printerType: z.enum(['LASER', 'INKJET', 'THERMAL', 'THREE_D']),
  connectionType: z.enum(['USB', 'WIFI', 'ETHERNET', 'BLUETOOTH']),
});

const capabilitySchema = z.object({
  capabilityType: z.enum([
    'BLACK_WHITE_PRINTING',
    'COLOR_PRINTING',
    'DOUBLE_SIDED_PRINTING',
    'A3_PRINTING',
    'PHOTO_PRINTING',
  ]),
  isSupported: z.boolean().optional(),
});

const healthSchema = z.object({
  printerId: z.string().uuid(),
  status: z.enum(['ONLINE', 'OFFLINE', 'BUSY', 'ERROR', 'MAINTENANCE']),
  paperLevel: z.number().min(0).max(100).optional(),
  inkLevel: z.number().min(0).max(100).optional(),
  errorCode: z.string().optional(),
  errorMessage: z.string().optional(),
});

// Shop printers CRUD
router.get('/shops/:id/printers', PrintersController.getShopPrinters);
router.post('/shops/:id/printers', authenticate, authorizeShopAccess('id'), validate(addPrinterSchema), PrintersController.addPrinter);
router.get('/printers/:id', PrintersController.getPrinter);
router.patch('/printers/:id', authenticate, PrintersController.updatePrinter);
router.delete('/printers/:id', authenticate, PrintersController.deletePrinter);

// Printer capabilities
router.post('/printers/:id/capabilities', authenticate, validate(capabilitySchema), PrintersController.addCapability);
router.get('/printers/:id/capabilities', PrintersController.getCapabilities);

// Hardware Printer Agent API
router.post('/printer-agent/register', authenticate, PrintersController.registerAgent);
router.post('/printer-agent/health', validate(healthSchema), PrintersController.reportHealth);
router.get('/printer-agent/printers/:id/jobs/next', PrintersController.getNextJob);

export default router;
