const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Çalıkuşu kapağını Son Arzu'ya ver (aynı yazar)
  const calikusu = await prisma.kitap.findFirst({ where: { baslik: 'Çalıkuşu' } });
  if (calikusu?.resim) {
    await prisma.kitap.updateMany({ where: { baslik: 'Son Arzu' }, data: { resim: calikusu.resim } });
    console.log('✅ Son Arzu güncellendi');
  }

  // Kiralık Konak kapağını Ankara'ya ver (aynı yazar)
  const konak = await prisma.kitap.findFirst({ where: { baslik: 'Kiralık Konak' } });
  if (konak?.resim) {
    await prisma.kitap.updateMany({ where: { baslik: 'Ankara' }, data: { resim: konak.resim } });
    console.log('✅ Ankara güncellendi');
  }

  console.log('Tamamlandı!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
