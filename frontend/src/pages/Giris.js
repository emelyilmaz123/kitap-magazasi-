import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

function Giris() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', sifre: '' });
  const [hata, setHata] = useState('');
  const [yukleniyor, setYukleniyor] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHata('');
    setYukleniyor(true);

    try {
      const res = await fetch('http://localhost:5000/api/auth/giris', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setHata(data.mesaj || 'Giriş başarısız');
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
        <h2>Giriş Yap</h2>
        <p className="auth-alt-baslik">Hesabına hoş geldin</p>

        <form onSubmit={handleSubmit} className="auth-form">
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
              placeholder="Şifrenizi girin"
              value={form.sifre}
              onChange={handleChange}
              required
            />
          </div>

          {hata && <div className="hata-mesaji">{hata}</div>}

          <button type="submit" className="btn-auth" disabled={yukleniyor}>
            {yukleniyor ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-link">
          Hesabın yok mu? <Link to="/kayit">Kayıt Ol</Link>
        </p>
      </div>
    </div>
  );
}

export default Giris;
