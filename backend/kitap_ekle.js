const { PrismaClient } = require('@prisma/client');
const https = require('https');
const prisma = new PrismaClient();

function gorselAra(baslik, yazar) {
  return new Promise((resolve) => {
    const url = `https://openlibrary.org/search.json?title=${encodeURIComponent(baslik)}&author=${encodeURIComponent(yazar)}&limit=1`;
    https.get(url, { headers: { 'User-Agent': 'KitapMagazasi/1.0' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const coverId = json.docs?.[0]?.cover_i;
          resolve(coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function bekle(ms) { return new Promise(r => setTimeout(r, ms)); }

const yeniKitaplar = [
  // KLASİK (id: 1)
  { baslik: 'Araba Sevdası', yazar: 'Recaizade Mahmut Ekrem', fiyat: 85, stok: 8, aciklama: 'Türk edebiyatının ilk realist romanlarından biri, Batı hayranlığını hicveden başyapıt.', kategoriId: 1 },
  { baslik: 'Eylül', yazar: 'Mehmet Rauf', fiyat: 90, stok: 7, aciklama: 'Türk edebiyatının ilk psikolojik romanı olarak kabul edilen yasak aşk hikayesi.', kategoriId: 1 },
  { baslik: 'Sergüzeşt', yazar: 'Samipaşazade Sezai', fiyat: 75, stok: 6, aciklama: 'Bir cariyenin dramatik yaşam öyküsünü anlatan duygusal ve toplumsal roman.', kategoriId: 1 },
  { baslik: 'Felatun Bey ile Rakım Efendi', yazar: 'Ahmet Mithat', fiyat: 80, stok: 10, aciklama: 'Doğu-Batı sentezini iki farklı karakter üzerinden anlatan klasik Türk romanı.', kategoriId: 1 },

  // ROMANTİK (id: 2)
  { baslik: 'Dudaktan Kalbe', yazar: 'Reşat Nuri Güntekin', fiyat: 88, stok: 9, aciklama: 'Genç bir müzisyenin derin ve tutkulu bir aşk hikayesini anlatan roman.', kategoriId: 2 },
  { baslik: 'Akşam Güneşi', yazar: 'Reşat Nuri Güntekin', fiyat: 82, stok: 7, aciklama: 'Hayatın akşamında buluşan iki insanın sıcak ve hüzünlü aşk hikayesi.', kategoriId: 2 },
  { baslik: 'Yaprak Dökümü', yazar: 'Reşat Nuri Güntekin', fiyat: 95, stok: 8, aciklama: 'Bir ailenin çöküşünü ve nesiller arası çatışmayı anlatan güçlü roman.', kategoriId: 2 },
  { baslik: 'Son Arzu', yazar: 'Reşat Nuri Güntekin', fiyat: 78, stok: 6, aciklama: 'Yaşlı bir adamın son aşkını ve hayat özlemini anlatan duygusal roman.', kategoriId: 2 },

  // TOPLUMSAL (id: 3)
  { baslik: 'Bereketli Topraklar Üzerinde', yazar: 'Orhan Kemal', fiyat: 95, stok: 10, aciklama: 'Pamuk tarlalarında çalışan işçilerin zorlu yaşamını anlatan toplumsal roman.', kategoriId: 3 },
  { baslik: 'Murtaza', yazar: 'Orhan Kemal', fiyat: 88, stok: 8, aciklama: 'Katı kuralları ile yaşayan bir bekçinin trajikomik hayat hikayesi.', kategoriId: 3 },
  { baslik: 'Yılanı Öldürseler', yazar: 'Yaşar Kemal', fiyat: 105, stok: 7, aciklama: 'Çukurova\'da geçen, töre ve özgürlük çatışmasını anlatan güçlü roman.', kategoriId: 3 },
  { baslik: 'Devlet Ana', yazar: 'Kemal Tahir', fiyat: 120, stok: 6, aciklama: 'Osmanlı\'nın kuruluşunu Anadolu halkının gözünden anlatan tarihi toplumsal roman.', kategoriId: 3 },

  // SİYASİ (id: 4)
  { baslik: 'Yaban', yazar: 'Yakup Kadri Karaosmanoğlu', fiyat: 98, stok: 9, aciklama: 'Kurtuluş Savaşı döneminde bir aydının Anadolu köylüsüyle çatışmasını anlatan roman.', kategoriId: 4 },
  { baslik: 'Ankara', yazar: 'Yakup Kadri Karaosmanoğlu', fiyat: 105, stok: 7, aciklama: 'Cumhuriyetin kuruluşunu ve Ankara\'nın dönüşümünü anlatan tarihi siyasi roman.', kategoriId: 4 },
  { baslik: 'Tutunamayanlar', yazar: 'Oğuz Atay', fiyat: 130, stok: 8, aciklama: 'Türk edebiyatının en özgün yapıtlarından biri, modern bireyin varoluş bunalımı.', kategoriId: 4 },
  { baslik: 'Saatleri Ayarlama Enstitüsü', yazar: 'Ahmet Hamdi Tanpınar', fiyat: 115, stok: 6, aciklama: 'Modernleşme ve Batılılaşmayı hicveden, Türk edebiyatının şaheseri.', kategoriId: 4 },
];

async function main() {
  // Kategorideki satır sonlarını temizle
  await prisma.kategori.updateMany({ where: { ad: { contains: '\n' } }, data: { ad: 'romantik' } });
  await prisma.kategori.updateMany({ where: { ad: { contains: ' ' } }, data: { ad: 'klasik' } });
  console.log('Kategori isimleri temizlendi');

  // Çift kitapları sil (aynı başlık + yazar)
  const tumKitaplar = await prisma.kitap.findMany({ orderBy: { id: 'asc' } });
  const gorulenler = new Set();
  for (const kitap of tumKitaplar) {
    const anahtar = `${kitap.baslik.trim()}-${kitap.yazar.trim()}`;
    if (gorulenler.has(anahtar)) {
      await prisma.kitap.delete({ where: { id: kitap.id } });
      console.log(`Silindi (çift): ${kitap.baslik}`);
    } else {
      gorulenler.add(anahtar);
    }
  }

  // Yeni kitapları ekle
  for (const kitap of yeniKitaplar) {
    const resim = await gorselAra(kitap.baslik, kitap.yazar);
    await prisma.kitap.create({ data: { ...kitap, resim } });
    console.log(`${resim ? '✅' : '❌'} ${kitap.baslik}`);
    await bekle(400);
  }

  console.log('\nTamamlandı!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
