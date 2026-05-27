import { prisma } from '../../lib/prisma.js';

export class SearchService {
  static async search(query: string, filters: any) {
    const { category, tag, status = 'PUBLISHED', page = 1, limit = 20 } = filters;
    const pLimit = Math.min(parseInt(limit), 50);
    const pPage = Math.max(parseInt(page), 1);

    const where: any = {
      status,
    };

    if (query.length >= 4) {
      where.OR = [
        { title: { search: query } },
        { content: { search: query } },
      ];
    } else {
      where.OR = [
        { title: { contains: query } },
      ];
    }

    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };

    const [docs, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          category: { select: { name: true, slug: true } },
          tags: { include: { tag: { select: { name: true } } } },
        },
        skip: (pPage - 1) * pLimit,
        take: pLimit,
      }),
      prisma.document.count({ where }),
    ]);

    // Simple highlighting for the excerpt
    const docsWithHighlight = docs.map(doc => {
      const regex = new RegExp(`(${query})`, 'gi');
      return {
        ...doc,
        highlightedExcerpt: doc.excerpt?.replace(regex, '<mark>$1</mark>') || ''
      };
    });

    return { 
      docs: docsWithHighlight, 
      pagination: { page: pPage, limit: pLimit, total, pages: Math.ceil(total / pLimit) },
      query
    };
  }

  static async suggest(query: string) {
    if (!query) return [];
    return prisma.document.findMany({
      where: {
        status: 'PUBLISHED',
        title: { contains: query },
      },
      select: {
        id: true,
        title: true,
        slug: true,
        category: { select: { name: true } },
      },
      take: 8,
    });
  }
}
