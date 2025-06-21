# NexusShop - Platform Jasa Social Media Marketing

## 📋 Deskripsi Project

NexusShop adalah platform e-commerce yang mengkhususkan diri dalam jasa social media marketing. Platform ini dibangun menggunakan **Laravel 12** sebagai backend dan **React + TypeScript** sebagai frontend, dengan arsitektur **SPA (Single Page Application)** menggunakan **Inertia.js**.

### 🎯 Tujuan Utama
- Menyediakan layanan jasa social media marketing (followers, likes, views, dll)
- Integrasi dengan payment gateway Midtrans untuk pembayaran
- Integrasi dengan API Medanpedia untuk pemesanan layanan
- Panel admin untuk manajemen order dan monitoring
- User experience yang modern dan responsif

---

## 🏗️ Arsitektur Sistem

### Backend (Laravel 12)
- **Framework**: Laravel 12 dengan PHP 8.2+
- **Database**: MySQL/PostgreSQL dengan Eloquent ORM
- **Authentication**: Laravel Breeze dengan session-based auth
- **API Integration**: Midtrans (payment) + Medanpedia (services)
- **Caching**: Redis/Memcached untuk optimasi performa

### Frontend (React + TypeScript)
- **Framework**: React 19 dengan TypeScript
- **Styling**: Tailwind CSS 4.0 dengan shadcn/ui components
- **State Management**: React Hooks + Inertia.js
- **Build Tool**: Vite 6.0 dengan optimasi performa
- **3D Graphics**: Three.js untuk visual effects

### Integrasi
- **Inertia.js**: Menghubungkan Laravel backend dengan React frontend
- **Ziggy**: Route generation untuk frontend
- **Service Workers**: Caching dan offline functionality

---

## 🗄️ Struktur Database

### 1. Tabel `users` - Manajemen User
```sql
users
├── id (Primary Key)
├── name (Nama lengkap user)
├── email (Email unik untuk login)
├── email_verified_at (Timestamp verifikasi email)
├── password (Password ter-hash)
├── remember_token (Token untuk "remember me")
├── created_at (Timestamp pembuatan)
└── updated_at (Timestamp update)
```

**Fungsi**: Menyimpan data user yang terdaftar dan login ke sistem.

### 2. Tabel `admins` - Panel Admin
```sql
admins
├── id (Primary Key)
├── name (Nama admin)
├── email (Email admin)
├── password (Password ter-hash)
├── role (Role admin: admin, super_admin)
├── is_active (Status aktif/nonaktif)
├── remember_token (Token untuk "remember me")
├── created_at (Timestamp pembuatan)
└── updated_at (Timestamp update)
```

**Fungsi**: Menyimpan data admin yang mengakses control panel.

### 3. Tabel `orders` - Data Pemesanan
```sql
orders
├── id (Primary Key)
├── order_id (ID unik order)
├── email (Email pemesan)
├── service_id (ID layanan dari Medanpedia)
├── service_name (Nama layanan)
├── target (Target akun/URL)
├── quantity (Jumlah yang dipesan)
├── comments (Komentar tambahan)
├── usernames (Username yang diproses)
├── price (Harga total)
├── status (Status: pending, processing, completed, cancelled, partial)
├── medanpedia_order_id (ID order di Medanpedia)
├── medanpedia_response (Response dari API Medanpedia)
├── start_count (Jumlah awal)
├── remains (Sisa yang belum diproses)
├── currency (Mata uang, default: IDR)
├── created_at (Timestamp pembuatan)
└── updated_at (Timestamp update)
```

**Fungsi**: Menyimpan semua data pemesanan layanan dari user.

### 4. Tabel `payments` - Data Pembayaran
```sql
payments
├── id (Primary Key)
├── order_id (Foreign Key ke orders)
├── payment_id (ID unik pembayaran)
├── midtrans_order_id (ID order di Midtrans)
├── payment_method (Metode: qris, bank_transfer, credit_card, dll)
├── amount (Jumlah pembayaran)
├── currency (Mata uang, default: IDR)
├── status (Status: pending, paid, failed, expired, cancelled)
├── midtrans_response (Response dari Midtrans)
├── transaction_id (ID transaksi Midtrans)
├── qr_code_url (URL QR Code untuk QRIS)
├── va_number (Nomor Virtual Account)
├── paid_at (Timestamp pembayaran)
├── expired_at (Timestamp expired)
├── created_at (Timestamp pembuatan)
└── updated_at (Timestamp update)
```

**Fungsi**: Menyimpan semua data pembayaran yang terintegrasi dengan Midtrans.

---

## 🔄 Alur Kerja Sistem

