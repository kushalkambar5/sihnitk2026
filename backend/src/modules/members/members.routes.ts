import { Router } from 'express';
import { MembersController } from './members.controller.js';
import { authenticate } from '../../middleware/authenticate.js';
import { authorizeShopAccess } from '../../middleware/authorize.js';
import { validate } from '../../middleware/validate.js';
import { z } from 'zod';

const router = Router({ mergeParams: true });

const addMemberSchema = z.object({
  email: z.string().email(),
  role: z.enum(['OWNER', 'MANAGER', 'OPERATOR', 'STAFF']).optional(),
});

const updateMemberSchema = z.object({
  role: z.enum(['OWNER', 'MANAGER', 'OPERATOR', 'STAFF']).optional(),
  isActive: z.boolean().optional(),
});

router.use(authenticate);

router.post('/', authorizeShopAccess('id'), validate(addMemberSchema), MembersController.addMember);
router.get('/', authorizeShopAccess('id'), MembersController.getMembers);
router.patch('/:memberId', authorizeShopAccess('id'), validate(updateMemberSchema), MembersController.updateMember);
router.delete('/:memberId', authorizeShopAccess('id'), MembersController.removeMember);

export default router;
