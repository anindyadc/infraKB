import { Router } from 'express';
import { UsersController } from './users.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), UsersController.getAll);
router.put('/:id', authenticate, authorize(['ADMIN']), UsersController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), UsersController.delete);

export default router;
