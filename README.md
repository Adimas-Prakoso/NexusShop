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

## 📁 **PANDUAN LENGKAP FILE-BY-FILE (Untuk Non-Programmer)**

### 🎯 **Bagian Ini Khusus Untuk Anda Yang Tidak Tahu Coding**

Jika Anda tidak familiar dengan programming, bagian ini akan menjelaskan **file mana yang penting** dan **apa fungsinya** dalam bahasa yang mudah dipahami.

---

## 🗂️ **STRUKTUR FILE PENTING (File-by-File Guide)**

### **1. FILE KONFIGURASI UTAMA**

#### 📄 **`.env`** (File Konfigurasi Rahasia)
**Lokasi**: Root folder project
**Fungsi**: File ini seperti "kunci rumah" - berisi semua password dan setting penting
**Yang Diisi Di Sini**:
- Password database
- API key Midtrans (untuk pembayaran)
- API key Medanpedia (untuk layanan)
- URL website

**Contoh Isi**:
```env
DB_PASSWORD=rahasia123
MIDTRANS_SERVER_KEY=SB-Mid-server-ABC123
MEDANPedia_API_KEY=medanpedia123
```

#### 📄 **`composer.json`** (Daftar Bahan Laravel)
**Lokasi**: Root folder
**Fungsi**: Seperti "daftar belanja" - berisi semua library PHP yang dibutuhkan
**Yang Penting**:
- Laravel framework
- Inertia.js untuk koneksi frontend-backend
- Library untuk payment gateway

#### 📄 **`package.json`** (Daftar Bahan React)
**Lokasi**: Root folder
**Fungsi**: Seperti "daftar belanja" untuk bagian website yang user lihat
**Yang Penting**:
- React framework
- Tailwind CSS untuk styling
- Three.js untuk efek 3D

---

### **2. FILE DATABASE (Tempat Menyimpan Data)**

#### 📄 **`database/migrations/2025_06_20_002749_create_users_table.php`**
**Lokasi**: `database/migrations/` folder
**Fungsi**: Membuat tabel untuk menyimpan data user
**Yang Disimpan**:
- Nama user
- Email user
- Password (terenkripsi)
- Tanggal daftar

**Kode Penting** (Line 15-25):
```php
Schema::create('users', function (Blueprint $table) {
    $table->id();                    // ID unik user
    $table->string('name');          // Nama user
    $table->string('email')->unique(); // Email (tidak boleh sama)
    $table->string('password');      // Password (terenkripsi)
    $table->timestamps();            // Tanggal buat & update
});
```

#### 📄 **`database/migrations/2025_06_19_083611_create_orders_table.php`**
**Lokasi**: `database/migrations/` folder
**Fungsi**: Membuat tabel untuk menyimpan semua pesanan
**Yang Disimpan**:
- ID pesanan unik
- Email pemesan
- Jenis layanan yang dipilih
- Jumlah yang dipesan
- Harga total
- Status pesanan

**Kode Penting** (Line 15-35):
```php
Schema::create('orders', function (Blueprint $table) {
    $table->id();                           // ID unik
    $table->string('order_id')->unique();   // Kode pesanan (ORD-ABC123)
    $table->string('email');                // Email pemesan
    $table->integer('service_id');          // ID layanan dari Medanpedia
    $table->string('service_name');         // Nama layanan
    $table->string('target');               // Target (username/URL)
    $table->integer('quantity');            // Jumlah yang dipesan
    $table->decimal('price', 10, 2);        // Harga total
    $table->string('status')->default('pending'); // Status: pending/processing/completed
});
```

#### 📄 **`database/migrations/2025_06_19_083614_create_payments_table.php`**
**Lokasi**: `database/migrations/` folder
**Fungsi**: Membuat tabel untuk menyimpan data pembayaran
**Yang Disimpan**:
- ID pembayaran
- Metode pembayaran (QRIS/Bank Transfer)
- Jumlah yang dibayar
- Status pembayaran
- QR Code URL (untuk QRIS)

**Kode Penting** (Line 15-30):
```php
Schema::create('payments', function (Blueprint $table) {
    $table->id();                           // ID unik
    $table->foreignId('order_id');          // Hubungan ke tabel orders
    $table->string('payment_id')->unique(); // Kode pembayaran (PAY-ABC123)
    $table->string('payment_method');       // QRIS, bank_transfer, dll
    $table->decimal('amount', 10, 2);       // Jumlah pembayaran
    $table->string('status')->default('pending'); // Status pembayaran
    $table->string('qr_code_url')->nullable(); // URL QR Code
    $table->string('va_number')->nullable(); // Nomor Virtual Account
});
```

---

### **3. FILE LOGIKA BISNIS (Otak Sistem)**

#### 📄 **`app/Http/Controllers/OrderController.php`**
**Lokasi**: `app/Http/Controllers/` folder
**Fungsi**: Ini adalah "otak" yang mengatur semua proses pemesanan dan pembayaran
**Yang Dilakukan**:
- Menerima pesanan dari user
- Membuat pembayaran di Midtrans
- Menerima webhook dari Midtrans
- Update status pesanan

