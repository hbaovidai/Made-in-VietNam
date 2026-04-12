import React, { useEffect, useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, User as UserIcon, Lock, Unlock } from 'lucide-react';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminUsers() {
  const { addToast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <DashboardSection 
        title="Quản lý Người dùng" 
        subtitle="Khái quát toàn bộ danh sách tài khoản đã đăng ký trên MIVN5."
      >
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-wider font-bold text-slate-500">
                    <th className="p-4 pl-6">ID</th>
                    <th className="p-4">Thông tin</th>
                    <th className="p-4">Vai trò</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4">Ngày tham gia</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {users.map(user => (
                    <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6 text-slate-400 font-mono text-xs">{user.id.substring(0,8)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                            {user.fullName ? user.fullName[0] : <UserIcon size={16} />}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.fullName || 'Chưa thiết lập'}</div>
                            <div className="text-xs text-slate-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">{getRoleBadge(user.role)}</td>
                      <td className="p-4">
                        {(user.status || 'ACTIVE') === 'ACTIVE' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Hoạt động
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-red-50 text-red-600">
                            <Lock size={12} />
                            Bị khóa
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-slate-500 font-medium">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {user.role !== 'ADMIN' && (
                          (user.status || 'ACTIVE') === 'ACTIVE' ? (
                            <button
                              onClick={() => setConfirmLock({ isOpen: true, user, intent: 'SUSPENDED' })}
                              className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors inline-flex items-center gap-1"
                            >
                              <Lock size={14} /> Khóa
                            </button>
                          ) : (
                            <button
                              onClick={() => setConfirmLock({ isOpen: true, user, intent: 'ACTIVE' })}
                              className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-1 shadow-sm shadow-primary/20"
                            >
                              <Unlock size={14} /> Mở khóa
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr><td colSpan={6} className="p-12 text-center text-slate-400 font-medium">Chưa có người dùng nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardSection>

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
