import { z } from 'zod';

export const createDocSchema = z.object({
  title: z.string().min(3).max(300),
  content: z.string().min(10).max(500000),
  categoryId: z.number().int().optional().nullable(),
  osEnv: z.string().max(150).optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('PUBLISHED'),
  tags: z.array(z.string().min(1).max(60)).max(20).optional(),
  isPinned: z.boolean().default(false),
});

export const updateDocSchema = createDocSchema.partial().extend({
  changeSummary: z.string().max(255).optional(),
});
