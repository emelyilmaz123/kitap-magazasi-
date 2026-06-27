import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './KitapDetay.css';

function KitapDetay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kitap, setKitap] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [sepetMesaj, setSepetMesaj] = useState('');

  const kullanici = JSON.parse(localStorage.getItem('kullanici') || 'null');

  useEffect(() => {
    fetch(`http://localhost:5000/api/kitaplar/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('Kitap bulunamadı');
        return res.json();
      })
      .then(data => setKitap(data))
      .catch(() => setHata('Kitap bulunamadı'))
      .finally(() => setYukleniyor(false));
  }, [id]);

  const sepeteEkle = async () => {
    if (!kullanici) {
      navigate('/giris');
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:5000/api/sepet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ kitapId: kitap.id, adet: 1 }),
      });

      if (res.ok) {
        setSepetMesaj('Sepete eklendi!');
        setTimeout(() => setSepetMesaj(''), 3000);
      } else {
        setSepetMesaj('Hata oluştu, tekrar dene.');
      }
    } catch {
      setSepetMesaj('Sunucuya bağlanılamadı.');
    }
  };

  if (yukleniyor) return <div className="detay-yuklen">Yükleniyor...</div>;
  if (hata) return <div className="detay-hata">{hata} <Link to="/">Ana sayfaya dön</Link></div>;

  return (
    <div className="detay-sayfa">
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <Link to="/">Ana Sayfa</Link>
          {kullanici ? (
            <span className="navbar-kullanici">👤 {kullanici.ad}</span>
          ) : (
            <>
              <Link to="/giris" className="btn-giris">Giriş Yap</Link>
              <Link to="/kayit" className="btn-kayit">Kayıt Ol</Link>
            </>
          )}
        </nav>
      </header>

      <div className="detay-icerik">
        <button className="btn-geri" onClick={() => navigate(-1)}>
          ← Geri Dön
        </button>

        <div className="detay-kart">
          <div className="detay-sol">
            <div className="detay-kapak">
              {kitap.resim ? <img src={kitap.resim} alt={kitap.baslik} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} /> : '📖'}
            </div>
            <span className="detay-kategori">{kitap.kategori?.ad || kitap.kategori}</span>
          </div>

          <div className="detay-sag">
            <h1>{kitap.baslik}</h1>
            <p className="detay-yazar">✍️ {kitap.yazar}</p>

            {kitap.aciklama && (
              <p className="detay-aciklama">{kitap.aciklama}</p>
            )}

            <div className="detay-bilgiler">
              {kitap.stok !== undefined && (
                <span className={`stok-etiket ${kitap.stok > 0 ? 'var' : 'yok'}`}>
                  {kitap.stok > 0 ? `✅ Stokta (${kitap.stok} adet)` : '❌ Stokta Yok'}
                </span>
              )}
            </div>

            <div className="detay-fiyat">{kitap.fiyat} ₺</div>

            {sepetMesaj && <div className="sepet-mesaj">{sepetMesaj}</div>}

            <button
              className="btn-sepete-ekle"
              onClick={sepeteEkle}
              disabled={kitap.stok === 0}
            >
              🛒 {kullanici ? 'Sepete Ekle' : 'Giriş Yaparak Ekle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default KitapDetay;
