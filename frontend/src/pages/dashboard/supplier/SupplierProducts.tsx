import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Edit2, Trash2, Eye, Box, Loader2, X } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../lib/api';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { formatProductPrice } from '../../../utils/formatters';

export function SupplierProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { user } = useAuth();
  
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<any | null>(null);

  useEffect(() => {
    loadMyProducts();
  }, []);

  const loadMyProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/products/me');
      setProductList(res.data || []);
    } catch (err) {
      addToast({ type: 'error', title: t('buyer_error'), message: t('supplier_load_error') });
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = productList.filter((p) => {
    let match = true;
    if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) match = false;
    if (statusFilter && p.status !== statusFilter) match = false;
    return match;
  });

  const handleEdit = (product: any) => {
    navigate(`/dashboard/supplier/products/${product.id}/edit`);
  };

  const handleCreate = () => {
    if (user?.supplier?.status !== 'VERIFIED') {
      addToast({ type: 'error', title: t('supplier_unverified_title'), message: t('supplier_unverified_msg') });
      return;
    }
    navigate('/dashboard/supplier/products/add');
  };

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const handlePreview = (product: any) => {
    window.open(`/products/${product.id}`, '_blank');
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${productToDelete.id}`);
        setProductList((prev) => prev.filter((p) => p.id !== productToDelete.id));
        addToast({ type: 'success', title: t('buyer_success'), message: t('supplier_delete_success') });
        setIsDeleteOpen(false);
      } catch (error) {
        addToast({ type: 'error', title: t('buyer_error'), message: t('supplier_delete_error') });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-600" style={{ letterSpacing: '0.16px' }}>
            {t('my_products_title')}: <span className="text-slate-900 font-bold">{productList.length} sản phẩm</span>
          </p>
        </div>
        <button 
          onClick={handleCreate} 
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-all shrink-0"
        >
          <Plus size={16} /> {t('add_new_product')}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('search_product')} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-slate-300 text-sm text-slate-800 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:text-slate-400 shadow-2xs transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={14} className="text-slate-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 text-sm text-slate-800 px-3 py-2.5 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-medium shadow-2xs transition-all"
          >
            <option value="">{t('supplier_status_all')}</option>
            <option value="ACTIVE">{t('supplier_status_active')}</option>
            <option value="PENDING">{t('supplier_status_pending')}</option>
            <option value="REJECTED">{t('supplier_status_rejected')}</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="animate-spin text-blue-600" size={28} /></div>
      ) : filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white border border-slate-200/80 rounded-xl shadow-sm">
          <Box size={48} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 mb-2">
            {productList.length === 0 ? t('no_products') : t('supplier_no_results')}
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            {productList.length === 0 ? t('no_products_desc') : t('supplier_no_results_desc')}
          </p>
          {productList.length === 0 && (
            <button className="bg-blue-600 text-white text-xs font-semibold px-4 py-2.5 hover:bg-blue-700 rounded-lg shadow-sm transition-all" onClick={handleCreate}>
              {t('create_first_product')}
            </button>
          )}
        </div>
      ) : (
        <>
        {/* Mobile: Card List */}
        <div className="md:hidden space-y-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-slate-200/80 p-4 flex gap-3 items-start rounded-xl shadow-sm">
              <div className="w-14 h-14 bg-slate-100 border border-slate-200 overflow-hidden shrink-0 rounded-lg">
                <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-slate-900 truncate">{product.name}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="font-bold text-xs text-blue-600">{formatProductPrice(product)}</span>
                  {product.status === 'PENDING' && <Badge variant="warning">{t('supplier_status_pending')}</Badge>}
                  {product.status === 'ACTIVE' && <Badge variant="success">{t('supplier_status_active')}</Badge>}
                  {product.status === 'REJECTED' && <Badge variant="danger">{t('supplier_status_rejected')}</Badge>}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-slate-100" onClick={() => handleEdit(product)}><Edit2 size={13} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-slate-100" onClick={() => handleDeleteClick(product)}><Trash2 size={13} /></button>
                  <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-slate-100" onClick={() => handlePreview(product)}><Eye size={13} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Table Card */}
        <div className="hidden md:block bg-white border border-slate-200/80 rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pl-1">{t('product_table_name')}</th>
                <th className="pb-3">{t('product_table_category')}</th>
                <th className="pb-3">{t('product_table_price')}</th>
                <th className="pb-3">{t('product_table_status')}</th>
                <th className="pb-3 pr-1 text-right">{t('product_table_action')}</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-slate-100 hover:bg-slate-50/80 transition-colors group">
                  <td className="py-4 pl-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 border border-slate-200 overflow-hidden shrink-0 rounded-lg">
                        <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors">{product.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-medium text-slate-500">{product.category?.name || ''}</span>
                  </td>
                  <td className="py-4">
                    <span className="font-bold text-slate-900">{formatProductPrice(product)}</span>
                  </td>
                  <td className="py-4">
                    {product.status === 'PENDING' && <Badge variant="warning">{t('supplier_status_pending')}</Badge>}
                    {product.status === 'ACTIVE' && <Badge variant="success">{t('supplier_status_active')}</Badge>}
                    {product.status === 'REJECTED' && <Badge variant="danger">{t('supplier_status_rejected')}</Badge>}
                  </td>
                  <td className="py-4 pr-1 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-slate-100" onClick={() => handleEdit(product)} title={t('supplier_action_edit')}>
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded hover:bg-slate-100" onClick={() => handleDeleteClick(product)} title={t('supplier_action_delete')}>
                        <Trash2 size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded hover:bg-slate-100" onClick={() => handlePreview(product)} title={t('supplier_action_preview')}>
                        <Eye size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_product')}
        message={t('delete_product_confirm', { name: productToDelete?.name })}
        confirmText={t('delete_permanently')}
        variant="danger"
      />
    </div>
  );
}
