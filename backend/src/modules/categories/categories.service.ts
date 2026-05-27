import { prisma } from '../../lib/prisma.js';
import slugify from 'slugify';

export class CategoriesService {
  static async getAll() {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: {
          include: {
            _count: { select: { docs: true } }
          }
        },
        _count: { select: { docs: true } }
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  static async create(data: { name: string; icon?: string; description?: string; parentId?: number; sortOrder?: number }) {
    const slug = slugify.default(data.name, { lower: true });
    return prisma.category.create({
      data: {
        ...data,
        slug,
      },
    });
  }

  static async update(id: number, data: { name?: string; icon?: string; description?: string; parentId?: number; sortOrder?: number }) {
    const updateData: any = { ...data };
    if (data.name) {
      updateData.slug = slugify.default(data.name, { lower: true });
    }
    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(id: number) {
    const category = await prisma.category.findUnique({
      where: { id },
      include: { children: true },
    });

    if (!category) {
      throw new Error('CATEGORY_NOT_FOUND');
    }

    if (category.children.length > 0) {
      throw new Error('CATEGORY_HAS_CHILDREN');
    }

    return prisma.category.delete({ where: { id } });
  }
}