**Kode Penting - Membuat Pesanan** (Line 25-45):
```php
public function store(Request $request)
{
    // Validasi data dari form
    $request->validate([
        'email' => 'required|email',        // Email harus valid
        'service_id' => 'required|integer', // ID layanan harus ada
        'target' => 'required|string',      // Target harus diisi
        'quantity' => 'required|integer|min:1', // Jumlah minimal 1
        'price' => 'required|numeric|min:0',    // Harga harus valid
    ]);

    // Buat ID pesanan unik
    $orderId = 'ORD-' . strtoupper(Str::random(10)); // Contoh: ORD-ABC123DEF4

    // Simpan ke database
    $order = Order::create([
        'order_id' => $orderId,
        'email' => $request->email,
        'service_id' => $request->service_id,
        'target' => $request->target,
        'quantity' => $request->quantity,
        'price' => $request->price,
        'status' => 'pending',
    ]);
}
```

**Kode Penting - Webhook Midtrans** (Line 617-650):
```php
public function webhook(Request $request)
{
    // Terima notifikasi dari Midtrans
    $notificationData = $request->all();
    
    // Validasi signature untuk keamanan
    if (!$this->validateMidtransSignature($notificationData)) {
        return response('Invalid signature', 400);
    }
    
    // Update status pembayaran
    $payment = Payment::where('midtrans_order_id', $notificationData['order_id'])->first();
    $payment->update([
        'status' => $this->mapMidtransStatus($notificationData['transaction_status']),
        'paid_at' => now(),
    ]);
    
    // Jika pembayaran berhasil, kirim ke Medanpedia
    if ($payment->status === 'paid') {
        $this->processOrderWithMedanpedia($payment->order);
    }
}
```

#### 📄 **`app/Services/MidtransService.php`**
**Lokasi**: `app/Services/` folder
**Fungsi**: Khusus untuk komunikasi dengan payment gateway Midtrans
**Yang Dilakukan**:
- Membuat transaksi pembayaran
- Menerima webhook dari Midtrans
- Validasi keamanan webhook

**Kode Penting - Buat Transaksi** (Line 80-110):
```php
public function createTransaction(array $transactionData): ?array
{
    try {
        // Kirim request ke Midtrans
        $response = Http::withBasicAuth($this->serverKey, '')
            ->withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
            ])
            ->post("{$this->baseUrl}/charge", $transactionData);

        if ($response->successful()) {
            return $response->json(); // Return data QR Code, VA Number, dll
        }

        // Log error jika gagal
        Log::error('Failed to create Midtrans transaction', [
            'data' => $transactionData,
            'status' => $response->status(),
            'body' => $response->body()
        ]);

        return null;
    } catch (\Exception $e) {
        Log::error('Exception when creating Midtrans transaction', [
            'error' => $e->getMessage()
        ]);
        return null;
    }
}
```

#### 📄 **`app/Services/MedanpediaService.php`**
**Lokasi**: `app/Services/` folder
**Fungsi**: Khusus untuk komunikasi dengan API Medanpedia (penyedia layanan)
**Yang Dilakukan**:
- Ambil daftar layanan yang tersedia
- Kirim pesanan ke Medanpedia
- Check status pesanan

**Kode Penting - Ambil Layanan** (Line 20-40):
```php
public function getAllServices()
{
    try {
        // Cache untuk 1 jam agar tidak terlalu sering call API
        return Cache::remember('medanpedia_services', 3600, function () {
            $response = Http::timeout(30)->post($this->apiUrl, [
                'api_id' => $this->apiId,
                'api_key' => $this->apiKey,
            ]);

            if ($response->successful()) {
                $data = $response->json();
                return $data['data'] ?? []; // Return daftar layanan
            }

            Log::error('Medanpedia API Error: ' . $response->body());
            return [];
        });
    } catch (\Exception $e) {
        Log::error('Medanpedia Service Error: ' . $e->getMessage());
        return [];
    }
}
```

---

### **4. FILE TAMPILAN WEBSITE (Yang User Lihat)**

#### 📄 **`resources/js/pages/welcome.tsx`**
**Lokasi**: `resources/js/pages/` folder
**Fungsi**: Halaman utama website (landing page)
**Yang Ditampilkan**:
- Hero section dengan animasi 3D
- Daftar layanan
- Testimonial customer
- Contact form

**Kode Penting - Hero Section** (Line 340-380):
```tsx
const Welcome = ({ auth }: Props) => {
    // State untuk bahasa (Indonesia/English)
    const [language, setLanguage] = useState<'en' | 'id'>('en');
    
    // State untuk loading 3D
    const [loadingProgress, setLoadingProgress] = useState(0);
    
    // Fungsi ganti bahasa
    const changeLanguage = (lang: 'en' | 'id') => {
        setLanguage(lang);
    };

    return (
        <>
            <Head title="NexusShop - Digital Top-Up Platform" />
            
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {translations[language].navbar.brand}
                            </h1>
                        </div>
                        
                        {/* Language Switcher */}
                        <div className="flex items-center space-x-4">
                            <button onClick={() => changeLanguage('en')}>
                                EN
                            </button>
                            <button onClick={() => changeLanguage('id')}>
                                ID
                            </button>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
};
```

#### 📄 **`resources/js/pages/Order/Create.tsx`**
**Lokasi**: `resources/js/pages/Order/` folder
**Fungsi**: Form untuk membuat pesanan baru
**Yang Ditampilkan**:
- Form input data pesanan
- Kalkulasi harga otomatis
- Pilihan metode pembayaran

