# Analisis Kode NexusShop Laravel Application

## 1. Koneksi Database

### Konfigurasi Database
- **File Konfigurasi**: `config/database.php`
- **Database Default**: SQLite (in-memory database)
- **Driver**: SQLite dengan PDO
- **Konfigurasi**:
  ```php
  'default' => env('DB_CONNECTION', 'sqlite'),
  'connections' => [
      'sqlite' => [
          'driver' => 'sqlite',
          'database' => ':memory:',
          'prefix' => '',
          'foreign_key_constraints' => env('DB_FOREIGN_KEYS', true),
      ],
  ]
  ```

### Cara Menghubungkan Database ke PHP
1. **Laravel Eloquent ORM**: Menggunakan model-model yang sudah didefinisikan
2. **Migration**: File migration untuk membuat struktur tabel
3. **Model Relationships**: Relasi antar tabel menggunakan Eloquent
4. **Environment Variables**: Konfigurasi database melalui file `.env`

## 2. Struktur Database dan Tabel

### Jumlah Tabel: 5 Tabel

#### 1. Tabel `admins`
- **File Migration**: `2025_06_07_103626_create_admins_table.php`
- **Kolom**:
  - `id` (Primary Key)
  - `name` (string)
  - `email` (string, unique)
  - `password` (string)
  - `role` (string, default: 'admin')
  - `is_active` (boolean, default: true)
  - `remember_token` (string)
  - `created_at`, `updated_at` (timestamps)

#### 2. Tabel `users`
- **File Migration**: `2025_06_20_002749_create_users_table.php`
- **Kolom**:
  - `id` (Primary Key)
  - `name` (string)
  - `email` (string, unique)
  - `email_verified_at` (timestamp, nullable)
  - `password` (string)
  - `remember_token` (string)
  - `created_at`, `updated_at` (timestamps)

#### 3. Tabel `orders`
- **File Migration**: `2025_06_19_083611_create_orders_table.php`
- **Kolom**:
  - `id` (Primary Key)
  - `user_id` (foreign key ke users, nullable)
  - `order_id` (string, unique)
  - `email` (string)
  - `service_id` (integer)
  - `service_name` (string)
  - `target` (string)
  - `quantity` (integer)
  - `comments` (text, nullable)
  - `usernames` (text, nullable)
  - `price` (decimal 10,2)
  - `status` (string, default: 'pending')
  - `medanpedia_order_id` (string, nullable)
  - `medanpedia_response` (text, nullable)
  - `start_count` (integer, nullable)
  - `remains` (integer, nullable)
  - `currency` (string 3, default: 'IDR')
  - `created_at`, `updated_at` (timestamps)

#### 4. Tabel `payments`
- **File Migration**: `2025_06_19_083614_create_payments_table.php`
- **Kolom**:
  - `id` (Primary Key)
  - `order_id` (foreign key ke orders)
  - `payment_id` (string, unique)
  - `midtrans_order_id` (string, unique)
  - `payment_method` (string)
  - `amount` (decimal 10,2)
  - `currency` (string 3, default: 'IDR')
  - `status` (string, default: 'pending')
  - `midtrans_response` (text, nullable)
  - `transaction_id` (string, nullable)
  - `qr_code_url` (string, nullable)
  - `va_number` (string, nullable)
  - `paid_at` (timestamp, nullable)
  - `expired_at` (timestamp, nullable)
  - `created_at`, `updated_at` (timestamps)

#### 5. Tabel `recent_activities`
- **File Migration**: `2025_06_21_204615_create_recent_activities_table.php`
- **Kolom**:
  - `id` (Primary Key)
  - `type` (string)
  - `description` (text)
  - `subject_type` (string) - Polymorphic relation
  - `subject_id` (integer) - Polymorphic relation
  - `created_at`, `updated_at` (timestamps)

### Relasi Antar Tabel
- **users** ↔ **orders**: One-to-Many (user bisa punya banyak order)
- **orders** ↔ **payments**: One-to-One (satu order punya satu payment)
- **orders** ↔ **recent_activities**: Polymorphic (order bisa punya banyak activity)

## 3. Controller yang Digunakan

### Jumlah Controller: 6 Controller

#### 1. `OrderController` (File: `app/Http/Controllers/OrderController.php`)
- **Ukuran**: 26KB, 666 baris
- **Fungsi Utama**: Menangani proses order dan payment

#### 2. `CallbackController` (File: `app/Http/Controllers/CallbackController.php`)
- **Ukuran**: 20KB, 563 baris
- **Fungsi Utama**: Menangani callback dari payment gateway

#### 3. `AuthController` (File: `app/Http/Controllers/Auth/AuthController.php`)
- **Ukuran**: 3.3KB, 107 baris
- **Fungsi Utama**: Autentikasi user biasa

#### 4. `ControlPanel\AuthController` (File: `app/Http/Controllers/ControlPanel/AuthController.php`)
- **Ukuran**: 4.2KB, 131 baris
- **Fungsi Utama**: Autentikasi admin

