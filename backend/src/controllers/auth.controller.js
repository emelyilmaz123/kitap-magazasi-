const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const kayitOl = async (req, res) => {
  try {
    const { ad, email, sifre } = req.body;
    const mevcutKullanici = await prisma.kullanici.findUnique({ where: { email } });
    if (mevcutKullanici) return res.status(400).json({ mesaj: 'Bu email zaten kayıtlı' });

    const hashlenmis = await bcrypt.hash(sifre, 10);
    const kullanici = await prisma.kullanici.create({
      data: { ad, email, sifre: hashlenmis }
    });

    const token = jwt.sign({ id: kullanici.id, rol: kullanici.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, kullanici: { id: kullanici.id, ad: kullanici.ad, email: kullanici.email, rol: kullanici.rol } });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası', hata: err.message });
  }
};

const girisYap = async (req, res) => {
  try {
    const { email, sifre } = req.body;
    const kullanici = await prisma.kullanici.findUnique({ where: { email } });
    if (!kullanici) return res.status(400).json({ mesaj: 'Email veya şifre hatalı' });

    const eslesiyor = await bcrypt.compare(sifre, kullanici.sifre);
    if (!eslesiyor) return res.status(400).json({ mesaj: 'Email veya şifre hatalı' });

    const token = jwt.sign({ id: kullanici.id, rol: kullanici.rol }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, kullanici: { id: kullanici.id, ad: kullanici.ad, email: kullanici.email, rol: kullanici.rol } });
  } catch (err) {
    res.status(500).json({ mesaj: 'Sunucu hatası' });
  }
};

module.exports = { kayitOl, girisYap };
