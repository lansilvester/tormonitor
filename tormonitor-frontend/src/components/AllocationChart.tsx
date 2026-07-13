import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { InvestmentAsset } from '../types';

interface AllocationChartProps {
  assets: InvestmentAsset[];
}

export function AllocationChart({ assets }: AllocationChartProps) {
  const CATEGORY_COLORS: Record<string, string> = {
    Saham: '#2D4B39',    // forest
    Obligasi: '#2563eb', // blue
    Kripto: '#7c3aed',   // purple
    Properti: '#d97706', // amber
    Kas: '#059669'       // emerald
  };
  const DEFAULT_COLOR = '#8fa89b';

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  // Group assets by type
  const groupedDataMap = assets.reduce((acc, asset) => {
    if (!acc[asset.type]) {
      acc[asset.type] = 0;
    }
    acc[asset.type] += asset.value;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(groupedDataMap).map(([type, value]) => {
    const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0;
    return {
      name: type,
      value: Math.round(allocation * 10) / 10,
      amount: value
    };
  }).filter(item => item.value > 0);

  return (
    <div className="glass rounded-3xl p-6 h-full flex flex-col">
      <h3 className="font-display font-bold text-xl text-forest mb-6">Alokasi Aset</h3>
      
      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-8 min-h-[250px]">
        <div className="w-48 h-48 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.name}`} fill={CATEGORY_COLORS[entry.name] || DEFAULT_COLOR} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}
                formatter={(value: number) => [`${value}%`, 'Alokasi']}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-display font-bold text-forest">{assets.length}</span>
            <span className="text-xs font-bold text-forest/60 uppercase tracking-wider">Aset</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full sm:w-auto">
          {chartData.map((data) => (
            <div key={data.name} className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full shrink-0" 
                style={{ backgroundColor: CATEGORY_COLORS[data.name] || DEFAULT_COLOR }}
              />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-forest leading-tight">{data.name}</span>
                <span className="text-xs text-forest/60">
                  {data.value}% (Rp {data.amount.toLocaleString('id-ID')})
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


