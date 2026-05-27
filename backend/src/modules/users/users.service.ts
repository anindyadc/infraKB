import { prisma } from '../../lib/prisma.js';

export class UsersService {
  static async getAll(filters: any) {
    const { page = 1, limit = 20, role, search } = filters;
    const pLimit = Math.min(parseInt(limit), 100);
    const pPage = Math.max(parseInt(page), 1);

    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { username: { contains: search } },
        { displayName: { contains: search } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          displayName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          _count: { select: { docs: true } },
        },
        skip: (pPage - 1) * pLimit,
        take: pLimit,
      }),
      prisma.user.count({ where }),
    ]);

    return { 
      users, 
      pagination: { page: pPage, limit: pLimit, total, pages: Math.ceil(total / pLimit) } 
    };
  }

  static async update(id: number, data: any) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
