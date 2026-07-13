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