**Kode Penting - Form Order** (Line 50-100):
```tsx
const Create = ({ service }: Props) => {
    // State untuk form data
    const [formData, setFormData] = useState({
        email: '',
        target: '',
        quantity: service.min || 1000,
        comments: '',
        usernames: '',
        payment_method: 'qris'
    });

    // Kalkulasi harga otomatis
    const totalPrice = (formData.quantity / 1000) * service.price;

    // Handle submit form
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Kirim data ke backend
        router.post('/order/store', {
            ...formData,
            service_id: service.id,
            service_name: service.name,
            price: totalPrice
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
                <label>Email Address</label>
                <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                />
            </div>
            
            {/* Target Input */}
            <div>
                <label>Target (Username/URL)</label>
                <input
                    type="text"
                    value={formData.target}
                    onChange={(e) => setFormData({...formData, target: e.target.value})}
                    required
                />
            </div>
            
            {/* Quantity Input */}
            <div>
                <label>Quantity: {formData.quantity}</label>
                <input
                    type="range"
                    min={service.min}
                    max={service.max}
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                />
            </div>
            
            {/* Total Price Display */}
            <div className="text-xl font-bold">
                Total: Rp {totalPrice.toLocaleString()}
            </div>
            
            <button type="submit">Proceed to Payment</button>
        </form>
    );
};
```

#### 📄 **`resources/js/pages/Order/Payment.tsx`**
**Lokasi**: `resources/js/pages/Order/` folder
**Fungsi**: Halaman pembayaran dengan QR Code dan VA Number
**Yang Ditampilkan**:
- QR Code untuk scan
- Nomor Virtual Account
- Timer countdown
- Status pembayaran real-time

