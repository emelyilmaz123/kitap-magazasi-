const { PrismaClient } = require('@prisma/client');
const https = require('https');
const prisma = new PrismaClient();

function gorselAra(baslik, yazar) {
  return new Promise((resolve) => {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(baslik + ' ' + yazar)}&limit=5`;
    https.get(url, { headers: { 'User-Agent': 'KitapMagazasi/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const docWithCover = json.docs?.find(d => d.cover_i);
          resolve(docWithCover ? `https://covers.openlibrary.org/b/id/${docWithCover.cover_i}-L.jpg` : null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function bekle(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const kitaplar = await prisma.kitap.findMany({ where: { resim: null } });
  console.log(`${kitaplar.length} kitap için görsel aranıyor...\n`);

  for (const kitap of kitaplar) {
    const resim = await gorselAra(kitap.baslik, kitap.yazar);
    if (resim) {
      await prisma.kitap.update({ where: { id: kitap.id }, data: { resim } });
      console.log(`✅ ${kitap.baslik}`);
    } else {
      console.log(`❌ ${kitap.baslik} → görsel bulunamadı`);
    }
    await bekle(400);
  }
  console.log('\nTamamlandı!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
