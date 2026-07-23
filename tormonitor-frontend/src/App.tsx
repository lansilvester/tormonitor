import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Layout } from './components/layout/Layout';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { PlaceholderPage } from './components/ui/PlaceholderPage';
import { PortfolioPage } from './pages/user/portfolio/PortfolioPage';
import { OverviewPage } from './pages/user/overview/OverviewPage';
import { AuthPage } from './pages/auth/AuthPage';
import { AdminOverviewPage } from './pages/admin/overview/AdminOverviewPage';
import { UserManagementPage } from './pages/admin/users/UserManagementPage';
import { mockAssets } from './data';
import { InvestmentAsset } from './types';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  // Derive role based on restored email
  const [role, setRole] = useState<'user' | 'admin'>(() => {
    const savedEmail = localStorage.getItem('userEmail');
    return savedEmail === 'admin@tormonitor.com' ? 'admin' : 'user';
  });
  const [currentPage, setCurrentPage] = useState('Ringkasan');
  const [assets, setAssets] = useState<InvestmentAsset[]>(mockAssets);

  // Custom routing path state
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  
  // Auth state (initialized from localStorage to persist login session)
  const [userEmail, setUserEmail] = useState<string | null>(localStorage.getItem('userEmail'));

  // Sync role and page if userEmail changes or on initial load
  useEffect(() => {
    if (userEmail === 'admin@tormonitor.com') {
      setRole('admin');
      setCurrentPage('Panel Admin');
    } else {
      setRole('user');
      setCurrentPage('Ringkasan');
    }
  }, [userEmail]);
  // Listen to browser navigation popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (path: string) => {
    window.history.pushState(null, '', path);
    setCurrentPath(path);
  };

  const isAuthPath = currentPath === '/login' || currentPath === '/register' || currentPath === '/forgotpassword';

  // Protect dashboard routes - redirect to login if not authenticated
  useEffect(() => {
    if (!userEmail && !isAuthPath) {
      handleNavigate('/login');
    } else if (userEmail && isAuthPath) {
      handleNavigate('/');
    }
  }, [userEmail, currentPath, isAuthPath]);

  const handleLoginSuccess = (email: string) => {
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
    const derivedRole = email === 'admin@tormonitor.com' ? 'admin' : 'user';
    setRole(derivedRole);
    handleNavigate('/');
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail(null);
    setRole('user');
    handleNavigate('/login');
  };

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
            <AdminOverviewPage onNavigateToUsers={() => setCurrentPage('Manajemen Pengguna')} />
          );
        case 'Manajemen Pengguna':
          return <UserManagementPage />;
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

  if (isAuthPath) {
    const authMode = currentPath === '/register' ? 'register' : currentPath === '/forgotpassword' ? 'forgotpassword' : 'login';
    return (
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loading" />
        ) : (
          <motion.div
            key="auth-page"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <AuthPage 
              initialMode={authMode} 
              onNavigate={handleNavigate} 
              onLoginSuccess={handleLoginSuccess} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

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
          <Layout 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
            role={role} 
            userEmail={userEmail || ''}
            onLogout={handleLogout}
          >
            <AnimatePresence mode="wait">
              {renderContent()}
            </AnimatePresence>
          </Layout>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
