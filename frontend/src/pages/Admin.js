import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Admin.css';

function Admin() {
  const navigate = useNavigate();
  const [kitaplar, setKitaplar] = useState([]);
  const [kategoriler, setKategoriler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [form, setForm] = useState({ baslik: '', yazar: '', fiyat: '', stok: '', aciklama: '', kategoriId: '' });
  const [formHata, setFormHata] = useState('');
  const [formBasari, setFormBasari] = useState('');
  const [silOnay, setSilOnay] = useState(null);

  const kullanici = JSON.parse(localStorage.getItem('kullanici') || 'null');
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!kullanici || kullanici.rol !== 'ADMIN') {
      navigate('/');
      return;
    }
    verileriYukle();
  }, []);

  const verileriYukle = async () => {
    try {
      const [kitapRes, katRes] = await Promise.all([
        fetch('http://localhost:5000/api/kitaplar'),
        fetch('http://localhost:5000/api/kategoriler'),
      ]);
      const kitapData = await kitapRes.json();
      const katData = await katRes.json();
      setKitaplar(kitapData);
      setKategoriler(katData);
      if (katData.length > 0) setForm(f => ({ ...f, kategoriId: katData[0].id }));
    } finally {
      setYukleniyor(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const kitapEkle = async (e) => {
    e.preventDefault();
    setFormHata('');
    setFormBasari('');

    try {
      const res = await fetch('http://localhost:5000/api/kitaplar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          baslik: form.baslik,
          yazar: form.yazar,
          fiyat: parseFloat(form.fiyat),
          stok: parseInt(form.stok),
          aciklama: form.aciklama,
          kategoriId: parseInt(form.kategoriId),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setFormHata(data.mesaj || 'Hata oluştu');
        return;
      }

      setFormBasari('Kitap başarıyla eklendi!');
      setForm({ baslik: '', yazar: '', fiyat: '', stok: '', aciklama: '', kategoriId: kategoriler[0]?.id || '' });
      verileriYukle();
      setTimeout(() => setFormBasari(''), 3000);
    } catch {
      setFormHata('Sunucuya bağlanılamadı');
    }
  };

  const kitapSil = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/kitaplar/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setKitaplar(kitaplar.filter(k => k.id !== id));
      setSilOnay(null);
    } catch {}
  };

  if (yukleniyor) return <div className="admin-yuklen">Yükleniyor...</div>;

  return (
    <div className="admin-sayfa">
      <header className="navbar">
        <div className="navbar-logo">📚 Kitap Mağazası</div>
        <nav className="navbar-links">
          <Link to="/">Ana Sayfa</Link>
          <span className="navbar-kullanici">👤 {kullanici.ad} (Admin)</span>
        </nav>
      </header>

      <div className="admin-icerik">
        <h1>⚙️ Admin Paneli</h1>

        <div className="admin-layout">
          {/* KİTAP EKLEME FORMU */}
          <div className="admin-form-bolum">
            <h2>Yeni Kitap Ekle</h2>
            <form onSubmit={kitapEkle} className="admin-form">
              <div className="form-grup">
                <label>Kitap Adı</label>
                <input name="baslik" value={form.baslik} onChange={handleChange} placeholder="Kitap adı" required />
              </div>
              <div className="form-grup">
                <label>Yazar</label>
                <input name="yazar" value={form.yazar} onChange={handleChange} placeholder="Yazar adı" required />
              </div>
              <div className="form-row">
                <div className="form-grup">
                  <label>Fiyat (₺)</label>
                  <input name="fiyat" type="number" value={form.fiyat} onChange={handleChange} placeholder="0" required min="0" />
                </div>
                <div className="form-grup">
                  <label>Stok</label>
                  <input name="stok" type="number" value={form.stok} onChange={handleChange} placeholder="0" required min="0" />
                </div>
              </div>
              <div className="form-grup">
                <label>Kategori</label>
                <select name="kategoriId" value={form.kategoriId} onChange={handleChange} required>
                  {kategoriler.map(k => (
                    <option key={k.id} value={k.id}>{k.ad}</option>
                  ))}
                </select>
              </div>
              <div className="form-grup">
                <label>Açıklama</label>
                <textarea name="aciklama" value={form.aciklama} onChange={handleChange} placeholder="Kitap açıklaması (isteğe bağlı)" rows={3} />
              </div>

              {formHata && <div className="form-hata">{formHata}</div>}
              {formBasari && <div className="form-basari">{formBasari}</div>}

              <button type="submit" className="btn-ekle">+ Kitap Ekle</button>
            </form>
          </div>

          {/* KİTAP LİSTESİ */}
          <div className="admin-liste-bolum">
            <h2>Kitaplar ({kitaplar.length})</h2>
            <div className="admin-liste">
              {kitaplar.map(kitap => (
                <div key={kitap.id} className="admin-kitap-satir">
                  <div className="admin-kitap-bilgi">
                    <span className="admin-kitap-ad">{kitap.baslik}</span>
                    <span className="admin-kitap-alt">{kitap.yazar} · {kitap.fiyat} ₺ · Stok: {kitap.stok}</span>
                  </div>
                  {silOnay === kitap.id ? (
                    <div className="sil-onay">
                      <span>Emin misin?</span>
                      <button className="btn-evet" onClick={() => kitapSil(kitap.id)}>Evet</button>
                      <button className="btn-hayir" onClick={() => setSilOnay(null)}>Hayır</button>
                    </div>
                  ) : (
                    <button className="btn-sil" onClick={() => setSilOnay(kitap.id)}>🗑️</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin;
