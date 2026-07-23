import { useState, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Trash2, Eye, Users, Plus, Pencil, CheckSquare, Square, ToggleLeft, ToggleRight, ChevronLeft, ChevronRight, X, UserPlus, Wallet, Activity, Check, AlertTriangle } from 'lucide-react';
import { mockAdminUsers } from '../../../data';
import { AdminUser, InvestmentAsset } from '../../../types';
import { UserDetailPanel } from './UserDetailPanel';

export function UserManagementPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Semua' | 'Aktif' | 'Ditangguhkan' | 'Diblokir'>('Semua');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Selection state for Bulk Actions
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Audit Reason state for changes
  const [auditReason, setAuditReason] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);

  // Custom Delete Warning Modal state
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    targetId?: string;
    targetName?: string;
    count?: number;
  }>({ isOpen: false, type: 'single' });

  // Password reset simulation states
  const [isPasswordResetSent, setIsPasswordResetSent] = useState(false);
  const [isPinResetSent, setIsPinResetSent] = useState(false);

  // KYC document preview state
  const [showKycDoc, setShowKycDoc] = useState(false);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    kycStatus: 'Belum Verifikasi' as AdminUser['kycStatus'],
    status: 'Aktif' as AdminUser['status'],
  });

  // Pagination state
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const itemsPerPage = 5;

  // Statistics calculation
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === 'Aktif').length;
  const inactiveUsers = totalUsers - activeUsers;
  const totalAUM = users.reduce((sum, u) => sum + u.totalPortfolioValue, 0);

  // Filter & Search Logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus =
      statusFilter === 'Semua' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const indexOfLastItem = currentPageNum * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Handle single page navigation boundaries
  if (currentPageNum > totalPages) {
    setCurrentPageNum(totalPages);
  }

  // Row selection handler
  const handleSelectUser = (id: string, e: MouseEvent) => {
    e.stopPropagation();
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((userId) => userId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const visibleIds = currentItems.map((u) => u.id);
    const allVisibleSelected = visibleIds.every((id) => selectedUserIds.includes(id));

    if (allVisibleSelected) {
      // Unselect all currently visible items
      setSelectedUserIds((prev) => prev.filter((id) => !visibleIds.includes(id)));
    } else {
      // Select all currently visible items
      setSelectedUserIds((prev) => [...new Set([...prev, ...visibleIds])]);
    }
  };

  // Open custom delete modal instead of confirm
  const handleDelete = (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setDeleteConfirm({
      isOpen: true,
      type: 'single',
      targetId: id,
      targetName: user.name,
    });
  };

  const handleConfirmSingleDelete = () => {
    const id = deleteConfirm.targetId;
    if (!id) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'Ditangguhkan' } : u))
    );
    setSelectedUserIds((prev) => prev.filter((userId) => userId !== id));
    setDeleteConfirm({ isOpen: false, type: 'single' });
  };

  // Open custom bulk delete modal
  const handleBulkDelete = () => {
    setDeleteConfirm({
      isOpen: true,
      type: 'bulk',
      count: selectedUserIds.length,
    });
  };

  const handleConfirmBulkDelete = () => {
    setUsers((prev) =>
      prev.map((u) => (selectedUserIds.includes(u.id) ? { ...u, status: 'Ditangguhkan' } : u))
    );
    setSelectedUserIds([]);
    setDeleteConfirm({ isOpen: false, type: 'single' });
  };

  const handleBulkDeactivate = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedUserIds.includes(u.id) ? { ...u, status: 'Ditangguhkan' } : u
      )
    );
    setSelectedUserIds([]);
  };

  const handleBulkActivate = () => {
    setUsers((prev) =>
      prev.map((u) =>
        selectedUserIds.includes(u.id) ? { ...u, status: 'Aktif' } : u
      )
    );
    setSelectedUserIds([]);
  };

  const handleAddUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Mohon isi nama dan email.');
      return;
    }

    // New user starts with Rp 0 portfolio for financial safety (AUM is read-only)
    const newUser: AdminUser = {
      id: `u${Date.now()}`,
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber || 'Belum Diatur',
      kycStatus: formData.kycStatus || 'Belum Verifikasi',
      joinDate: new Date().toISOString().split('T')[0],
      totalPortfolioValue: 0,
      assetCount: 0,
      status: formData.status,
      role: 'user',
      assets: [],
    };

    setUsers((prev) => [newUser, ...prev]);
    setIsAddModalOpen(false);
    setFormData({ name: '', email: '', phoneNumber: '', kycStatus: 'Belum Verifikasi', status: 'Aktif' });
  };

  const handleEditUser = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userToEdit) return;
    if (!auditReason.trim()) {
      alert('Mohon isi alasan perubahan data.');
      return;
    }

    // Log the change reason to console (simulating the system audit log)
    console.log(`[AUDIT LOG] Admin modified user ID ${userToEdit.id}. Reason: "${auditReason}"`);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === userToEdit.id
          ? {
              ...u,
              name: formData.name,
              phoneNumber: formData.phoneNumber,
              kycStatus: formData.kycStatus,
              status: formData.status,
            }
          : u
      )
    );
    setIsEditModalOpen(false);
    setUserToEdit(null);
    setAuditReason('');
    setIsPasswordResetSent(false);
    setIsPinResetSent(false);
  };

  const openEditModal = (user: AdminUser, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setUserToEdit(user);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      kycStatus: user.kycStatus || 'Belum Verifikasi',
      status: user.status,
    });
    setAuditReason('');
    setIsPasswordResetSent(false);
    setIsPinResetSent(false);
    setIsEditModalOpen(true);
  };

  const formatRupiah = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)}M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)}jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const statusColors: Record<AdminUser['status'], string> = {
    'Aktif': 'bg-green-100 text-green-700',
    'Ditangguhkan': 'bg-amber-100 text-amber-700',
    'Diblokir': 'bg-red-100 text-red-600',
  };

  return (
    <>
      <motion.div
        key="user-management"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="space-y-6 pb-24"
      >
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-forest">Manajemen Pengguna</h2>
            <p className="text-xs sm:text-sm text-forest/65 mt-1 leading-relaxed">
              Kelola hak akses, status keaktifan, dan pantau total portofolio seluruh pengguna Tormonitor.
            </p>
          </div>

          <button
            onClick={() => {
              setFormData({ name: '', email: '', status: 'Aktif', totalPortfolioValue: 0 });
              setIsAddModalOpen(true);
            }}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-forest text-cream font-bold text-sm rounded-2xl hover:bg-forest-light active:scale-[0.98] transition-all shadow-md self-start md:self-auto cursor-pointer"
          >
            <Plus size={16} />
            <span>Tambah Pengguna</span>
          </button>
        </div>

        {/* 2. Statistik Ringkasan (Mini Summary Cards) */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest/10 flex items-center justify-center text-forest shrink-0">
              <Users size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">Total Pengguna</p>
              <p className="text-xl font-display font-bold text-forest">{totalUsers}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center text-green-700 shrink-0">
              <Activity size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">User Aktif</p>
              <p className="text-xl font-display font-bold text-forest">{activeUsers}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <X size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">User Nonaktif</p>
              <p className="text-xl font-display font-bold text-forest">{inactiveUsers}</p>
            </div>
          </div>
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center text-terracotta shrink-0">
              <Wallet size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">Total AUM</p>
              <p className="text-xl font-display font-bold text-forest">{formatRupiah(totalAUM)}</p>
            </div>
          </div>
        </section>

        {/* Filter controls */}
        <section className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest/40" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/70 border border-black/8 text-sm text-forest placeholder:text-forest/40 focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all font-medium"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-white/70 border border-black/8 rounded-2xl px-4 py-2 text-sm text-forest font-semibold outline-none focus:ring-2 focus:ring-forest/20 transition-all cursor-pointer"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Status: Aktif</option>
              <option value="Tidak Aktif">Status: Tidak Aktif</option>
            </select>
          </div>
        </section>

        {/* Users Table */}
        <div className="glass rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/5 bg-forest/3 select-none">
                  <th className="py-4 px-4 text-center w-12">
                    <button
                      onClick={handleSelectAll}
                      className="p-1 rounded-lg hover:bg-black/5 text-forest/60 transition-colors cursor-pointer"
                    >
                      {currentItems.length > 0 && currentItems.every((u) => selectedUserIds.includes(u.id)) ? (
                        <CheckSquare size={18} className="text-forest" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th className="text-left py-4 px-3 text-xs font-bold text-forest/50 uppercase tracking-wider">Pengguna</th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-forest/50 uppercase tracking-wider hidden lg:table-cell">Bergabung</th>
                  <th className="text-right py-4 px-4 text-xs font-bold text-forest/50 uppercase tracking-wider">Total Portofolio</th>
                  <th className="text-center py-4 px-4 text-xs font-bold text-forest/50 uppercase tracking-wider hidden md:table-cell">Aset</th>
                  <th className="text-center py-4 px-4 text-xs font-bold text-forest/50 uppercase tracking-wider">Status</th>
                  <th className="text-center py-4 px-4 text-xs font-bold text-forest/50 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((user, idx) => {
                    const isSelected = selectedUserIds.includes(user.id);
                    return (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onClick={() => setSelectedUser(user)}
                        className={`border-b border-black/4 cursor-pointer transition-colors ${isSelected ? 'bg-forest/8' : selectedUser?.id === user.id ? 'bg-forest/4' : 'hover:bg-forest/3'}`}
                      >
                        <td className="py-4 px-4 text-center" onClick={(e) => handleSelectUser(user.id, e)}>
                          <button className="p-1 rounded-lg hover:bg-black/5 text-forest/50 transition-colors">
                            {isSelected ? <CheckSquare size={18} className="text-forest" /> : <Square size={18} />}
                          </button>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-forest/10 border border-forest/15 flex items-center justify-center shrink-0">
                              <span className="text-sm font-extrabold text-forest">{user.name.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-forest leading-tight">{user.name}</p>
                              <p className="text-xs text-forest/50 leading-tight mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-forest/60 hidden lg:table-cell font-medium">
                          {new Date(user.joinDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-forest">
                          {formatRupiah(user.totalPortfolioValue)}
                        </td>
                        <td className="py-4 px-4 text-center text-sm font-bold text-forest/70 hidden md:table-cell">
                          {user.assetCount}
                        </td>
                        <td className="py-4 px-4 text-center">
                          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl ${statusColors[user.status]}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedUser(user)}
                              title="Lihat Detail"
                              className="p-2 rounded-xl text-forest/50 hover:text-forest hover:bg-forest/10 transition-all cursor-pointer"
                            >
                              <Eye size={15} />
                            </button>
                            <button
                              onClick={(e) => openEditModal(user, e)}
                              title="Ubah Profil"
                              className="p-2 rounded-xl text-forest/50 hover:text-forest hover:bg-forest/10 transition-all cursor-pointer"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={(e) => handleDelete(user.id, e)}
                              title="Hapus Pengguna"
                              className="p-2 rounded-xl text-forest/40 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-16 text-center">
                      <div className="flex flex-col items-center gap-3 text-forest/40">
                        <Users size={32} />
                        <p className="font-semibold text-sm">Tidak ada pengguna ditemukan</p>
                        <p className="text-xs">Coba ubah kata kunci pencarian atau filter status Anda.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 bg-forest/3 select-none">
              <span className="text-xs font-semibold text-forest/60">
                Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredUsers.length)} dari {filteredUsers.length} pengguna
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={currentPageNum === 1}
                  onClick={() => setCurrentPageNum((p) => p - 1)}
                  className="p-2 rounded-xl border border-black/5 bg-white text-forest/60 hover:text-forest hover:shadow-sm disabled:opacity-40 disabled:hover:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-forest px-3">
                  {currentPageNum} / {totalPages}
                </span>
                <button
                  disabled={currentPageNum === totalPages}
                  onClick={() => setCurrentPageNum((p) => p + 1)}
                  className="p-2 rounded-xl border border-black/5 bg-white text-forest/60 hover:text-forest hover:shadow-sm disabled:opacity-40 disabled:hover:shadow-none transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Slide-in Side Panel (Portfolio Detail) */}
      <UserDetailPanel user={selectedUser} onClose={() => setSelectedUser(null)} />

      {/* Floating Action Bar for Bulk Action */}
      <AnimatePresence>
        {selectedUserIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-forest text-cream px-6 py-3.5 rounded-2xl shadow-xl border border-white/10 z-30 flex items-center gap-6"
          >
            <span className="text-xs font-bold whitespace-nowrap">
              {selectedUserIds.length} Pengguna Terpilih
            </span>
            <div className="h-4 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBulkActivate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <ToggleRight size={14} />
                Aktifkan
              </button>
              <button
                onClick={handleBulkDeactivate}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <ToggleLeft size={14} />
                Nonaktifkan
              </button>
              <button
                onClick={handleBulkDelete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 size={14} />
                Hapus
              </button>
              <button
                onClick={() => setSelectedUserIds([])}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors cursor-pointer"
                title="Batalkan Pilihan"
              >
                <X size={15} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-cream rounded-3xl p-7 border border-black/5 shadow-2xl relative z-10 w-full max-w-md flex flex-col"
            >
              <div className="flex items-center justify-between mb-5 border-b border-black/5 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                    <UserPlus size={16} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-forest">Tambah Pengguna Baru</h3>
                </div>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1.5 rounded-lg text-forest/40 hover:text-forest hover:bg-black/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddUser} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-forest/60 uppercase tracking-wider mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest/60 uppercase tracking-wider mb-1.5">Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="budi.santoso@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-forest/60 uppercase tracking-wider mb-1.5">Status Awal</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all font-bold cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                </div>

                <div className="bg-forest/5 p-3 rounded-2xl border border-forest/10 mt-2">
                  <p className="text-[10px] font-bold text-forest/50 uppercase tracking-wider mb-1">Catatan Keamanan</p>
                  <p className="text-[11px] text-forest/70 leading-relaxed">
                    Pengguna baru akan memulai dengan total portofolio <strong>Rp 0</strong>. Saldo hanya dapat diubah oleh pemilik akun atau terhubung otomatis melalui modul integrasi keuangan.
                  </p>
                </div>

                <div className="flex gap-3 pt-3 border-t border-black/5">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="flex-1 py-2.5 bg-black/5 hover:bg-black/10 rounded-xl text-xs font-bold text-forest transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-forest text-cream hover:bg-forest-light rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                  >
                    Simpan User
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {isEditModalOpen && userToEdit && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setIsEditModalOpen(false);
                setUserToEdit(null);
              }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-cream rounded-3xl p-8 border border-black/5 shadow-2xl relative z-10 w-full max-w-4xl flex flex-col max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b border-black/5 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-forest/10 flex items-center justify-center text-forest">
                    <Pencil size={16} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-forest">Ubah Data Pengguna</h3>
                    <p className="text-[10px] font-bold text-forest/40 uppercase tracking-wider mt-0.5">{userToEdit.name} (ID: {userToEdit.id})</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setUserToEdit(null);
                  }}
                  className="p-1.5 rounded-lg text-forest/40 hover:text-forest hover:bg-black/5 transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleEditUser} className="space-y-6">
                
                {/* Section Headers */}
                <div className="hidden md:grid grid-cols-2 gap-6 border-b border-black/5 pb-2 select-none">
                  <p className="text-xs font-bold text-forest/40 uppercase tracking-wider">Data Administrasi & KYC</p>
                  <p className="text-xs font-bold text-forest/40 uppercase tracking-wider">Status Akun & Keamanan</p>
                </div>

                {/* ROW 1: Nama Lengkap vs Status Akun & Portofolio */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  {/* Left: Nama Lengkap */}
                  <div>
                    <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/65 uppercase tracking-wider">Nama Lengkap</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Nama Lengkap"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  {/* Right: Status Akun & Portofolio */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col justify-between">
                      <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/65 uppercase tracking-wider">Status Akun</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all font-bold cursor-pointer"
                      >
                        <option value="Aktif">Aktif</option>
                        <option value="Ditangguhkan">Freeze</option>
                        <option value="Diblokir">Banned</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-between">
                      <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/40 uppercase tracking-wider select-none leading-none">Portofolio (Read-Only)</label>
                      <div className="w-full px-4 py-2.5 rounded-xl border border-black/5 bg-black/5 text-sm text-forest/50 font-extrabold select-none text-center">
                        {formatRupiah(userToEdit.totalPortfolioValue)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ROW 2: Nomor Telepon vs Alamat Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  {/* Left: Nomor Telepon */}
                  <div>
                    <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/65 uppercase tracking-wider">Nomor Telepon</label>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="Contoh: 0812-3456-7890"
                      className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-forest/20 focus:bg-white transition-all font-semibold"
                    />
                  </div>

                  {/* Right: Alamat Email */}
                  <div>
                    <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/40 uppercase tracking-wider select-none">Alamat Email (Read-Only)</label>
                    <div className="w-full px-4 py-2.5 rounded-xl border border-black/5 bg-black/5 text-sm text-forest/50 font-semibold select-none truncate">
                      {formData.email}
                    </div>
                  </div>
                </div>

                {/* ROW 3: Verifikasi KYC vs Aksi Keamanan Cepat */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                  {/* Left: Verifikasi KYC dropdown & Swafoto view trigger */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col justify-between">
                      <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/65 uppercase tracking-wider">Verifikasi KYC</label>
                      <select
                        value={formData.kycStatus}
                        onChange={(e) => setFormData({ ...formData, kycStatus: e.target.value as any })}
                        className="w-full px-4 py-2.5 rounded-xl border border-black/8 bg-white/80 text-sm text-forest focus:outline-none focus:ring-2 focus:ring-forest/20 transition-all font-bold cursor-pointer"
                      >
                        <option value="Belum Verifikasi">Belum Verifikasi</option>
                        <option value="Proses Review">Proses Review</option>
                        <option value="Terverifikasi">Terverifikasi</option>
                        <option value="Ditolak">Ditolak</option>
                      </select>
                    </div>
                    <div className="flex flex-col justify-end">
                      <div className="h-8 flex items-end pb-1.5 select-none">
                        <span className="text-[10px] font-bold text-forest/30 uppercase tracking-wider">Aksi Dokumen</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowKycDoc(true)}
                        className="w-full py-2.5 bg-forest/5 hover:bg-forest/10 border border-forest/15 text-xs font-bold text-forest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Eye size={13} />
                        Lihat Dokumen
                      </button>
                    </div>
                  </div>

                  {/* Right: Keamanan Akun */}
                  <div>
                    <label className="h-8 flex items-end pb-1.5 text-xs font-bold text-forest/60 uppercase tracking-wider">Aksi Keamanan Cepat</label>
                    <div className="py-1 px-3 bg-white/60 border border-black/5 rounded-2xl flex gap-2 items-center min-h-[46px]">
                      {isPasswordResetSent ? (
                        <div className="flex-1 text-center text-green-700 text-[10px] font-bold py-1">
                          ✓ Reset Sandi Terkirim
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsPasswordResetSent(true)}
                          className="flex-1 py-1.5 bg-white hover:bg-forest hover:text-white border border-forest/20 text-[10px] font-bold text-forest rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          Reset Password
                        </button>
                      )}

                      {isPinResetSent ? (
                        <div className="flex-1 text-center text-green-700 text-[10px] font-bold py-1">
                          ✓ Reset PIN Terkirim
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsPinResetSent(true)}
                          className="flex-1 py-1.5 bg-white hover:bg-forest hover:text-white border border-forest/20 text-[10px] font-bold text-forest rounded-lg transition-all cursor-pointer shadow-sm"
                        >
                          Reset PIN
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Audit Trail Justifikasi (Mandatory) */}
                <div className="pt-4 border-t border-black/5">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-bold text-terracotta uppercase tracking-wider">
                      Alasan Perubahan Data (Wajib Isi)
                    </label>
                    <span className="text-[10px] font-bold text-forest/40 uppercase tracking-wider">
                      Audit Log System Enabled
                    </span>
                  </div>
                  <textarea
                    required
                    rows={2}
                    value={auditReason}
                    onChange={(e) => setAuditReason(e.target.value)}
                    placeholder="Tuliskan justifikasi formal untuk audit internal (contoh: Koreksi ejaan nama user sesuai pengajuan tiket #4120 dan update nomor telepon)."
                    className="w-full px-4 py-2.5 rounded-xl border border-terracotta/30 focus:border-terracotta bg-white/80 text-xs text-forest placeholder:text-forest/30 focus:outline-none focus:ring-2 focus:ring-terracotta/20 focus:bg-white transition-all font-medium resize-none leading-relaxed"
                  />
                  <p className="text-[9px] text-forest/40 mt-1 leading-normal">
                    *Tindakan pengubahan data ini akan secara otomatis mencatat nama administrator, stempel waktu, dan detail alasan perubahan ke dalam sistem log yang tidak dapat diubah (immutable audit log).
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-4 border-t border-black/5 justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setUserToEdit(null);
                    }}
                    className="px-6 py-2.5 bg-black/5 hover:bg-black/10 rounded-xl text-xs font-bold text-forest transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!auditReason.trim()}
                    className="px-8 py-2.5 bg-forest text-cream hover:bg-forest-light rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Simulated KYC Document Viewer Overlay */}
      <AnimatePresence>
        {showKycDoc && userToEdit && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-60">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowKycDoc(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-cream rounded-3xl p-6 border border-black/5 shadow-2xl relative z-10 w-full max-w-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5 border-b border-black/5 pb-3">
                <div>
                  <h4 className="font-display font-bold text-md text-forest">Verifikasi Dokumen KYC</h4>
                  <p className="text-[10px] text-forest/50 font-bold uppercase tracking-wider mt-0.5">{userToEdit.name} (KYC: {userToEdit.kycStatus || 'Review'})</p>
                </div>
                <button
                  onClick={() => setShowKycDoc(false)}
                  className="p-1 rounded-lg text-forest/40 hover:text-forest hover:bg-black/5 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Document Mockups Container */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4">
                {/* 1. KTP Mockup */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider pl-1">Dokumen 1: KTP / Paspor</span>
                  <div className="w-full h-44 rounded-2xl border border-black/5 bg-forest/5 p-4 flex flex-col justify-between relative overflow-hidden select-none">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-forest/5 rounded-full blur-xl"></div>
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-extrabold uppercase text-forest/40 tracking-wider">KARTU TANDA PENDUDUK</p>
                        <p className="text-xs font-bold text-forest">{userToEdit.name}</p>
                      </div>
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-forest/10 text-forest">PROV. DKI JAKARTA</span>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-mono text-forest/70">NIK: 3174092809960002</p>
                      <p className="text-[8px] text-forest/55">Alamat: Jl. Sudirman No. 12, Jakarta Selatan</p>
                    </div>
                  </div>
                </div>

                {/* 2. Selfie Mockup */}
                <div className="space-y-2">
                  <span className="block text-[11px] font-bold text-forest/50 uppercase tracking-wider pl-1">Dokumen 2: Swafoto (Selfie)</span>
                  <div className="w-full h-44 rounded-2xl border border-black/5 bg-forest/5 flex flex-col items-center justify-center relative select-none">
                    <div className="w-16 h-16 rounded-full bg-forest/10 border border-forest/20 flex items-center justify-center text-forest/60">
                      <Users size={32} />
                    </div>
                    <p className="text-[11px] font-bold text-forest mt-2">Swafoto Identitas Pengguna</p>
                    <p className="text-[9px] text-forest/50">Gambar selfie memegang KTP terverifikasi.</p>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center border-t border-black/5 pt-4">
                <span className="text-[11px] text-forest/60 leading-normal max-w-sm">
                  Silakan periksa kesesuaian nama, wajah, dan NIK dengan data registrasi sebelum menyetujui KYC.
                </span>
                <button
                  onClick={() => setShowKycDoc(false)}
                  className="px-5 py-2 bg-forest text-cream hover:bg-forest-light text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Tutup Dokumen
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Delete Warning Modal */}
      <AnimatePresence>
        {deleteConfirm.isOpen && (
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="bg-cream rounded-3xl p-7 border border-black/5 shadow-2xl relative z-10 w-full max-w-md flex flex-col text-center items-center"
            >
              {/* Warning Icon */}
              <div className="w-14 h-14 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 mb-4 animate-bounce">
                <AlertTriangle size={28} />
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-lg text-forest mb-2">
                Konfirmasi Penangguhan Akun (Soft Delete)
              </h3>

              {/* Description */}
              <p className="text-xs text-forest/70 leading-relaxed mb-6">
                {deleteConfirm.type === 'single' ? (
                  <>
                    Apakah Anda yakin ingin menonaktifkan akun <strong>{deleteConfirm.targetName}</strong>? Seluruh data riwayat investasi dan transaksi finansial akan <strong>tetap disimpan</strong> demi kepentingan audit hukum & kepatuhan keuangan.
                  </>
                ) : (
                  <>
                    Apakah Anda yakin ingin menonaktifkan <strong>{deleteConfirm.count}</strong> akun terpilih? Seluruh data riwayat investasi dan transaksi finansial akan <strong>tetap disimpan</strong> demi kepentingan audit hukum & kepatuhan keuangan.
                  </>
                )}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-3 w-full border-t border-black/5 pt-4">
                <button
                  type="button"
                  onClick={() => setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))}
                  className="flex-1 py-2.5 bg-black/5 hover:bg-black/10 rounded-xl text-xs font-bold text-forest transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={deleteConfirm.type === 'single' ? handleConfirmSingleDelete : handleConfirmBulkDelete}
                  className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
                >
                  Ya, Nonaktifkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
