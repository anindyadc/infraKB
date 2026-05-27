import { prisma } from '../../lib/prisma.js';
import slugify from 'slugify';

export class DocsService {
  static async getAll(filters: any) {
    const { page = 1, limit = 20, category, tag, author, status = 'PUBLISHED', pinned, sort = 'updatedAt', order = 'desc' } = filters;
    const pLimit = Math.min(parseInt(limit), 100);
    const pPage = Math.max(parseInt(page), 1);

    const where: any = { status };
    if (category) where.category = { slug: category };
    if (tag) where.tags = { some: { tag: { slug: tag } } };
    if (author) where.authorId = parseInt(author);
    if (pinned !== undefined) where.isPinned = pinned === 'true';

    const [docs, total] = await Promise.all([
      prisma.document.findMany({
        where,
        include: {
          category: true,
          author: { select: { id: true, username: true, displayName: true } },
          tags: { include: { tag: true } },
        },
        orderBy: { [sort]: order },
        skip: (pPage - 1) * pLimit,
        take: pLimit,
      }),
      prisma.document.count({ where }),
    ]);

    return { 
      docs, 
      pagination: { 
        page: pPage, 
        limit: pLimit, 
        total, 
        pages: Math.ceil(total / pLimit) 
      } 
    };
  }

  static async getByIdOrSlug(idOrSlug: string, userRole: string, userId: number) {
    const isId = !isNaN(parseInt(idOrSlug));
    const doc = await prisma.document.findUnique({
      where: isId ? { id: parseInt(idOrSlug) } : { slug: idOrSlug },
      include: {
        category: true,
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        attachments: true,
      },
    });

    if (!doc) return null;

    if (doc.status === 'DRAFT' && userRole === 'VIEWER' && doc.authorId !== userId) {
      throw new Error('DOC_IS_DRAFT');
    }

    // Increment view count and return the updated document
    return prisma.document.update({
      where: { id: doc.id },
      data: { viewCount: { increment: 1 } },
      include: {
        category: true,
        author: { select: { id: true, username: true, displayName: true, avatarUrl: true } },
        tags: { include: { tag: true } },
        attachments: true,
      },
    });
  }

  static async create(data: any, authorId: number) {
    const slug = await this.generateSlug(data.title);
    const excerpt = this.generateExcerpt(data.content);
    
    const { tags, ...docData } = data;

    return prisma.document.create({
      data: {
        ...docData,
        slug,
        excerpt,
        authorId,
        tags: {
          create: tags ? await this.getOrCreateTags(tags) : [],
        },
      },
      include: {
        category: true,
        author: { select: { id: true, username: true, displayName: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  static async update(id: number, data: any, userId: number, userRole: string) {
    const currentDoc = await prisma.document.findUnique({ where: { id } });
    if (!currentDoc) throw new Error('DOC_NOT_FOUND');

    if (userRole !== 'ADMIN' && currentDoc.authorId !== userId) {
      throw new Error('INSUFFICIENT_PERMISSIONS');
    }

    // Create version snapshot before update
    await prisma.docVersion.create({
      data: {
        docId: id,
        content: currentDoc.content,
        title: currentDoc.title,
        editedBy: userId,
        changeSummary: data.changeSummary || null,
      },
    });

    const { tags, changeSummary, ...docData } = data;
    const updatePayload: any = { ...docData };

    if (data.title && data.title !== currentDoc.title) {
      updatePayload.slug = await this.generateSlug(data.title);
    }

    if (data.content) {
      updatePayload.excerpt = this.generateExcerpt(data.content);
    }

    if (tags) {
      await prisma.docTag.deleteMany({ where: { docId: id } });
      updatePayload.tags = {
        create: await this.getOrCreateTags(tags),
      };
    }

    return prisma.document.update({
      where: { id },
      data: updatePayload,
      include: {
        category: true,
        author: { select: { id: true, username: true, displayName: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  static async delete(id: number, userId: number, userRole: string) {
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) throw new Error('DOC_NOT_FOUND');

    if (userRole !== 'ADMIN' && doc.authorId !== userId) {
      throw new Error('INSUFFICIENT_PERMISSIONS');
    }

    return prisma.document.delete({ where: { id } });
  }

  private static async generateSlug(title: string) {
    const baseSlug = slugify.default(title, { lower: true, strict: true });
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.document.findUnique({ where: { slug } })) {
      counter++;
      slug = `${baseSlug}-${counter}`;
    }
    return slug;
  }

  private static generateExcerpt(content: string) {
    const plainText = content
      .replace(/[#*`>\[\]!]/g, '')
      .replace(/\n/g, ' ')
      .trim();
    return plainText.substring(0, 500);
  }

  private static async getOrCreateTags(tagNames: string[]) {
    const tagMappings = [];
    for (const name of tagNames) {
      const slug = slugify.default(name, { lower: true, strict: true });
      const tag = await prisma.tag.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
      tagMappings.push({ tagId: tag.id });
    }
    return tagMappings;
  }
}
