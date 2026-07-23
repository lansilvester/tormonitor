import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, Activity, User, Settings, Shield, LogOut, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  currentPage: string;
  onMenuClick?: () => void;
  role: 'user' | 'admin';
  userEmail: string;
  onLogout: () => void;
}

export function Header({ currentPage, onMenuClick, role, userEmail, onLogout }: HeaderProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const greetingPages = ['Ringkasan', 'Panel Admin'];
  const isGreetingPage = greetingPages.includes(currentPage);

  return (
    <header className="sticky top-0 z-20 bg-cream/80 backdrop-blur-lg border-b border-black/5 w-full">
      <div className="w-full max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4 lg:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl bg-black/5 text-forest hover:bg-black/10 transition-colors"
          >
            <Menu size={24} />
          </button>
          <div className="w-8 h-8 rounded-full bg-forest text-cream flex items-center justify-center font-bold text-sm">
            <Activity size={16} />
          </div>
        </div>

        <div className="hidden lg:block">
          <h1 className="text-3xl font-display font-bold tracking-tight text-forest">
            {isGreetingPage
              ? `Selamat pagi, ${role === 'admin' ? 'Administrator' : 'Investor'}`
              : currentPage}
          </h1>
          <p className="text-forest/60 text-sm mt-1">
            {isGreetingPage
              ? 'Berikut adalah ringkasan hari ini.'
              : `Lihat detail ${currentPage.toLowerCase()} Anda.`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              type="text"
              placeholder="Cari aset..."
              className="pl-10 pr-4 py-2.5 rounded-2xl bg-black/5 border-none focus:ring-2 focus:ring-forest/20 outline-none text-sm w-64 transition-all"
            />
          </div>
          <button className="relative p-2.5 rounded-2xl bg-white shadow-sm border border-black/5 text-forest hover:shadow-md transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2.5 w-2 h-2 bg-terracotta rounded-full border border-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-1.5 p-1 pr-2.5 rounded-2xl bg-forest/10 border border-forest/20 hover:bg-forest/20 transition-all cursor-pointer"
              title="Profil"
            >
              <div className="w-8 h-8 rounded-xl bg-forest text-cream flex items-center justify-center font-bold text-sm">
                <User size={16} />
              </div>
              <ChevronDown size={14} className={`text-forest/70 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2.5 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-black/5 py-2.5 z-30"
                >
                  {/* Profile Info */}
                  <div className="px-4 py-2.5 border-b border-black/5 mb-2">
                    <p className="text-xs font-bold text-forest/50 uppercase tracking-wider">Akun Aktif</p>
                    <p className="font-display font-bold text-sm text-forest mt-0.5 truncate">{userEmail}</p>
                    <span className={`inline-block mt-1 text-[10px] font-extrabold px-1.5 py-0.5 rounded ${role === 'admin' ? 'bg-terracotta/15 text-terracotta' : 'bg-forest/10 text-forest'}`}>
                      {role === 'admin' ? '🛡️ Superadmin' : '👤 Investor Premium'}
                    </span>
                  </div>

                  {/* Menu Items */}
                  <div className="space-y-0.5 px-1.5">
                    <button
                      onClick={() => {
                        alert('Pengaturan Akun sedang disiapkan!');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-forest/80 hover:bg-black/5 hover:text-forest transition-all"
                    >
                      <Settings size={14} />
                      <span>Pengaturan Akun</span>
                    </button>

                    <button
                      onClick={() => {
                        alert('Konfigurasi 2FA segera hadir!');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-forest/80 hover:bg-black/5 hover:text-forest transition-all"
                    >
                      <Shield size={14} />
                      <span>Keamanan & Sandi</span>
                    </button>

                    <hr className="border-black/5 my-1.5 mx-2" />

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-xs font-bold text-terracotta hover:bg-terracotta/10 transition-all"
                    >
                      <LogOut size={14} />
                      <span>Keluar Sesi</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}
