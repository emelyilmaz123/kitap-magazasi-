import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-icerik">
        <div className="footer-sutun">
          <div className="footer-logo">📚 Kitap Mağazası</div>
          <p className="footer-aciklama">
            Binlerce kitap, uygun fiyatlar ve hızlı teslimatla okuma keyfini yaşatıyoruz.
          </p>
        </div>

        <div className="footer-sutun">
          <h4>Hızlı Bağlantılar</h4>
          <ul>
            <li><Link to="/">Ana Sayfa</Link></li>
            <li><Link to="/#kategoriler">Kategoriler</Link></li>
            <li><Link to="/sepet">Sepetim</Link></li>
            <li><Link to="/siparislerim">Siparişlerim</Link></li>
          </ul>
        </div>

        <div className="footer-sutun">
          <h4>Hesap</h4>
          <ul>
            <li><Link to="/giris">Giriş Yap</Link></li>
            <li><Link to="/kayit">Kayıt Ol</Link></li>
          </ul>
        </div>

        <div className="footer-sutun">
          <h4>İletişim</h4>
          <ul>
            <li>📧 destek@kitapmag.com</li>
            <li>📞 0850 000 00 00</li>
            <li>📍 İstanbul, Türkiye</li>
          </ul>
        </div>
      </div>

      <div className="footer-alt">
        <p>© 2024 Kitap Mağazası. Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
}

export default Footer;
