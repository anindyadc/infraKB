import { Request, Response } from 'express';
import { CategoriesService } from './categories.service.js';

export class CategoriesController {
  static async getAll(req: Request, res: Response) {
    const categories = await CategoriesService.getAll();
    return res.json({ success: true, data: categories });
  }

  static async create(req: Request, res: Response) {
    try {
      const category = await CategoriesService.create(req.body);
      return res.status(201).json({ success: true, data: category });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const category = await CategoriesService.update(parseInt(req.params.id), req.body);
      return res.json({ success: true, data: category });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      await CategoriesService.delete(parseInt(req.params.id));
      return res.json({ success: true, data: { deleted: true } });
    } catch (error: any) {
      const status = error.message === 'CATEGORY_HAS_CHILDREN' ? 409 : 400;
      return res.status(status).json({ success: false, error: { code: error.message, message: error.message } });
    }
  }
}
