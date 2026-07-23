import { motion, AnimatePresence } from 'motion/react';
import { X, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { AdminUser } from '../../../types';

interface UserDetailPanelProps {
  user: AdminUser | null;
  onClose: () => void;
}

const ASSET_TYPE_COLORS: Record<string, string> = {
  Saham: 'bg-forest/15 text-forest',
  Obligasi: 'bg-blue-100 text-blue-700',
  Kripto: 'bg-purple-100 text-purple-700',
  Properti: 'bg-amber-100 text-amber-700',
  Kas: 'bg-emerald-100 text-emerald-700',
};

const ASSET_TYPE_BAR: Record<string, string> = {
  Saham: 'bg-forest',
  Obligasi: 'bg-blue-500',
  Kripto: 'bg-purple-500',
  Properti: 'bg-amber-500',
  Kas: 'bg-emerald-500',
};

export function UserDetailPanel({ user, onClose }: UserDetailPanelProps) {
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

  return (
    <AnimatePresence>
      {user && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.aside
            key="panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-cream border-l border-black/10 shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Panel Header */}
            <div className="p-6 border-b border-black/5 bg-white/60 backdrop-blur-sm shrink-0">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-forest/10 border border-forest/20 flex items-center justify-center shrink-0">
                    <span className="text-xl font-extrabold text-forest">{user.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-lg text-forest leading-tight">{user.name}</h2>
                    <p className="text-xs text-forest/55">{user.email}</p>
                    <span className={`inline-block mt-1 text-[10px] font-extrabold px-2 py-0.5 rounded-lg ${
                      user.status === 'Aktif'
                        ? 'bg-green-100 text-green-700'
                        : user.status === 'Ditangguhkan'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {user.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl text-forest/50 hover:text-forest hover:bg-forest/10 transition-all"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Panel Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Summary Card */}
              <div className="glass rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-2 text-forest/60">
                  <Wallet size={15} />
                  <span className="text-xs font-bold uppercase tracking-wider">Ringkasan Portofolio</span>
                </div>
                <p className="text-3xl font-display font-bold text-forest">
                  {formatRupiah(user.totalPortfolioValue)}
                </p>
                <div className="flex gap-4 text-xs text-forest/60 border-t border-black/5 pt-3">
                  <div>
                    <p className="font-bold text-forest/40 uppercase tracking-wider text-[10px]">Jumlah Aset</p>
                    <p className="font-bold text-forest mt-0.5">{user.assetCount} aset</p>
                  </div>
                  <div>
                    <p className="font-bold text-forest/40 uppercase tracking-wider text-[10px]">Bergabung</p>
                    <p className="font-bold text-forest mt-0.5">
                      {new Date(user.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Asset Allocation Bar */}
              <div>
                <p className="text-xs font-bold text-forest/50 uppercase tracking-wider mb-3">Alokasi Aset</p>
                <div className="flex rounded-2xl overflow-hidden h-3 gap-0.5">
                  {user.assets.map((asset) => (
                    <div
                      key={asset.id}
                      title={`${asset.name}: ${asset.allocation}%`}
                      style={{ width: `${asset.allocation}%` }}
                      className={`${ASSET_TYPE_BAR[asset.type] ?? 'bg-gray-400'} h-full transition-all`}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {user.assets.map((asset) => (
                    <span key={asset.id} className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${ASSET_TYPE_COLORS[asset.type] ?? 'bg-gray-100 text-gray-600'}`}>
                      {asset.type} {asset.allocation}%
                    </span>
                  ))}
                </div>
              </div>

              {/* Asset List */}
              <div>
                <p className="text-xs font-bold text-forest/50 uppercase tracking-wider mb-3">Daftar Aset</p>
                <div className="space-y-2.5">
                  {user.assets.map((asset, idx) => (
                    <motion.div
                      key={asset.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="flex items-center justify-between p-3.5 bg-white/70 rounded-2xl border border-black/5 hover:bg-white/90 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-extrabold ${ASSET_TYPE_COLORS[asset.type] ?? 'bg-gray-100 text-gray-600'}`}>
                          {asset.type.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-forest leading-tight">{asset.name}</p>
                          <p className="text-[11px] text-forest/50">{asset.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-forest">
                          {asset.value >= 1_000_000_000
                            ? `Rp ${(asset.value / 1_000_000_000).toFixed(1)}M`
                            : `Rp ${(asset.value / 1_000_000).toFixed(0)}jt`}
                        </p>
                        <p className={`text-[11px] font-bold flex items-center justify-end gap-0.5 ${asset.currentReturn >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                          {asset.currentReturn >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                          {asset.currentReturn}%
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
