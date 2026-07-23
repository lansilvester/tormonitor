import { PieChart } from 'lucide-react';
import { InvestmentAsset } from '../../../types';

interface PortfolioBreakdownProps {
  categoryAllocations: Array<{ type: string; value: number; percentage: number }>;
  assets: InvestmentAsset[];
}

export function PortfolioBreakdown({ categoryAllocations, assets }: PortfolioBreakdownProps) {
  return (
    <div className="glass rounded-3xl p-6 border border-black/5 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <PieChart className="w-4 h-4 text-forest" />
        <h3 className="text-sm font-display font-bold text-forest">Pembagian Alokasi</h3>
      </div>

      <div className="space-y-3">
        {categoryAllocations.map((alloc) => (
          <div key={alloc.type} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-forest/70">{alloc.type}</span>
              <span className="font-bold text-forest">{alloc.percentage.toFixed(1)}%</span>
            </div>
            <div className="w-full h-2 bg-black/5 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full"
                style={{ 
                  width: `${alloc.percentage}%`,
                  backgroundColor: 
                    alloc.type === 'Saham' ? '#2D4B39' : 
                    alloc.type === 'Obligasi' ? '#2563eb' :
                    alloc.type === 'Kripto' ? '#7c3aed' :
                    alloc.type === 'Properti' ? '#d97706' : '#059669'
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-forest/40">
              <span>{assets.filter(a => a.type === alloc.type).length} Investasi</span>
              <span>Rp {alloc.value.toLocaleString('id-ID')}</span>
            </div>
          </div>
        ))}

        {categoryAllocations.length === 0 && (
          <p className="text-xs text-center text-forest/40 py-4">Belum ada alokasi terdaftar.</p>
        )}
      </div>
    </div>
  );
}
