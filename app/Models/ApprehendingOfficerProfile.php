<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ApprehendingOfficerProfile extends Model
{
    protected $fillable = [
        'user_id',
        // 'username',
        'designation',
        'contact_number',
        'status'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
} 