<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Transaction;
use Illuminate\Http\Request;

class AssetController extends Controller
{
    // 1. Menyimpan Aset Baru (Contoh: Menambahkan Emiten Saham "BBCA" atau Koin "BTC")
    public function storeAsset(Request $request)
    {
        $request->validate([
            'asset_name' => 'required|string|max:255',
            'ticker'     => 'required|string|max:10',
            'category'   => 'required|string|max:50', // Saham, Crypto, dll.
        ]);

        $asset = $request->user()->assets()->create([
            'asset_name' => $request->asset_name,
            'ticker'     => strtoupper($request->ticker),
            'category'   => $request->category,
        ]);

        return response()->json([
            'message' => 'Aset berhasil ditambahkan',
            'data'    => $asset
        ], 201);
    }

    // 2. Mencatat Transaksi Baru (BUY / SELL / DIVIDEND) pada Aset Tertentu
    public function storeTransaction(Request $request, $assetId)
    {
        // Pastikan aset tersebut memang milik user yang sedang login
        $asset = $request->user()->assets()->findOrFail($assetId);

        $request->validate([
            'type'             => 'required|in:BUY,SELL,DIVIDEND',
            'quantity'         => 'required|numeric|gt:0',
            'price_per_unit'   => 'required|numeric|gt:0',
            'fee'              => 'nullable|numeric|gte:0',
            'transaction_date' => 'required|date',
        ]);

        $transaction = $asset->transactions()->create([
            'type'             => $request->type,
            'quantity'         => $request->quantity,
            'price_per_unit'   => $request->price_per_unit,
            'fee'              => $request->fee ?? 0,
            'transaction_date' => $request->transaction_date,
        ]);

        return response()->json([
            'message' => 'Transaksi berhasil dicatat',
            'data'    => $transaction
        ], 201);
    }
}