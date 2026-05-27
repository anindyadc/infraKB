import { Request, Response } from 'express';
import { StatsService } from './stats.service.js';

export class StatsController {
  static async getStats(req: Request, res: Response) {
    const stats = await StatsService.getDashboardStats();
    return res.json({ success: true, data: stats });
  }
}
