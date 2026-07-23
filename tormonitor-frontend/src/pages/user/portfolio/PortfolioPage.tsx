import { useState } from 'react';
import { InvestmentAsset } from '../../../types';
import { Plus, Search, ArrowUpDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioStats } from './PortfolioStats';
import { AssetCard } from './AssetCard';
import { PortfolioBreakdown } from './PortfolioBreakdown';
import { WealthInsights } from './WealthInsights';
import { AssetForm } from './AssetForm';
import { Calculator } from 'lucide-react';

interface PortfolioPageProps {
  assets: InvestmentAsset[];
  onAddAsset: (asset: Omit<InvestmentAsset, 'id' | 'allocation'>) => void;
  onUpdateAsset: (id: string, asset: Omit<InvestmentAsset, 'id' | 'allocation'>) => void;
  onDeleteAsset: (id: string) => void;
}

export function PortfolioPage({ assets, onAddAsset, onUpdateAsset, onDeleteAsset }: PortfolioPageProps) {
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingAsset, setEditingAsset] = useState<InvestmentAsset | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value-desc' | 'value-asc' | 'return-desc' | 'name-asc'>('value-desc');

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalReturnWeighted = totalValue > 0 
    ? assets.reduce((sum, asset) => sum + (asset.currentReturn * asset.value), 0) / totalValue 
    : 0;

  // Group by category for breakdown
  const categoryTotals = assets.reduce((acc, asset) => {
    acc[asset.type] = (acc[asset.type] || 0) + asset.value;
    return acc;
  }, {} as Record<string, number>);

  const categoryAllocations = Object.entries(categoryTotals).map(([type, value]) => ({
    type,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0
  })).sort((a, b) => b.value - a.value);

  // Filter & Sort assets
  const filteredAssets = assets
    .filter(asset => {
      const matchFilter = selectedFilter === 'Semua' || asset.type === selectedFilter;
      const matchSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.type.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'value-desc': return b.value - a.value;
        case 'value-asc': return a.value - b.value;
        case 'return-desc': return b.currentReturn - a.currentReturn;
        case 'name-asc': return a.name.localeCompare(b.name);
        default: return b.value - a.value;
      }
    });

  const handleOpenAddForm = () => {
    setEditingAsset(null);
    setViewMode('form');
  };

  const handleOpenEditForm = (asset: InvestmentAsset) => {
    setEditingAsset(asset);
    setViewMode('form');
  };

  const handleSave = (payload: Omit<InvestmentAsset, 'id' | 'allocation'>) => {
    if (editingAsset) {
      onUpdateAsset(editingAsset.id, payload);
    } else {
      onAddAsset(payload);
    }
    setViewMode('list');
    setEditingAsset(null);
  };

  const handleDelete = (id: string) => {
    onDeleteAsset(id);
    setViewMode('list');
    setEditingAsset(null);
  };

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Page Header Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-forest">Portofolio Detail</h2>
                <p className="text-sm text-forest/60">Kelola rincian kepemilikan investasi spesifik Anda secara komprehensif.</p>
              </div>
              <button
                onClick={handleOpenAddForm}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-forest text-cream hover:bg-forest-light transition-all shadow-md font-semibold text-sm cursor-pointer"
              >
                <Plus size={18} />
                <span>Tambah Investasi</span>
              </button>
            </div>

            {/* Quick Stats Summary Banner */}
            <PortfolioStats
              totalValue={totalValue}
              totalReturnWeighted={totalReturnWeighted}
              dominanSektor={categoryAllocations[0]?.type || 'N/A'}
              dominanSektorPercentage={categoryAllocations[0]?.percentage || 0}
              totalProducts={assets.length}
            />

            {/* Main Interactive Grid / Columns Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Main Section */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Search and Filter Row */}
                <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3.5 top-3.5 text-forest/40 w-4 h-4" />
                    <input
                      type="text"
                      placeholder="Cari aset investasi..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/5 border-none text-forest placeholder-forest/40 text-xs font-medium outline-none focus:ring-2 focus:ring-forest/20"
                    />
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    <ArrowUpDown size={14} className="text-forest/50" />
                    <span className="text-xs font-semibold text-forest/50 hidden sm:inline">Urutkan:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="flex-1 md:flex-initial py-2 px-3 rounded-xl bg-black/5 text-forest text-xs font-bold border-none outline-none cursor-pointer focus:ring-2 focus:ring-forest/20"
                    >
                      <option value="value-desc">Nilai Terbesar</option>
                      <option value="value-asc">Nilai Terkecil</option>
                      <option value="return-desc">Imbal Hasil Tertinggi</option>
                      <option value="name-asc">Abjad (A-Z)</option>
                    </select>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-1.5 pb-2 border-b border-black/5">
                  {['Semua', 'Saham', 'Obligasi', 'Kripto', 'Properti', 'Kas'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedFilter(tab)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedFilter === tab
                          ? 'bg-forest text-cream shadow-sm'
                          : 'text-forest/60 hover:bg-black/5 hover:text-forest'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Filtered Assets Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredAssets.map((asset) => (
                      <AssetCard
                        key={asset.id}
                        asset={asset}
                        totalValue={totalValue}
                        onEdit={handleOpenEditForm}
                        onDelete={onDeleteAsset}
                      />
                    ))}
                  </AnimatePresence>

                  {filteredAssets.length === 0 && (
                    <div className="col-span-full py-16 text-center glass rounded-2xl border border-dashed border-forest/10 flex flex-col items-center justify-center">
                      <p className="text-forest/50 text-xs font-semibold">Tidak ada aset investasi ditemukan.</p>
                      <button
                        onClick={handleOpenAddForm}
                        className="mt-3 text-xs font-bold text-forest hover:underline cursor-pointer"
                      >
                        Tambah aset baru sekarang →
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Side Section */}
              <div className="space-y-6">
                <PortfolioBreakdown
                  categoryAllocations={categoryAllocations}
                  assets={assets}
                />

                <WealthInsights
                  assets={assets}
                  categoryAllocations={categoryAllocations}
                  totalValue={totalValue}
                />

                <div className="glass rounded-3xl p-6 border border-black/5 bg-forest-light/5 flex flex-col justify-between space-y-3">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-forest" />
                    <h4 className="text-sm font-display font-bold text-forest">Ingin mensimulasikan masa depan?</h4>
                  </div>
                  <p className="text-xs text-forest/60 leading-relaxed">
                    Gunakan fitur **Simulasi** di sidebar untuk memproyeksikan pertumbuhan seluruh nilai investasi Anda hingga puluhan tahun mendatang!
                  </p>
                </div>
              </div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 w-full"
          >
            <AssetForm
              assets={assets}
              editingAsset={editingAsset}
              onSave={handleSave}
              onCancel={() => setViewMode('list')}
              onDelete={handleDelete}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
