const express = require('express');
const { PrismaClient } = require('@prisma/client');
const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const yorumlar = await prisma.yorum.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(yorumlar);
  } catch (err) {
    res.status(500).json({ mesaj: 'Yorumlar alınamadı' });
  }
});

router.post('/', async (req, res) => {
  const { kitapAdi, yorum, yazarAdi } = req.body;
  if (!kitapAdi || !yorum) {
    return res.status(400).json({ mesaj: 'Kitap adı ve yorum zorunludur' });
  }
  try {
    const yeniYorum = await prisma.yorum.create({
      data: { kitapAdi, yorum, yazarAdi: yazarAdi || 'Anonim' },
    });
    res.status(201).json(yeniYorum);
  } catch (err) {
    res.status(500).json({ mesaj: 'Yorum kaydedilemedi' });
  }
});

module.exports = router;
