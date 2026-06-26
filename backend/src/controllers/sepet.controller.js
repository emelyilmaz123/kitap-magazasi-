const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sepetGoster = async (req, res) => {
  try {
    let sepet = await prisma.sepet.findUnique({
      where: { kullaniciId: req.kullanici.id },
      include: { kitaplar: { include: { kitap: true } } }
    });
    if (!sepet) sepet = { kitaplar: [] };
    res.json(sepet);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const sepeteEkle = async (req, res) => {
  try {
    const { kitapId, adet } = req.body;
    let sepet = await prisma.sepet.findUnique({ where: { kullaniciId: req.kullanici.id } });
    if (!sepet) {
      sepet = await prisma.sepet.create({ data: { kullaniciId: req.kullanici.id } });
    }
    const kalem = await prisma.sepetiKitap.create({
      data: { sepetId: sepet.id, kitapId, adet }
    });
    res.status(201).json(kalem);
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

const sepettenCikar = async (req, res) => {
  try {
    const sepet = await prisma.sepet.findUnique({ where: { kullaniciId: req.kullanici.id } });
    if (!sepet) return res.status(404).json({ mesaj: 'Sepet bulunamadı' });
    await prisma.sepetiKitap.deleteMany({
      where: { sepetId: sepet.id, kitapId: parseInt(req.params.kitapId) }
    });
    res.json({ mesaj: 'Kitap sepetten çıkarıldı' });
  } catch {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

module.exports = { sepetGoster, sepeteEkle, sepettenCikar };
