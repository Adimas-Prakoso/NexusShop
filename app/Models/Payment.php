<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'payment_id',
        'midtrans_order_id',
        'payment_method',
        'amount',
        'currency',
        'status',
        'midtrans_response',
        'transaction_id',
        'qr_code_url',
        'va_number',
        'paid_at',
        'expired_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'midtrans_response' => 'array',
        'paid_at' => 'datetime:Asia/Jakarta',
        'expired_at' => 'datetime:Asia/Jakarta',
    ];

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'paid' => 'green',
            'failed' => 'red',
            'expired' => 'gray',
            'cancelled' => 'red',
            default => 'gray',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pending',
            'paid' => 'Paid',
            'failed' => 'Failed',
            'expired' => 'Expired',
            'cancelled' => 'Cancelled',
            default => 'Unknown',
        };
    }

    public function getPaymentMethodLabelAttribute(): string
    {
        return match($this->payment_method) {
            'qris' => 'QRIS',
            'bank_transfer' => 'Bank Transfer',
            'credit_card' => 'Credit Card',
            'gopay' => 'GoPay',
            'shopeepay' => 'ShopeePay',
            'dana' => 'DANA',
            'ovo' => 'OVO',
            default => ucfirst(str_replace('_', ' ', $this->payment_method)),
        };
    }
}