#### 5. `ProfileController` (File: `app/Http/Controllers/ProfileController.php`)
- **Ukuran**: 2.3KB, 79 baris
- **Fungsi Utama**: Manajemen profil user

#### 6. `SocialMediaController` (File: `app/Http/Controllers/SocialMediaController.php`)
- **Ukuran**: 3.3KB, 93 baris
- **Fungsi Utama**: Menangani produk social media

## 4. Fungsi-fungsi yang Digunakan

### Total Fungsi: 18 Fungsi

#### OrderController (6 fungsi)
1. **`create(Request $request)`** - Menampilkan halaman pembuatan order
2. **`store(Request $request)`** - Menyimpan order baru dan membuat payment
3. **`payment($orderId)`** - Menampilkan halaman payment
4. **`status($orderId)`** - Menampilkan status order
5. **`checkStatus($orderId)`** - Mengecek status order dari API eksternal
6. **`markAsPaid($orderId)`** - Menandai order sebagai sudah dibayar
7. **`webhook(Request $request)`** - Menangani webhook dari Midtrans

#### AuthController (User) (5 fungsi)
1. **`showLogin()`** - Menampilkan halaman login
2. **`showRegister()`** - Menampilkan halaman register
3. **`login(Request $request)`** - Proses login user
4. **`register(Request $request)`** - Proses registrasi user
5. **`logout(Request $request)`** - Proses logout user

#### ControlPanel\AuthController (Admin) (4 fungsi)
1. **`showLogin()`** - Menampilkan halaman login admin
2. **`login(Request $request)`** - Proses login admin
3. **`logout(Request $request)`** - Proses logout admin
4. **`dashboard(Request $request)`** - Menampilkan dashboard admin

#### ProfileController (3 fungsi)
1. **`edit()`** - Menampilkan halaman edit profil
2. **`update(Request $request)`** - Update data profil
3. **`orders()`** - Menampilkan riwayat order user

#### SocialMediaController (2 fungsi)
1. **`show($category)`** - Menampilkan produk social media berdasarkan kategori
2. **`search(Request $request)`** - Mencari layanan social media

#### CallbackController (1 fungsi)
1. **`handle(Request $request)`** - Menangani callback dari payment gateway

## 5. Model yang Digunakan

### Jumlah Model: 5 Model

1. **`Admin`** - Model untuk tabel admins
2. **`User`** - Model untuk tabel users
3. **`Order`** - Model untuk tabel orders
4. **`Payment`** - Model untuk tabel payments
5. **`RecentActivity`** - Model untuk tabel recent_activities

## 6. Fitur Utama Aplikasi

### E-commerce Social Media Services
- **Order Management**: Sistem pemesanan layanan social media
- **Payment Integration**: Integrasi dengan Midtrans payment gateway
- **User Authentication**: Sistem login/register untuk user
- **Admin Panel**: Panel admin untuk mengelola sistem
- **Activity Tracking**: Pencatatan aktivitas user dan order
- **API Integration**: Integrasi dengan Medanpedia API untuk layanan social media

### Payment Methods
- QRIS
- Bank Transfer
- Credit Card
- Virtual Account

### Order Status
- Pending
- Processing
- Completed
- Cancelled
- Partial

### Payment Status
- Pending
- Paid
- Failed
- Expired
- Cancelled

## 7. Teknologi yang Digunakan

- **Framework**: Laravel (PHP)
- **Frontend**: React + TypeScript + Inertia.js
- **Database**: SQLite (in-memory)
- **Payment Gateway**: Midtrans
- **API Integration**: Medanpedia
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## 8. Struktur Routing

### Authentication Routes
- `/login` - Login user
- `/register` - Register user
- `/logout` - Logout user

### Order Routes
- `/order/create` - Buat order
- `/order/store` - Simpan order
- `/order/{orderId}/payment` - Halaman payment
- `/order/{orderId}/status` - Status order
- `/order/{orderId}/check-status` - Cek status order
- `/order/{orderId}/mark-as-paid` - Tandai sudah dibayar

### Admin Routes
- `/control-panel/login` - Login admin
- `/control-panel/dashboard` - Dashboard admin
- `/control-panel/logout` - Logout admin

### Product Routes
- `/products` - Halaman produk
- `/products/social/{category}` - Produk social media
- `/api/services/search` - API pencarian layanan

### Profile Routes
- `/profile` - Edit profil
- `/orders` - Riwayat order

## 9. Kesimpulan

NexusShop adalah aplikasi e-commerce Laravel yang fokus pada layanan social media. Aplikasi ini memiliki:

- **5 tabel database** dengan relasi yang kompleks
- **6 controller** dengan total 18 fungsi
- **5 model** untuk interaksi database
- **Integrasi payment gateway** (Midtrans)
- **API integration** (Medanpedia)
- **Sistem autentikasi** untuk user dan admin
- **Activity tracking** untuk monitoring aktivitas
- **Modern frontend** dengan React + TypeScript

Aplikasi ini dirancang dengan arsitektur yang baik menggunakan Laravel best practices, dengan pemisahan yang jelas antara logic bisnis, data layer, dan presentation layer. 