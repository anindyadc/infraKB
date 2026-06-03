import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function exportData() {
  console.log('Connecting to local MySQL database...');
  const docs = await prisma.document.findMany({
    include: {
      category: true,
      tags: { include: { tag: true } }
    }
  });

  if (docs.length === 0) {
    console.log('No documents found to export.');
    process.exit(0);
  }

  const exportDir = path.join(__dirname, 'exported_runbooks');
  if (!fs.existsSync(exportDir)) {
    fs.mkdirSync(exportDir);
  }

  console.log(`Exporting ${docs.length} documents...`);

  for (const doc of docs) {
    let catFolder = 'Uncategorized';
    if (doc.category) {
      catFolder = doc.category.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }
    
    const targetDir = path.join(exportDir, catFolder);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const safeTitle = doc.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(targetDir, `${safeTitle}.md`);
    
    fs.writeFileSync(filePath, doc.content);
    console.log(`Exported: ${catFolder}/${safeTitle}.md`);
  }

  console.log(`\n✅ Export complete! All your documents have been saved as Markdown files in: ${exportDir}`);
  console.log('You can now log into your live Supabase app and use the "Bulk Import Mode" in the Admin Panel to upload these folders.');
}

exportData().catch(console.error).finally(() => prisma.$disconnect());
