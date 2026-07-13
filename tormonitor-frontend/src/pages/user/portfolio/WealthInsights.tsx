import { Sparkles, Info } from 'lucide-react';
import { InvestmentAsset } from '../../../types';

interface WealthInsightsProps {
  assets: InvestmentAsset[];
  categoryAllocations: Array<{ type: string; value: number; percentage: number }>;
  totalValue: number;
}

export function WealthInsights({ assets, categoryAllocations, totalValue }: WealthInsightsProps) {
  const getSmartInsight = () => {
    if (assets.length === 0) {
      return {
        title: "Portofolio Kosong",
        description: "Mulai tambahkan aset investasi Anda seperti Saham, Kripto, atau Obligasi untuk mendapatkan analisis otomatis di sini.",
        style: "bg-forest/5 text-forest border-forest/10"
      };
    }

    const cashPerc = categoryAllocations.find(c => c.type === 'Kas')?.percentage || 0;
    const cryptoPerc = categoryAllocations.find(c => c.type === 'Kripto')?.percentage || 0;
    const stockPerc = categoryAllocations.find(c => c.type === 'Saham')?.percentage || 0;
    const highRiskPerc = stockPerc + cryptoPerc;

    if (cashPerc < 10 && totalValue > 5000000) {
      return {
        title: "Likuiditas Rendah",
        description: `Alokasi Kas Anda hanya ${cashPerc.toFixed(1)}%. Disarankan menjaga minimal 10% dana di Kas/Deposito untuk kebutuhan mendesak.`,
        style: "bg-terracotta/10 text-terracotta border-terracotta/20"
      };
    }

    if (cryptoPerc > 25) {
      return {
        title: "Risiko Volatilitas Tinggi",
        description: `Porsi Kripto Anda (${cryptoPerc.toFixed(1)}%) sangat tinggi. Disarankan melakukan rebalancing berkala demi mengamankan profit.`,
        style: "bg-purple-50 text-purple-900 border-purple-200"
      };
    }

    if (highRiskPerc > 75) {
      return {
        title: "Profil Portofolio Agresif",
        description: `Sebanyak ${highRiskPerc.toFixed(1)}% aset Anda berupa instrumen berisiko tinggi. Pastikan horizon investasi Anda berjangka panjang.`,
        style: "bg-blue-50 text-blue-900 border-blue-200"
      };
    }

    return {
      title: "Diversifikasi Optimal",
      description: "Proporsi portofolio Anda sangat sehat dan terdistribusi proporsional antara instrumen pertumbuhan dan instrumen pelindung nilai.",
      style: "bg-forest/10 text-forest border-forest/20"
    };
  };

  const insight = getSmartInsight();

  return (
    <div className={`rounded-3xl p-6 border ${insight.style} space-y-3`}>
      <div className="flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        <h4 className="text-sm font-display font-bold">{insight.title}</h4>
      </div>
      <p className="text-xs leading-relaxed font-medium">
        {insight.description}
      </p>
      <div className="pt-2 text-[10px] opacity-60 flex items-center gap-1.5 font-semibold">
        <Info size={10} />
        <span>Analisis disesuaikan dengan proporsi portofolio aktif Anda.</span>
      </div>
    </div>
  );
}
