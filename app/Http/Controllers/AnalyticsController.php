<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    public function getMonthlyTrend(Request $request)
    {
        $user = $request->user();
        
        // Ambil semua transaksi user dari awal sampai sekarang, urutkan dari yang terlama
        $transactions = $user->transactions()
            ->with('asset')
            ->orderBy('transaction_date', 'asc')
            ->get();

        $monthlyData = [];
        $runningInvestment = 0;

        // Ambil data 6 bulan terakhir untuk tren grafik
        for ($i = 5; $i >= 0; $i--) {
            $monthDate = Carbon::now()->subMonths($i);
            $monthKey = $monthDate->format('Y-m'); // Format: 2026-02, 2026-03, dst
            $monthName = $monthDate->translatedFormat('F Y'); // Nama bulan dalam teks

            $monthlyData[$monthKey] = [
                'month' => $monthName,
                'total_invested' => 0
            ];
        }

        // Hitung akumulasi modal masuk dari riwayat transaksi
        foreach ($transactions as $tx) {
            $txMonth = Carbon::parse($tx->transaction_date)->format('Y-m');

            if ($tx->type === 'BUY') {
                $runningInvestment += ($tx->quantity * $tx->price_per_unit) + $tx->fee;
            } elseif ($tx->type === 'SELL') {
                // Sederhananya mengurangi porsi modal awal yang keluar
                $runningInvestment -= ($tx->quantity * $tx->price_per_unit);
                if ($runningInvestment < 0) $runningInvestment = 0;
            }

            // Jika transaksi terjadi di dalam salah satu dari 6 bulan terakhir, update nilainya
            if (array_key_exists($txMonth, $monthlyData)) {
                $monthlyData[$txMonth]['total_invested'] = round($runningInvestment, 2);
            }
        }

        // Rapikan nilai bulan yang kosong agar mengikuti akumulasi bulan sebelumnya (forward fill)
        $lastValue = 0;
        foreach ($monthlyData as $key => $data) {
            if ($data['total_invested'] == 0) {
                $monthlyData[$key]['total_invested'] = $lastValue;
            } else {
                $lastValue = $data['total_invested'];
            }
        }

        return response()->json([
            'status' => 'success',
            'chart_data' => array_values($monthlyData)
        ]);
    }
}