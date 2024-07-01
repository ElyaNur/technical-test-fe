<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    protected $fillable = [
        'movie_id',
        'user_id',
        'title',
        'photo',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];
}
