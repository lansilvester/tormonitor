import { useState, useEffect, FormEvent } from 'react';
import { Sparkles, Trash2, ArrowLeft, Layers, Calculator, Info, Coins, Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { InvestmentAsset } from '../../../types';
import { PRESETS, AssetPreset } from './presets';
import { getCategoryIcon, getBadgeStyle } from './AssetCard';

interface AssetFormProps {
  assets: InvestmentAsset[];
  editingAsset: InvestmentAsset | null;
  onSave: (payload: Omit<InvestmentAsset, 'id' | 'allocation'>) => void;
  onCancel: () => void;
  onDelete: (id: string) => void;
}

export function AssetForm({ assets, editingAsset, onSave, onCancel, onDelete }: AssetFormProps) {
  // Form State
  const [name, setName] = useState(editingAsset ? editingAsset.name : '');
  const [type, setType] = useState<'Saham' | 'Obligasi' | 'Kripto' | 'Properti' | 'Kas'>(
    editingAsset ? editingAsset.type : 'Saham'
  );
  const [value, setValue] = useState(editingAsset ? editingAsset.value.toString() : '');
  const [currentReturn, setCurrentReturn] = useState(editingAsset ? editingAsset.currentReturn.toString() : '');

  // Input Mode State
  const [inputMode, setInputMode] = useState<'direct' | 'unit'>('direct');
  const [quantity, setQuantity] = useState('');
  const [unitPrice, setUnitPrice] = useState('');
  const [unitName, setUnitName] = useState('unit');

  // Sync value if unit inputs change
  useEffect(() => {
    if (inputMode === 'unit' && quantity && unitPrice) {
      const computedValue = parseFloat(quantity) * parseFloat(unitPrice);
      setValue(isNaN(computedValue) ? '' : computedValue.toString());
    }
  }, [quantity, unitPrice, inputMode]);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  const totalReturnWeighted = totalValue > 0 
    ? assets.reduce((sum, asset) => sum + (asset.currentReturn * asset.value), 0) / totalValue 
    : 0;

  const selectPreset = (preset: AssetPreset) => {
    setName(preset.name);
    setType(preset.type);
    setCurrentReturn(preset.defaultReturn.toString());
    if (preset.unitPrice) {
      setUnitPrice(preset.unitPrice.toString());
    }
    if (preset.unitName) {
      setUnitName(preset.unitName);
    }
    if (preset.unitPrice && preset.unitName && preset.unitName !== 'Rupiah' && preset.unitPrice > 1) {
      setInputMode('unit');
      setQuantity('1');
    } else {
      setInputMode('direct');
      if (preset.unitPrice) {
        setValue(preset.unitPrice.toString());
      }
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !value || !currentReturn) return;

    onSave({
      name,
      type,
      value: parseFloat(value),
      currentReturn: parseFloat(currentReturn)
    });
  };

  const handleDeleteAndBack = () => {
    if (editingAsset && confirm(`Apakah Anda yakin ingin menghapus investasi ${editingAsset.name}?`)) {
      onDelete(editingAsset.id);
    }
  };

  return (
    <div className="space-y-8 w-full">
      {/* Sub-page Header with Back Button */}
      <div className="flex items-center gap-4 pb-4 border-b border-black/5">
        <button
          type="button"
          onClick={onCancel}
          className="p-3 rounded-2xl bg-white border border-black/5 text-forest hover:bg-forest hover:text-cream hover:border-forest transition-all shadow-sm cursor-pointer"
          title="Kembali ke Portofolio"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-2xl font-display font-bold text-forest">
            {editingAsset ? 'Edit Investasi' : 'Tambah Investasi Baru'}
          </h2>
          <p className="text-sm text-forest/60">
            {editingAsset
              ? 'Perbarui rincian kepemilikan instrumen investasi Anda.'
              : 'Masukkan instrumen investasi baru Anda ke dalam pemantau portofolio.'}
          </p>
        </div>
      </div>

      {/* Main Form Content in a 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
          <div className="glass rounded-3xl p-6 md:p-8 space-y-6 border border-black/5">
            
            {/* Category Selection Tab */}
            <div>
              <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2.5">Kategori Aset</label>
              <div className="grid grid-cols-5 gap-1 bg-black/5 p-1 rounded-2xl">
                {(['Saham', 'Obligasi', 'Kripto', 'Properti', 'Kas'] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setType(cat);
                      if (cat === 'Saham') setUnitName('lembar');
                      else if (cat === 'Kripto') setUnitName('unit');
                      else if (cat === 'Obligasi') setUnitName('unit');
                      else if (cat === 'Properti') setUnitName('unit');
                      else setUnitName('Rupiah');
                    }}
                    className={`py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                      type === cat 
                        ? 'bg-forest text-cream shadow-sm' 
                        : 'text-forest/60 hover:text-forest'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Specific Asset Name */}
            <div>
              <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2.5">Nama Aset / Investasi Spesifik</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Bitcoin (BTC), Saham BCA (BBCA), ORI025, Logam Mulia Antam"
                className="w-full px-4 py-3.5 rounded-xl bg-black/5 border-none text-forest placeholder-forest/30 outline-none focus:ring-2 focus:ring-forest/20 text-sm font-semibold"
              />
            </div>

            {/* Calculation Strategy Toggles */}
            <div>
              <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2.5">Metode Input Nilai</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setInputMode('direct')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    inputMode === 'direct'
                      ? 'bg-forest/10 border-forest/30 text-forest font-extrabold'
                      : 'border-black/5 text-forest/60 hover:bg-black/5'
                  }`}
                >
                  <Layers size={14} />
                  <span>Total Nilai Rupiah Langsung</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('unit')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    inputMode === 'unit'
                      ? 'bg-forest/10 border-forest/30 text-forest font-extrabold'
                      : 'border-black/5 text-forest/60 hover:bg-black/5'
                  }`}
                >
                  <Calculator size={14} />
                  <span>Hitung Berdasarkan Unit & Harga</span>
                </button>
              </div>
            </div>

            {/* Value Fields */}
            {inputMode === 'unit' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-forest/5 p-5 rounded-3xl border border-forest/10">
                <div>
                  <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-1.5">Jumlah Unit</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Contoh: 0.156 atau 1500"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-black/5 text-forest placeholder-forest/30 outline-none focus:ring-2 focus:ring-forest/20 text-sm font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-1.5">Harga per Unit (Rp)</label>
                  <input
                    type="number"
                    required
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder="Contoh: 10250 atau 980000000"
                    className="w-full px-3.5 py-3 rounded-xl bg-white border border-black/5 text-forest placeholder-forest/30 outline-none focus:ring-2 focus:ring-forest/20 text-sm font-semibold"
                  />
                </div>
                <div className="sm:col-span-2 pt-2 border-t border-forest/10 flex justify-between items-center text-xs font-semibold text-forest/70">
                  <span>Nama Satuan Unit:</span>
                  <input
                    type="text"
                    value={unitName}
                    onChange={(e) => setUnitName(e.target.value)}
                    placeholder="e.g. BTC, lembar, gram, unit"
                    className="w-32 text-right bg-transparent border-b border-black/10 focus:border-forest/40 outline-none text-forest py-1 font-bold"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2">Total Nilai Investasi (Rupiah)</label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-sm font-bold text-forest/40">Rp</span>
                  <input
                    type="number"
                    required
                    min="1"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Contoh: 15000000"
                    className="w-full pl-11 pr-4 py-4 rounded-xl bg-black/5 border-none text-forest placeholder-forest/30 outline-none focus:ring-2 focus:ring-forest/20 text-sm font-bold"
                  />
                </div>
              </div>
            )}

            {/* Return/Profit Rate */}
            <div>
              <label className="block text-xs font-bold text-forest/70 uppercase tracking-wider mb-2">Imbal Hasil / Profit Rate saat ini (%)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  required
                  value={currentReturn}
                  onChange={(e) => setCurrentReturn(e.target.value)}
                  placeholder="Contoh: 12.5 atau -5.2"
                  className="w-full px-4 py-4 rounded-xl bg-black/5 border-none text-forest placeholder-forest/30 outline-none focus:ring-2 focus:ring-forest/20 text-sm font-bold"
                />
                <span className="absolute right-4 top-4 text-sm font-bold text-forest/50">%</span>
              </div>
            </div>

            {/* Real-time Computed Summary Card */}
            {value && (
              <div className="bg-forest text-cream rounded-3xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-md">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest opacity-70 mb-1">Total Nilai Konversi Aset</p>
                  <p className="text-xl font-display font-bold">
                    Rp {parseFloat(value).toLocaleString('id-ID')}
                  </p>
                </div>
                {inputMode === 'unit' && quantity && unitPrice && (
                  <p className="text-xs text-cream/80 text-left sm:text-right italic max-w-xs">
                    {quantity} {unitName} @ Rp {parseFloat(unitPrice).toLocaleString('id-ID')}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            {editingAsset && (
              <button
                type="button"
                onClick={handleDeleteAndBack}
                className="px-5 py-4 rounded-2xl bg-terracotta/10 hover:bg-terracotta/20 text-terracotta font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Trash2 size={16} />
                <span>Hapus Investasi</span>
              </button>
            )}
            
            <div className="flex-1 flex gap-3">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-4 rounded-2xl bg-black/5 hover:bg-black/10 text-forest font-semibold text-sm transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex-1 py-4 rounded-2xl bg-forest text-cream hover:bg-forest-light font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles size={16} />
                <span>{editingAsset ? 'Perbarui Investasi' : 'Simpan Investasi'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Right Column: Premium Sidebar & Live Visualizer */}
        <div className="space-y-6">
          
          {/* 1. Live Card Preview */}
          <div className="glass rounded-3xl p-6 border border-black/5 space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-forest" />
              <h3 className="text-xs font-bold text-forest/70 uppercase tracking-wider">Visualisasi Live Card</h3>
            </div>
            
            <div className="border border-dashed border-forest/20 rounded-2xl p-4 bg-white/50 relative overflow-hidden">
              <span className="absolute top-2 right-2 text-[8px] font-extrabold uppercase bg-forest/10 text-forest px-1.5 py-0.5 rounded">Preview</span>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-lg bg-black/5">
                    {getCategoryIcon(type)}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(type)}`}>
                    {type}
                  </span>
                </div>
                
                <div>
                  <h4 className="text-base font-display font-bold text-forest truncate">
                    {name || 'Nama Produk / Aset'}
                  </h4>
                  <p className="text-xl font-display font-bold text-forest">
                    Rp {(parseFloat(value) || 0).toLocaleString('id-ID')}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-black/5">
                  {(() => {
                    const assetVal = parseFloat(value) || 0;
                    const hypotheticalTotal = editingAsset
                      ? totalValue - editingAsset.value + assetVal
                      : totalValue + assetVal;
                    const hypotheticalPercentage = hypotheticalTotal > 0 
                      ? (assetVal / hypotheticalTotal) * 100 
                      : 0;
                    
                    return (
                      <div>
                        <div className="flex justify-between text-[10px] font-semibold text-forest/50 mb-1">
                          <span>Bobot Portofolio Estimasi</span>
                          <span>{hypotheticalPercentage.toFixed(1)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-black/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-forest rounded-full transition-all duration-300" 
                            style={{ width: `${hypotheticalPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })()}

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-forest/60">Estimasi Imbal Hasil</span>
                    <div className={`flex items-center gap-0.5 font-bold ${
                      (parseFloat(currentReturn) || 0) >= 0 ? 'text-forest' : 'text-terracotta'
                    }`}>
                      {(parseFloat(currentReturn) || 0) >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      <span>{(parseFloat(currentReturn) || 0) >= 0 ? '+' : ''}{currentReturn || '0'}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Portfolio Impact Estimator */}
          {parseFloat(value) > 0 && (
            <div className="glass rounded-3xl p-6 border border-black/5 space-y-4 bg-forest-light/5">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-forest animate-pulse" />
                <h3 className="text-xs font-bold text-forest/70 uppercase tracking-wider">Dampak Ke Portofolio</h3>
              </div>

              {(() => {
                const assetVal = parseFloat(value) || 0;
                const assetRet = parseFloat(currentReturn) || 0;
                
                let nextTotalVal = totalValue;
                let nextWeightedReturn = totalReturnWeighted;

                if (editingAsset) {
                  nextTotalVal = totalValue - editingAsset.value + assetVal;
                  const oldSumWeighted = assets.reduce((sum, asset) => sum + (asset.currentReturn * asset.value), 0);
                  const newSumWeighted = oldSumWeighted - (editingAsset.currentReturn * editingAsset.value) + (assetRet * assetVal);
                  nextWeightedReturn = nextTotalVal > 0 ? newSumWeighted / nextTotalVal : 0;
                } else {
                  nextTotalVal = totalValue + assetVal;
                  const oldSumWeighted = assets.reduce((sum, asset) => sum + (asset.currentReturn * asset.value), 0);
                  const newSumWeighted = oldSumWeighted + (assetRet * assetVal);
                  nextWeightedReturn = nextTotalVal > 0 ? newSumWeighted / nextTotalVal : 0;
                }

                const percentageIncrease = totalValue > 0 
                  ? ((nextTotalVal - totalValue) / totalValue) * 100 
                  : 100;
                
                const returnChange = nextWeightedReturn - totalReturnWeighted;

                return (
                  <div className="space-y-3.5 text-xs">
                    {/* Value Impact */}
                    <div className="flex justify-between items-center py-1">
                      <div>
                        <span className="text-forest/60 block">Total Nilai Portofolio</span>
                        <span className="font-semibold text-forest/40">Rp {totalValue.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-forest block">Rp {nextTotalVal.toLocaleString('id-ID')}</span>
                        {percentageIncrease !== 0 && (
                          <span className={`text-[10px] font-bold ${percentageIncrease > 0 ? 'text-forest' : 'text-terracotta'}`}>
                            {percentageIncrease > 0 ? '+' : ''}{percentageIncrease.toFixed(1)}%
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Weighted Return Impact */}
                    <div className="flex justify-between items-center py-1 border-t border-black/5">
                      <div>
                        <span className="text-forest/60 block">Rata-Rata Imbal Hasil</span>
                        <span className="font-semibold text-forest/40">{totalReturnWeighted.toFixed(2)}%</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-forest block">{nextWeightedReturn.toFixed(2)}%</span>
                        {returnChange !== 0 && (
                          <span className={`text-[10px] font-bold ${returnChange > 0 ? 'text-forest' : 'text-terracotta'}`}>
                            {returnChange > 0 ? '+' : ''}{returnChange.toFixed(2)}%
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* 3. Preset Selector */}
          <div className="glass rounded-3xl p-6 border border-black/5 space-y-3.5">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-forest" />
              <h3 className="text-xs font-bold text-forest/70 uppercase tracking-wider">Pilih Preset Cepat</h3>
            </div>
            
            <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => selectPreset(p)}
                  className={`px-2.5 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer ${
                    name === p.name 
                      ? 'bg-forest text-cream border-forest shadow-sm' 
                      : 'bg-white hover:bg-black/5 border-black/5 text-forest/80'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-forest/50 leading-relaxed">
              Pilih salah satu produk investasi populer di atas untuk mengisi formulir secara instan, lalu sesuaikan jumlah unit kepemilikan Anda.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
