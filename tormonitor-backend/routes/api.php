<?php


// Route Publik (Bisa diakses tanpa login)
Route::post('/register', [AuthController::class, 'register']);
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;

// Route Publik (Bisa diakses tanpa login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route Terproteksi (Wajib membawa Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/assets', [AssetController::class, 'storeAsset']);
    Route::post('/assets/{assetId}/transactions', [AssetController::class, 'storeTransaction']);
});