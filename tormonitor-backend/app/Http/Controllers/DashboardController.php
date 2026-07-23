<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $assets = $user->assets()->with(['transactions' => function($query) {
            $query->orderBy('transaction_date', 'asc');
        }])->get();

        $portfolioSummary = [];
        $totalInvestedCapital = 0;
        $totalCurrentValue = 0;
        $totalDividendsReceived = 0; // Tambahan penampung total deviden global

        $categoryTotals = [];

        foreach ($assets as $asset) {
            $totalQuantity = 0;
            $totalCost = 0;
            $totalDividendAsset = 0; // Penampung deviden per aset

            foreach ($asset->transactions as $tx) {
                if ($tx->type === 'BUY') {
                    $totalQuantity += $tx->quantity;
                    $totalCost += ($tx->quantity * $tx->price_per_unit) + $tx->fee;
                } elseif ($tx->type === 'SELL') {
                    if ($totalQuantity > 0) {
                        $currentAvg = $totalCost / $totalQuantity;
                        $totalQuantity -= $tx->quantity;
                        $totalCost -= ($tx->quantity * $currentAvg);
                    }
                } elseif ($tx->type === 'DIVIDEND') {
                    // Deviden berupa cash langsung dihitung sebagai keuntungan tunai
                    // Nilai deviden = jumlah unit saat itu * besaran deviden per unit
                    $totalDividendAsset += ($tx->quantity * $tx->price_per_unit);
                }
            }

            $averagePrice = $totalQuantity > 0 ? ($totalCost / $totalQuantity) : 0;

            // Simulasi Harga Pasar Saat Ini
            $currentPrice = $averagePrice * 1.05; 
            $currentValue = $totalQuantity * $currentPrice;

            // Floating PnP dihitung dari: (Nilai Sekarang + Deviden yang Diterima) - Modal yang Masuk
            $floatingProfitLoss = ($currentValue + $totalDividendAsset) - $totalCost;
            $percentageReturn = $totalCost > 0 ? ($floatingProfitLoss / $totalCost) * 100 : 0;

            if ($totalQuantity > 0 || $totalDividendAsset > 0) {
                $portfolioSummary[] = [
                    'asset_id'        => $asset->id,
                    'asset_name'      => $asset->asset_name,
                    'ticker'          => $asset->ticker,
                    'category'        => $asset->category,
                    'total_unit'      => round($totalQuantity, 4),
                    'avg_price'       => round($averagePrice, 2),
                    'current_price'   => round($currentPrice, 2),
                    'total_value'     => round($currentValue, 2),
                    'total_dividend'  => round($totalDividendAsset, 2), // Tampilkan deviden per aset di tabel
                    'profit_loss_num' => round($floatingProfitLoss, 2),
                    'profit_loss_pct' => round($percentageReturn, 2),
                ];

                $totalInvestedCapital += $totalCost;
                $totalCurrentValue += $currentValue;
                $totalDividendsReceived += $totalDividendAsset;

                if (!isset($categoryTotals[$asset->category])) {
                    $categoryTotals[$asset->category] = 0;
                }
                $categoryTotals[$asset->category] += $currentValue;
            }
        }

        // Total keuntungan gabungan termasuk seluruh pendapatan deviden
        $totalGainLoss = ($totalCurrentValue + $totalDividendsReceived) - $totalInvestedCapital;
        $totalPercentageReturn = $totalInvestedCapital > 0 ? ($totalGainLoss / $totalInvestedCapital) * 100 : 0;

        $assetAllocation = [];
        foreach ($categoryTotals as $category => $value) {
            $assetAllocation[] = [
                'category'   => $category,
                'value'      => round($value, 2),
                'percentage' => $totalCurrentValue > 0 ? round(($value / $totalCurrentValue) * 100, 2) : 0
            ];
        }

        return response()->json([
            'status' => 'success',
            'summary' => [
                'investor_name'          => $user->name,
                'total_balance'          => round($totalCurrentValue, 2),
                'total_investment'       => round($totalInvestedCapital, 2),
                'total_dividend_revenue' => round($totalDividendsReceived, 2), // Total pendapatan deviden user
                'total_profit_num'       => round($totalGainLoss, 2),
                'total_profit_pct'       => round($totalPercentageReturn, 2),
            ],
            'asset_allocation_chart' => $assetAllocation,
            'table_assets'           => $portfolioSummary
        ]);
    }
}