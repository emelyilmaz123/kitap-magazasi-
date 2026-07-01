import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Siparislerim.css';
import Footer from '../components/Footer';

function Siparislerim() {
  const navigate = useNavigate();
  const [siparisler, setSiparisler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [acikSiparis, setAcikSiparis] = useState(null);

  const kullanici = JSON.parse(localStorage.getItem('kullanici') || 'null');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!kullanici) {
      navigate('/giris');
      return;
    }
    fetch('http://localhost:5000/api/siparisler/benim', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setSiparisler(data))
      .catch(() => setSiparisler([]))
      .finally(() => setYukleniyor(false));
  }, []);

  const durumRenk = (durum) => {
    switch (durum) {
      case 'HAZIRLANIYOR': return 'durum-hazirlaniyor';
      case 'KARGODA': return 'durum-kargoda';
      case 'TESLIM_EDILDI': return 'durum-teslim';
      default: return 'durum-hazirlaniyor';
    }
  };

  const durumYazi = (durum) => {
    switch (durum) {
      case 'HAZIRLANIYOR': return '⏳ Hazırlanıyor';
      case 'KARGODA': return '🚚 Kargoda';
      case 'TESLIM_EDILDI': return '✅ Teslim Edildi';
      default: return durum;
    }
  };

  if (yukleniyor) return <div className="siparis-yuklen">Yükleniyor...</div>;

  return (
    <div className="siparis-sayfa">
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <Link to="/">Ana Sayfa</Link>
          <Link to="/sepet" className="navbar-sepet">🛒 Sepet</Link>
          {kullanici && <span className="navbar-kullanici">👤 {kullanici.ad}</span>}
        </nav>
      </header>

      <div className="siparis-icerik">
        <h1>📦 Siparişlerim</h1>

        {siparisler.length === 0 ? (
          <div className="siparis-bos">
            <div className="siparis-bos-ikon">📦</div>
            <p>Henüz siparişiniz yok</p>
            <Link to="/" className="btn-alisverise-don">Alışverişe Başla</Link>
          </div>
        ) : (
          <div className="siparis-liste">
            {siparisler.map(siparis => (
              <div key={siparis.id} className="siparis-kart">
                <div className="siparis-baslik" onClick={() => setAcikSiparis(acikSiparis === siparis.id ? null : siparis.id)}>
                  <div className="siparis-sol">
                    <span className="siparis-no">Sipariş #{siparis.id}</span>
                    <span className="siparis-tarih">
                      {new Date(siparis.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="siparis-sag">
                    <span className={`siparis-durum ${durumRenk(siparis.durum)}`}>{durumYazi(siparis.durum)}</span>
                    <span className="siparis-toplam">{siparis.toplam} ₺</span>
                    <span className="siparis-ok">{acikSiparis === siparis.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {acikSiparis === siparis.id && (
                  <div className="siparis-detay">
                    {siparis.kalemler.map(kalem => (
                      <div key={kalem.id} className="siparis-kalem">
                        <span className="kalem-kitap-adi">{kalem.kitap.baslik}</span>
                        <span className="kalem-bilgi">{kalem.adet} adet × {kalem.fiyat} ₺</span>
                        <span className="kalem-toplam">{kalem.adet * kalem.fiyat} ₺</span>
                      </div>
                    ))}
                    <div className="siparis-detay-toplam">
                      <span>Toplam</span>
                      <span>{siparis.toplam} ₺</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Siparislerim;
