const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tumKitaplar = async (req, res) => {
  try {
    const { kategori, arama } = req.query;
    const kitaplar = await prisma.kitap.findMany({
      where: {
        ...(kategori && { kategoriId: parseInt(kategori) }),
        ...(arama && { baslik: { contains: arama, mode: 'insensitive' } })
      },
      include: { kategori: true }
    });
    res.json(kitaplar);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const kitapDetay = async (req, res) => {
  try {
    const kitap = await prisma.kitap.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { kategori: true }
    });
    if (!kitap) return res.status(404).json({ mesaj: 'Kitap bulunamadı' });
    res.json(kitap);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const kitapEkle = async (req, res) => {
  try {
    const { baslik, yazar, fiyat, stok, aciklama, resim, kategoriId } = req.body;
    const kitap = await prisma.kitap.create({
      data: { baslik, yazar, fiyat, stok, aciklama, resim, kategoriId }
    });
    res.status(201).json(kitap);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const kitapGuncelle = async (req, res) => {
  try {
    const kitap = await prisma.kitap.update({
      where: { id: parseInt(req.params.id) },
      data: req.body
    });
    res.json(kitap);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const kitapSil = async (req, res) => {
  try {
    await prisma.kitap.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mesaj: 'Kitap silindi' });
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

module.exports = { tumKitaplar, kitapDetay, kitapEkle, kitapGuncelle, kitapSil };
