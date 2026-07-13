<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $assets = $user->assets()->with('transactions')->get();

        $portfolioSummary = [];
        $totalPortfolioValue = 0; // Total akumulasi modal masuk

        foreach ($assets as $asset) {
            $totalQuantity = 0;
            $totalCost = 0;

            foreach ($asset->transactions as $tx) {
                if ($tx->type === 'BUY') {
                    $totalQuantity += $tx->quantity;
                    $totalCost += ($tx->quantity * $tx->price_per_unit) + $tx->fee;
                } elseif ($tx->type === 'SELL') {
                    $totalQuantity -= $tx->quantity;
                    // Pengurangan cost dihitung proporsional berdasarkan rata-rata harga beli sebelumnya
                }
                // Catatan: Tipe DIVIDEND nanti bisa dikalkulasikan sebagai pengurang modal atau cash terpisah
            }

            // Hitung Harga Rata-rata Beli (Average Price)
            $averagePrice = $totalQuantity > 0 ? ($totalCost / $totalQuantity) : 0;

            $portfolioSummary[] = [
                'id' => $asset->id,
                'asset_name' => $asset->asset_name,
                'ticker' => $asset->ticker,
                'category' => $asset->category,
                'total_quantity' => $totalQuantity,
                'average_price' => round($averagePrice, 4),
                'total_invested_capital' => round($totalCost, 2),
            ];

            $totalPortfolioValue += $totalCost;
        }

        return response()->json([
            'status' => 'success',
            'summary' => [
                'investor_name' => $user->name,
                'total_assets_monitored' => $assets->count(),
                'total_money_invested' => round($totalPortfolioValue, 2),
            ],
            'my_portfolio' => $portfolioSummary
        ]);
    }
}