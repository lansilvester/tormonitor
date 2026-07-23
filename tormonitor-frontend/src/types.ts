export interface InvestmentAsset {
  id: string;
  name: string;
  type: 'Saham' | 'Obligasi' | 'Kripto' | 'Properti' | 'Kas';
  value: number;
  currentReturn: number;
  allocation: number; // percentage
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'Setor' | 'Tarik' | 'Beli' | 'Jual' | 'Dividen';
  status: 'Selesai' | 'Tertunda';
}

export interface PerformanceData {
  month: string;
  value: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phoneNumber?: string;
  kycStatus?: 'Belum Verifikasi' | 'Proses Review' | 'Terverifikasi' | 'Ditolak';
  joinDate: string;
  totalPortfolioValue: number;
  assetCount: number;
  status: 'Aktif' | 'Ditangguhkan' | 'Diblokir';
  role: 'user' | 'admin';
  assets: InvestmentAsset[];
}

export interface UserGrowthData {
  month: string;
  pengguna: number;
}