### 1. Alur Pemesanan User
```
1. User membuka website → Welcome page
2. User memilih layanan → Products page
3. User mengisi form order → Order/Create page
4. Sistem validasi input dan kalkulasi harga
5. Sistem membuat record di tabel orders
6. Sistem redirect ke halaman payment
7. User memilih metode pembayaran
8. Sistem integrasi dengan Midtrans
9. User melakukan pembayaran
10. Midtrans webhook update status payment
11. Sistem update status order dan payment
12. Sistem integrasi dengan Medanpedia untuk proses layanan
```

### 2. Alur Pembayaran
```
1. User klik "Proceed to Payment"
2. OrderController membuat payment record
3. MidtransService create transaction
4. Midtrans return payment data (QR Code, VA Number, dll)
5. User scan QR Code atau transfer ke VA
6. Midtrans kirim webhook ke /webhook/midtrans
7. Sistem validasi signature webhook
8. Sistem update status payment dan order
9. Jika berhasil, sistem kirim order ke Medanpedia
```

### 3. Alur Monitoring Order
```
1. Admin login ke control panel
2. Admin lihat dashboard dengan statistik
3. Admin monitor order status real-time
4. Sistem auto-check status dari Medanpedia
5. Admin bisa manual update status jika perlu
6. Sistem kirim notifikasi ke user
```

---

## 🛠️ Komponen Utama

### 1. Controllers

#### `OrderController.php`
- **Fungsi**: Menangani semua operasi terkait order
- **Method Utama**:
  - `create()`: Tampilkan form pembuatan order
  - `store()`: Simpan order baru ke database
  - `payment()`: Tampilkan halaman pembayaran
  - `status()`: Tampilkan status order
  - `checkStatus()`: Check status real-time
  - `webhook()`: Handle webhook dari Midtrans

#### `AuthController.php`
- **Fungsi**: Menangani autentikasi user
- **Method**: Login, register, logout, profile management

#### `SocialMediaController.php`
- **Fungsi**: Menangani halaman produk social media
- **Method**: Tampilkan layanan, search, filter

### 2. Services

#### `MidtransService.php`
- **Fungsi**: Integrasi dengan payment gateway Midtrans
- **Method Utama**:
  - `createTransaction()`: Buat transaksi pembayaran
  - `getTransactionStatus()`: Check status transaksi
  - `validateNotificationSignature()`: Validasi webhook
  - `processNotification()`: Proses data webhook

#### `MedanpediaService.php`
- **Fungsi**: Integrasi dengan API Medanpedia untuk layanan
- **Method Utama**:
  - `getAllServices()`: Ambil semua layanan
  - `getServicesByCategory()`: Filter layanan by kategori
  - `checkOrderStatus()`: Check status order di Medanpedia
  - `createOrder()`: Buat order di Medanpedia

### 3. Models

#### `User.php`
- **Fungsi**: Model untuk user authentication
- **Relationships**: `hasMany(Order::class)`

#### `Order.php`
- **Fungsi**: Model untuk data pemesanan
- **Relationships**: `hasOne(Payment::class)`
- **Accessors**: `getStatusColorAttribute()`, `getStatusLabelAttribute()`

#### `Payment.php`
- **Fungsi**: Model untuk data pembayaran
- **Relationships**: `belongsTo(Order::class)`
- **Accessors**: Status colors, payment method labels

#### `Admin.php`
- **Fungsi**: Model untuk admin control panel

### 4. Middleware

#### `AdminAuth.php`
- **Fungsi**: Proteksi route admin
- **Logic**: Check session admin, redirect ke login jika belum auth

#### `ForceHttps.php`
- **Fungsi**: Force redirect HTTP ke HTTPS
- **Logic**: Redirect semua request ke HTTPS untuk security

#### `HandleInertiaRequests.php`
- **Fungsi**: Handle Inertia.js requests
- **Logic**: Share data ke frontend, handle versioning

---

## 🎨 Frontend Components

### 1. Layout Components
- **`app-layout.tsx`**: Layout utama aplikasi
- **`app-header.tsx`**: Header dengan navigation
- **`app-sidebar.tsx`**: Sidebar untuk admin panel
- **`auth-layout.tsx`**: Layout untuk halaman auth

### 2. Page Components
- **`welcome.tsx`**: Landing page dengan hero section
- **`products.tsx`**: Halaman produk social media
- **`order/create.tsx`**: Form pembuatan order
- **`order/payment.tsx`**: Halaman pembayaran
- **`order/status.tsx`**: Status tracking order
- **`control-panel/dashboard.tsx`**: Dashboard admin

### 3. UI Components (shadcn/ui)
- **`button.tsx`**: Button component dengan variants
- **`card.tsx`**: Card layout component
- **`dialog.tsx`**: Modal dialog component
- **`input.tsx`**: Input form component
- **`select.tsx`**: Dropdown select component

### 4. Special Components
- **`three-scene.tsx`**: 3D background dengan Three.js
- **`PerformanceMonitor.tsx`**: Monitoring performa aplikasi
- **`GoogleAnalytics.tsx`**: Integration Google Analytics
- **`SessionNotification.tsx`**: Notifikasi session timeout

