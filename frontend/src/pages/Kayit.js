import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Kayit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ad: '', email: '', sifre: '', sifreTekrar: '' });
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');

    if (form.sifre !== form.sifreTekrar) {
      setHata('Şifreler eşleşmiyor');
      return;
    }

    if (form.sifre.length < 6) {
      setHata('Şifre en az 6 karakter olmalı');
      return;
    }

    setYukleniyor(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/kayit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ad: form.ad, email: form.email, sifre: form.sifre }),
      });

      const data = await res.json();

      if (!res.ok) {
        setHata(data.mesaj || 'Kayıt başarısız');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
      navigate('/');
    } catch {
      setHata('Sunucuya bağlanılamadı');
    } finally {
      setYukleniyor(false);
    }
  };

  return (
    <div className="auth-sayfa">
      <div className="auth-kart">
        <div className="auth-logo">📚</div>
        <h2>Kayıt Ol</h2>
        <p className="auth-alt-baslik">Yeni hesap oluştur</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grup">
            <label>Ad Soyad</label>
            <input
              type="text"
              name="ad"
              placeholder="Adınız Soyadınız"
              value={form.ad}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grup">
            <label>E-posta</label>
            <input
              type="email"
              name="email"
              placeholder="ornek@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grup">
            <label>Şifre</label>
            <input
              type="password"
              name="sifre"
              placeholder="En az 6 karakter"
              value={form.sifre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grup">
            <label>Şifre Tekrar</label>
            <input
              type="password"
              name="sifreTekrar"
              placeholder="Şifrenizi tekrar girin"
              value={form.sifreTekrar}
              onChange={handleChange}
              required
            />
          </div>

          {hata && <div className="hata-mesaji">{hata}</div>}

          <button type="submit" className="btn-auth" disabled={yukleniyor}>
            {yukleniyor ? 'Kayıt yapılıyor...' : 'Kayıt Ol'}
          </button>
        </form>

        <p className="auth-link">
          Zaten hesabın var mı? <Link to="/giris">Giriş Yap</Link>
        </p>
      </div>
    </div>
  );
}

export default Kayit;
