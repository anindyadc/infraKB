import { Request, Response } from 'express';
import { SearchService } from './search.service.js';

export class SearchController {
  static async search(req: Request, res: Response) {
    const query = req.query.q as string;
    if (!query || query.length < 2) {
      return res.status(400).json({ success: false, error: { message: 'Query too short' } });
    }

    const result = await SearchService.search(query, req.query);
    return res.json({ success: true, data: result.docs, pagination: result.pagination, query: result.query });
  }

  static async suggest(req: Request, res: Response) {
    const query = req.query.q as string;
    const suggestions = await SearchService.suggest(query);
    return res.json({ success: true, data: suggestions });
  }
}
