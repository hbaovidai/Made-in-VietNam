import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, User as UserIcon, Lock, Unlock, Search, Filter } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [confirmLock, setConfirmLock] = useState<{ isOpen: boolean; user: any; intent: 'ACTIVE' | 'SUSPENDED' }>({
    isOpen: false, user: null, intent: 'SUSPENDED'
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/users?limit=100');
      setUsers(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải người dùng' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    const { user, intent } = confirmLock;
    if (!user) return;
    try {
      await api.put(`/users/${user.id}/status`, { status: intent });
      addToast({
        type: 'success',
        title: 'Thành công',
        message: intent === 'SUSPENDED' ? `Đã khóa tài khoản ${user.fullName}` : `Đã mở khóa tài khoản ${user.fullName}`
      });
      setConfirmLock({ ...confirmLock, isOpen: false });
      loadUsers();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Thao tác thất bại' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return <Badge variant="warning">ADMIN</Badge>;
      case 'SUPPLIER': return <Badge variant="success">DOANH NGHIỆP</Badge>;
      default: return <Badge variant="default">NGƯỜI MUA</Badge>;
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || 
      u.fullName?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Quản lý Người dùng</h1>
        <p className="text-sm text-slate-500 mt-1">Toàn bộ tài khoản đã đăng ký trên hệ thống — {users.length} người dùng</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl text-sm px-3 py-2.5 outline-none focus:border-primary font-medium text-slate-700"
          >
            <option value="ALL">Tất cả vai trò</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPPLIER">Doanh nghiệp</option>
            <option value="BUYER">Người mua</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pl-1">Thông tin</th>
                <th className="pb-3">Vai trò</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3">Ngày tham gia</th>
                <th className="pb-3 pr-1 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(user => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pl-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                        {user.fullName ? user.fullName[0].toUpperCase() : <UserIcon size={14} />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.fullName || 'Chưa thiết lập'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{getRoleBadge(user.role)}</td>
                  <td className="py-4">
                    {(user.status || 'ACTIVE') === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Hoạt động
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
                        <Lock size={11} />
                        Bị khóa
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-slate-400 text-xs font-medium">
                    {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                  </td>
                  <td className="py-4 pr-1 text-right">
                    {user.role !== 'ADMIN' && (
                      (user.status || 'ACTIVE') === 'ACTIVE' ? (
                        <button
                          onClick={() => setConfirmLock({ isOpen: true, user, intent: 'SUSPENDED' })}
                          className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1"
                        >
                          <Lock size={12} /> Khóa
                        </button>
                      ) : (
                        <button
                          onClick={() => setConfirmLock({ isOpen: true, user, intent: 'ACTIVE' })}
                          className="text-xs font-bold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                        >
                          <Unlock size={12} /> Mở khóa
                        </button>
                      )
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-16 text-center text-slate-400 text-sm">Không tìm thấy người dùng nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmLock.isOpen}
        onClose={() => setConfirmLock({ ...confirmLock, isOpen: false })}
        onConfirm={handleToggleStatus}
        title={confirmLock.intent === 'SUSPENDED' ? 'Khóa tài khoản?' : 'Mở khóa tài khoản?'}
        message={
          confirmLock.intent === 'SUSPENDED'
            ? `Tài khoản "${confirmLock.user?.fullName}" (${confirmLock.user?.email}) sẽ bị khóa và không thể đăng nhập.`
            : `Mở khóa tài khoản "${confirmLock.user?.fullName}" (${confirmLock.user?.email})?`
        }
        confirmText={confirmLock.intent === 'SUSPENDED' ? 'Khóa tài khoản' : 'Mở khóa'}
        variant={confirmLock.intent === 'SUSPENDED' ? 'danger' : 'info'}
      />
    </div>
  );
}
