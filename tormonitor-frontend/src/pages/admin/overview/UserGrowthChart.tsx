import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { userGrowthHistory } from '../../../data';

export function UserGrowthChart() {
  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="font-display font-bold text-xl text-forest">Pertumbuhan Pengguna</h3>
          <p className="text-xs text-forest/50 mt-0.5">Total pengguna terdaftar per bulan</p>
        </div>
        <div className="px-3 py-1.5 bg-forest/10 rounded-xl">
          <span className="text-xs font-bold text-forest">2026</span>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={userGrowthHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPengguna" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C68972" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C68972" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(45, 75, 57, 0.08)" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(45, 75, 57, 0.55)', fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(45, 75, 57, 0.55)', fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              itemStyle={{ color: '#C68972', fontWeight: 600 }}
              formatter={(value: number) => [`${value} pengguna`, 'Total']}
            />
            <Area
              type="monotone"
              dataKey="pengguna"
              stroke="#C68972"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPengguna)"
              dot={{ fill: '#C68972', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#C68972' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
