import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [kitaplar, setKitaplar] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/kitaplar')
      .then(res => res.json())
      .then(data => {
        setKitaplar(data);
        setYukleniyor(false);
      })
      .catch(() => setYukleniyor(false));
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <a href="#kitaplar">Kitaplar</a>
          <a href="#" className="btn-giris">Giriş Yap</a>
          <a href="#" className="btn-kayit">Kayıt Ol</a>
        </nav>
      </header>

      <section className="hero">
        <h1>Kitap Dünyasına Hoş Geldiniz</h1>
        <p>Binlerce kitap, uygun fiyatlar, hızlı teslimat</p>
        <a href="#kitaplar" className="btn-kesfet">Kitapları Keşfet</a>
      </section>

      <section className="kitaplar-bolum" id="kitaplar">
        <h2>Tüm Kitaplar</h2>
        {yukleniyor ? (
          <p className="yukleniyor">Yükleniyor...</p>
        ) : kitaplar.length === 0 ? (
          <p className="bos-mesaj">Henüz kitap eklenmemiş.</p>
        ) : (
          <div className="kitap-grid">
            {kitaplar.map(kitap => (
              <div key={kitap.id} className="kitap-kart">
                <div className="kitap-resim">📖</div>
                <h3>{kitap.baslik}</h3>
                <p className="yazar">{kitap.yazar}</p>
                <p className="fiyat">{kitap.fiyat} ₺</p>
                <button className="btn-sepet">Sepete Ekle</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="footer">
        <p>© 2024 Kitap Mağazası. Tüm hakları saklıdır.</p>
      </footer>
    </div>
  );
}

export default App;
