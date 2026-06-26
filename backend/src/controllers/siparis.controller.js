const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const siparisOlustur = async (req, res) => {
  try {
    const sepet = await prisma.sepet.findUnique({
      where: { kullaniciId: req.kullanici.id },
      include: { kitaplar: { include: { kitap: true } } }
    });
    if (!sepet || sepet.kitaplar.length === 0) {
      return res.status(400).json({ mesaj: 'Sepet boş' });
    }

    const toplam = sepet.kitaplar.reduce((acc, item) => acc + item.kitap.fiyat * item.adet, 0);

    const siparis = await prisma.siparis.create({
      data: {
        kullaniciId: req.kullanici.id,
        toplam,
        kalemler: {
          create: sepet.kitaplar.map(item => ({
            kitapId: item.kitapId,
            adet: item.adet,
            fiyat: item.kitap.fiyat
          }))
        }
      },
      include: { kalemler: true }
    });

    await prisma.sepetiKitap.deleteMany({ where: { sepetId: sepet.id } });

    res.status(201).json(siparis);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const siparislerim = async (req, res) => {
  try {
    const siparisler = await prisma.siparis.findMany({
      where: { kullaniciId: req.kullanici.id },
      include: { kalemler: { include: { kitap: true } } }
    });
    res.json(siparisler);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const tumSiparisler = async (req, res) => {
  try {
    const siparisler = await prisma.siparis.findMany({
      include: { kullanici: true, kalemler: { include: { kitap: true } } }
    });
    res.json(siparisler);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const siparisDurumGuncelle = async (req, res) => {
  try {
    const siparis = await prisma.siparis.update({
      where: { id: parseInt(req.params.id) },
      data: { durum: req.body.durum }
    });
    res.json(siparis);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

module.exports = { siparisOlustur, siparislerim, tumSiparisler, siparisDurumGuncelle };
