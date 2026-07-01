const { PrismaClient } = require('@prisma/client');
const https = require('https');
const prisma = new PrismaClient();

function gorselAra(baslik, yazar) {
  return new Promise((resolve) => {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(baslik)}&author=${encodeURIComponent(yazar)}&limit=3`;
    https.get(url, { headers: { 'User-Agent': 'KitapMagazasi/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const coverId = json.docs?.find(d => d.cover_i)?.cover_i;
          resolve(coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function bekle(ms) { return new Promise(r => setTimeout(r, ms)); }

const yeniKitaplar = [
  // KLASİK (id: 1)
  { baslik: 'Don Kişot', yazar: 'Miguel de Cervantes', fiyat: 140, stok: 7, aciklama: 'Gerçekle hayali karıştıran şövalye Don Kişot\'un maceraları; dünyanın ilk modern romanı.', kategoriId: 1 },
  { baslik: 'Dorian Gray\'in Portresi', yazar: 'Oscar Wilde', fiyat: 100, stok: 9, aciklama: 'Gençliğini sonsuza taşıyan bir portrenin karşılığında ruhunu yitiren bir adamın trajik hikayesi.', kategoriId: 1 },
  { baslik: 'Büyük Umutlar', yazar: 'Charles Dickens', fiyat: 115, stok: 8, aciklama: 'Yoksul bir gençten beyefendiye dönüşen Pip\'in kimlik arayışını anlatan Dickens başyapıtı.', kategoriId: 1 },
  { baslik: 'Karamazov Kardeşler', yazar: 'Fyodor Dostoyevski', fiyat: 160, stok: 6, aciklama: 'İnanç, özgür irade ve ahlaki sorumluluk temalarını işleyen Dostoyevski\'nin son büyük eseri.', kategoriId: 1 },

  // ROMANTİK (id: 2)
  { baslik: 'Simyacı', yazar: 'Paulo Coelho', fiyat: 90, stok: 12, aciklama: 'Kişisel efsanesini aramaya çıkan bir çobanın kendini bulma yolculuğu.', kategoriId: 2 },
  { baslik: 'Şeker Portakalı', yazar: 'Jose Mauro de Vasconcelos', fiyat: 85, stok: 11, aciklama: 'Zedinho\'nun masumiyeti ve acı gerçeklikle yüzleşmesini anlatan dokunaklı roman.', kategoriId: 2 },
  { baslik: 'Aşk', yazar: 'Elif Şafak', fiyat: 110, stok: 10, aciklama: 'Şems-i Tebrizi ve Rumi\'nin dostluğunu iki ayrı zaman diliminde anlatan büyüleyici roman.', kategoriId: 2 },
  { baslik: 'Vadideki Zambak', yazar: 'Honore de Balzac', fiyat: 95, stok: 7, aciklama: 'Genç bir adamın evli bir kadına duyduğu imkansız aşkı anlatan Balzac\'ın lirik şaheseri.', kategoriId: 2 },

  // TOPLUMSAL (id: 3)
  { baslik: 'Yüzyıllık Yalnızlık', yazar: 'Gabriel Garcia Marquez', fiyat: 145, stok: 7, aciklama: 'Buendia ailesinin yedi kuşak boyunca geçen epik hikayesi; büyülü gerçekçiliğin zirvesi.', kategoriId: 3 },
  { baslik: 'Uçurtma Avcısı', yazar: 'Khaled Hosseini', fiyat: 120, stok: 9, aciklama: 'Afganistan\'da geçen, ihanet, suçluluk ve kurtuluşu anlatan sarsıcı bir dostluk romanı.', kategoriId: 3 },
  { baslik: 'Bin Muhteşem Güneş', yazar: 'Khaled Hosseini', fiyat: 115, stok: 8, aciklama: 'Afgan iç savaşında iki kadının hayatta kalma mücadelesini ve dayanışmayı anlatan roman.', kategoriId: 3 },
  { baslik: 'To Kill a Mockingbird', yazar: 'Harper Lee', fiyat: 105, stok: 8, aciklama: 'Amerika\'da ırkçılık ve adaletsizliği bir çocuğun gözünden anlatan Nobel ödüllü başyapıt.', kategoriId: 3 },

  // SİYASİ (id: 4)
  { baslik: 'Yabancı', yazar: 'Albert Camus', fiyat: 88, stok: 10, aciklama: 'Anlamsızlık ve varoluşun sorgusunu bir cinayetin ardından ortaya koyan absürd edebiyatın şaheseri.', kategoriId: 4 },
  { baslik: 'Dönüşüm', yazar: 'Franz Kafka', fiyat: 80, stok: 11, aciklama: 'Bir sabah böceğe dönüşen Gregor Samsa\'nın yabancılaşmasını anlatan distopik kısa roman.', kategoriId: 4 },
  { baslik: 'Gülün Adı', yazar: 'Umberto Eco', fiyat: 150, stok: 6, aciklama: 'Ortaçağ bir manastırında yaşanan gizemleri ve bilgi iktidar ilişkisini sorgulayan roman.', kategoriId: 4 },
];

async function main() {
  // Görseli olmayan kitapları sil
  const gorselsizler = await prisma.kitap.findMany({ where: { resim: null } });
  console.log(`${gorselsizler.length} görselsiz kitap siliniyor...`);
  for (const kitap of gorselsizler) {
    await prisma.sepetiKitap.deleteMany({ where: { kitapId: kitap.id } });
    await prisma.siparisKalemi.deleteMany({ where: { kitapId: kitap.id } });
    await prisma.kitap.delete({ where: { id: kitap.id } });
    console.log(`🗑️  Silindi: ${kitap.baslik}`);
  }

  console.log(`\n${yeniKitaplar.length} yeni kitap ekleniyor...\n`);

  for (const kitap of yeniKitaplar) {
    const mevcut = await prisma.kitap.findFirst({
      where: { baslik: { equals: kitap.baslik, mode: 'insensitive' } }
    });
    if (mevcut) {
      console.log(`⏭️  Zaten var: ${kitap.baslik}`);
      continue;
    }

    const resim = await gorselAra(kitap.baslik, kitap.yazar);
    await prisma.kitap.create({ data: { ...kitap, resim } });
    console.log(`${resim ? '✅' : '❌'} ${kitap.baslik}`);
    await bekle(400);
  }

  const toplam = await prisma.kitap.count();
  console.log(`\nTamamlandı! Toplam ${toplam} kitap.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
