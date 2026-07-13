<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
   public function run(): void
    {
        // Pembuatan Akun Akun Admin Utama
        User::create([
            'name' => 'Super Admin Tormonitor',
            'email' => 'admin@tormonitor.com',
            'password' => Hash::make('admin123'), // Password untuk login admin
            'role' => 'admin',
        ]);

        // Pembuatan Akun User / Investor Contoh
        User::create([
            'name' => 'Varland Investor',
            'email' => 'user@tormonitor.com',
            'password' => Hash::make('user123'),
            'role' => 'user',
        ]);
    }
}
