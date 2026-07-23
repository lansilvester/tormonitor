import { InvestmentAsset, Transaction, PerformanceData, AdminUser, UserGrowthData } from './types';


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

export const userGrowthHistory: UserGrowthData[] = [
  { month: 'Jan', pengguna: 120 },
  { month: 'Feb', pengguna: 185 },
  { month: 'Mar', pengguna: 240 },
  { month: 'Apr', pengguna: 312 },
  { month: 'Mei', pengguna: 398 },
  { month: 'Jun', pengguna: 475 },
  { month: 'Jul', pengguna: 562 },
];

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'u1',
    name: 'Budi Santoso',
    email: 'budi.santoso@gmail.com',
    phoneNumber: '0812-3456-7890',
    kycStatus: 'Terverifikasi',
    joinDate: '2026-01-15',
    totalPortfolioValue: 4200000000,
    assetCount: 4,
    status: 'Aktif',
    role: 'user',
    assets: [
      { id: 'a1', name: 'Vanguard S&P 500 ETF', type: 'Saham', value: 1875000000, currentReturn: 12.4, allocation: 45 },
      { id: 'a2', name: 'Obligasi Negara', type: 'Obligasi', value: 675000000, currentReturn: 3.2, allocation: 15 },
      { id: 'a3', name: 'Dana Investasi Real Estat', type: 'Properti', value: 1275000000, currentReturn: 8.7, allocation: 30 },
      { id: 'a4', name: 'Reksa Dana Pasar Uang', type: 'Kas', value: 375000000, currentReturn: 4.5, allocation: 10 },
    ],
  },
  {
    id: 'u2',
    name: 'Siti Rahayu',
    email: 'siti.rahayu@outlook.com',
    phoneNumber: '0821-9876-5432',
    kycStatus: 'Terverifikasi',
    joinDate: '2026-02-20',
    totalPortfolioValue: 1850000000,
    assetCount: 3,
    status: 'Aktif',
    role: 'user',
    assets: [
      { id: 'b1', name: 'Bitcoin', type: 'Kripto', value: 950000000, currentReturn: 34.2, allocation: 51 },
      { id: 'b2', name: 'Ethereum', type: 'Kripto', value: 600000000, currentReturn: 22.1, allocation: 32 },
      { id: 'b3', name: 'Reksa Dana Pasar Uang', type: 'Kas', value: 300000000, currentReturn: 4.5, allocation: 17 },
    ],
  },
  {
    id: 'u3',
    name: 'Ahmad Fauzi',
    email: 'ahmad.fauzi@yahoo.com',
    phoneNumber: '0855-1234-5678',
    kycStatus: 'Proses Review',
    joinDate: '2026-03-05',
    totalPortfolioValue: 3120000000,
    assetCount: 5,
    status: 'Aktif',
    role: 'user',
    assets: [
      { id: 'c1', name: 'Saham Telkom Indonesia', type: 'Saham', value: 780000000, currentReturn: 9.1, allocation: 25 },
      { id: 'c2', name: 'Saham BCA', type: 'Saham', value: 936000000, currentReturn: 11.5, allocation: 30 },
      { id: 'c3', name: 'Obligasi Korporasi', type: 'Obligasi', value: 624000000, currentReturn: 6.2, allocation: 20 },
      { id: 'c4', name: 'Apartemen Jakarta Selatan', type: 'Properti', value: 468000000, currentReturn: 5.8, allocation: 15 },
      { id: 'c5', name: 'Deposito BCA', type: 'Kas', value: 312000000, currentReturn: 4.1, allocation: 10 },
    ],
  },
  {
    id: 'u4',
    name: 'Dewi Permatasari',
    email: 'dewi.permata@gmail.com',
    phoneNumber: '0813-1122-3344',
    kycStatus: 'Ditolak',
    joinDate: '2026-04-12',
    totalPortfolioValue: 760000000,
    assetCount: 2,
    status: 'Ditangguhkan',
    role: 'user',
    assets: [
      { id: 'd1', name: 'Reksa Dana Campuran', type: 'Saham', value: 460000000, currentReturn: 7.3, allocation: 61 },
      { id: 'd2', name: 'Tabungan Berjangka', type: 'Kas', value: 300000000, currentReturn: 3.8, allocation: 39 },
    ],
  },
  {
    id: 'u5',
    name: 'Rudi Hartono',
    email: 'rudi.hartono@perusahaan.co.id',
    phoneNumber: '0812-5566-7788',
    kycStatus: 'Terverifikasi',
    joinDate: '2026-05-28',
    totalPortfolioValue: 6500000000,
    assetCount: 6,
    status: 'Aktif',
    role: 'user',
    assets: [
      { id: 'e1', name: 'Saham BBRI', type: 'Saham', value: 1950000000, currentReturn: 14.2, allocation: 30 },
      { id: 'e2', name: 'Saham Unilever', type: 'Saham', value: 1300000000, currentReturn: 8.9, allocation: 20 },
      { id: 'e3', name: 'Obligasi Pemerintah 10Y', type: 'Obligasi', value: 975000000, currentReturn: 7.1, allocation: 15 },
      { id: 'e4', name: 'Ruko Surabaya', type: 'Properti', value: 1625000000, currentReturn: 6.5, allocation: 25 },
      { id: 'e5', name: 'Ethereum', type: 'Kripto', value: 325000000, currentReturn: 22.1, allocation: 5 },
      { id: 'e6', name: 'Dana Darurat', type: 'Kas', value: 325000000, currentReturn: 3.5, allocation: 5 },
    ],
  },
  {
    id: 'u6',
    name: 'Maya Indriati',
    email: 'maya.indriati@gmail.com',
    phoneNumber: '0899-8877-6655',
    kycStatus: 'Belum Verifikasi',
    joinDate: '2026-06-10',
    totalPortfolioValue: 2100000000,
    assetCount: 3,
    status: 'Aktif',
    role: 'user',
    assets: [
      { id: 'f1', name: 'Index Fund IHSG', type: 'Saham', value: 1050000000, currentReturn: 10.8, allocation: 50 },
      { id: 'f2', name: 'Obligasi Ritel ORI', type: 'Obligasi', value: 630000000, currentReturn: 5.9, allocation: 30 },
      { id: 'f3', name: 'Reksa Dana Pasar Uang', type: 'Kas', value: 420000000, currentReturn: 4.2, allocation: 20 },
    ],
  },
];

