import { Router } from 'express';
import { DocsController } from './docs.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router();

// Public routes (No authentication required)
router.get('/public/:idOrSlug', DocsController.getPublic);

router.get('/', authenticate, DocsController.getAll);
router.get('/:idOrSlug', authenticate, DocsController.getOne);
router.post('/', authenticate, authorize(['EDITOR', 'ADMIN']), DocsController.create);
router.put('/:id', authenticate, authorize(['EDITOR', 'ADMIN']), DocsController.update);
router.delete('/:id', authenticate, authorize(['EDITOR', 'ADMIN']), DocsController.delete);

export default router;
