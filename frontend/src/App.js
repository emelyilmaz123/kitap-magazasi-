import './App.css';
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Giris from './pages/Giris';
import Kayit from './pages/Kayit';
import KitapDetay from './pages/KitapDetay';
import Sepet from './pages/Sepet';
import Admin from './pages/Admin';
import Siparislerim from './pages/Siparislerim';
import Yorumlar from './pages/Yorumlar';
import Footer from './components/Footer';

function AnaSayfa() {
  const navigate = useNavigate();
  const [kitaplar, setKitaplar] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [secilenKategori, setSecilenKategori] = useState('Tümü');
  const [kullanici, setKullanici] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/kitaplar')
      .then(res => res.json())
      .then(data => setKitaplar(data))
      .catch(() => {});

    fetch('http://localhost:5000/api/kategoriler')
      .then(res => res.json())
      .then(data => setKategoriler(data))
      .catch(() => {});

    const k = localStorage.getItem('kullanici');
    if (k) setKullanici(JSON.parse(k));
  }, []);

  const cikisYap = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('kullanici');
    setKullanici(null);
  };

  const filtreliKitaplar = secilenKategori === 'Tümü'
    ? kitaplar
    : kitaplar.filter(k => (k.kategori?.ad || k.kategori) === secilenKategori);

  return (
    <div className="app">
      {/* NAVBAR */}
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <a href="#kitaplar">Kitaplar</a>
          <a href="#kategoriler">Kategoriler</a>
          <Link to="/yorumlar">💬 Yorumlar</Link>
          {kullanici ? (
            <>
              <Link to="/sepet" className="navbar-sepet">🛒 Sepet</Link>
              <Link to="/siparislerim" className="navbar-sepet">📦 Siparişlerim</Link>
              {kullanici.rol === 'ADMIN' && <Link to="/admin" className="navbar-sepet">⚙️ Admin</Link>}
              <span className="navbar-kullanici">👤 {kullanici.ad}</span>
              <button onClick={cikisYap} className="btn-cikis">Çıkış</button>
            </>
          ) : (
            <>
              <Link to="/giris" className="btn-giris">Giriş Yap</Link>
              <Link to="/kayit" className="btn-kayit">Kayıt Ol</Link>
            </>
          )}
        </nav>
      </header>

      {/* HERO */}
      <section className="hero">
        <h1>Kitap Dünyasına Hoş Geldiniz</h1>
        <p>Binlerce kitap, uygun fiyatlar, hızlı teslimat</p>
        <a href="#kitaplar" className="btn-kesfet">Kitapları Keşfet</a>
        <div className="hero-alinti">
          <p>"Çocukluğumda elime geçen iki kuruştan birini kitaba verirdim. Eğer böyle yapmasaydım, bu yaptıklarımın hiçbirini yapamazdım."</p>
          <span>— Mustafa Kemal Atatürk</span>
        </div>
      </section>

      {/* İSTATİSTİKLER */}
      <section className="istatistikler">
        <div className="istatistik-kart">
          <span className="ist-sayi">10.000+</span>
          <span className="ist-etiket">Kitap Çeşidi</span>
        </div>
        <div className="istatistik-kart">
          <span className="ist-sayi">50.000+</span>
          <span className="ist-etiket">Mutlu Müşteri</span>
        </div>
        <div className="istatistik-kart">
          <span className="ist-sayi">500+</span>
          <span className="ist-etiket">Yazar</span>
        </div>
        <div className="istatistik-kart">
          <span className="ist-sayi">24 Saat</span>
          <span className="ist-etiket">Hızlı Teslimat</span>
        </div>
      </section>

      {/* KATEGORİLER */}
      <section className="kategoriler-bolum" id="kategoriler">
        <h2>Kategoriler</h2>
        <div className="kategori-listesi">
          <button
            className={`kategori-btn ${secilenKategori === 'Tümü' ? 'aktif' : ''}`}
            onClick={() => setSecilenKategori('Tümü')}
          >
            📚 Tümü
          </button>
          {kategoriler.map(k => (
            <button
              key={k.id}
              className={`kategori-btn ${secilenKategori === k.ad ? 'aktif' : ''}`}
              onClick={() => setSecilenKategori(k.ad)}
            >
              📚 {k.ad}
            </button>
          ))}
        </div>
      </section>

      {/* KİTAPLAR */}
      <section className="kitaplar-bolum" id="kitaplar">
        <h2>
          {secilenKategori === 'Tümü' ? 'Tüm Kitaplar' : `${secilenKategori} Kitapları`}
          <span className="kitap-sayisi">{filtreliKitaplar.length} kitap</span>
        </h2>
        <div className="kitap-grid">
          {filtreliKitaplar.map(kitap => (
            <div key={kitap.id} className="kitap-kart" onClick={() => navigate(`/kitap/${kitap.id}`)} style={{ cursor: 'pointer' }}>
              <div className="kitap-resim">
                {kitap.resim ? <img src={kitap.resim} alt={kitap.baslik} /> : '📖'}
              </div>
              <span className="kitap-kategori-etiket">{kitap.kategori?.ad || kitap.kategori}</span>
              <h3>{kitap.baslik}</h3>
              <p className="yazar">{kitap.yazar}</p>
              <p className="fiyat">{kitap.fiyat} ₺</p>
              <button className="btn-sepet">🛒 Sepete Ekle</button>
            </div>
          ))}
        </div>
      </section>

      {/* KAMPANYA */}
      <section className="kampanya">
        <div className="kampanya-icerik">
          <h2>Bu Haftanın Fırsatı!</h2>
          <p>Klasik eserlerde %30 indirim — kaçırma!</p>
          <button className="btn-kampanya">Fırsatları Gör</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AnaSayfa />} />
        <Route path="/giris" element={<Giris />} />
        <Route path="/kayit" element={<Kayit />} />
        <Route path="/kitap/:id" element={<KitapDetay />} />
        <Route path="/sepet" element={<Sepet />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/siparislerim" element={<Siparislerim />} />
        <Route path="/yorumlar" element={<Yorumlar />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
