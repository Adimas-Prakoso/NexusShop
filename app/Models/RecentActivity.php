<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RecentActivity extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'type',
        'description',
        'subject_id',
        'subject_type',
    ];

    /**
     * Get the parent subject model (user, order, etc.).
     */
    public function subject()
    {
        return $this->morphTo();
    }
}
