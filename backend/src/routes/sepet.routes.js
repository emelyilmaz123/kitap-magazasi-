const router = require('express').Router();
const { sepeteEkle, sepetGoster, sepettenCikar } = require('../controllers/sepet.controller');
const { auth } = require('../middlewares/auth.middleware');

router.get('/', auth, sepetGoster);
router.post('/', auth, sepeteEkle);
router.delete('/:kitapId', auth, sepettenCikar);

module.exports = router;
