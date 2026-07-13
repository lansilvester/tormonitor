import { motion } from 'motion/react';
import { HeroCard } from '../../components/HeroCard';
import { PerformanceChart } from '../../components/PerformanceChart';
import { AllocationChart } from '../../components/AllocationChart';
import { TransactionsTable } from '../../components/TransactionsTable';
import { InvestmentAsset } from '../../types';

interface OverviewPageProps {
  assets: InvestmentAsset[];
  totalValue: number;
}

export function OverviewPage({ assets, totalValue }: OverviewPageProps) {
  return (
    <motion.div 
      key="ringkasan"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <section>
        <HeroCard totalValue={totalValue} />
      </section>
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PerformanceChart />
        </div>
        <div className="lg:col-span-1">
          <AllocationChart assets={assets} />
        </div>
      </section>
      <section>
        <TransactionsTable />
      </section>
    </motion.div>
  );
}
