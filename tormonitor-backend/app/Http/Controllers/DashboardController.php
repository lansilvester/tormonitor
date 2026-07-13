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

        // Grouping untuk kebutuhan chart alokasi aset
        $categoryTotals = [];

        foreach ($assets as $asset) {
            $totalQuantity = 0;
            $totalCost = 0;

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
                }
            }

            $averagePrice = $totalQuantity > 0 ? ($totalCost / $totalQuantity) : 0;

            // Simulasi Harga Pasar Saat Ini
            $currentPrice = $averagePrice * 1.05; // Contoh simulasi naik 5%
            $currentValue = $totalQuantity * $currentPrice;

            $floatingProfitLoss = $currentValue - $totalCost;
            $percentageReturn = $totalCost > 0 ? ($floatingProfitLoss / $totalCost) * 100 : 0;

            if ($totalQuantity > 0) {
                $portfolioSummary[] = [
                    'asset_id'        => $asset->id,
                    'asset_name'      => $asset->asset_name,
                    'ticker'          => $asset->ticker,
                    'category'        => $asset->category,
                    'total_unit'      => round($totalQuantity, 4), // Pas dengan kolom 'Total Unit'
                    'avg_price'       => round($averagePrice, 2),  // Pas dengan kolom 'Avg Price'
                    'current_price'   => round($currentPrice, 2),  // Pas dengan kolom 'Current Price'
                    'total_value'     => round($currentValue, 2),
                    'profit_loss_num' => round($floatingProfitLoss, 2),
                    'profit_loss_pct' => round($percentageReturn, 2), // Pas dengan kolom 'Total Profit/Loss'
                ];

                $totalInvestedCapital += $totalCost;
                $totalCurrentValue += $currentValue;

                // Hitung total nilai per kategori untuk chart alokasi
                if (!isset($categoryTotals[$asset->category])) {
                    $categoryTotals[$asset->category] = 0;
                }
                $categoryTotals[$asset->category] += $currentValue;
            }
        }

        $totalGainLoss = $totalCurrentValue - $totalInvestedCapital;
        $totalPercentageReturn = $totalInvestedCapital > 0 ? ($totalGainLoss / $totalInvestedCapital) * 100 : 0;

        // Format data alokasi aset untuk Chart di UI
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
                'investor_name'    => $user->name,
                'total_balance'    => round($totalCurrentValue, 2),    // Menjawab Card 'Total Balance'
                'total_investment' => round($totalInvestedCapital, 2), // Menjawab Card 'Total Investment'
                'total_profit_num' => round($totalGainLoss, 2),          // Menjawab Card 'Total Profit'
                'total_profit_pct' => round($totalPercentageReturn, 2),
            ],
            'asset_allocation_chart' => $assetAllocation, // Data siap saji untuk Pie Chart teman Anda
            'table_assets'           => $portfolioSummary // Data siap saji untuk baris tabel
        ]);
    }
}