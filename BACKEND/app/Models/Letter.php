<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    protected $table = 'letters';

    protected $fillable = [
        'title',
        'description',
        'category_id',
        'file_path',
        'uploaded_by'
    ];

    public function category() {
        return $this->belongsTo(Category::class, 'category_id', 'id');
    }

    public function user() {
        return $this->belongsTo(User::class, 'uploaded_by', 'id');
    }

    public function downloads() {
        return $this->hasMany(Download::class, 'letter_id', 'id');
    }
}
