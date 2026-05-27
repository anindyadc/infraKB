import { Router } from 'express';
import { StatsController } from './stats.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router();

router.get('/', authenticate, authorize(['ADMIN']), StatsController.getStats);

export default router;
