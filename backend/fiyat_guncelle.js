const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 2025 Türkiye güncel kitap fiyatları (TL)
const fiyatlar = [
  // Türk Klasikleri
  { baslik: 'İnce Memed',                        fiyat: 205 },
  { baslik: 'Çalıkuşu',                           fiyat: 185 },
  { baslik: 'kuyucaklı yusuf',                    fiyat: 180 },
  { baslik: 'Sinekli Bakkal',                     fiyat: 190 },
  { baslik: 'Sabahattin Ali Seçme Hikayeler',     fiyat: 165 },
  { baslik: 'Kiralık Konak',                      fiyat: 180 },
  { baslik: 'Aşk-ı Memnu',                        fiyat: 210 },
  { baslik: 'Huzur',                              fiyat: 215 },
  { baslik: 'Yorgun Savaşçı',                     fiyat: 190 },
  { baslik: 'Bir Tereddüdün Romanı',              fiyat: 160 },
  { baslik: 'Araba Sevdası',                      fiyat: 170 },
  { baslik: 'Eylül',                              fiyat: 160 },
  { baslik: 'Sergüzeşt',                          fiyat: 150 },
  { baslik: 'Felatun Bey ile Rakım Efendi',       fiyat: 158 },
  { baslik: 'Dudaktan Kalbe',                     fiyat: 178 },
  { baslik: 'Akşam Güneşi',                       fiyat: 168 },
  { baslik: 'Yaprak Dökümü',                      fiyat: 188 },
  { baslik: 'Bereketli Topraklar Üzerinde',       fiyat: 185 },
  { baslik: 'Murtaza',                            fiyat: 172 },
  { baslik: 'Yılanı Öldürseler',                  fiyat: 198 },
  { baslik: 'Devlet Ana',                         fiyat: 225 },
  { baslik: 'Yaban',                              fiyat: 188 },
  { baslik: 'Tutunamayanlar',                     fiyat: 285 },
  { baslik: 'Saatleri Ayarlama Enstitüsü',        fiyat: 225 },
  { baslik: 'Mai ve Siyah',                       fiyat: 192 },
  { baslik: 'Vurun Kahpeye',                      fiyat: 168 },
  { baslik: 'İntibah',                            fiyat: 148 },
  { baslik: 'Kürk Mantolu Madonna',               fiyat: 178 },
  { baslik: 'Bozkırdaki Çekirdek',                fiyat: 195 },
  { baslik: 'Benim Adım Kırmızı',                 fiyat: 265 },
  { baslik: 'Aşk',                                fiyat: 225 },

  // Dünya Klasikleri (çeviri)
  { baslik: 'Suç ve Ceza',                        fiyat: 225 },
  { baslik: 'Sefiller',                           fiyat: 285 },
  { baslik: 'Madame Bovary',                      fiyat: 198 },
  { baslik: 'Gurur ve Önyargı',                   fiyat: 215 },
  { baslik: 'Jane Eyre',                          fiyat: 222 },
  { baslik: 'Uğultulu Tepeler',                   fiyat: 205 },
  { baslik: 'Kırmızı ve Siyah',                   fiyat: 208 },
  { baslik: 'Oliver Twist',                       fiyat: 198 },
  { baslik: 'İki Şehrin Hikayesi',                fiyat: 215 },
  { baslik: '1984',                               fiyat: 215 },
  { baslik: 'Hayvan Çiftliği',                    fiyat: 162 },
  { baslik: 'Cesur Yeni Dünya',                   fiyat: 198 },
  { baslik: 'Don Kişot',                          fiyat: 285 },
  { baslik: 'Büyük Umutlar',                      fiyat: 218 },
  { baslik: 'Karamazov Kardeşler',                fiyat: 325 },
  { baslik: 'Simyacı',                            fiyat: 185 },
  { baslik: 'Şeker Portakalı',                    fiyat: 178 },
  { baslik: 'Vadideki Zambak',                    fiyat: 198 },
  { baslik: 'Yüzyıllık Yalnızlık',               fiyat: 272 },
  { baslik: 'Uçurtma Avcısı',                     fiyat: 235 },
  { baslik: 'Bin Muhteşem Güneş',                 fiyat: 228 },
  { baslik: 'To Kill a Mockingbird',              fiyat: 215 },
  { baslik: 'Yabancı',                            fiyat: 178 },
  { baslik: 'Dönüşüm',                            fiyat: 158 },
  { baslik: 'Gülün Adı',                          fiyat: 295 },
  { baslik: 'Frankenstein',                       fiyat: 188 },
];

async function main() {
  let guncellenen = 0;
  for (const { baslik, fiyat } of fiyatlar) {
    const sonuc = await prisma.kitap.updateMany({
      where: { baslik: { contains: baslik, mode: 'insensitive' } },
      data: { fiyat },
    });
    if (sonuc.count > 0) {
      console.log(`✅ ${baslik} → ${fiyat} ₺`);
      guncellenen++;
    } else {
      console.log(`⚠️  Bulunamadı: ${baslik}`);
    }
  }
  console.log(`\n${guncellenen}/${fiyatlar.length} kitap güncellendi.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