**Kode Penting - QR Code Display** (Line 80-120):
```tsx
const Payment = ({ order, payment }: Props) => {
    // State untuk countdown timer
    const [timeLeft, setTimeLeft] = useState('');
    
    // State untuk status pembayaran
    const [paymentStatus, setPaymentStatus] = useState(payment.status);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const expiry = new Date(payment.expired_at).getTime();
            const distance = expiry - now;

            if (distance < 0) {
                setTimeLeft('EXPIRED');
                clearInterval(timer);
            } else {
                const hours = Math.floor(distance / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}:${minutes}:${seconds}`);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [payment.expired_at]);

    return (
        <div className="max-w-md mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
            
            {/* Order Info */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <p><strong>Order ID:</strong> {order.order_id}</p>
                <p><strong>Service:</strong> {order.service_name}</p>
                <p><strong>Amount:</strong> Rp {payment.amount.toLocaleString()}</p>
                <p><strong>Time Left:</strong> {timeLeft}</p>
            </div>
            
            {/* QR Code untuk QRIS */}
            {payment.qr_code_url && (
                <div className="text-center mb-6">
                    <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
                    <img 
                        src={payment.qr_code_url} 
                        alt="QR Code" 
                        className="mx-auto border-2 border-gray-300"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                        Scan dengan aplikasi e-wallet atau mobile banking
                    </p>
                </div>
            )}
            
            {/* Virtual Account Number */}
            {payment.va_number && (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-2">Bank Transfer</h3>
                    <p className="font-mono text-lg">{payment.va_number}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        Transfer ke nomor VA di atas
                    </p>
                </div>
            )}
            
            {/* Status Check Button */}
            <button 
                onClick={() => checkPaymentStatus()}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg"
            >
                Check Payment Status
            </button>
        </div>
    );
};
```

---

### **5. FILE ADMIN PANEL**

#### 📄 **`resources/js/pages/ControlPanel/Dashboard.tsx`**
**Lokasi**: `resources/js/pages/ControlPanel/` folder
**Fungsi**: Dashboard admin untuk monitoring semua pesanan
**Yang Ditampilkan**:
- Statistik total pesanan
- Daftar pesanan terbaru
- Filter berdasarkan status
- Action untuk update status

**Kode Penting - Dashboard Stats** (Line 50-80):
```tsx
const Dashboard = ({ stats, recentOrders }: Props) => {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
            
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Orders</h3>
                    <p className="text-3xl font-bold">{stats.totalOrders}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Pending Orders</h3>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Completed Orders</h3>
                    <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-gray-500 text-sm">Total Revenue</h3>
                    <p className="text-3xl font-bold">Rp {stats.totalRevenue.toLocaleString()}</p>
                </div>
            </div>
            
            {/* Recent Orders Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Recent Orders</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Order ID</th>
                                <th className="px-6 py-3 text-left">Customer</th>
                                <th className="px-6 py-3 text-left">Service</th>
                                <th className="px-6 py-3 text-left">Amount</th>
                                <th className="px-6 py-3 text-left">Status</th>
                                <th className="px-6 py-3 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="border-b">
                                    <td className="px-6 py-4">{order.order_id}</td>
                                    <td className="px-6 py-4">{order.email}</td>
                                    <td className="px-6 py-4">{order.service_name}</td>
                                    <td className="px-6 py-4">Rp {order.price.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-sm ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button onClick={() => checkOrderStatus(order.id)}>
                                            Check Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
```

---

### **6. FILE KONFIGURASI ROUTE**

#### 📄 **`routes/web.php`**
**Lokasi**: `routes/` folder
**Fungsi**: File ini seperti "peta" - menentukan URL mana yang mengarah ke halaman mana
**Yang Didefinisikan**:
- URL untuk halaman user
- URL untuk admin panel
- URL untuk API webhook

**Kode Penting - Route Definitions** (Line 1-50):
```php
<?php

// ROUTE UNTUK USER (Yang tidak perlu login)
Route::get('/', function () {
    return inertia('Welcome'); // URL: / → Halaman Welcome
});

Route::get('/products', function () {
    return inertia('Products'); // URL: /products → Halaman Products
});

// ROUTE UNTUK ORDER (Yang tidak perlu login)
Route::get('/order/create', [OrderController::class, 'create']); // Form order
Route::post('/order/store', [OrderController::class, 'store']); // Simpan order
Route::get('/order/{orderId}/payment', [OrderController::class, 'payment']); // Halaman payment
Route::get('/order/{orderId}/status', [OrderController::class, 'status']); // Status order

// ROUTE UNTUK WEBHOOK (Dari Midtrans)
Route::post('/webhook/midtrans', [OrderController::class, 'webhook']); // Terima notifikasi pembayaran

// ROUTE UNTUK ADMIN (Perlu login admin)
Route::prefix('control-panel')->name('control-panel.')->group(function () {
    Route::middleware('admin.auth')->group(function () {
        Route::get('/dashboard', [AuthController::class, 'dashboard']); // Dashboard admin
    });
});
```

---

## 🔧 **CARA KERJA SISTEM (Step-by-Step untuk Non-Programmer)**

### **1. Ketika User Membuka Website**
```
1. User ketik URL: https://nexusshop.com
2. Server baca file: routes/web.php (line 25-27)
3. Server load file: resources/js/pages/welcome.tsx
4. Browser tampilkan halaman utama dengan animasi 3D
```

### **2. Ketika User Pilih Layanan**
```
1. User klik "Services" di navbar
2. Server baca file: routes/web.php (line 30-32)
3. Server load file: resources/js/pages/products.tsx
4. Browser tampilkan daftar layanan dari Medanpedia
```

### **3. Ketika User Buat Pesanan**
```
1. User isi form di: resources/js/pages/Order/Create.tsx
2. User klik "Proceed to Payment"
3. Data dikirim ke: app/Http/Controllers/OrderController.php (line 25-45)
4. Controller simpan ke database: database/migrations/create_orders_table.php
5. Controller buat pembayaran di Midtrans: app/Services/MidtransService.php (line 80-110)
6. User diarahkan ke halaman payment: resources/js/pages/Order/Payment.tsx
```

### **4. Ketika User Bayar**
```
1. User scan QR Code atau transfer ke VA
2. Midtrans kirim webhook ke: routes/web.php (line 55)
3. Webhook diproses di: app/Http/Controllers/OrderController.php (line 617-650)
4. Status pembayaran diupdate di: database/migrations/create_payments_table.php
5. Jika berhasil, order dikirim ke Medanpedia: app/Services/MedanpediaService.php
```

### **5. Ketika Admin Monitor**
```
1. Admin login ke control panel
2. Server load: resources/js/pages/ControlPanel/Dashboard.tsx
3. Dashboard ambil data dari: app/Http/Controllers/ControlPanel/AuthController.php
4. Admin bisa lihat semua order dan update status
```

---

## 🛠️ **FILE YANG PERLU DIEDIT UNTUK CUSTOMIZATION**

### **Untuk Ganti Nama Brand**
- **File**: `resources/js/pages/welcome.tsx` (line 40-50)
- **Yang Diubah**: `brand: "NexusShop"` → `brand: "Nama Brand Anda"`

### **Untuk Ganti Warna Website**
- **File**: `tailwind.config.js`
- **Yang Diubah**: Color palette di bagian `theme.extend.colors`

### **Untuk Ganti Logo**
- **File**: `public/logo.png` dan `public/logo.svg`
- **Yang Diubah**: Ganti file gambar dengan logo baru

### **Untuk Ganti API Key**
- **File**: `.env`
- **Yang Diubah**: 
  - `MIDTRANS_SERVER_KEY=your_new_key`
  - `MEDANPEDIA_API_KEY=your_new_key`

### **Untuk Tambah Layanan Baru**
- **File**: `app/Services/MedanpediaService.php` (line 50-80)
- **Yang Diubah**: Tambah kategori baru di `$categoryMappings`

---

## 🚨 **FILE YANG TIDAK BOLEH DIEDIT (Untuk Keamanan)**

### **File Konfigurasi Database**
- `database/migrations/*.php` - Jangan edit struktur tabel
- `app/Models/*.php` - Jangan edit relasi database

### **File Keamanan**
- `app/Http/Middleware/*.php` - Jangan edit middleware keamanan
- `config/auth.php` - Jangan edit konfigurasi auth

### **File Dependencies**
- `composer.json` - Jangan edit versi library
- `package.json` - Jangan edit versi package

---

## 📞 **BANTUAN TEKNIS (Untuk Non-Programmer)**

### **Jika Website Tidak Bisa Diakses**
1. Cek file `.env` - pastikan `APP_URL` benar
2. Cek file `routes/web.php` - pastikan route ada
3. Cek log error di `storage/logs/laravel.log`

### **Jika Pembayaran Tidak Berfungsi**
1. Cek file `.env` - pastikan `MIDTRANS_SERVER_KEY` benar
2. Cek file `app/Services/MidtransService.php` - pastikan URL API benar
3. Cek webhook URL di dashboard Midtrans

### **Jika Layanan Tidak Muncul**
1. Cek file `.env` - pastikan `MEDANPEDIA_API_KEY` benar
2. Cek file `app/Services/MedanpediaService.php` - pastikan endpoint API benar
3. Cek cache di `storage/framework/cache/`

### **Jika Admin Panel Tidak Bisa Diakses**
1. Cek file `database/seeders/AdminSeeder.php` - pastikan admin sudah dibuat
2. Cek file `app/Http/Middleware/AdminAuth.php` - pastikan middleware berfungsi
3. Cek session di `storage/framework/sessions/`

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

#### **OrderController** (`app/Http/Controllers/OrderController.php`)
**Fungsi Utama**: Mengelola seluruh proses pemesanan dan pembayaran
**Method Penting**:
- `create()` - Menampilkan form pemesanan
- `store()` - Menyimpan pesanan baru
- `payment()` - Menampilkan halaman pembayaran
- `webhook()` - Menerima notifikasi dari Midtrans
- `status()` - Mengecek status pesanan

#### **AuthController** (`app/Http/Controllers/Auth/AuthController.php`)
**Fungsi Utama**: Mengelola autentikasi user
**Method Penting**:
- `login()` - Proses login user
- `logout()` - Proses logout user
- `register()` - Registrasi user baru

#### **ControlPanel\AuthController** (`app/Http/Controllers/ControlPanel/AuthController.php`)
**Fungsi Utama**: Mengelola autentikasi admin
**Method Penting**:
- `login()` - Login admin
- `dashboard()` - Dashboard admin
- `logout()` - Logout admin

### 2. Models

#### **User** (`app/Models/User.php`)
```php
class User extends Authenticatable
{
    protected $fillable = ['name', 'email', 'password'];
    protected $hidden = ['password', 'remember_token'];
    
    // Relasi ke orders
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
```

#### **Order** (`app/Models/Order.php`)
```php
class Order extends Model
{
    protected $fillable = [
        'order_id', 'email', 'service_id', 'service_name',
        'target', 'quantity', 'price', 'status'
    ];
    
    // Relasi ke payment
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
    
    // Relasi ke user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

#### **Payment** (`app/Models/Payment.php`)
```php
class Payment extends Model
{
    protected $fillable = [
        'order_id', 'payment_id', 'payment_method',
        'amount', 'status', 'qr_code_url', 'va_number'
    ];
    
    // Relasi ke order
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
```

### 3. Services

#### **MidtransService** (`app/Services/MidtransService.php`)
**Fungsi**: Integrasi dengan payment gateway Midtrans
**Method Utama**:
- `createTransaction()` - Membuat transaksi pembayaran
- `validateWebhook()` - Validasi webhook dari Midtrans
- `getTransactionStatus()` - Cek status transaksi

#### **MedanpediaService** (`app/Services/MedanpediaService.php`)
**Fungsi**: Integrasi dengan API Medanpedia untuk layanan
**Method Utama**:
- `getAllServices()` - Ambil daftar layanan
- `createOrder()` - Buat pesanan di Medanpedia
- `checkOrderStatus()` - Cek status pesanan

### 4. Middleware

#### **AdminAuth** (`app/Http/Middleware/AdminAuth.php`)
**Fungsi**: Memastikan hanya admin yang bisa akses control panel
```php
public function handle($request, Closure $next)
{
    if (!auth()->guard('admin')->check()) {
        return redirect()->route('control-panel.login');
    }
    
    return $next($request);
}
```

#### **ForceHttps** (`app/Http/Middleware/ForceHttps.php`)
**Fungsi**: Memaksa semua request menggunakan HTTPS
```php
public function handle($request, Closure $next)
{
    if (!$request->secure() && app()->environment() === 'production') {
        return redirect()->secure($request->getRequestUri());
    }
    
    return $next($request);
}
```

---

## 🎨 Frontend Components

### 1. Layout Components

#### **AppLayout** (`resources/js/layouts/app-layout.tsx`)
**Fungsi**: Layout utama untuk semua halaman aplikasi
**Fitur**:
- Navbar dengan logo dan menu
- Sidebar untuk navigasi
- Footer dengan informasi
- Responsive design

#### **AuthLayout** (`resources/js/layouts/auth-layout.tsx`)
**Fungsi**: Layout khusus untuk halaman login/register
**Fitur**:
- Form centered
- Background dengan efek visual
- Minimal navigation

### 2. UI Components

#### **Button** (`resources/js/components/ui/button.tsx`)
```tsx
interface ButtonProps {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
}

export const Button = ({ variant = 'default', size = 'default', children, ...props }: ButtonProps) => {
    return (
        <button 
            className={cn(buttonVariants({ variant, size }))}
            {...props}
        >
            {children}
        </button>
    )
}
```

#### **Card** (`resources/js/components/ui/card.tsx`)
**Fungsi**: Container untuk konten dengan styling konsisten
**Fitur**:
- Header, content, dan footer sections
- Shadow dan border styling
- Responsive padding

### 3. Business Components

#### **OrderForm** (`resources/js/components/OrderForm.tsx`)
**Fungsi**: Form untuk membuat pesanan baru
**Fitur**:
- Validasi input real-time
- Kalkulasi harga otomatis
- Preview order summary

#### **PaymentDisplay** (`resources/js/components/PaymentDisplay.tsx`)
**Fungsi**: Menampilkan informasi pembayaran
**Fitur**:
- QR Code display
- Virtual Account number
- Countdown timer
- Status updates

---

## 🔌 API Endpoints

### Public Endpoints

#### **GET /** - Welcome Page
```http
GET /
Content-Type: application/json

Response: Inertia page (Welcome.tsx)
```

#### **GET /products** - Products Page
```http
GET /products
Content-Type: application/json

Response: Inertia page (Products.tsx) dengan data services
```

#### **GET /order/create** - Order Form
```http
GET /order/create?service_id={id}
Content-Type: application/json

Response: Inertia page (Order/Create.tsx) dengan data service
```

#### **POST /order/store** - Create Order
```http
POST /order/store
Content-Type: application/json

{
    "email": "user@example.com",
    "service_id": 123,
    "target": "username",
    "quantity": 1000,
    "price": 50000
}

Response: Redirect ke payment page
```

#### **GET /order/{id}/payment** - Payment Page
```http
GET /order/{id}/payment
Content-Type: application/json

Response: Inertia page (Order/Payment.tsx) dengan data payment
```

#### **GET /order/{id}/status** - Order Status
```http
GET /order/{id}/status
Content-Type: application/json

Response: JSON dengan status order
{
    "order_id": "ORD-ABC123",
    "status": "processing",
    "payment_status": "paid",
    "medanpedia_status": "in_progress"
}
```

### Webhook Endpoints

#### **POST /webhook/midtrans** - Midtrans Webhook
```http
POST /webhook/midtrans
Content-Type: application/json

{
    "order_id": "ORD-ABC123",
    "transaction_status": "capture",
    "fraud_status": "accept",
    "signature_key": "abc123..."
}

Response: 200 OK
```

### Admin Endpoints

#### **GET /control-panel/login** - Admin Login Page
```http
GET /control-panel/login
Content-Type: application/json

Response: Inertia page (ControlPanel/Login.tsx)
```

#### **POST /control-panel/login** - Admin Login
```http
POST /control-panel/login
Content-Type: application/json

{
    "email": "admin@nexusshop.com",
    "password": "password"
}

Response: Redirect ke dashboard
```

#### **GET /control-panel/dashboard** - Admin Dashboard
```http
GET /control-panel/dashboard
Authorization: Bearer {token}

Response: Inertia page (ControlPanel/Dashboard.tsx) dengan data stats
```

---

## 🚀 Deployment Guide

### 1. Prerequisites
- **Server**: Ubuntu 20.04+ / CentOS 8+
- **PHP**: 8.2+ dengan extensions: bcmath, ctype, fileinfo, json, mbstring, openssl, pdo, tokenizer, xml
- **Database**: MySQL 8.0+ atau PostgreSQL 13+
- **Web Server**: Nginx atau Apache
- **Node.js**: 18+ untuk build frontend

### 2. Server Setup

#### **Install Dependencies**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP 8.2
sudo apt install php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip php8.2-bcmath php8.2-gd php8.2-redis

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### **Install Database**
```bash
# MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Create database
sudo mysql -u root -p
CREATE DATABASE nexusshop;
CREATE USER 'nexusshop'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON nexusshop.* TO 'nexusshop'@'localhost';
FLUSH PRIVILEGES;
```

### 3. Application Deployment

#### **Clone Repository**
```bash
cd /var/www
sudo git clone https://github.com/your-repo/nexusshop.git
sudo chown -R www-data:www-data nexusshop
cd nexusshop
```

#### **Install Dependencies**
```bash
# Backend dependencies
composer install --no-dev --optimize-autoloader

# Frontend dependencies
npm install
npm run build
```

#### **Environment Configuration**
```bash
# Copy environment file
cp .env.example .env

# Edit .env file
nano .env
```

**Isi file `.env`**:
```env
APP_NAME=NexusShop
APP_ENV=production
APP_KEY=base64:your-app-key
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=nexusshop
DB_USERNAME=nexusshop
DB_PASSWORD=your_password

MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=true

MEDANPEDIA_API_KEY=your_medanpedia_api_key
MEDANPEDIA_API_URL=https://api.medanpedia.com

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379
```

#### **Database Setup**
```bash
# Generate app key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database
php artisan db:seed

# Create admin user
php artisan make:admin
```

#### **File Permissions**
```bash
# Set proper permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache
```

### 4. Web Server Configuration

#### **Nginx Configuration**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;
    
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    root /var/www/nexusshop/public;
    index index.php index.html;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }
    
    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### 5. SSL Certificate (Let's Encrypt)
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 6. Queue Worker Setup
```bash
# Create systemd service
sudo nano /etc/systemd/system/nexusshop-queue.service
```

**Service file content**:
```ini
[Unit]
Description=NexusShop Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/nexusshop
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl enable nexusshop-queue
sudo systemctl start nexusshop-queue
```

### 7. Monitoring & Logs
```bash
# Check application logs
tail -f storage/logs/laravel.log

# Check queue worker
sudo systemctl status nexusshop-queue

# Check nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

#### **1. Blank/Black Screen Issue**
**Problem**: Website shows blank screen after deployment
**Causes**:
- Missing environment variables
- Incorrect file permissions
- PHP errors not displayed

**Solutions**:
```bash
# Check environment file
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Check permissions
sudo chown -R www-data:www-data storage bootstrap/cache
sudo chmod -R 775 storage bootstrap/cache

# Check logs
tail -f storage/logs/laravel.log
```

#### **2. Payment Gateway Issues**
**Problem**: Midtrans integration not working
**Causes**:
- Incorrect API keys
- Webhook URL not configured
- SSL certificate issues

**Solutions**:
```bash
# Verify API keys in .env
MIDTRANS_SERVER_KEY=your_correct_key
MIDTRANS_CLIENT_KEY=your_correct_key

# Check webhook URL in Midtrans dashboard
https://your-domain.com/webhook/midtrans

# Test webhook locally
php artisan tinker
>>> app(\App\Services\MidtransService::class)->testWebhook()
```

#### **3. Database Connection Issues**
**Problem**: Cannot connect to database
**Causes**:
- Incorrect database credentials
- Database service not running
- Firewall blocking connection

**Solutions**:
```bash
# Check MySQL service
sudo systemctl status mysql

# Test database connection
php artisan tinker
>>> DB::connection()->getPdo()

# Check database credentials
php artisan config:show database
```

#### **4. Frontend Build Issues**
**Problem**: React components not loading
**Causes**:
- Missing npm dependencies
- Build process failed
- Asset files not generated

**Solutions**:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild assets
npm run build

# Check asset files
ls -la public/build/
```

#### **5. Performance Issues**
**Problem**: Website loading slowly
**Causes**:
- No caching configured
- Large asset files
- Database queries not optimized

**Solutions**:
```bash
# Enable caching
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev

# Check Redis cache
redis-cli ping
```

#### **6. Admin Panel Access Issues**
**Problem**: Cannot access admin panel
**Causes**:
- Admin user not created
- Incorrect credentials
- Middleware issues

**Solutions**:
```bash
# Create admin user
php artisan make:admin

# Check admin table
php artisan tinker
>>> \App\Models\Admin::all()

# Clear session
php artisan session:table
php artisan migrate
```

### Debug Commands

#### **Laravel Debug Commands**
```bash
# Check application status
php artisan about

# List all routes
php artisan route:list

# Check configuration
php artisan config:show

# Clear all caches
php artisan optimize:clear

# Check queue status
php artisan queue:work --once
```

#### **System Debug Commands**
```bash
# Check PHP version and extensions
php -v
php -m

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
ps aux | grep php
ps aux | grep nginx
```

---

## 📊 Performance Optimization

### 1. Backend Optimization

#### **Database Optimization**
```sql
-- Add indexes for frequently queried columns
ALTER TABLE orders ADD INDEX idx_status (status);
ALTER TABLE orders ADD INDEX idx_created_at (created_at);
ALTER TABLE payments ADD INDEX idx_status (status);
ALTER TABLE payments ADD INDEX idx_expired_at (expired_at);

-- Optimize table structure
OPTIMIZE TABLE orders;
OPTIMIZE TABLE payments;
```

#### **Caching Strategy**
```php
// Cache frequently accessed data
Cache::remember('medanpedia_services', 3600, function () {
    return $this->medanpediaService->getAllServices();
});

// Cache user sessions
Cache::remember('user_' . $userId, 1800, function () {
    return User::find($userId);
});
```

#### **Queue Implementation**
```php
// Move heavy operations to queue
class ProcessOrderJob implements ShouldQueue
{
    public function handle()
    {
        // Process order with Medanpedia
        $this->medanpediaService->createOrder($this->order);
    }
}

// Dispatch job
ProcessOrderJob::dispatch($order);
```

### 2. Frontend Optimization

#### **Code Splitting**
```tsx
// Lazy load components
const OrderForm = lazy(() => import('./OrderForm'));
const PaymentDisplay = lazy(() => import('./PaymentDisplay'));

// Use Suspense
<Suspense fallback={<LoadingSpinner />}>
    <OrderForm />
</Suspense>
```

#### **Asset Optimization**
```javascript
// vite.config.ts
export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
                }
            }
        }
    }
});
```

#### **Service Worker Caching**
```javascript
// sw.js
const CACHE_NAME = 'nexusshop-v1';
const urlsToCache = [
    '/',
    '/css/app.css',
    '/js/app.js',
    '/images/logo.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
```

### 3. Server Optimization

#### **Nginx Configuration**
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

# Browser caching
location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### **PHP-FPM Optimization**
```ini
; /etc/php/8.2/fpm/php.ini
memory_limit = 256M
max_execution_time = 60
opcache.enable = 1
opcache.memory_consumption = 128
opcache.max_accelerated_files = 4000
```

---

## 🔒 Security Best Practices

### 1. Application Security

#### **Input Validation**
```php
// Validate all inputs
$request->validate([
    'email' => 'required|email|max:255',
    'service_id' => 'required|integer|exists:services,id',
    'quantity' => 'required|integer|min:1|max:100000',
    'price' => 'required|numeric|min:0|max:10000000'
]);
```

#### **SQL Injection Prevention**
```php
// Use Eloquent ORM (automatically prevents SQL injection)
$orders = Order::where('status', $status)->get();

// Use parameterized queries for raw SQL
DB::select('SELECT * FROM orders WHERE status = ?', [$status]);
```

#### **XSS Prevention**
```php
// Escape output in Blade templates
{{ $user->name }}

// Use JSON encoding for JavaScript
<script>
    const data = @json($data);
</script>
```

### 2. API Security

#### **Webhook Validation**
```php
public function validateMidtransWebhook($data, $signature)
{
    $expectedSignature = hash('sha512', 
        $data['order_id'] . $data['status_code'] . $data['gross_amount'] . $this->serverKey
    );
    
    return hash_equals($expectedSignature, $signature);
}
```

#### **Rate Limiting**
```php
// In routes/web.php
Route::middleware(['throttle:60,1'])->group(function () {
    Route::post('/order/store', [OrderController::class, 'store']);
});

// Custom rate limiting
Route::middleware(['throttle:5,1'])->group(function () {
    Route::post('/webhook/midtrans', [OrderController::class, 'webhook']);
});
```

### 3. Server Security

#### **Firewall Configuration**
```bash
# UFW firewall setup
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

#### **SSL/TLS Configuration**
```nginx
# Strong SSL configuration
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;
```

---

## 📈 Monitoring & Analytics

### 1. Application Monitoring

#### **Laravel Telescope** (Development)
```bash
# Install Telescope
composer require laravel/telescope --dev

# Publish configuration
php artisan telescope:install

# Access dashboard
http://your-domain.com/telescope
```

#### **Custom Logging**
```php
// Log important events
Log::info('Order created', [
    'order_id' => $order->order_id,
    'amount' => $order->price,
    'user_email' => $order->email
]);

Log::error('Payment failed', [
    'order_id' => $order->order_id,
    'error' => $exception->getMessage()
]);
```

### 2. Performance Monitoring

#### **Database Query Monitoring**
```php
// Enable query logging
DB::enableQueryLog();

// Your database operations
$orders = Order::where('status', 'pending')->get();

// Check queries
dd(DB::getQueryLog());
```

#### **Memory Usage Monitoring**
```php
// Check memory usage
$memoryUsage = memory_get_usage(true);
$peakMemory = memory_get_peak_usage(true);

Log::info('Memory usage', [
    'current' => $memoryUsage,
    'peak' => $peakMemory
]);
```

### 3. Error Tracking

#### **Sentry Integration**
```bash
# Install Sentry
composer require sentry/sentry-laravel

# Configure in .env
SENTRY_LARAVEL_DSN=your_sentry_dsn
```

```php
// Manual error reporting
Sentry::captureException($exception);
Sentry::captureMessage('Payment processing failed', 'error');
```

---

## 🧪 Testing

### 1. Unit Testing

#### **Order Model Test**
```php
// tests/Unit/OrderTest.php
class OrderTest extends TestCase
{
    public function test_can_create_order()
    {
        $order = Order::factory()->create([
            'order_id' => 'ORD-TEST123',
            'email' => 'test@example.com',
            'price' => 50000
        ]);

        $this->assertDatabaseHas('orders', [
            'order_id' => 'ORD-TEST123',
            'email' => 'test@example.com'
        ]);
    }
}
```

#### **Payment Service Test**
```php
// tests/Unit/MidtransServiceTest.php
class MidtransServiceTest extends TestCase
{
    public function test_can_create_transaction()
    {
        $service = new MidtransService();
        
        $result = $service->createTransaction([
            'order_id' => 'ORD-TEST123',
            'amount' => 50000
        ]);

        $this->assertNotNull($result);
        $this->assertArrayHasKey('transaction_id', $result);
    }
}
```

### 2. Feature Testing

#### **Order Flow Test**
```php
// tests/Feature/OrderFlowTest.php
class OrderFlowTest extends TestCase
{
    public function test_complete_order_flow()
    {
        // Create order
        $response = $this->post('/order/store', [
            'email' => 'test@example.com',
            'service_id' => 1,
            'target' => 'testuser',
            'quantity' => 1000,
            'price' => 50000
        ]);

        $response->assertRedirect();
        
        // Check order created
        $this->assertDatabaseHas('orders', [
            'email' => 'test@example.com',
            'price' => 50000
        ]);
    }
}
```

### 3. Browser Testing

#### **Laravel Dusk**
```bash
# Install Dusk
composer require laravel/dusk --dev
php artisan dusk:install
```

```php
// tests/Browser/OrderTest.php
class OrderTest extends DuskTestCase
{
    public function test_user_can_create_order()
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/order/create')
                    ->type('email', 'test@example.com')
                    ->type('target', 'testuser')
                    ->type('quantity', '1000')
                    ->press('Proceed to Payment')
                    ->assertPathIs('/order/*/payment');
        });
    }
}
```

---

## 📚 Additional Resources

### 1. Documentation Links
- [Laravel 12 Documentation](https://laravel.com/docs/12.x)
- [React Documentation](https://react.dev/)
- [Inertia.js Documentation](https://inertiajs.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Midtrans API Documentation](https://docs.midtrans.com/)

### 2. Community Resources
- [Laravel Community](https://laravel.com/community)
- [React Community](https://react.dev/community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/laravel)
- [GitHub Discussions](https://github.com/laravel/laravel/discussions)

### 3. Development Tools
- [Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar)
- [Laravel IDE Helper](https://github.com/barryvdh/laravel-ide-helper)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools)
- [Vue DevTools](https://devtools.vuejs.org/)

---

## 🤝 Contributing

### 1. Development Setup
```bash
# Fork the repository
git clone https://github.com/your-username/nexusshop.git
cd nexusshop

# Install dependencies
composer install
npm install

# Setup environment
cp .env.example .env
php artisan key:generate

# Run migrations
php artisan migrate --seed

# Start development server
php artisan serve
npm run dev
```

### 2. Code Standards
- Follow PSR-12 coding standards for PHP
- Use TypeScript for all React components
- Write tests for new features
- Update documentation for API changes

### 3. Pull Request Process
1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create Pull Request with detailed description

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Laravel Team** for the amazing PHP framework
- **React Team** for the powerful frontend library
- **Tailwind CSS** for the utility-first CSS framework
- **Midtrans** for the payment gateway integration
- **Medanpedia** for the social media services API
- **Inertia.js** for seamless SPA experience

---

## 📞 Support

For support and questions:
- **Email**: support@nexusshop.com
- **Documentation**: https://docs.nexusshop.com
- **Issues**: https://github.com/your-repo/nexusshop/issues
- **Discord**: https://discord.gg/nexusshop

---

**NexusShop** - Empowering Digital Growth Through Social Media Marketing Services

*Built with ❤️ using Laravel 12, React, and TypeScript*