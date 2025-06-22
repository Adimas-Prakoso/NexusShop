<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_id',
        'user_id',
        'email',
        'service_id',
        'service_name',
        'target',
        'quantity',
        'comments',
        'usernames',
        'price',
        'status',
        'medanpedia_order_id',
        'medanpedia_response',
        'start_count',
        'remains',
        'currency',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'quantity' => 'integer',
        'service_id' => 'integer',
        'start_count' => 'integer',
        'remains' => 'integer',
        'medanpedia_response' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    /**
     * Get all of the order's activities.
     */
    public function activities()
    {
        return $this->morphMany(RecentActivity::class, 'subject');
    }

    public function getStatusColorAttribute(): string
    {
        return match($this->status) {
            'pending' => 'yellow',
            'processing' => 'blue',
            'completed' => 'green',
            'cancelled' => 'red',
            'partial' => 'orange',
            default => 'gray',
        };
    }

    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            'pending' => 'Pending',
            'processing' => 'Processing',
            'completed' => 'Completed',
            'cancelled' => 'Cancelled',
            'partial' => 'Partial',
            default => 'Unknown',
        };
    }
}
