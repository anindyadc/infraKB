import { Request, Response } from 'express';
import { UsersService } from './users.service.js';
import { AuthRequest } from '../../middleware/auth.js';

export class UsersController {
  static async getAll(req: Request, res: Response) {
    const result = await UsersService.getAll(req.query);
    return res.json({ success: true, data: result.users, pagination: result.pagination });
  }

  static async update(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    if (id === req.user!.id && req.body.role) {
      return res.status(403).json({ success: false, error: { code: 'CANNOT_DEMOTE_SELF', message: 'Admin cannot change their own role' } });
    }
    try {
      const user = await UsersService.update(id, req.body);
      return res.json({ success: true, data: user });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    const id = parseInt(req.params.id);
    if (id === req.user!.id) {
      return res.status(403).json({ success: false, error: { code: 'CANNOT_DELETE_SELF', message: 'Admin cannot delete themselves' } });
    }
    try {
      await UsersService.delete(id);
      return res.json({ success: true, data: { deleted: true } });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }
}
