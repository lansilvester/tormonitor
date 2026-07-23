import { motion } from 'motion/react';
import { Users, Wallet, TrendingUp, BarChart3, ChevronRight } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { UserGrowthChart } from './UserGrowthChart';
import { mockAdminUsers } from '../../../data';
import { AdminUser } from '../../../types';

interface AdminOverviewPageProps {
  onNavigateToUsers: () => void;
}

export function AdminOverviewPage({ onNavigateToUsers }: AdminOverviewPageProps) {
  const totalUsers = mockAdminUsers.length;
  const activeUsers = mockAdminUsers.filter((u) => u.status === 'Aktif').length;
  const totalAUM = mockAdminUsers.reduce((sum, u) => sum + u.totalPortfolioValue, 0);
  const totalAssets = mockAdminUsers.reduce((sum, u) => sum + u.assetCount, 0);

  const recentUsers = [...mockAdminUsers].slice(0, 5);

  const formatRupiah = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)}jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const statusColors: Record<AdminUser['status'], string> = {
    'Aktif': 'bg-green-100 text-green-700',
    'Ditangguhkan': 'bg-amber-100 text-amber-700',
    'Diblokir': 'bg-red-100 text-red-600',
  };

  return (
    <motion.div
      key="admin-overview"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      {/* Stats Cards Grid */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pengguna"
          value={totalUsers.toString()}
          subtitle={`${activeUsers} pengguna aktif`}
          icon={Users}
          trend={{ value: '18%', positive: true }}
          delay={0}
          accent="bg-forest/10"
        />
        <StatsCard
          title="Dana Kelolaan (AUM)"
          value={formatRupiah(totalAUM)}
          subtitle="Seluruh portofolio pengguna"
          icon={Wallet}
          trend={{ value: '12%', positive: true }}
          delay={0.05}
          accent="bg-terracotta/10"
        />
        <StatsCard
          title="Total Aset Dikelola"
          value={totalAssets.toString()}
          subtitle="Di seluruh kategori aset"
          icon={BarChart3}
          trend={{ value: '7%', positive: true }}
          delay={0.1}
          accent="bg-blue-500/10"
        />
        <StatsCard
          title="Rata-rata Imbal Hasil"
          value="10.2%"
          subtitle="Return rata-rata per pengguna"
          icon={TrendingUp}
          trend={{ value: '2.1%', positive: true }}
          delay={0.15}
          accent="bg-purple-500/10"
        />
      </section>

      {/* Growth Chart */}
      <section>
        <UserGrowthChart />
      </section>

      {/* Recent Users Preview Table */}
      <section className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-display font-bold text-xl text-forest">Pengguna Terdaftar</h3>
            <p className="text-xs text-forest/50 mt-0.5">Menampilkan {recentUsers.length} dari {totalUsers} pengguna</p>
          </div>
          <button
            onClick={onNavigateToUsers}
            className="flex items-center gap-1.5 text-xs font-bold text-forest/70 hover:text-forest bg-forest/5 hover:bg-forest/10 px-3 py-2 rounded-xl transition-all"
          >
            Lihat Semua
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="text-left py-3 px-2 text-xs font-bold text-forest/50 uppercase tracking-wider">Pengguna</th>
                <th className="text-left py-3 px-2 text-xs font-bold text-forest/50 uppercase tracking-wider hidden md:table-cell">Bergabung</th>
                <th className="text-right py-3 px-2 text-xs font-bold text-forest/50 uppercase tracking-wider">Total Portofolio</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-forest/50 uppercase tracking-wider hidden sm:table-cell">Aset</th>
                <th className="text-center py-3 px-2 text-xs font-bold text-forest/50 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, idx) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="border-b border-black/4 hover:bg-forest/3 transition-colors group"
                >
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-2xl bg-forest/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-extrabold text-forest">{user.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-forest text-sm leading-tight">{user.name}</p>
                        <p className="text-xs text-forest/50 leading-tight">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 text-xs text-forest/60 hidden md:table-cell">
                    {new Date(user.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="py-3.5 px-2 text-right font-semibold text-forest text-sm">
                    {formatRupiah(user.totalPortfolioValue)}
                  </td>
                  <td className="py-3.5 px-2 text-center text-xs font-bold text-forest/60 hidden sm:table-cell">
                    {user.assetCount}
                  </td>
                  <td className="py-3.5 px-2 text-center">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${statusColors[user.status]}`}>
                      {user.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </motion.div>
  );
}
