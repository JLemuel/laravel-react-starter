<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Violation extends Model
{
    protected $fillable = ['name', 'ordinance_number', 'penalties'];
    
    protected $casts = [
        'penalties' => 'array'
    ];
}
