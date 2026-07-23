<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    // 1. Admin melihat daftar semua investor yang terdaftar di aplikasi
    public function index()
    {
        $users = User::where('role', 'user')
            ->select('id', 'name', 'email', 'created_at')
            ->withCount('assets') // Menghitung berapa banyak jenis aset yang mereka pantau
            ->get();

        return response()->json([
            'status' => 'success',
            'count'  => $users->count(),
            'data'   => $users
        ]);
    }

    // 2. Admin melihat detail aset dan transaksi milik user tertentu (untuk kebutuhan CS/Audit)
    public function showUserPortfolio($id)
    {
        $user = User::where('role', 'user')->with('assets.transactions')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => [
                'user_id' => $user->id,
                'name'    => $user->name,
                'email'   => $user->email,
                'assets'  => $user->assets
            ]
        ]);
    }

    // 3. Admin bisa menghapus atau memblokir akun user yang melanggar ketentuan
    public function destroy($id)
    {
        $user = User::where('role', 'user')->findOrFail($id);
        
        // Menghapus user (relasi aset & transaksi akan terhapus otomatis jika menggunakan onDelete('cascade') di migration)
        $user->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Akun investor berhasil dihapus dari sistem oleh Admin.'
        ]);
    }
}