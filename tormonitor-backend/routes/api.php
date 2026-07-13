<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AdminAssetController;
use App\Http\Controllers\AdminUserController;
use Illuminate\Support\Facades\Route;

// Route Publik (Bisa diakses tanpa login)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Route Terproteksi (Wajib membawa Bearer Token)
Route::middleware('auth:sanctum')->group(function () {
    // Auth Routes
    Route::post('/logout', [AuthController::class, 'logout']);

    // User Dashboard & Assets
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::post('/assets', [AssetController::class, 'storeAsset']);
    Route::post('/assets/{assetId}/transactions', [AssetController::class, 'storeTransaction']);
    Route::get('/assets/{assetId}/transactions', [AssetController::class, 'getTransactions']);
    Route::delete('/transactions/{transactionId}', [AssetController::class, 'destroyTransaction']);

    // Admin Routes
    Route::middleware('is_admin')->group(function () {
        // Global Assets Management
        Route::get('/admin/global-assets', [AdminAssetController::class, 'index']);
        Route::post('/admin/global-assets', [AdminAssetController::class, 'store']);

        // User Management
        Route::get('/admin/users', [AdminUserController::class, 'index']);
        Route::get('/admin/users', [AdminUserController::class, 'index']); // Lihat semua user
        Route::get('/admin/users/{id}/portfolio', [AdminUserController::class, 'showUserPortfolio']); // Intip portofolio user
        Route::delete('/admin/users/{id}', [AdminUserController::class, 'destroy']); // Hapus user
        // System Summary
        Route::get('/admin/system-summary', [AdminAssetController::class, 'systemSummary']);

    });
});