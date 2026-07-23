import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: LucideIcon;
  trend?: { value: string; positive: boolean };
  delay?: number;
  accent?: string;
}

export function StatsCard({ title, value, subtitle, icon: Icon, trend, delay = 0, accent = 'bg-forest/10' }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass rounded-3xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-2xl ${accent} flex items-center justify-center`}>
          <Icon size={20} className="text-forest" />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-xl ${trend.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
            {trend.positive ? '▲' : '▼'} {trend.value}
          </span>
        )}
      </div>

      <div>
        <p className="text-xs font-bold text-forest/50 uppercase tracking-wider mb-1">{title}</p>
        <p className="text-3xl font-display font-bold text-forest leading-none">{value}</p>
        <p className="text-xs text-forest/60 mt-1.5">{subtitle}</p>
      </div>
    </motion.div>
  );
}
