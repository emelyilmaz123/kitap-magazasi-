# 📚 Kitap Mağazası

Türk ve dünya edebiyatından 58+ kitabın yer aldığı tam stack kitap satış uygulaması.

## Teknolojiler

**Frontend**
- React (Create React App)
- React Router DOM
- CSS (özel tasarım)

**Backend**
- Node.js + Express 5
- Prisma ORM
- JWT kimlik doğrulama

**Veritabanı**
- PostgreSQL (Supabase)

## Kurulum

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

> Backend `localhost:5000`, frontend `localhost:3000` portunda çalışır.

### Ortam Değişkenleri

`backend/.env` dosyasına aşağıdaki değişkenleri ekle:

```
DATABASE_URL=...
DIRECT_URL=...
JWT_SECRET=...
```

## Özellikler

### Kullanıcı
- Giriş / Kayıt (JWT tabanlı)
- Kitapları listeleme ve kategori filtreleme
- Kitap detay sayfası (açıklama, stok durumu)
- Sepete ekleme ve sepet yönetimi
- Sipariş verme
- Sipariş geçmişini görüntüleme
- Kitap yorum sayfası (yorum yazma ve okuma)

### Admin
- Yeni kitap ekleme
- Kitap silme
- Sipariş durumu güncelleme (Hazırlanıyor / Kargoda / Teslim Edildi)

### Tasarım
- Koyu tema (`#1a1a2e`)
- Hero bölümünde Atatürk görseli ve kitap sözü
- Tüm sayfalarda ortak footer (hızlı bağlantılar, iletişim)
- Responsive kart grid yapısı
- OpenLibrary API'den otomatik kitap kapak görselleri

## Sayfalar

| Sayfa | URL |
|-------|-----|
| Ana Sayfa | `/` |
| Giriş | `/giris` |
| Kayıt | `/kayit` |
| Kitap Detay | `/kitap/:id` |
| Sepet | `/sepet` |
| Siparişlerim | `/siparislerim` |
| Yorumlar | `/yorumlar` |
| Admin Paneli | `/admin` |

## Veritabanı Modelleri

`Kullanici` · `Kitap` · `Kategori` · `Sepet` · `SepetiKitap` · `Siparis` · `SiparisKalemi` · `Yorum`
