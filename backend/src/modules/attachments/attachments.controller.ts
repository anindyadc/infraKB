import { Request, Response } from 'express';
import { AttachmentsService } from './attachments.service.js';
import { AuthRequest } from '../../middleware/auth.js';

export class AttachmentsController {
  static async upload(req: AuthRequest, res: Response) {
    if (!req.file) {
      return res.status(400).json({ success: false, error: { message: 'No file uploaded' } });
    }

    try {
      const docId = parseInt(req.body.docId);
      const attachment = await AttachmentsService.upload(req.file, docId, req.user!.id);
      
      return res.status(201).json({
        success: true,
        data: {
          ...attachment,
          markdownEmbed: `![${attachment.filename}](${attachment.url})`
        }
      });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async getFile(req: Request, res: Response) {
    try {
      const result = await AttachmentsService.getFile(req.params.filename);
      if (!result) {
        return res.status(404).json({ success: false, error: { message: 'File not found' } });
      }
      return res.sendFile(result.filePath);
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      await AttachmentsService.delete(parseInt(req.params.id), req.user!.id, req.user!.role);
      return res.json({ success: true, data: { deleted: true } });
    } catch (error: any) {
      return res.status(400).json({ success: false, error: { message: error.message } });
    }
  }
}
