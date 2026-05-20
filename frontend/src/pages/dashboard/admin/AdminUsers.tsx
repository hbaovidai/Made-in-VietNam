import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, User as UserIcon, Lock, Unlock, Search, Filter, Trash2 } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminUsers() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const [confirmLock, setConfirmLock] = useState<{ isOpen: boolean; user: any; intent: 'ACTIVE' | 'SUSPENDED' }>({
    isOpen: false, user: null, intent: 'SUSPENDED'
  });

  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; user: any }>({
    isOpen: false, user: null
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await api.get('/users?limit=100');
      setUsers(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_load_error') });
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
        title: t('admin_success'),
        message: intent === 'SUSPENDED' ? t('admin_locked_msg', { name: user.fullName }) : t('admin_unlocked_msg', { name: user.fullName })
      });
      setConfirmLock({ ...confirmLock, isOpen: false });
      loadUsers();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_action_failed') });
    }
  };

  const handleDeleteUser = async () => {
    const { user } = confirmDelete;
    if (!user) return;
    try {
      await api.delete(`/users/${user.id}`);
      addToast({
        type: 'success',
        title: t('admin_success'),
        message: `Đã xóa người dùng ${user.fullName} (${user.email})`
      });
      setConfirmDelete({ isOpen: false, user: null });
      loadUsers();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: 'Không thể xóa người dùng. Có thể người dùng còn đơn hàng hoặc dữ liệu liên quan.' });
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return <Badge variant="warning">ADMIN</Badge>;
      case 'SUPPLIER': return <Badge variant="success">{t('admin_role_supplier')}</Badge>;
      default: return <Badge variant="default">{t('admin_role_buyer')}</Badge>;
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
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('admin_search_placeholder')}
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
            <option value="ALL">{t('admin_all_roles')}</option>
            <option value="ADMIN">{t('admin_role_admin')}</option>
            <option value="SUPPLIER">{t('admin_role_supplier')}</option>
            <option value="BUYER">{t('admin_role_buyer')}</option>
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
                <th className="pb-3 pl-1">{t('admin_info')}</th>
                <th className="pb-3">{t('admin_role')}</th>
                <th className="pb-3">{t('admin_status')}</th>
                <th className="pb-3">{t('admin_joined')}</th>
                <th className="pb-3 pr-1 text-right">{t('admin_action')}</th>
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
                        <div className="font-semibold text-slate-900">{user.fullName || t('admin_not_set')}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">{getRoleBadge(user.role)}</td>
                  <td className="py-4">
                    {(user.status || 'ACTIVE') === 'ACTIVE' ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        {t('admin_status_active')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
                        <Lock size={11} />
                        {t('admin_status_locked')}
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-slate-400 text-xs font-medium">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-4 pr-1 text-right">
                    {user.role !== 'ADMIN' && (
                      <div className="flex justify-end items-center gap-2">
                        {(user.status || 'ACTIVE') === 'ACTIVE' ? (
                          <button
                            onClick={() => setConfirmLock({ isOpen: true, user, intent: 'SUSPENDED' })}
                            className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1"
                          >
                            <Lock size={12} /> {t('admin_lock')}
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmLock({ isOpen: true, user, intent: 'ACTIVE' })}
                            className="text-xs font-bold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                          >
                            <Unlock size={12} /> {t('admin_unlock')}
                          </button>
                        )}
                        <button
                          onClick={() => setConfirmDelete({ isOpen: true, user })}
                          className="text-xs font-bold text-slate-400 hover:text-red-600 transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 size={12} /> Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-16 text-center text-slate-400 text-sm">{t('admin_no_users_found')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmLock.isOpen}
        onClose={() => setConfirmLock({ ...confirmLock, isOpen: false })}
        onConfirm={handleToggleStatus}
        title={confirmLock.intent === 'SUSPENDED' ? t('admin_lock_account') : t('admin_unlock_account')}
        message={
          confirmLock.intent === 'SUSPENDED'
            ? t('admin_lock_msg', { name: confirmLock.user?.fullName, email: confirmLock.user?.email })
            : t('admin_unlock_msg', { name: confirmLock.user?.fullName, email: confirmLock.user?.email })
        }
        confirmText={confirmLock.intent === 'SUSPENDED' ? t('admin_lock_btn') : t('admin_unlock_btn')}
        variant={confirmLock.intent === 'SUSPENDED' ? 'danger' : 'info'}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, user: null })}
        onConfirm={handleDeleteUser}
        title="Xóa người dùng vĩnh viễn?"
        message={`Bạn chắc chắn muốn xóa tài khoản "${confirmDelete.user?.fullName}" (${confirmDelete.user?.email})? Hành động này không thể hoàn tác. Toàn bộ dữ liệu của người dùng sẽ bị xóa vĩnh viễn.`}
        confirmText="Xác nhận Xóa"
        variant="danger"
      />
    </div>
  );
}
