import { InvestmentAsset, Transaction, PerformanceData } from './types';

export const mockAssets: InvestmentAsset[] = [
  { id: '1', name: 'Vanguard S&P 500 ETF', type: 'Saham', value: 1875000000, currentReturn: 12.4, allocation: 45 },
  { id: '2', name: 'Obligasi Negara', type: 'Obligasi', value: 675000000, currentReturn: 3.2, allocation: 15 },
  { id: '3', name: 'Dana Investasi Real Estat', type: 'Properti', value: 1275000000, currentReturn: 8.7, allocation: 30 },
  { id: '4', name: 'Reksa Dana Pasar Uang', type: 'Kas', value: 375000000, currentReturn: 4.5, allocation: 10 },
];

export const mockTransactions: Transaction[] = [
  { id: 't1', date: '2026-07-10', description: 'Setoran Bulanan', amount: 75000000, type: 'Setor', status: 'Selesai' },
  { id: 't2', date: '2026-07-08', description: 'Dividen Vanguard', amount: 6750000, type: 'Dividen', status: 'Selesai' },
  { id: 't3', date: '2026-07-05', description: 'Beli Saham Teknologi', amount: 30000000, type: 'Beli', status: 'Selesai' },
  { id: 't4', date: '2026-07-02', description: 'Jual Obligasi', amount: 15000000, type: 'Jual', status: 'Tertunda' },
];

export const performanceHistory: PerformanceData[] = [
  { month: 'Jan', value: 3150000000 },
  { month: 'Feb', value: 3225000000 },
  { month: 'Mar', value: 3180000000 },
  { month: 'Apr', value: 3420000000 },
  { month: 'Mei', value: 3525000000 },
  { month: 'Jun', value: 3750000000 },
  { month: 'Jul', value: 4200000000 },
];
