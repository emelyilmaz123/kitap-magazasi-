const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Yaprak Dökümü çiftini sil (toplumsal kategorideki eski olanı)
  await prisma.kitap.delete({ where: { id: 12 } });
  console.log('✅ Yaprak Dökümü çifti silindi (id:12)');

  // Son Arzu - yanlış kapak, null yap
  await prisma.kitap.update({ where: { id: 23 }, data: { resim: null } });
  console.log('✅ Son Arzu kapağı temizlendi');

  // Ankara - yanlış kapak, null yap
  await prisma.kitap.update({ where: { id: 29 }, data: { resim: null } });
  console.log('✅ Ankara kapağı temizlendi');
}

main().catch(console.error).finally(() => prisma.$disconnect());
