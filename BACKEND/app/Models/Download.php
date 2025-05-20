<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Download extends Model
{
    protected $table = 'downloads';

    protected $fillable = [
        'user_id',
        'letter_id',
        'downloaded_at'
    ];

    protected $casts = [
        'downloaded_at' => 'datetime',
    ];


    public function user() {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function letter() {
        return $this->belongsTo(Letter::class, 'letter_id', 'id');
    }
}
