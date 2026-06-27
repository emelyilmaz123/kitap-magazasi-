const { PrismaClient } = require('@prisma/client');
const https = require('https');

const prisma = new PrismaClient();

function ara(baslik, yazar) {
  return new Promise((resolve) => {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(baslik)}&author=${encodeURIComponent(yazar)}&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'KitapMagazasi/1.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const coverId = json.docs?.[0]?.cover_i;
          resolve(coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function bekle(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const kitaplar = await prisma.kitap.findMany();

  for (const kitap of kitaplar) {
    const url = await ara(kitap.baslik, kitap.yazar);
    if (url) {
      await prisma.kitap.update({ where: { id: kitap.id }, data: { resim: url } });
      console.log(`✅ ${kitap.baslik} → görsel bulundu`);
    } else {
      console.log(`❌ ${kitap.baslik} → görsel bulunamadı`);
    }
    await bekle(500);
  }
  console.log('\nTamamlandı!');
}

main().finally(() => prisma.$disconnect());
