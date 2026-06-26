const router = require('express').Router();
const { tumKategoriler, kategoriEkle, kategoriSil } = require('../controllers/kategori.controller');
const { auth, adminAuth } = require('../middlewares/auth.middleware');

router.get('/', tumKategoriler);
router.post('/', auth, adminAuth, kategoriEkle);
router.delete('/:id', auth, adminAuth, kategoriSil);

module.exports = router;
