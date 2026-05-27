import { Router } from 'express';
import { CategoriesController } from './categories.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router();

router.get('/', authenticate, CategoriesController.getAll);
router.post('/', authenticate, authorize(['ADMIN']), CategoriesController.create);
router.put('/:id', authenticate, authorize(['ADMIN']), CategoriesController.update);
router.delete('/:id', authenticate, authorize(['ADMIN']), CategoriesController.delete);

export default router;
