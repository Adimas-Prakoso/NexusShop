# Payment System Fixes & Production Mode Guide

## 🔧 Payment Expiration Issue - RESOLVED

### Problem Description
Payment pages were showing "Payment Expired" immediately after order creation, even though payments should be valid for 24 hours.

### Root Cause Analysis
1. **Timezone Mismatch**: Application timezone (Asia/Jakarta) vs Database timezone (UTC)
2. **Frontend Date Parsing**: JavaScript Date parsing issues with timezone handling
3. **Configuration Issues**: Inconsistent timezone handling between backend and frontend

### Solutions Implemented

#### 1. Backend Timezone Fix
**File**: `app/Http/Controllers/OrderController.php`
```php
// Before (Problematic)
'expired_at' => now()->addHours(24),

// After (Fixed)
'expired_at' => now()->utc()->addHours(24),
```

#### 2. Application Timezone Configuration
**File**: `config/app.php`
```php
// Changed from UTC to Asia/Jakarta
'timezone' => 'Asia/Jakarta',
```

#### 3. Frontend JavaScript Fix
**File**: `resources/js/pages/Order/Payment.tsx`
```javascript
// Before (Problematic)
const expiredTime = new Date(payment.expired_at).getTime();

// After (Fixed)
const expiredTime = new Date(payment.expired_at + 'Z').getTime(); // Force UTC parsing
```

#### 4. Debug Tools Created
- `php artisan debug:payment-expiration {orderId?}` - Debug payment expiration issues
- Console logging added to frontend for timezone debugging

### Testing Commands
```bash
# Test payment generation
php artisan test:payment --method=qris --amount=25000

# Debug specific payment
php artisan debug:payment-expiration ORDER-ID

# Debug all recent payments
php artisan debug:payment-expiration
```

---

## 🔄 Production Mode Switching - IMPLEMENTED

### Feature Description
Toggle between Midtrans Sandbox and Production modes without manual .env editing.

### Implementation

#### 1. Configuration Structure
**File**: `config/services.php`
```php
'midtrans' => [
    'server_key' => env('MIDTRANS_SANDBOX', true) 
        ? env('SANDBOX_MIDTRANS_SERVER_KEY') 
        : env('MIDTRANS_SERVER_KEY'),
    'client_key' => env('MIDTRANS_SANDBOX', true) 
        ? env('SANDBOX_MIDTRANS_CLIENT_KEY') 
        : env('MIDTRANS_CLIENT_KEY'),
    'sandbox_server_key' => env('SANDBOX_MIDTRANS_SERVER_KEY'),
    'sandbox_client_key' => env('SANDBOX_MIDTRANS_CLIENT_KEY'),
    'production_server_key' => env('MIDTRANS_SERVER_KEY'),
    'production_client_key' => env('MIDTRANS_CLIENT_KEY'),
    'sandbox' => env('MIDTRANS_SANDBOX', true),
]
```

#### 2. Dynamic Key Selection
**File**: `app/Http/Controllers/OrderController.php`
```php
// Dynamic server key selection
$isSandbox = config('services.midtrans.sandbox', true);
$serverKey = $isSandbox
    ? config('services.midtrans.sandbox_server_key')
    : config('services.midtrans.production_server_key');

// Dynamic API URL selection
$url = $isSandbox 
    ? 'https://api.sandbox.midtrans.com/v2/charge'
    : 'https://api.midtrans.com/v2/charge';
```

#### 3. Management Commands
```bash
# Check current configuration
php artisan test:production-mode

# Toggle between sandbox and production
php artisan test:production-mode --toggle
```

### Environment Variables Required

#### Sandbox Mode (MIDTRANS_SANDBOX=true)
```env
MIDTRANS_SANDBOX=true
SANDBOX_MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxx
SANDBOX_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxx
```

#### Production Mode (MIDTRANS_SANDBOX=false)
```env
MIDTRANS_SANDBOX=false
MIDTRANS_SERVER_KEY=Mid-server-xxxxxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxxxxx
```

### Safety Features
- Clear warnings when switching to production mode
- Configuration validation before processing payments
- Automatic config cache clearing after mode switch

---

## 🧪 Testing & Debugging Tools

### Payment Generation Testing
```bash
# Test QRIS payment
php artisan test:payment --method=qris --amount=25000

# Test Bank Transfer payment
php artisan test:payment --method=bank_transfer --amount=50000
```

