const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.kitap.updateMany({
    where: { baslik: { contains: 'Sabahattin Ali' } },
    data: { resim: 'https://covers.openlibrary.org/b/id/12275204-L.jpg' }
  });
  console.log('Sabahattin Ali güncellendi');

  await prisma.kitap.updateMany({
    where: { baslik: 'Huzur' },
    data: { resim: 'https://covers.openlibrary.org/b/id/8739161-L.jpg' }
  });
  console.log('Huzur güncellendi');

  await prisma.kitap.updateMany({
    where: { baslik: { contains: 'Yaprak' } },
    data: { resim: 'https://covers.openlibrary.org/b/id/9255494-L.jpg' }
  });
  console.log('Yaprak Dökümü güncellendi');

  await prisma.kitap.updateMany({
    where: { baslik: { contains: 'Teredd' } },
    data: { resim: 'https://covers.openlibrary.org/b/id/8090379-L.jpg' }
  });
  console.log('Bir Tereddüdün Romanı güncellendi');

  console.log('Tamamlandı!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
