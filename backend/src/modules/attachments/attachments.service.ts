import { prisma } from '../../lib/prisma.js';
import fs from 'fs/promises';
import path from 'path';
import { env } from '../../config/env.js';

export class AttachmentsService {
  static async upload(file: Express.Multer.File, docId: number, userId: number) {
    const doc = await prisma.document.findUnique({ where: { id: docId } });
    if (!doc) throw new Error('DOC_NOT_FOUND');

    const attachment = await prisma.attachment.create({
      data: {
        docId,
        filename: file.originalname,
        storedName: file.filename,
        mimeType: file.mimetype,
        sizeBytes: file.size,
        url: `/api/v1/attachments/${file.filename}/file`,
        uploadedBy: userId,
      },
    });

    return attachment;
  }

  static async getFile(filename: string) {
    const attachment = await prisma.attachment.findFirst({
      where: { storedName: filename }
    });
    if (!attachment) return null;

    const filePath = path.resolve(env.UPLOAD_DIR, filename);
    return { filePath, mimeType: attachment.mimeType };
  }

  static async delete(id: number, userId: number, userRole: string) {
    const attachment = await prisma.attachment.findUnique({ where: { id } });
    if (!attachment) throw new Error('ATTACHMENT_NOT_FOUND');

    if (userRole !== 'ADMIN' && attachment.uploadedBy !== userId) {
      throw new Error('INSUFFICIENT_PERMISSIONS');
    }

    const filePath = path.resolve(env.UPLOAD_DIR, attachment.storedName);
    await fs.unlink(filePath).catch(() => {});
    
    return prisma.attachment.delete({ where: { id } });
  }
}
