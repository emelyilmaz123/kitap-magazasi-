import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sepet.css';
import Footer from '../components/Footer';

function Sepet() {
  const navigate = useNavigate();
  const [sepet, setSepet] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [siparisYukleniyor, setSiparisYukleniyor] = useState(false);
  const kullanici = JSON.parse(localStorage.getItem('kullanici') || 'null');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!kullanici) {
      navigate('/giris');
      return;
    }
    sepetYukle();
  }, []);

  const sepetYukle = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/sepet', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      setSepet(data.kitaplar || []);
    } catch {
      setSepet([]);
    } finally {
      setYukleniyor(false);
    }
  };

  const kitapCikar = async (kitapId) => {
    try {
      await fetch(`http://localhost:5000/api/sepet/${kitapId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setSepet(sepet.filter(k => k.kitapId !== kitapId));
    } catch {}
  };

  const toplamFiyat = sepet.reduce((toplam, k) => toplam + k.kitap.fiyat * k.adet, 0);

  const siparisVer = async () => {
    setSiparisYukleniyor(true);
    try {
      const res = await fetch('http://localhost:5000/api/siparisler', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        navigate('/siparislerim');
      }
    } catch {}
    finally {
      setSiparisYukleniyor(false);
    }
  };

  if (yukleniyor) return <div className="sepet-yuklen">Yükleniyor...</div>;

  return (
    <div className="sepet-sayfa">
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <Link to="/">Ana Sayfa</Link>
          {kullanici && <span className="navbar-kullanici">👤 {kullanici.ad}</span>}
        </nav>
      </header>

      <div className="sepet-icerik">
        <h1>🛒 Sepetim</h1>

        {sepet.length === 0 ? (
          <div className="sepet-bos">
            <div className="sepet-bos-ikon">🛒</div>
            <p>Sepetiniz boş</p>
            <Link to="/" className="btn-alisverise-don">Alışverişe Başla</Link>
          </div>
        ) : (
          <div className="sepet-layout">
            <div className="sepet-liste">
              {sepet.map(kalem => (
                <div key={kalem.id} className="sepet-kalem">
                  <div className="kalem-kapak">📖</div>
                  <div className="kalem-bilgi">
                    <h3>{kalem.kitap.baslik}</h3>
                    <p className="kalem-yazar">{kalem.kitap.yazar}</p>
                    <p className="kalem-adet">{kalem.adet} adet</p>
                  </div>
                  <div className="kalem-sag">
                    <p className="kalem-fiyat">{kalem.kitap.fiyat * kalem.adet} ₺</p>
                    <button
                      className="btn-cikar"
                      onClick={() => kitapCikar(kalem.kitapId)}
                    >
                      🗑️ Kaldır
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="sepet-ozet">
              <h2>Sipariş Özeti</h2>
              <div className="ozet-satir">
                <span>Ürünler ({sepet.length})</span>
                <span>{toplamFiyat} ₺</span>
              </div>
              <div className="ozet-satir">
                <span>Kargo</span>
                <span className="ucretsiz">Ücretsiz</span>
              </div>
              <div className="ozet-toplam">
                <span>Toplam</span>
                <span>{toplamFiyat} ₺</span>
              </div>
              <button className="btn-satin-al" onClick={siparisVer} disabled={siparisYukleniyor}>
                {siparisYukleniyor ? 'Sipariş veriliyor...' : 'Satın Al'}
              </button>
              <Link to="/" className="btn-alisverise-devam">← Alışverişe Devam Et</Link>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Sepet;
