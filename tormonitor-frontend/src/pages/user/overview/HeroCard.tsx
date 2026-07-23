import { ArrowUpRight, TrendingUp, Download } from 'lucide-react';

interface HeroCardProps {
  totalValue: number;
}

export function HeroCard({ totalValue }: HeroCardProps) {
  return (
    <div className="glass rounded-3xl p-8 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-terracotta/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-forest/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <p className="text-forest/60 text-sm font-bold mb-1 uppercase tracking-wider">Total Nilai Portofolio</p>
          <h2 className="text-4xl lg:text-5xl font-display font-bold tracking-tight text-forest mb-4">
            Rp {totalValue.toLocaleString('id-ID')}
          </h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-forest text-cream rounded-full text-sm font-medium shadow-sm">
              <TrendingUp size={16} className="text-terracotta" />
              <span>+12.4%</span>
            </div>
            <span className="text-forest/60 text-sm">vs bulan lalu</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white border border-black/5 text-forest hover:bg-black/5 transition-all shadow-sm">
            <Download size={20} />
          </button>
          <button className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-forest text-cream hover:bg-forest-light transition-all shadow-md font-medium text-sm">
            <span>Investasi</span>
            <ArrowUpRight size={18} className="text-terracotta" />
          </button>
        </div>
      </div>
    </div>
  );
}
