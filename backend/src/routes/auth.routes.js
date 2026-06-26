const router = require('express').Router();
const { kayitOl, girisYap } = require('../controllers/auth.controller');

router.post('/kayit', kayitOl);
router.post('/giris', girisYap);

module.exports = router;
