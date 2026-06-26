const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mesaj: 'Token gerekli' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.kullanici = decoded;
    next();
  } catch {
    res.status(401).json({ mesaj: 'Geçersiz token' });
  }
};

const adminAuth = (req, res, next) => {
  if (req.kullanici.rol !== 'ADMIN') {
    return res.status(403).json({ mesaj: 'Bu işlem için admin yetkisi gerekli' });
  }
  next();
};

module.exports = { auth, adminAuth };
