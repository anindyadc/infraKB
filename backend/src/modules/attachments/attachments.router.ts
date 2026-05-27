import { Router } from 'express';
import { AttachmentsController } from './attachments.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { upload } from '../../middleware/upload.js';

const router = Router();

router.post('/', authenticate, upload.single('file'), AttachmentsController.upload);
router.get('/:filename/file', authenticate, AttachmentsController.getFile);
router.delete('/:id', authenticate, AttachmentsController.delete);

export default router;
