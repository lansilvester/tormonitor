import { Home, PieChart, ArrowLeftRight, FileText, Activity, Settings, LogOut, ChevronRight, HelpCircle, X, Shield, Users } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  onClose?: () => void;
  isMobile?: boolean;
  role: 'user' | 'admin';
}

export function Sidebar({ currentPage, onPageChange, onClose, isMobile = false, role }: SidebarProps) {
  const navItems = role === 'admin'
    ? [
        { icon: Shield, id: 'Panel Admin', label: 'Panel Admin' },
        { icon: Users, id: 'Manajemen Pengguna', label: 'Pengguna' },
      ]
    : [
        { icon: Home, id: 'Ringkasan', label: 'Ringkasan' },
        { icon: PieChart, id: 'Portofolio', label: 'Portofolio' },
        { icon: Activity, id: 'Analitik', label: 'Analitik' },
        { icon: ArrowLeftRight, id: 'Transaksi', label: 'Transaksi' },
        { icon: FileText, id: 'Dokumen', label: 'Dokumen' },
      ];

  const handlePageSelect = (pageId: string) => {
    onPageChange(pageId);
    if (onClose) {
      onClose();
    }
  };

  return (
    <aside className={isMobile 
      ? "flex flex-col w-64 h-full p-6 bg-cream/95 relative"
      : "hidden lg:flex flex-col w-64 h-screen fixed top-0 left-0 border-r border-black/5 p-6 bg-cream/50 z-30"
    }>
      <div className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-sm">
            <Activity size={16} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-forest">TorMonitor</span>
        </div>
        {isMobile && onClose && (
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg bg-black/5 text-forest hover:bg-black/10 transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto">
        <p className="text-xs font-semibold text-forest/40 uppercase tracking-wider mb-4 px-2">Menu</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handlePageSelect(item.id)}
              className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? 'bg-forest text-cream shadow-md'
                  : 'text-forest/70 hover:bg-black/5 hover:text-forest'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-terracotta' : ''} />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && <ChevronRight size={16} className="ml-auto opacity-70" />}
            </button>
          );
        })}
        
        <p className="text-xs font-semibold text-forest/40 uppercase tracking-wider mb-4 mt-8 px-2 block">Dukungan</p>
        <button 
          onClick={() => handlePageSelect('Pengaturan')}
          className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all ${
            currentPage === 'Pengaturan' ? 'bg-forest text-cream shadow-md' : 'text-forest/70 hover:bg-black/5 hover:text-forest'
          }`}
        >
          <Settings size={20} className={currentPage === 'Pengaturan' ? 'text-terracotta' : ''} />
          <span className="font-medium text-sm">Pengaturan</span>
        </button>
        <button 
          onClick={() => handlePageSelect('Pusat Bantuan')}
          className={`flex items-center w-full gap-3 px-4 py-3 rounded-xl transition-all ${
            currentPage === 'Pusat Bantuan' ? 'bg-forest text-cream shadow-md' : 'text-forest/70 hover:bg-black/5 hover:text-forest'
          }`}
        >
          <HelpCircle size={20} className={currentPage === 'Pusat Bantuan' ? 'text-terracotta' : ''} />
          <span className="font-medium text-sm">Pusat Bantuan</span>
        </button>
      </nav>

      <div className="mt-8 mb-6 p-4 bg-terracotta/10 rounded-2xl border border-terracotta/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-16 h-16 bg-terracotta/20 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
        <h4 className="font-display font-bold text-sm text-forest mb-1">Butuh Saran?</h4>
        <p className="text-xs text-forest/70 mb-3">Bicara dengan penasihat kekayaan khusus Anda hari ini.</p>
        <button className="w-full py-2 bg-white rounded-lg text-xs font-bold text-forest hover:bg-forest hover:text-white transition-colors shadow-sm">
          Jadwalkan Panggilan
        </button>
      </div>

      <div className="pt-5 border-t border-black/5">
        <button className="flex items-center gap-3 px-4 py-2 rounded-xl transition-all text-forest/70 hover:bg-black/5 hover:text-forest w-full">
          <LogOut size={20} />
          <span className="font-medium text-sm">Keluar</span>
        </button>
      </div>
    </aside>
  );
}
