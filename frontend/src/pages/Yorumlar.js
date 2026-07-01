import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Yorumlar.css';
import Footer from '../components/Footer';

function Yorumlar() {
  const [form, setForm] = useState({ kitapAdi: '', yorum: '' });
  const [yorumlar, setYorumlar] = useState([]);
  const [acikYorum, setAcikYorum] = useState(null);
  const [gonderiliyor, setGonderiliyor] = useState(false);
  const [basari, setBasari] = useState('');
  const [hata, setHata] = useState('');

  const kullanici = JSON.parse(localStorage.getItem('kullanici') || 'null');

  useEffect(() => {
    yorumlariYukle();
  }, []);

  const yorumlariYukle = () => {
    fetch('http://localhost:5000/api/yorumlar')
      .then(res => res.json())
      .then(data => setYorumlar(data))
      .catch(() => {});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setBasari('');
    if (!form.kitapAdi.trim() || !form.yorum.trim()) {
      setHata('Lütfen kitap adı ve yorumunuzu girin.');
      return;
    }
    setGonderiliyor(true);
    try {
      const res = await fetch('http://localhost:5000/api/yorumlar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kitapAdi: form.kitapAdi.trim(),
          yorum: form.yorum.trim(),
          yazarAdi: kullanici?.ad || 'Anonim',
        }),
      });
      if (res.ok) {
        setBasari('Yorumunuz başarıyla gönderildi!');
        setForm({ kitapAdi: '', yorum: '' });
        yorumlariYukle();
        setTimeout(() => setBasari(''), 3000);
      } else {
        setHata('Yorum gönderilemedi, tekrar dene.');
      }
    } catch {
      setHata('Sunucuya bağlanılamadı.');
    } finally {
      setGonderiliyor(false);
    }
  };

  return (
    <div className="yorumlar-sayfa">
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <Link to="/">Ana Sayfa</Link>
          {kullanici && <span className="navbar-kullanici">👤 {kullanici.ad}</span>}
        </nav>
      </header>

      <div className="yorumlar-icerik">
        <h1>💬 Kitap Yorumları</h1>
        <p className="yorumlar-aciklama">Okuduğun kitap hakkındaki görüşlerini paylaş.</p>

        <div className="yorum-form-kart">
          <h2>Yorum Yaz</h2>
          <form onSubmit={handleSubmit} className="yorum-form">
            <div className="form-grup">
              <label>Kitap Adı</label>
              <input
                type="text"
                placeholder="Yorumladığınız kitabın adını girin"
                value={form.kitapAdi}
                onChange={e => setForm({ ...form, kitapAdi: e.target.value })}
              />
            </div>
            <div className="form-grup">
              <label>Yorumunuz</label>
              <textarea
                placeholder="Bu kitap hakkındaki düşüncelerinizi paylaşın..."
                rows={5}
                value={form.yorum}
                onChange={e => setForm({ ...form, yorum: e.target.value })}
              />
            </div>
            {hata && <div className="yorum-hata">{hata}</div>}
            {basari && <div className="yorum-basari">{basari}</div>}
            <button type="submit" className="btn-gonder" disabled={gonderiliyor}>
              {gonderiliyor ? 'Gönderiliyor...' : '📨 Gönder'}
            </button>
          </form>
        </div>

        <div className="yorumlar-liste-bolum">
          <h2>Tüm Yorumlar <span className="yorum-sayisi">{yorumlar.length} yorum</span></h2>

          {yorumlar.length === 0 ? (
            <div className="yorum-bos">
              <p>Henüz yorum yapılmamış. İlk yorumu sen yap!</p>
            </div>
          ) : (
            <table className="yorumlar-tablo">
              <thead>
                <tr>
                  <th>Kitap Adı</th>
                  <th>Yorumcu</th>
                  <th>Tarih</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {yorumlar.map(y => (
                  <>
                    <tr key={y.id} className="yorum-satir">
                      <td className="yorum-kitap-adi">📖 {y.kitapAdi}</td>
                      <td className="yorum-yazar">👤 {y.yazarAdi}</td>
                      <td className="yorum-tarih">
                        {new Date(y.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </td>
                      <td>
                        <button
                          className="btn-yorumu-oku"
                          onClick={() => setAcikYorum(acikYorum === y.id ? null : y.id)}
                        >
                          {acikYorum === y.id ? '▲ Kapat' : '▼ Yorumu Oku'}
                        </button>
                      </td>
                    </tr>
                    {acikYorum === y.id && (
                      <tr key={`${y.id}-detay`} className="yorum-detay-satir">
                        <td colSpan={4}>
                          <div className="yorum-detay-icerik">
                            {y.yorum}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Yorumlar;
