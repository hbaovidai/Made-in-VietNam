import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle2, X, Search, Filter, Eye } from 'lucide-react';
import { ConfirmDialog, Modal } from '../../../components/ui/Modal';

export function AdminSuppliers() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  
  const [confirmVerify, setConfirmVerify] = useState<{isOpen: boolean, supplier: any, intent: boolean}>({
    isOpen: false, supplier: null, intent: true
  });
  const [viewSupplier, setViewSupplier] = useState<any | null>(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await api.get('/suppliers?limit=100');
      setSuppliers(Array.isArray(res.data) ? res.data : (res.data.data || []));
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_load_error') });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    const { supplier, intent } = confirmVerify;
    if (!supplier) return;
    
    try {
      await api.put(`/suppliers/${supplier.id}/verify`, { isVerified: intent });
      addToast({ type: 'success', title: t('admin_success'), message: intent ? t('admin_verify_success') : t('admin_revoke_success') });
      setConfirmVerify({ ...confirmVerify, isOpen: false });
      loadSuppliers();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_action_failed') });
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
          <h1 className="text-xl font-bold text-slate-900">{t('admin_suppliers_title')}</h1>
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
            placeholder={t('admin_search_suppliers')}
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
            <option value="ALL">{t('admin_all_status')}</option>
            <option value="PENDING">{t('admin_filter_pending')}</option>
            <option value="VERIFIED">{t('admin_filter_verified')}</option>
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
                        <ShieldCheck size={13} /> {t('admin_verified')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-600">
                        <ShieldAlert size={13} /> {t('admin_pending')}
                      </span>
                    )}
                  </td>
                  <td className="py-4 pr-1 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <button 
                        onClick={() => setViewSupplier(s)}
                        className="text-xs font-bold text-slate-600 hover:text-primary transition-colors inline-flex items-center gap-1 bg-slate-100 hover:bg-blue-50 px-2.5 py-1.5 rounded-lg"
                      >
                        <Eye size={13} /> Xem hồ sơ
                      </button>
                      {!s.isVerified ? (
                        <button 
                          onClick={() => setConfirmVerify({ isOpen: true, supplier: s, intent: true })}
                          className="text-xs font-bold text-primary hover:text-white transition-colors inline-flex items-center gap-1 border border-primary hover:bg-primary px-2.5 py-1.5 rounded-lg"
                        >
                          <CheckCircle2 size={13} /> Duyệt
                        </button>
                      ) : (
                        <button 
                          onClick={() => setConfirmVerify({ isOpen: true, supplier: s, intent: false })}
                          className="text-xs font-bold text-red-500 hover:text-white transition-colors inline-flex items-center gap-1 border border-red-200 hover:bg-red-500 hover:border-red-500 px-2.5 py-1.5 rounded-lg"
                        >
                          <X size={13} /> Hủy duyệt
                        </button>
                      )}
                    </div>
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
        title={confirmVerify.intent ? t('admin_verify_badge') : t('admin_revoke_badge')}
        message={
          confirmVerify.intent 
          ? `Bạn có chắc chắn muốn cấp Xác minh cho ${confirmVerify.supplier?.companyName}?` 
          : `Thu hồi Tick xanh của ${confirmVerify.supplier?.companyName}?`
        }
        confirmText={confirmVerify.intent ? t('admin_verify_confirm') : t('admin_revoke_confirm')}
        variant={confirmVerify.intent ? 'info' : 'danger'}
      />

      {viewSupplier && (
        <Modal isOpen={!!viewSupplier} onClose={() => setViewSupplier(null)} title="Hồ sơ Pháp lý & Xác thực" size="lg">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mã số thuế</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{viewSupplier.taxCode || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Người đại diện</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{viewSupplier.legalRepresentative || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SĐT Liên hệ</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{viewSupplier.companyPhone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email công ty</p>
                <p className="text-sm font-semibold text-slate-900 mt-0.5">{viewSupplier.companyEmail || 'N/A'}</p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck size={16} className="text-primary" />
                Tài liệu đính kèm
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 border border-slate-200 rounded-xl bg-white hover:border-primary/30 transition-colors shadow-sm">
                  <p className="text-xs font-bold text-slate-700 mb-3">Giấy Đăng Ký Kinh Doanh</p>
                  {viewSupplier.businessLicenseUrl ? (
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${viewSupplier.businessLicenseUrl.replace('/api/v1', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">
                      <Eye size={14} /> Xem tài liệu gốc
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 italic px-3 py-2 bg-slate-50 rounded-lg inline-block">Chưa tải lên</p>
                  )}
                </div>
                <div className="p-4 border border-slate-200 rounded-xl bg-white hover:border-primary/30 transition-colors shadow-sm">
                  <p className="text-xs font-bold text-slate-700 mb-3">CCCD Người Đại Diện</p>
                  {viewSupplier.identityCardUrl ? (
                    <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${viewSupplier.identityCardUrl.replace('/api/v1', '')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors">
                      <Eye size={14} /> Xem tài liệu gốc
                    </a>
                  ) : (
                    <p className="text-xs text-slate-400 italic px-3 py-2 bg-slate-50 rounded-lg inline-block">Chưa tải lên</p>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6 flex items-center justify-end gap-3">
              <button className="btn-ghost" onClick={() => setViewSupplier(null)}>Đóng</button>
              {!viewSupplier.isVerified ? (
                <button 
                  className="btn-primary" 
                  onClick={() => { setViewSupplier(null); setConfirmVerify({ isOpen: true, supplier: viewSupplier, intent: true }); }}
                >
                  <CheckCircle2 size={16} className="inline-block mr-1"/> Phê Duyệt Hồ Sơ
                </button>
              ) : (
                <button 
                  className="px-4 py-2.5 bg-red-50 text-red-600 font-bold text-sm rounded-xl hover:bg-red-100 transition-colors inline-flex items-center gap-1.5" 
                  onClick={() => { setViewSupplier(null); setConfirmVerify({ isOpen: true, supplier: viewSupplier, intent: false }); }}
                >
                  <X size={16} /> Thu Hồi Xác Thực
                </button>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
