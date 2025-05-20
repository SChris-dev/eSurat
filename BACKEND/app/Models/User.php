<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    protected $table = 'users';

    protected $fillable = [
        'name',
        'email',
        'password',
        'role'
    ];

    public function letters() {
        return $this->hasMany(Letter::class, 'uploaded_by', 'id');
    }

    public function downloads() {
        return $this->hasMany(Download::class, 'user_id', 'id');
    }


    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
    ];


}
