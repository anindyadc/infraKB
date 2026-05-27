import { Router } from 'express';
import { prisma } from '../../lib/prisma.js';
import { authenticate } from '../../middleware/auth.js';
import { authorize } from '../../middleware/rbac.js';

const router = Router();

router.get('/', authenticate, async (req, res) => {
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { docs: true } } },
    orderBy: { docs: { _count: 'desc' } }
  });
  return res.json({ success: true, data: tags });
});

router.delete('/:id', authenticate, authorize(['ADMIN']), async (req, res) => {
  await prisma.tag.delete({ where: { id: parseInt(req.params.id) } });
  return res.json({ success: true, data: { deleted: true } });
});

export default router;
