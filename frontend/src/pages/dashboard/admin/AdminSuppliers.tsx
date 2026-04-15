import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle2, X, Search, Filter } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminSuppliers() {
  const { addToast } = useToast();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [confirmVerify, setConfirmVerify] = useState<{isOpen: boolean, supplier: any, intent: boolean}>({
    isOpen: false, supplier: null, intent: true
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await api.get('/suppliers?limit=100');
      setSuppliers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách Supplier' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    const { supplier, intent } = confirmVerify;
    if (!supplier) return;
    
    try {
      await api.put(`/suppliers/${supplier.id}/verify`, { isVerified: intent });
      addToast({ type: 'success', title: 'Thành công', message: intent ? 'Cấp Tick xanh thành công!' : 'Đã thu hồi Tick xanh!' });
      setConfirmVerify({ ...confirmVerify, isOpen: false });
      loadSuppliers();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Thao tác thất bại' });
    }
  };

  const pendingCount = suppliers.filter(s => !s.isVerified).length;

  const filtered = suppliers.filter(s => {
    const matchSearch = !search || s.companyName?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'ALL' || (statusFilter === 'VERIFIED' ? s.isVerified : !s.isVerified);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Duyệt Doanh nghiệp</h1>
          <p className="text-sm text-slate-500 mt-1">
            {suppliers.length} doanh nghiệp — 
            {pendingCount > 0 ? (
              <span className="text-amber-600 font-semibold"> {pendingCount} chờ duyệt</span>
            ) : (
              <span className="text-emerald-600"> tất cả đã duyệt</span>
            )}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Tìm doanh nghiệp..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl text-sm px-3 py-2.5 outline-none focus:border-primary font-medium text-slate-700"
          >
            <option value="ALL">Tất cả</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="VERIFIED">Đã duyệt</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-primary" size={28} /></div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[650px]">
            <thead>
              <tr className="border-b border-slate-200 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pl-1">Công ty</th>
                <th className="pb-3 hidden sm:table-cell">Ngành</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 pr-1 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(s => (
                <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pl-1">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                        {s.companyName?.substring(0, 2).toUpperCase() || 'DN'}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{s.companyName}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{s.city ? `${s.city}, ${s.province}` : 'Việt Nam'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 hidden sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {s.industries?.slice(0, 2).map((ind: any, i: number) => (
                        <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium">
                          {ind.industry}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    {s.isVerified ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                        <ShieldCheck size={13} /> Đã duyệt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                        <ShieldAlert size={13} /> Chờ duyệt
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-1 text-right">
                    {!s.isVerified ? (
                      <button 
                        onClick={() => setConfirmVerify({ isOpen: true, supplier: s, intent: true })}
                        className="text-xs font-bold text-primary hover:text-primary-dark transition-colors inline-flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} /> Duyệt
                      </button>
                    ) : (
                      <button 
                        onClick={() => setConfirmVerify({ isOpen: true, supplier: s, intent: false })}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1"
                      >
                        <X size={13} /> Hủy duyệt
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="py-16 text-center text-slate-400 text-sm">Không tìm thấy doanh nghiệp nào</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmVerify.isOpen}
        onClose={() => setConfirmVerify({ ...confirmVerify, isOpen: false })}
        onConfirm={handleVerifyToggle}
        title={confirmVerify.intent ? 'Cấp huy hiệu xác minh?' : 'Thu hồi huy hiệu xác minh?'}
        message={
          confirmVerify.intent 
          ? `Bạn có chắc chắn muốn cấp Xác minh cho ${confirmVerify.supplier?.companyName}? Họ sẽ được hiển thị kèm Tick xanh uy tín trên các trang Public.` 
          : `Thu hồi Tick xanh của ${confirmVerify.supplier?.companyName}?`
        }
        confirmText={confirmVerify.intent ? 'Xác nhận Duyệt' : 'Tiến hành Thu hồi'}
        variant={confirmVerify.intent ? 'info' : 'danger'}
      />
    </div>
  );
}
