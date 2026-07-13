/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { PlaceholderPage } from './components/ui/PlaceholderPage';
import { PortfolioPage } from './pages/user/portfolio/PortfolioPage';
import { OverviewPage } from './pages/user/OverviewPage';
import { mockAssets } from './data';
import { InvestmentAsset } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [currentPage, setCurrentPage] = useState('Ringkasan');
  const [assets, setAssets] = useState<InvestmentAsset[]>(mockAssets);

  // Switch default page when role changes
  useEffect(() => {
    if (role === 'admin') {
      setCurrentPage('Panel Admin');
    } else {
      setCurrentPage('Ringkasan');
    }
  }, [role]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const handleAddAsset = (newAsset: Omit<InvestmentAsset, 'id' | 'allocation'>) => {
    const created: InvestmentAsset = {
      ...newAsset,
      id: Date.now().toString(),
      allocation: 0
    };
    setAssets((prev) => [created, ...prev]);
  };

  const handleUpdateAsset = (id: string, updatedAsset: Omit<InvestmentAsset, 'id' | 'allocation'>) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, ...updatedAsset } : asset))
    );
  };

  const handleDeleteAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const renderContent = () => {
    // Admin Role Pages
    if (role === 'admin') {
      switch (currentPage) {
        case 'Panel Admin':
          return (
            <motion.div key="admin-overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PlaceholderPage 
                title="Panel Admin Segera Hadir" 
                description="Halaman panel admin sedang dipersiapkan." 
              />
            </motion.div>
          );
        case 'Manajemen Pengguna':
          return (
            <motion.div key="user-management" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PlaceholderPage 
                title="Manajemen Pengguna Segera Hadir" 
                description="Halaman manajemen pengguna sedang dipersiapkan." 
              />
            </motion.div>
          );
        default:
          return (
            <motion.div key="admin-placeholder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <PlaceholderPage 
                title={`${currentPage} Segera Hadir`} 
                description="Fitur admin ini sedang dipersiapkan." 
              />
            </motion.div>
          );
      }
    }

    // User Role Pages
    switch (currentPage) {
      case 'Ringkasan':
        return (
          <OverviewPage assets={assets} totalValue={totalValue} />
        );
      case 'Portofolio':
        return (
          <motion.div 
            key="portofolio" 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
          >
            <PortfolioPage 
              assets={assets} 
              onAddAsset={handleAddAsset} 
              onUpdateAsset={handleUpdateAsset}
              onDeleteAsset={handleDeleteAsset} 
            />
          </motion.div>
        );
      case 'Analitik':
        return (
          <motion.div key="analitik" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <PlaceholderPage 
              title="Analitik Portofolio Segera Hadir" 
              description="Fitur analisis mendalam, pemantauan performa historis, dan penasihat keuangan berbasis kecerdasan buatan (AI) sedang dipersiapkan untuk Anda." 
            />
          </motion.div>
        );
      case 'Transaksi':
        return (
          <motion.div key="transaksi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <PlaceholderPage 
              title="Riwayat Transaksi Segera Hadir" 
              description="Halaman pencatatan mutasi kas, histori transaksi jual-beli instrumen, dan pembagian dividen otomatis akan segera tersedia." 
            />
          </motion.div>
        );
      default:
        return (
          <motion.div key="placeholder" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
            <PlaceholderPage 
              title={`${currentPage} Segera Hadir`} 
              description="Kami sedang merancang dan mematangkan fitur ini untuk menghadirkan pengalaman pemantauan kekayaan terbaik bagi Anda." 
            />
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <LoadingScreen key="loading" />
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Layout currentPage={currentPage} onPageChange={setCurrentPage} role={role} onRoleChange={setRole}>
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
