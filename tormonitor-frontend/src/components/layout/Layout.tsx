import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { motion, AnimatePresence } from 'motion/react';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
  role: 'user' | 'admin';
  onRoleChange: (role: 'user' | 'admin') => void;
}

export function Layout({ children, currentPage, onPageChange, role, onRoleChange }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Abstract Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-terracotta/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-forest/5 rounded-full blur-[120px]"></div>
      </div>

      {/* Desktop Sidebar */}
      <Sidebar currentPage={currentPage} onPageChange={onPageChange} role={role} />

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Sidebar Content */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 h-full flex"
            >
              <Sidebar 
                currentPage={currentPage} 
                onPageChange={onPageChange} 
                onClose={() => setIsMobileSidebarOpen(false)}
                isMobile={true}
                role={role}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      <main className="flex-1 flex flex-col min-h-screen lg:pl-64 relative z-10">
        <Header 
          currentPage={currentPage} 
          onMenuClick={() => setIsMobileSidebarOpen(true)}
          role={role}
          onRoleChange={onRoleChange}
        />
        <div className="p-6 lg:p-10 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
