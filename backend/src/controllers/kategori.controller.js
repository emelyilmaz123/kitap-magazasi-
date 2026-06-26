const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const tumKategoriler = async (req, res) => {
  try {
    const kategoriler = await prisma.kategori.findMany();
    res.json(kategoriler);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const kategoriEkle = async (req, res) => {
  try {
    const kategori = await prisma.kategori.create({ data: { ad: req.body.ad } });
    res.status(201).json(kategori);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const kategoriSil = async (req, res) => {
  try {
    await prisma.kategori.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ mesaj: 'Kategori silindi' });
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

module.exports = { tumKategoriler, kategoriEkle, kategoriSil };
