const router = require('express').Router();
const { tumKitaplar, kitapDetay, kitapEkle, kitapGuncelle, kitapSil } = require('../controllers/kitap.controller');
const { auth, adminAuth } = require('../middlewares/auth.middleware');

router.get('/', tumKitaplar);
router.get('/:id', kitapDetay);
router.post('/', auth, adminAuth, kitapEkle);
router.put('/:id', auth, adminAuth, kitapGuncelle);
router.delete('/:id', auth, adminAuth, kitapSil);

module.exports = router;
