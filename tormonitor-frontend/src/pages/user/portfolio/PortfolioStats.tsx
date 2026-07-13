import { TrendingUp, TrendingDown } from 'lucide-react';

interface PortfolioStatsProps {
  totalValue: number;
  totalReturnWeighted: number;
  dominanSektor: string;
  dominanSektorPercentage: number;
  totalProducts: number;
}

export function PortfolioStats({
  totalValue,
  totalReturnWeighted,
  dominanSektor,
  dominanSektorPercentage,
  totalProducts
}: PortfolioStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass rounded-2xl p-5 border border-black/5 flex flex-col justify-between">
        <span className="text-xs font-bold text-forest/50 uppercase tracking-wider">Total Nilai Portofolio</span>
        <span className="text-2xl font-display font-bold text-forest mt-2">
          Rp {totalValue.toLocaleString('id-ID')}
        </span>
      </div>
      
      <div className="glass rounded-2xl p-5 border border-black/5 flex flex-col justify-between">
        <span className="text-xs font-bold text-forest/50 uppercase tracking-wider">Rata-Rata Imbal Hasil</span>
        <div className="flex items-center gap-1.5 mt-2">
          <span className={`text-2xl font-display font-bold ${totalReturnWeighted >= 0 ? 'text-forest' : 'text-terracotta'}`}>
            {totalReturnWeighted >= 0 ? '+' : ''}{totalReturnWeighted.toFixed(2)}%
          </span>
          {totalReturnWeighted >= 0 ? (
            <TrendingUp size={18} className="text-forest" />
          ) : (
            <TrendingDown size={18} className="text-terracotta" />
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5 border border-black/5 flex flex-col justify-between">
        <span className="text-xs font-bold text-forest/50 uppercase tracking-wider">Dominasi Sektor</span>
        <span className="text-lg font-display font-bold text-forest mt-2 truncate">
          {dominanSektor} ({dominanSektorPercentage.toFixed(0)}%)
        </span>
      </div>

      <div className="glass rounded-2xl p-5 border border-black/5 flex flex-col justify-between">
        <span className="text-xs font-bold text-forest/50 uppercase tracking-wider">Total Jenis Aset</span>
        <span className="text-2xl font-display font-bold text-forest mt-2">
          {totalProducts} Produk
        </span>
      </div>
    </div>
  );
}
