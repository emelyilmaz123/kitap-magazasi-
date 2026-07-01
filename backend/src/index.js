const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/kitaplar', require('./routes/kitap.routes'));
app.use('/api/kategoriler', require('./routes/kategori.routes'));
app.use('/api/sepet', require('./routes/sepet.routes'));
app.use('/api/siparisler', require('./routes/siparis.routes'));
app.use('/api/yorumlar', require('./routes/yorum.routes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda çalışıyor`);
});
