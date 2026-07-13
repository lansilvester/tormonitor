import { Sparkles } from 'lucide-react';

export function TransactionsTable() {
  return (
    <div className="glass rounded-3xl p-8 border border-black/5 flex flex-col items-center justify-center min-h-[280px] text-center relative overflow-hidden bg-white/40">
      <div className="absolute top-0 right-0 w-32 h-32 bg-forest/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="w-12 h-12 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center mb-4 text-forest">
        <Sparkles size={20} className="animate-pulse" />
      </div>
      
      <h3 className="font-display font-bold text-lg text-forest mb-2">Riwayat Transaksi Segera Hadir</h3>
      <p className="text-forest/60 text-xs max-w-sm leading-relaxed">
        Fitur integrasi otomatis mutasi rekening dan pencatatan transaksi investasi real-time sedang disiapkan untuk menyempurnakan pelacakan portofolio Anda.
      </p>
    </div>
  );
}


