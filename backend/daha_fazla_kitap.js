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
  { baslik: 'Mai ve Siyah', yazar: 'Halit Ziya Uşaklıgil', fiyat: 95, stok: 8, aciklama: 'Bir şairin hayallerini ve hayal kırıklıklarını anlatan Türk edebiyatının başyapıtı.', kategoriId: 1 },
  { baslik: 'Vurun Kahpeye', yazar: 'Halide Edib Adıvar', fiyat: 85, stok: 10, aciklama: 'Kurtuluş Savaşı döneminde bir öğretmenin vatan uğruna verdiği mücadeleyi anlatan roman.', kategoriId: 1 },
  { baslik: 'İntibah', yazar: 'Namık Kemal', fiyat: 70, stok: 7, aciklama: 'Türk edebiyatının ilk romanlarından biri; bir gencin aşk ve yıkım hikayesi.', kategoriId: 1 },
  { baslik: 'Savaş ve Barış', yazar: 'Lev Tolstoy', fiyat: 180, stok: 5, aciklama: 'Napolyon savaşları döneminde Rus aristokrasinin hayatını anlatan edebiyatın zirvesi.', kategoriId: 1 },
  { baslik: 'Suç ve Ceza', yazar: 'Fyodor Dostoyevski', fiyat: 110, stok: 9, aciklama: 'Bir suçun ardındaki psikolojik çöküşü ve vicdan azabını derinlemesine inceleyen başyapıt.', kategoriId: 1 },
  { baslik: 'Sefiller', yazar: 'Victor Hugo', fiyat: 150, stok: 6, aciklama: 'Adalet, aşk ve kurtuluş temalarını işleyen dünya edebiyatının en büyük eserlerinden biri.', kategoriId: 1 },
  { baslik: 'Anna Karenina', yazar: 'Lev Tolstoy', fiyat: 130, stok: 7, aciklama: '19. yüzyıl Rus toplumunda bir kadının trajik aşkını ve özgürlük arayışını anlatan roman.', kategoriId: 1 },
  { baslik: 'Madame Bovary', yazar: 'Gustave Flaubert', fiyat: 100, stok: 8, aciklama: 'Taşra hayatından sıkılan bir kadının hayal kırıklıklarını işleyen realist edebiyat şaheseri.', kategoriId: 1 },

  // ROMANTİK (id: 2)
  { baslik: 'Gurur ve Önyargı', yazar: 'Jane Austen', fiyat: 115, stok: 10, aciklama: 'Elizabeth Bennet ve Mr. Darcy\'nin önyargıları aşarak buldukları aşkı anlatan zamansız klasik.', kategoriId: 2 },
  { baslik: 'Jane Eyre', yazar: 'Charlotte Brontë', fiyat: 120, stok: 8, aciklama: 'Yetim bir kadının bağımsızlığını ve gerçek aşkı bulma mücadelesini anlatan roman.', kategoriId: 2 },
  { baslik: 'Uğultulu Tepeler', yazar: 'Emily Brontë', fiyat: 105, stok: 7, aciklama: 'Tutkulu ve yıkıcı bir aşkın nesiller boyu süren etkisini anlatan gotik başyapıt.', kategoriId: 2 },
  { baslik: 'Kırmızı ve Siyah', yazar: 'Stendhal', fiyat: 110, stok: 6, aciklama: 'Hırslı bir gencin aşk ve iktidar peşindeki çıkışını anlatan Fransız edebiyatının şaheseri.', kategoriId: 2 },
  { baslik: 'Aşkın Adı Yok', yazar: 'Kerime Nadir', fiyat: 80, stok: 9, aciklama: 'Türk romantik edebiyatının sevilen yazarından tutkulu ve duygusal bir aşk hikayesi.', kategoriId: 2 },
  { baslik: 'Acımak', yazar: 'Reşat Nuri Güntekin', fiyat: 88, stok: 8, aciklama: 'Fedakarlık ve özveri üzerine kurulu, yüreğe dokunan derin bir aşk ve insan hikayesi.', kategoriId: 2 },
  { baslik: 'Matmazel Noraliya\'nın Koltuğu', yazar: 'Peyami Safa', fiyat: 95, stok: 7, aciklama: 'Madde ve ruh çatışmasını mistik bir aşk hikayesi çerçevesinde anlatan derin roman.', kategoriId: 2 },
  { baslik: 'Küçük Prens', yazar: 'Antoine de Saint-Exupéry', fiyat: 65, stok: 15, aciklama: 'Sevgi, dostluk ve hayatın anlamını sorgulayan, her yaştan okuyucuya hitap eden eser.', kategoriId: 2 },

  // TOPLUMSAL (id: 3)
  { baslik: 'Yılanların Öcü', yazar: 'Fakir Baykurt', fiyat: 88, stok: 9, aciklama: 'Anadolu köyündeki sınıf çatışmalarını ve halk arasındaki adaletsizliği konu alan roman.', kategoriId: 3 },
  { baslik: 'Oliver Twist', yazar: 'Charles Dickens', fiyat: 100, stok: 8, aciklama: 'Viktoryen İngiltere\'sinde bir yetim çocuğun hayatta kalma mücadelesini anlatan toplumsal eleştiri.', kategoriId: 3 },
  { baslik: 'Gazap Üzümleri', yazar: 'John Steinbeck', fiyat: 120, stok: 6, aciklama: 'Büyük Buhran döneminde göç eden bir ailenin umutlarını ve yıkımını anlatan Nobel ödüllü roman.', kategoriId: 3 },
  { baslik: 'Fareler ve İnsanlar', yazar: 'John Steinbeck', fiyat: 85, stok: 10, aciklama: 'İki göçmen işçinin büyük hayaller kurduğu ve bunların nasıl parçalandığını anlatan etkileyici roman.', kategoriId: 3 },
  { baslik: 'Kürk Mantolu Madonna', yazar: 'Sabahattin Ali', fiyat: 90, stok: 12, aciklama: 'Sınıf farkını aşmaya çalışan iki insanın kavuşamayan aşkını anlatan edebi başyapıt.', kategoriId: 3 },
  { baslik: 'İki Şehrin Hikayesi', yazar: 'Charles Dickens', fiyat: 110, stok: 7, aciklama: 'Fransız Devrimi döneminde Londra ve Paris\'te geçen, fedakarlık ve adalet üzerine epik roman.', kategoriId: 3 },
  { baslik: 'Vukuat Var', yazar: 'Orhan Kemal', fiyat: 82, stok: 8, aciklama: 'Fabrika işçilerinin zorlu yaşamlarını ve sınıf bilincini anlatan keskin gözlemli roman.', kategoriId: 3 },
  { baslik: 'Tırpan', yazar: 'Fakir Baykurt', fiyat: 85, stok: 7, aciklama: 'Anadolu köyünde toprak kavgasını ve köylü dayanışmasını anlatan güçlü toplumsal roman.', kategoriId: 3 },

  // SİYASİ (id: 4)
  { baslik: '1984', yazar: 'George Orwell', fiyat: 105, stok: 10, aciklama: 'Totaliter bir düzende gözetim altındaki bireyin özgürlük mücadelesini anlatan distopik başyapıt.', kategoriId: 4 },
  { baslik: 'Hayvan Çiftliği', yazar: 'George Orwell', fiyat: 75, stok: 12, aciklama: 'Devrim sonrası iktidar yozlaşmasını ve totalitarizmi hicveden siyasi alegorik roman.', kategoriId: 4 },
  { baslik: 'Cesur Yeni Dünya', yazar: 'Aldous Huxley', fiyat: 95, stok: 9, aciklama: 'Teknoloji ve tüketimle uyuşturulmuş bir toplumu anlatan distopik roman.', kategoriId: 4 },
  { baslik: 'Kar', yazar: 'Orhan Pamuk', fiyat: 130, stok: 8, aciklama: 'Türkiye\'deki siyasi gerilimleri, kimlik bunalımını ve din-laiklik çatışmasını ele alan roman.', kategoriId: 4 },
  { baslik: 'Ateşten Gömlek', yazar: 'Halide Edib Adıvar', fiyat: 90, stok: 7, aciklama: 'Kurtuluş Savaşı\'nı bir kadın kahraman gözünden anlatan vatanseverlik ve direniş romanı.', kategoriId: 4 },
  { baslik: 'Kurt Kanunu', yazar: 'Kemal Tahir', fiyat: 110, stok: 6, aciklama: 'Türkiye\'nin siyasi tarihine ilişkin derin çözümlemeler sunan güçlü siyasi roman.', kategoriId: 4 },
  { baslik: 'Bozkırdaki Çekirdek', yazar: 'Kemal Tahir', fiyat: 100, stok: 7, aciklama: 'Anadolu\'daki toplumsal dönüşümü ve Cumhuriyet\'in ilk yıllarını anlatan siyasi roman.', kategoriId: 4 },
  { baslik: 'Benim Adım Kırmızı', yazar: 'Orhan Pamuk', fiyat: 140, stok: 8, aciklama: 'Osmanlı minyatür geleneğini ve sanat ile ölüm temalarını iç içe işleyen Nobel ödüllü roman.', kategoriId: 4 },
];

async function main() {
  console.log(`${yeniKitaplar.length} kitap eklenecek...\n`);

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
  console.log(`\nTamamlandı! Veritabanında toplam ${toplam} kitap var.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
