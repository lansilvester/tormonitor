import React from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Edit3, Trash2, LineChart, Shield, Coins, Building2, Wallet, Briefcase } from 'lucide-react';
import { InvestmentAsset } from '../../../types';

interface AssetCardProps {
  asset: InvestmentAsset;
  totalValue: number;
  onEdit: (asset: InvestmentAsset) => void;
  onDelete: (id: string) => void;
}

const getCategoryIcon = (type: string) => {
  switch (type) {
    case 'Saham': return <LineChart className="w-5 h-5 text-forest" />;
    case 'Obligasi': return <Shield className="w-5 h-5 text-blue-600" />;
    case 'Kripto': return <Coins className="w-5 h-5 text-purple-600" />;
    case 'Properti': return <Building2 className="w-5 h-5 text-amber-600" />;
    case 'Kas': return <Wallet className="w-5 h-5 text-emerald-600" />;
    default: return <Briefcase className="w-5 h-5 text-forest" />;
  }
};

const getBadgeStyle = (type: string) => {
  switch (type) {
    case 'Saham': return 'bg-forest/10 text-forest border-forest/20';
    case 'Obligasi': return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Kripto': return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'Properti': return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Kas': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    default: return 'bg-terracotta/10 text-terracotta border-terracotta/20';
  }
};

export const AssetCard: React.FC<AssetCardProps> = ({ asset, totalValue, onEdit, onDelete }) => {
  const allocationPercentage = totalValue > 0 ? (asset.value / totalValue) * 100 : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="glass rounded-2xl p-5 flex flex-col justify-between border border-black/5 hover:shadow-md transition-all relative group"
    >
      {/* Hover edit/delete action badges */}
      <div className="absolute top-4 right-4 flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(asset)}
          className="p-1.5 text-forest/60 hover:text-forest hover:bg-forest/10 rounded-lg transition-all cursor-pointer"
          title="Edit Investasi"
        >
          <Edit3 size={14} />
        </button>
        <button
          onClick={() => {
            if (confirm(`Hapus investasi ${asset.name}?`)) {
              onDelete(asset.id);
            }
          }}
          className="p-1.5 text-forest/40 hover:text-terracotta hover:bg-terracotta/10 rounded-lg transition-all cursor-pointer"
          title="Hapus Investasi"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2.5">
          <span className="p-1 rounded-lg bg-black/5">
            {getCategoryIcon(asset.type)}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(asset.type)}`}>
            {asset.type}
          </span>
        </div>
        
        <h3 className="text-base font-display font-bold text-forest mb-1 pr-14 truncate">{asset.name}</h3>
        <p className="text-xl font-display font-bold text-forest mb-3">
          Rp {asset.value.toLocaleString('id-ID')}
        </p>
      </div>

      <div className="space-y-2.5 pt-3 border-t border-black/5">
        <div>
          <div className="flex justify-between text-[10px] font-semibold text-forest/50 mb-1">
            <span>Bobot Portofolio</span>
            <span>{allocationPercentage.toFixed(1)}%</span>
          </div>
          <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-forest rounded-full transition-all duration-500" 
              style={{ width: `${allocationPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-forest/60">Imbal Hasil</span>
          <div className={`flex items-center gap-0.5 font-bold ${
            asset.currentReturn >= 0 ? 'text-forest' : 'text-terracotta'
          }`}>
            {asset.currentReturn >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{asset.currentReturn >= 0 ? '+' : ''}{asset.currentReturn}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
export { getCategoryIcon, getBadgeStyle };
