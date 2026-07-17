<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;


class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
   
    use HasFactory, HasApiTokens, Notifiable; // Tambahkan HasApiTokens di sini

    protected $fillable = ['name', 'email', 'password','role'];
    protected $hidden = ['password', 'remember_token'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    public function assets()
    {
        return $this->hasMany(Asset::class);
    }
    public function transactions(): HasManyThrough
    {
        return $this->hasManyThrough(Transaction::class, Asset::class);
    }
}
