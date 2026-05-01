import React, { useEffect, useState } from 'react';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Trash2, CheckCircle2, AlertCircle, Search, Filter } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';

export function AdminProducts() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'REJECTED'>('PENDING');
  const [search, setSearch] = useState('');
  
  const [confirmDelete, setConfirmDelete] = useState<{isOpen: boolean, product: any}>({
    isOpen: false, product: null
  });
  
  const [confirmVerify, setConfirmVerify] = useState<{isOpen: boolean, product: any, newStatus: 'ACTIVE'|'REJECTED'|null}>({
    isOpen: false, product: null, newStatus: null
  });

  useEffect(() => {
    loadProducts();
  }, [activeTab]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/admin?limit=100&status=${activeTab}`);
      setProducts(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_load_error') });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { product } = confirmDelete;
    if (!product) return;
    try {
      await api.delete(`/products/${product.id}`);
      addToast({ type: 'success', title: t('admin_success'), message: t('admin_product_deleted') });
      setConfirmDelete({ isOpen: false, product: null });
      loadProducts();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_product_delete_error') });
    }
  };

  const handleVerify = async () => {
    const { product, newStatus } = confirmVerify;
    if (!product || !newStatus) return;
    try {
      await api.put(`/products/${product.id}/verify`, { status: newStatus });
      addToast({ type: 'success', title: t('admin_success'), message: newStatus === 'ACTIVE' ? t('admin_product_approved') : t('admin_product_rejected') });
      setConfirmVerify({ isOpen: false, product: null, newStatus: null });
      loadProducts();
    } catch (error) {
      addToast({ type: 'error', title: t('admin_error'), message: t('admin_action_failed') });
    }
  };

  const tabs = [
    { key: 'PENDING' as const, label: t('admin_tab_pending') },
    { key: 'ACTIVE' as const, label: t('admin_tab_approved') },
    { key: 'REJECTED' as const, label: t('admin_tab_rejected') },
  ];

  const filtered = products.filter(p => 
    !search || p.name?.toLowerCase().includes(search.toLowerCase()) || p.supplier?.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">{t('admin_products_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('admin_products_subtitle')}</p>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.key 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={t('admin_search_products')}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
          />
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
                <th className="pb-3 pl-1">Sản phẩm</th>
                <th className="pb-3">Doanh nghiệp</th>
                <th className="pb-3">Trạng thái</th>
                <th className="pb-3 pr-1 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 pl-1">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-lg object-cover bg-slate-100" />
                      <div>
                        <div className="font-semibold text-slate-900 line-clamp-1">{p.name || 'Sản phẩm'}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{p.category?.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-slate-600 font-medium">{p.supplier?.companyName}</span>
                  </td>
                  <td className="py-4">
                    {p.status === 'PENDING' && <Badge variant="warning">{t('admin_tab_pending')}</Badge>}
                    {p.status === 'ACTIVE' && <Badge variant="success">{t('admin_tab_approved')}</Badge>}
                    {p.status === 'REJECTED' && <Badge variant="danger">{t('admin_tab_rejected')}</Badge>}
                  </td>
                  <td className="py-4 pr-1 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {p.status === 'PENDING' && (
                        <>
                          <button 
                            onClick={() => setConfirmVerify({ isOpen: true, product: p, newStatus: 'ACTIVE' })}
                            className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                          >
                            <CheckCircle2 size={13} /> {t('admin_approve')}
                          </button>
                          <button 
                            onClick={() => setConfirmVerify({ isOpen: true, product: p, newStatus: 'REJECTED' })}
                            className="text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors inline-flex items-center gap-1"
                          >
                            <AlertCircle size={13} /> {t('admin_reject')}
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setConfirmDelete({ isOpen: true, product: p })}
                        className="text-xs font-bold text-red-500 hover:text-red-700 transition-colors inline-flex items-center gap-1"
                      >
                        <Trash2 size={13} /> {t('admin_delete')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={4} className="py-16 text-center text-slate-400 text-sm">{t('admin_no_products_found')}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, product: null })}
        onConfirm={handleDelete}
        title="Xóa Sản Phẩm?"
        message={`Sản phẩm "${confirmDelete.product?.name}" sẽ bị gỡ vĩnh viễn khỏi hệ thống.`}
        confirmText="Xác nhận Xóa"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={confirmVerify.isOpen}
        onClose={() => setConfirmVerify({ isOpen: false, product: null, newStatus: null })}
        onConfirm={handleVerify}
        title={confirmVerify.newStatus === 'ACTIVE' ? 'Duyệt sản phẩm?' : 'Từ chối sản phẩm?'}
        message={confirmVerify.newStatus === 'ACTIVE' 
          ? `Cho phép "${confirmVerify.product?.name}" xuất hiện công khai trên Marketplace.` 
          : `Từ chối "${confirmVerify.product?.name}". Doanh nghiệp sẽ cần sửa lại nội dung.`}
        confirmText={confirmVerify.newStatus === 'ACTIVE' ? 'Duyệt' : 'Từ chối'}
        variant={confirmVerify.newStatus === 'ACTIVE' ? 'info' : 'warning'}
      />
    </div>
  );
}
