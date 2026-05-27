import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seed started...');

  // 1. Create Admin User
  const adminEmail = 'admin@infrakb.local';
  const passwordHash = await bcrypt.hash('Admin123456', 10);
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: {
      email: adminEmail,
      username: 'admin',
      passwordHash,
      displayName: 'Administrator',
      role: Role.ADMIN,
    },
  });
  console.log('Admin user ensured: admin@infrakb.local / Admin123456');

  // 2. Create Categories
  const categories = [
    { name: 'Infrastructure', slug: 'infrastructure', icon: '🏗️' },
    { name: 'Cloud', slug: 'cloud', icon: '☁️' },
    { name: 'DevOps', slug: 'devops', icon: '♾️' },
    { name: 'Security', slug: 'security', icon: '🔒' },
    { name: 'Networking', slug: 'networking', icon: '🌐' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log('Default categories created.');

  console.log('Seed finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
