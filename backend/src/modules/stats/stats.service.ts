import { prisma } from '../../lib/prisma.js';

export class StatsService {
  static async getDashboardStats() {
    const [
      totalDocs,
      publishedDocs,
      draftDocs,
      archivedDocs,
      totalCategories,
      totalTags,
      totalUsers,
      totalAttachments,
      recentDocs,
      topViewedDocs,
    ] = await Promise.all([
      prisma.document.count(),
      prisma.document.count({ where: { status: 'PUBLISHED' } }),
      prisma.document.count({ where: { status: 'DRAFT' } }),
      prisma.document.count({ where: { status: 'ARCHIVED' } }),
      prisma.category.count(),
      prisma.tag.count(),
      prisma.user.count(),
      prisma.attachment.count(),
      prisma.document.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, updatedAt: true, slug: true },
      }),
      prisma.document.findMany({
        orderBy: { viewCount: 'desc' },
        take: 5,
        select: { id: true, title: true, viewCount: true, slug: true },
      }),
    ]);

    return {
      totalDocs,
      publishedDocs,
      draftDocs,
      archivedDocs,
      totalCategories,
      totalTags,
      totalUsers,
      totalAttachments,
      recentDocs,
      topViewedDocs,
    };
  }
}
