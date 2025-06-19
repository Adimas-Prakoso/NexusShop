# NexusShop Order System

## Overview

Sistem order lengkap untuk NexusShop yang mengintegrasikan:
- **Medanpedia API** untuk layanan social media
- **Midtrans Payment Gateway** untuk pembayaran
- **React/TypeScript** untuk frontend
- **Laravel** untuk backend

## Features

### 🛒 Order Flow
1. **Create Order** - Form pemesanan dengan validasi
2. **Payment** - Integrasi Midtrans (QRIS, Bank Transfer, E-wallet)
3. **Status Tracking** - Real-time status order dan payment

### 💳 Payment Methods
- **QRIS** - Scan QR code dengan e-wallet
- **Bank Transfer** - Virtual Account
- **GoPay** - Pembayaran digital
- **ShopeePay** - E-wallet Shopee
- **DANA** - Digital wallet

### 📊 Order Management
- Real-time status tracking
- Automatic payment verification
- Order progress monitoring
- Email notifications

## Installation & Setup

### 1. Database Migration
```bash
php artisan migrate
```

### 2. Environment Configuration
Tambahkan ke `.env`:
```env
# Medanpedia API
MEDANPEDIA_APIKEY=your_api_key
MEDANPEDIA_API_ID=your_api_id

# Midtrans Sandbox
SANDBOX_MIDTRANS_SERVER_KEY=your_sandbox_server_key
SANDBOX_MIDTRANS_CLIENT_KEY=your_sandbox_client_key
MIDTRANS_SANDBOX=true

# Midtrans Production (optional)
MIDTRANS_SERVER_KEY=your_production_server_key
MIDTRANS_CLIENT_KEY=your_production_client_key
```

### 3. Build Assets
```bash
npm run build
```

## Usage

### 1. Create Order
```
GET /order/create?service_id=1&service_name=Service&price=10000&min=100&max=10000&type=Default
```

### 2. Process Order
```
POST /order/store
Content-Type: application/json

{
    "email": "user@example.com",
    "service_id": 1,
    "service_name": "Instagram Followers",
    "target": "@username",
    "quantity": 1000,
    "price": 25000,
    "payment_method": "qris"
}
```

### 3. Payment Page
```
GET /order/{orderId}/payment
```

### 4. Order Status
```
GET /order/{orderId}/status
```

### 5. Check Status (API)
```
GET /order/{orderId}/check-status
```

## API Integration

### Medanpedia Order API
```php
// Parameters for default order
$params = [
    'api_id' => config('services.medanpedia.api_id'),
    'api_key' => config('services.medanpedia.api_key'),
    'service' => $serviceId,
    'target' => $target,
    'quantity' => $quantity
];

// Optional parameters
if ($comments) {
    $params['comments'] = $comments; // For Custom Comments
}
if ($usernames) {
    $params['usernames'] = $usernames; // For Mentions Custom List
}
```

### Midtrans Payment API
```php
// QRIS Payment
$params = [
    'transaction_details' => [
        'order_id' => $midtransOrderId,
        'gross_amount' => (int) $amount,
    ],
    'customer_details' => [
        'email' => $customerEmail,
    ],
    'payment_type' => 'qris'
];
```

## Database Schema

### Orders Table
| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| order_id | string | Unique order identifier |
| email | string | Customer email |
| service_id | int | Medanpedia service ID |
| service_name | string | Service name |
| target | string | Social media target |
| quantity | int | Order quantity |
| comments | text | Custom comments (optional) |
| usernames | text | Custom usernames (optional) |
| price | decimal | Order price |
| status | string | Order status |
| medanpedia_order_id | string | Provider order ID |
| medanpedia_response | text | API response |
| start_count | int | Starting count |
| remains | int | Remaining count |
| currency | string | Currency (default: IDR) |

