const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`SELECT setval(pg_get_serial_sequence('"Kitap"', 'id'), (SELECT MAX(id) FROM "Kitap") + 1)`);

  const kitaplar = [
    { baslik: 'İnce Memed', yazar: 'Yaşar Kemal', fiyat: 120, stok: 10, aciklama: 'Çukurova\'nın efsanevi kahramanı İnce Memed\'in destansı hikayesi.', kategoriId: 3 },
    { baslik: 'Çalıkuşu', yazar: 'Reşat Nuri Güntekin', fiyat: 95, stok: 8, aciklama: 'Feride\'nin Anadolu\'daki öğretmenlik macerasını anlatan başyapıt.', kategoriId: 2 },
    { baslik: 'Sinekli Bakkal', yazar: 'Halide Edib Adıvar', fiyat: 110, stok: 6, aciklama: 'İstanbul\'un tarihi bir mahallesinde geçen derin bir aşk ve toplum hikayesi.', kategoriId: 1 },
    { baslik: 'Sabahattin Ali Seçme Hikayeler', yazar: 'Sabahattin Ali', fiyat: 85, stok: 12, aciklama: 'Türk edebiyatının ustalık eserleri arasında yer alan seçme hikayeler.', kategoriId: 3 },
    { baslik: 'Kiralık Konak', yazar: 'Yakup Kadri Karaosmanoğlu', fiyat: 100, stok: 7, aciklama: 'Osmanlı\'dan Cumhuriyet\'e geçiş dönemini anlatan tarihi roman.', kategoriId: 4 },
    { baslik: 'Aşk-ı Memnu', yazar: 'Halit Ziya Uşaklıgil', fiyat: 130, stok: 9, aciklama: 'Türk edebiyatının ilk modern romanlarından biri, yasak aşkın trajik hikayesi.', kategoriId: 2 },
    { baslik: 'Huzur', yazar: 'Ahmet Hamdi Tanpınar', fiyat: 115, stok: 5, aciklama: 'İstanbul\'un güzelliğini ve ruhunu yansıtan derin bir roman.', kategoriId: 1 },
    { baslik: 'Yaprak Dökümü', yazar: 'Reşat Nuri Güntekin', fiyat: 90, stok: 11, aciklama: 'Bir ailenin çöküşünü anlatan çarpıcı Türk klasiği.', kategoriId: 3 },
    { baslik: 'Yorgun Savaşçı', yazar: 'Kemal Tahir', fiyat: 105, stok: 6, aciklama: 'Kurtuluş Savaşı dönemini gerçekçi bir bakış açısıyla anlatan roman.', kategoriId: 4 },
    { baslik: 'Bir Tereddüdün Romanı', yazar: 'Peyami Safa', fiyat: 88, stok: 8, aciklama: 'Doğu-Batı çatışmasını bireyin iç dünyasından ele alan roman.', kategoriId: 4 },
  ];

  for (const kitap of kitaplar) {
    await prisma.kitap.create({ data: kitap });
    console.log(`Eklendi: ${kitap.baslik}`);
  }

  console.log('Tüm kitaplar eklendi!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
