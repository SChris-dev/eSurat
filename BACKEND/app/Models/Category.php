<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';

    protected $fillable = [
        'name',
        'slug'
    ];

    public function letters() {
        return $this->hasMany(Letter::class, 'category_id', 'id');
    }
}
