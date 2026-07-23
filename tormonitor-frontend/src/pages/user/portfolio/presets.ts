export interface AssetPreset {
  name: string;
  type: 'Saham' | 'Obligasi' | 'Kripto' | 'Properti' | 'Kas';
  unitPrice?: number;
  unitName?: string;
  defaultReturn: number;
}

export const PRESETS: AssetPreset[] = [
  // Saham
  { name: 'Saham BCA (BBCA)', type: 'Saham', unitPrice: 10250, unitName: 'lembar', defaultReturn: 12.5 },
  { name: 'Saham Mandiri (BMRI)', type: 'Saham', unitPrice: 6400, unitName: 'lembar', defaultReturn: 9.8 },
  { name: 'Saham BRI (BBRI)', type: 'Saham', unitPrice: 4800, unitName: 'lembar', defaultReturn: -4.2 },
  { name: 'Saham Telkom (TLKM)', type: 'Saham', unitPrice: 3800, unitName: 'lembar', defaultReturn: 2.1 },
  // Kripto
  { name: 'Bitcoin (BTC)', type: 'Kripto', unitPrice: 980000000, unitName: 'BTC', defaultReturn: 45.2 },
  { name: 'Ethereum (ETH)', type: 'Kripto', unitPrice: 52000000, unitName: 'ETH', defaultReturn: 28.6 },
  { name: 'Solana (SOL)', type: 'Kripto', unitPrice: 2200000, unitName: 'SOL', defaultReturn: 88.4 },
  // Obligasi
  { name: 'Obligasi Negara (SBN / ORI)', type: 'Obligasi', unitPrice: 1000000, unitName: 'unit', defaultReturn: 6.3 },
  { name: 'Sukuk Ritel (SR)', type: 'Obligasi', unitPrice: 1000000, unitName: 'unit', defaultReturn: 6.1 },
  // Properti
  { name: 'Rumah Hunian', type: 'Properti', unitPrice: 1500000000, unitName: 'unit', defaultReturn: 7.5 },
  { name: 'Apartemen Premium', type: 'Properti', unitPrice: 850000000, unitName: 'unit', defaultReturn: 5.0 },
  // Kas
  { name: 'Tabungan BCA', type: 'Kas', unitPrice: 1, unitName: 'Rupiah', defaultReturn: 2.5 },
  { name: 'Deposito Bank Mandiri', type: 'Kas', unitPrice: 1, unitName: 'Rupiah', defaultReturn: 4.5 },
  { name: 'Kas Tunai (Cash)', type: 'Kas', unitPrice: 1, unitName: 'Rupiah', defaultReturn: 0.0 }
];
