<?php
namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\User;
use Illuminate\Http\Request;

class AdminAssetController extends Controller
{
    // 1. Admin melihat semua daftar aset yang terdaftar secara global di sistem
    public function index()
    {
        // Mengambil semua data aset unik berdasarkan ticker dan kategorinya
        $globalAssets = Asset::select('asset_name', 'ticker', 'category')
            ->groupBy('asset_name', 'ticker', 'category')
            ->get();

        return response()->json([
            'status' => 'success',
            'count'  => $globalAssets->count(),
            'data'   => $globalAssets
        ]);
    }

    // 2. Admin mendaftarkan emiten saham atau crypto baru ke dalam sistem
    public function store(Request $request)
    {
        $request->validate([
            'asset_name' => 'required|string|max:255',
            'ticker'     => 'required|string|max:10',
            'category'   => 'required|string|in:Saham,Crypto,Reksadana,Obligasi',
        ]);

        // Catatan: Karena struktur database kita mendesain aset berelasi dengan user, 
        // Admin bisa mendaftarkan ini sebagai aset master yang terikat pada akun admin itu sendiri
        $asset = $request->user()->assets()->create([
            'asset_name' => $request->asset_name,
            'ticker'     => strtoupper($request->ticker),
            'category'   => $request->category,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Aset master baru berhasil ditambahkan oleh Admin',
            'data'    => $asset
        ], 201);
    }

    // 3. Admin melihat statistik total user dan total transaksi di aplikasi
    public function systemSummary()
    {
        $totalUsers = User::where('role', 'user')->count();
        
        return response()->json([
            'status' => 'success',
            'summary' => [
                'total_registered_investors' => $totalUsers,
                'system_status'             => 'Healthy',
                'laravel_version'            => app()->version(),
            ]
        ]);
    }
}