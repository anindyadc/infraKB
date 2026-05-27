import { Request, Response } from 'express';
import { DocsService } from './docs.service.js';
import { createDocSchema, updateDocSchema } from './docs.schema.js';
import { AuthRequest } from '../../middleware/auth.js';

export class DocsController {
  static async getAll(req: AuthRequest, res: Response) {
    const result = await DocsService.getAll(req.query);
    return res.json({ success: true, ...result });
  }

  static async getOne(req: AuthRequest, res: Response) {
    try {
      const doc = await DocsService.getByIdOrSlug(req.params.idOrSlug, req.user!.role, req.user!.id);
      if (!doc) {
        return res.status(404).json({ success: false, error: { code: 'DOC_NOT_FOUND', message: 'Document not found' } });
      }
      return res.json({ success: true, data: doc });
    } catch (error: any) {
      const status = error.message === 'DOC_IS_DRAFT' ? 403 : 400;
      return res.status(status).json({ success: false, error: { code: error.message, message: error.message } });
    }
  }

  static async getPublic(req: Request, res: Response) {
    try {
      const doc = await DocsService.getPublicByIdOrSlug(req.params.idOrSlug);
      if (!doc) {
        return res.status(404).json({ success: false, error: { code: 'DOC_NOT_FOUND', message: 'Document not found or not public' } });
      }
      return res.json({ success: true, data: doc });
    } catch (error: any) {
      return res.status(404).json({ success: false, error: { code: 'DOC_NOT_FOUND', message: error.message } });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const data = createDocSchema.parse(req.body);
      const doc = await DocsService.create(data, req.user!.id);
      return res.status(201).json({ success: true, data: doc });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const data = updateDocSchema.parse(req.body);
      const doc = await DocsService.update(parseInt(req.params.id), data, req.user!.id, req.user!.role);
      return res.json({ success: true, data: doc });
    } catch (error: any) {
      const status = error.message === 'DOC_NOT_FOUND' ? 404 : (error.message === 'INSUFFICIENT_PERMISSIONS' ? 403 : 400);
      return res.status(status).json({ success: false, error: { code: error.message, message: error.message } });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      await DocsService.delete(parseInt(req.params.id), req.user!.id, req.user!.role);
      return res.json({ success: true, data: { deleted: true } });
    } catch (error: any) {
      const status = error.message === 'DOC_NOT_FOUND' ? 404 : (error.message === 'INSUFFICIENT_PERMISSIONS' ? 403 : 400);
      return res.status(status).json({ success: false, error: { message: error.message } });
    }
  }
}