### Payment Expiration Debugging
```bash
# Debug specific order
php artisan debug:payment-expiration ORDER-ID

# Debug all recent payments (last 24 hours)
php artisan debug:payment-expiration
```

### Production Mode Management
```bash
# Check current mode
php artisan test:production-mode

# Toggle between sandbox/production
php artisan test:production-mode --toggle
```

### Demo Data Creation
```bash
# Create demo orders with different statuses
php artisan demo:order-system

# Clean demo data
php artisan demo:order-system --clean

# Create test order flow
php artisan test:order-flow --email=test@example.com
```

---

## 🔍 Debugging Guide

### Payment Shows Expired Immediately

#### Check Backend Expiration
```bash
php artisan debug:payment-expiration YOUR-ORDER-ID
```

Look for:
- ✅ Status: ACTIVE (payment valid)
- ❌ Status: EXPIRED (payment genuinely expired)

#### Check Frontend Console
Open browser console on payment page and look for:
```javascript
Payment expiration debug: {
  expired_at: "1750410986",
  expiredTime: "2025-06-20T09:16:26.000Z",
  now: "2025-06-19T09:16:30.000Z",
  difference: 86396000,
  differenceHours: 23.999
}
```

#### Common Issues & Solutions

**Issue**: `difference` is negative
**Solution**: Check timezone handling in frontend

**Issue**: `expired_at` is null
**Solution**: Check OrderController payment creation

**Issue**: `differenceHours` is very small
**Solution**: Check timezone configuration mismatch

### Production Mode Not Working

#### Check Configuration
```bash
php artisan test:production-mode
```

#### Verify Environment Variables
```bash
# Check if variables are set
grep MIDTRANS .env
```

#### Test API Connection
```bash
# Test with current configuration
php artisan test:payment --method=qris --amount=1000
```

---

## 📋 Implementation Checklist

### ✅ Payment Expiration Fixes
- [x] Backend timezone handling fixed
- [x] Frontend JavaScript date parsing fixed
- [x] Application timezone configuration updated
- [x] Debug tools created and tested
- [x] Console logging implemented

### ✅ Production Mode Switching
- [x] Dynamic configuration implemented
- [x] Environment variable handling
- [x] Management commands created
- [x] Safety warnings implemented
- [x] API URL switching working

### ✅ Testing & Debugging
- [x] Payment generation testing command
- [x] Expiration debugging command
- [x] Production mode management command
- [x] Demo data creation command
- [x] Comprehensive error logging

---

## 🚀 Production Deployment

### Before Going Live

1. **Set Production Credentials**
   ```env
   MIDTRANS_SERVER_KEY=your_production_server_key
   MIDTRANS_CLIENT_KEY=your_production_client_key
   ```

2. **Switch to Production Mode**
   ```bash
   php artisan test:production-mode --toggle
   ```

3. **Test with Small Amount**
   ```bash
   php artisan test:payment --method=qris --amount=1000
   ```

4. **Verify Webhook URL**
   Set Midtrans webhook to: `https://yourdomain.com/webhook/midtrans`

5. **Monitor Logs**
   ```bash
   tail -f storage/logs/laravel.log
   ```

### Production Safety

- ⚠️ Production mode shows clear warnings
- 🔒 Real transactions will be processed
- 📊 All payments are logged
- 🔄 Easy rollback to sandbox mode
- 🔍 Debug tools available in production

---

## 📞 Support & Troubleshooting

### Common Commands
```bash
# Clear all caches
php artisan config:clear && php artisan route:clear && php artisan view:clear

# Check system status
php artisan debug:payment-expiration

# Reset to sandbox mode
php artisan test:production-mode --toggle

# Create test data
php artisan demo:order-system
```

### Log Locations
- **Laravel Logs**: `storage/logs/laravel.log`
- **Payment API Logs**: Check `Log::info()` and `Log::error()` entries
- **Frontend Console**: Browser Developer Tools

### Key Files Modified
- `app/Http/Controllers/OrderController.php` - Payment processing
- `config/services.php` - Midtrans configuration
- `config/app.php` - Timezone settings
- `resources/js/pages/Order/Payment.tsx` - Frontend expiration handling

---

**Last Updated**: June 19, 2025  
**Status**: ✅ All Issues Resolved  
**Version**: Production Ready