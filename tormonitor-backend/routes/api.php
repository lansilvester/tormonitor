<?php


// Route Publik (Bisa diakses tanpa login)
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AssetController;

// Route Publik (Bisa diakses tanpa login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route Terproteksi (Wajib membawa Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::post('/assets', [AssetController::class, 'storeAsset']);
    Route::post('/assets/{assetId}/transactions', [AssetController::class, 'storeTransaction']);
    Route::get('/assets/{assetId}/transactions', [AssetController::class, 'getTransactions']);
    Route::delete('/transactions/{transactionId}', [AssetController::class, 'destroyTransaction']);

});

// Grup khusus Admin (Bisa mengelola aset global dan melihat semua user)
Route::middleware(['auth:sanctum', 'is_admin'])->group(function () {
    Route::post('/admin/global-assets', [AdminAssetController::class, 'store']); // Tambah Saham/Crypto baru ke sistem
    Route::get('/admin/users', [AdminUserController::class, 'index']); // Lihat daftar user
});