### Payments Table
| Field | Type | Description |
|-------|------|-------------|
| id | bigint | Primary key |
| order_id | bigint | Foreign key to orders |
| payment_id | string | Unique payment identifier |
| midtrans_order_id | string | Midtrans order ID |
| payment_method | string | Payment method |
| amount | decimal | Payment amount |
| status | string | Payment status |
| midtrans_response | text | Midtrans response |
| transaction_id | string | Transaction ID |
| qr_code_url | string | QR code URL |
| va_number | string | Virtual account number |
| paid_at | timestamp | Payment date |
| expired_at | timestamp | Expiration date |

## Order Status Flow

```
1. PENDING    → Order created, waiting for payment
2. PROCESSING → Payment confirmed, order sent to provider
3. PARTIAL    → Order partially completed
4. COMPLETED  → Order fully completed
5. CANCELLED  → Order cancelled
```

## Payment Status Flow

```
1. PENDING → Payment created, waiting for payment
2. PAID    → Payment confirmed
3. FAILED  → Payment failed
4. EXPIRED → Payment expired
```

## Frontend Components

### Order Create (`/resources/js/pages/Order/Create.tsx`)
- Service information display
- Order form with validation
- Payment method selection
- Price calculation
- Responsive design

### Payment Page (`/resources/js/pages/Order/Payment.tsx`)
- QR code display for QRIS
- Virtual account for bank transfer
- Payment countdown timer
- Auto status checking
- Payment instructions

### Status Page (`/resources/js/pages/Order/Status.tsx`)
- Order progress tracking
- Payment status display
- Order statistics
- Refresh functionality
- Customer support info

## Testing

### Test Order Flow
```bash
php artisan test:order-flow --email=test@example.com
```

### Manual Testing URLs
```
# Order Creation
/order/create?service_id=1&service_name=Test&price=10000&min=100&max=10000&type=Default

# Social Media Products (with Order Now buttons)
/products/social/instagram
/products/social/youtube
/products/social/tiktok
```

## Security Features

### CSRF Protection
- Webhook routes excluded from CSRF verification
- Form validation with Laravel Request validation

### Payment Security
- Midtrans signature verification
- Secure API key handling
- Environment-based configuration

## Error Handling

### Order Errors
- Invalid service parameters
- Payment processing failures
- API communication errors

### Payment Errors
- Expired payments
- Failed transactions
- Invalid webhook signatures

## Monitoring & Logging

### Log Channels
```php
Log::info('Order processed', ['order_id' => $orderId]);
Log::error('Payment failed', ['error' => $errorMessage]);
```

### Status Monitoring
- Automatic payment status checking
- Order progress tracking
- Provider API monitoring

## Support & Maintenance

### Webhook Configuration
Set Midtrans webhook URL to:
```
https://yourdomain.com/webhook/midtrans
```

### Cron Jobs (Optional)
```bash
# Check pending payments every 5 minutes
*/5 * * * * php artisan schedule:run
```

### Troubleshooting
1. **Payment not confirmed**: Check Midtrans dashboard
2. **Order not processing**: Verify Medanpedia API credentials
3. **Status not updating**: Check webhook configuration
4. **Frontend errors**: Run `npm run build`

## API Documentation

### Order Endpoints
- `GET /order/create` - Show order form
- `POST /order/store` - Create new order
- `GET /order/{orderId}/payment` - Payment page
- `GET /order/{orderId}/status` - Order status
- `GET /order/{orderId}/check-status` - API status check
- `POST /webhook/midtrans` - Payment webhook

### Response Formats
```json
// Success Response
{
    "success": true,
    "data": {
        "order_id": "ORD-ABC123",
        "status": "pending"
    }
}

// Error Response
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "email": ["Email is required"]
    }
}
```

## Configuration

### Service Types Support
- **Default**: Basic orders (service, target, quantity)
- **Package**: Package-based orders (no quantity)
- **Custom Comments**: Orders with custom comments
- **Mentions Custom List**: Orders with custom usernames

### Payment Configuration
- Sandbox/Production mode switching
- Multiple payment methods
- Custom payment expiration (24 hours default)
- Automatic payment verification

---

## Version Information
- **Laravel**: 11.x
- **React**: 18.x
- **TypeScript**: 5.x
- **Midtrans**: v2
- **Medanpedia API**: v1

Last updated: June 2025