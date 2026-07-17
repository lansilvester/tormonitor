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

 // 2. Mencatat Transaksi Baru dengan Proteksi Saldo Unit
    public function storeTransaction(Request $request, $assetId)
    {
        $asset = $request->user()->assets()->findOrFail($assetId);

        $request->validate([
            'type'             => 'required|in:BUY,SELL,DIVIDEND',
            'quantity'         => 'required|numeric|gt:0',
            'price_per_unit'   => 'required|numeric|gt:0',
            'fee'              => 'nullable|numeric|gte:0',
            'transaction_date' => 'required|date',
        ]);

        // Proteksi khusus untuk transaksi JUAL (SELL)
        if ($request->type === 'SELL') {
            // Hitung total unit yang dimiliki saat ini dari riwayat transaksi
            $currentTransactions = $asset->transactions()->get();
            $ownedQuantity = 0;

            foreach ($currentTransactions as $tx) {
                if ($tx->type === 'BUY') {
                    $ownedQuantity += $tx->quantity;
                } elseif ($tx->type === 'SELL') {
                    $ownedQuantity -= $tx->quantity;
                }
            }

            // Jika jumlah yang ingin dijual lebih besar dari unit yang dimiliki
            if ($request->quantity > $ownedQuantity) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Transaksi gagal. Saldo unit aset Anda tidak mencukupi untuk melakukan penjualan.',
                    'current_owned_unit' => round($ownedQuantity, 8),
                    'attempted_sell_unit' => $request->quantity
                ], 422); // 422 Unprocessable Entity
            }
        }

        // Jalankan penyimpanan jika validasi lolos
        $transaction = $asset->transactions()->create([
            'type'             => $request->type,
            'quantity'         => $request->quantity,
            'price_per_unit'   => $request->price_per_unit,
            'fee'              => $request->fee ?? 0,
            'transaction_date' => $request->transaction_date,
        ]);

        return response()->json([
            'status'  => 'success',
            'message' => 'Transaksi berhasil dicatat',
            'data'    => $transaction
        ], 201);
    }
    // 3. Mengambil Semua Riwayat Transaksi dari Aset Tertentu
    public function getTransactions($assetId, Request $request)
    {
        $asset = $request->user()->assets()->with('transactions')->findOrFail($assetId);

        return response()->json([
            'status' => 'success',
            'asset'  => [
                'ticker'     => $asset->ticker,
                'asset_name' => $asset->asset_name
            ],
            'transactions' => $asset->transactions
        ]);
    }

    // 4. Menghapus Catatan Transaksi
    public function destroyTransaction(Request $request, $transactionId)
    {
        // Cari transaksi melalui aset yang dimiliki oleh user yang sedang login
        $transaction = Transaction::whereHas('asset', function ($query) use ($request) {
            $query->where('user_id', $request->user()->id);
        })->findOrFail($transactionId);

        $transaction->delete();

        return response()->json([
            'message' => 'Catatan transaksi berhasil dihapus'
        ]);
    }
    // 5. Mengambil daftar semua aset global unik untuk kebutuhan dropdown di frontend
    public function getGlobalAssetsList()
    {
        $globalAssets = Asset::select('asset_name', 'ticker', 'category')
            ->groupBy('asset_name', 'ticker', 'category')
            ->orderBy('asset_name', 'asc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $globalAssets
        ]);
    }
}