---

## 🔧 Konfigurasi & Setup

### 1. Environment Variables (.env)
```env
# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexusshop
DB_USERNAME=root
DB_PASSWORD=

# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_server_key
MIDTRANS_CLIENT_KEY=your_client_key
MIDTRANS_MERCHANT_ID=your_merchant_id
MIDTRANS_SANDBOX=true

# Medanpedia Configuration
MEDANPEDIA_API_KEY=your_api_key
MEDANPEDIA_API_ID=your_api_id

# App Configuration
APP_NAME="NexusShop"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com
```

### 2. Database Migration
```bash
# Jalankan migration untuk membuat tabel
php artisan migrate

# Jalankan seeder untuk data awal
php artisan db:seed
```

### 3. Frontend Build
```bash
# Install dependencies
npm install

# Development mode
npm run dev

# Production build
npm run build
```

---

## 🚀 Deployment & Performance

### 1. Performance Optimizations
- **Critical CSS**: Inline CSS untuk above-the-fold content
- **Service Worker**: Caching static assets
- **Lazy Loading**: Components dan images
- **Database Indexing**: Optimasi query performance
- **Redis Caching**: Cache API responses

### 2. Security Features
- **CSRF Protection**: Laravel built-in CSRF tokens
- **HTTPS Enforcement**: Force semua traffic ke HTTPS
- **Input Validation**: Validasi semua user input
- **SQL Injection Protection**: Eloquent ORM protection
- **XSS Protection**: Output escaping

### 3. Monitoring & Logging
- **Error Tracking**: Laravel logging system
- **Performance Monitoring**: Custom performance metrics
- **Payment Logging**: Log semua transaksi payment
- **API Logging**: Log semua API calls

---

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

### Features
- **Mobile-first**: Design dimulai dari mobile
- **Touch-friendly**: Button dan input yang mudah di-touch
- **Progressive Enhancement**: Fitur tambahan untuk device yang lebih powerful

---

## 🔄 API Integrations

### 1. Midtrans Payment Gateway
- **Endpoint**: `https://api.midtrans.com/v2`
- **Methods**: QRIS, Bank Transfer, Credit Card, E-Wallet
- **Webhook**: Real-time payment status updates
- **Security**: Signature validation untuk webhook

### 2. Medanpedia Services API
- **Endpoint**: `https://api.medanpedia.co.id`
- **Services**: Social media marketing services
- **Status Check**: Real-time order status
- **Caching**: 1 hour cache untuk service list

---

## 🧪 Testing

### 1. Backend Testing
```bash
# Run PHP tests
php artisan test

# Run specific test
php artisan test --filter OrderTest
```

### 2. Frontend Testing
```bash
# Run TypeScript type checking
npm run types

# Run ESLint
npm run lint

# Run Prettier
npm run format
```

---

## 📊 Monitoring & Analytics

### 1. Google Analytics
- **Page Views**: Track semua halaman
- **Events**: Track user interactions
- **E-commerce**: Track order conversions

### 2. Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS
- **Custom Metrics**: Order completion time
- **Error Tracking**: JavaScript errors

---

## 🔧 Maintenance & Updates

### 1. Regular Tasks
- **Database Backup**: Daily automated backups
- **Log Rotation**: Archive old log files
- **Cache Clearing**: Clear expired cache
- **Security Updates**: Update dependencies

### 2. Monitoring Alerts
- **Payment Failures**: Alert untuk payment yang gagal
- **API Errors**: Alert untuk API integration errors
- **Performance Issues**: Alert untuk slow response times

---

## 📚 Learning Resources

### Laravel
- [Laravel Documentation](https://laravel.com/docs)
- [Eloquent ORM](https://laravel.com/docs/eloquent)
- [Laravel Testing](https://laravel.com/docs/testing)

### React + TypeScript
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Inertia.js Documentation](https://inertiajs.com)

### Payment Integration
- [Midtrans Documentation](https://docs.midtrans.com)
- [Webhook Security](https://docs.midtrans.com/docs/webhook-security)

---

## 🤝 Contributing

### Development Workflow
1. **Fork** repository
2. **Create** feature branch
3. **Make** changes dengan testing
4. **Submit** pull request
5. **Code review** dan merge

### Code Standards
- **PHP**: PSR-12 coding standards
- **JavaScript**: ESLint + Prettier
- **TypeScript**: Strict mode enabled
- **Testing**: Minimum 80% coverage

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 📞 Support

Untuk pertanyaan atau dukungan teknis:
- **Email**: support@nexusshop.com
- **Documentation**: [docs.nexusshop.com](https://docs.nexusshop.com)
- **Issues**: [GitHub Issues](https://github.com/nexusshop/issues)

---

*Dibuat dengan ❤️ menggunakan Laravel 12 + React + TypeScript* 