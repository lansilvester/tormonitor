import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { performanceHistory } from '../data';

export function PerformanceChart() {
  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-display font-bold text-xl text-forest">Ringkasan Kinerja</h3>
        <select className="bg-white/50 border border-black/5 rounded-xl px-3 py-1.5 text-sm text-forest font-medium outline-none focus:ring-2 focus:ring-forest/20 transition-all cursor-pointer">
          <option>6 Bulan</option>
          <option>1 Tahun</option>
          <option>Sepanjang Waktu</option>
        </select>
      </div>
      
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={performanceHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D4B39" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#2D4B39" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(45, 75, 57, 0.1)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(45, 75, 57, 0.6)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'rgba(45, 75, 57, 0.6)', fontSize: 12 }}
              tickFormatter={(val) => `Rp${val / 1000000}jt`}
              dx={-10}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
              itemStyle={{ color: '#2D4B39', fontWeight: 600 }}
              formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Nilai Portofolio']}
            />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#2D4B39" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorValue)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

