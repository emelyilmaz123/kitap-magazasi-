const router = require('express').Router();
const { siparisOlustur, siparislerim, tumSiparisler, siparisDurumGuncelle } = require('../controllers/siparis.controller');
const { auth, adminAuth } = require('../middlewares/auth.middleware');

router.post('/', auth, siparisOlustur);
router.get('/benim', auth, siparislerim);
router.get('/', auth, adminAuth, tumSiparisler);
router.put('/:id', auth, adminAuth, siparisDurumGuncelle);

module.exports = router;
