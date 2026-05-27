import { Router } from 'express';
import { SearchController } from './search.controller.js';
import { authenticate } from '../../middleware/auth.js';

const router = Router();

router.get('/', authenticate, SearchController.search);
router.get('/suggest', authenticate, SearchController.suggest);

export default router;
