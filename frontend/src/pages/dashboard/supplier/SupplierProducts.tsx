import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Search, Filter, Plus, MoreVertical, Edit2, Trash2, Eye, Box, Loader2 } from 'lucide-react';
import { ProductForm } from './ProductForm';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { useToast } from '../../../components/ui/Toast';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Badge } from '../../../components/ui/Badge';
import { api } from '../../../lib/api';
import { SupplierBadge } from '../../../components/ui/SupplierBadge';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export function SupplierProducts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
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
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể lấy dữ liệu Sản phẩm' });
    } finally {
      setLoading(false);
    }
  };

  // Handlers
  const handleEdit = (product: any) => {
    navigate(`/dashboard/supplier/products/${product.id}/edit`);
  };

  const handleCreate = () => {
    navigate('/dashboard/supplier/products/add');
  };

  const handleDeleteClick = (product: any) => {
    setProductToDelete(product);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await api.delete(`/products/${productToDelete.id}`);
        setProductList((prev) => prev.filter((p) => p.id !== productToDelete.id));
        addToast({ type: 'success', title: 'Thành công', message: `Đã xoá sản phẩm` });
        setIsDeleteOpen(false);
      } catch (error) {
        addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xoá sản phẩm' });
      }
    }
  };

  return (
    <DashboardSection 
      title={t('my_products_title')} 
      subtitle={t('my_products_subtitle')}
      actions={
        <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
          <Plus size={16} /> {t('add_new_product')}
        </button>
      }
    >
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
        <div className="relative w-full md:w-80">
          <input type="text" placeholder={t('search_product')} className="input py-2 pl-10" />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="btn-secondary py-2 flex items-center gap-2">
            <Filter size={16} /> {t('filter')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : productList.length === 0 ? (
        <EmptyState 
          icon={<Box size={48} className="text-slate-300" />}
          title={t('no_products')}
          description={t('no_products_desc')}
          action={<button className="btn-primary mt-4" onClick={handleCreate}>{t('create_first_product')}</button>}
        />
      ) : (
        <>
        {/* Mobile: Card List */}
        <div className="md:hidden divide-y divide-slate-100">
          {productList.map((product) => (
            <div key={product.id} className="p-4 flex gap-3 items-start">
              <div className="w-16 h-16 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200">
                <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-slate-900 truncate">{product.name}</div>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">ID: PRD-{product.id}</div>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">{product.category?.name || ''}</span>
                  <span className="font-bold text-xs text-primary">{product.minPrice?.toLocaleString()}đ - {product.maxPrice?.toLocaleString()}đ</span>
                  {product.status === 'PENDING' && <Badge variant="warning">⏳ Chờ Duyệt</Badge>}
                  {product.status === 'ACTIVE' && <Badge variant="success">Đang Bán</Badge>}
                  {product.status === 'REJECTED' && <Badge variant="danger">Vi Phạm</Badge>}
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <button className="btn-icon" onClick={() => handleEdit(product)}>
                    <Edit2 size={14} />
                  </button>
                  <button className="btn-icon-danger" onClick={() => handleDeleteClick(product)}>
                    <Trash2 size={14} />
                  </button>
                  <button className="btn-icon">
                    <MoreVertical size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Desktop: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="table-header">
                <th className="px-6 py-4">{t('product_table_name')}</th>
                <th className="px-6 py-4">{t('product_table_category')}</th>
                <th className="px-6 py-4">{t('product_table_price')}</th>
                <th className="px-6 py-4">{t('product_table_status')}</th>
                <th className="px-6 py-4 text-right">{t('product_table_action')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {productList.map((product) => (
                <tr key={product.id} className="table-row group">
                  <td className="table-cell">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg overflow-hidden shrink-0 border border-slate-200">
                        <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{product.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: PRD-{product.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="table-cell">
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">{product.category?.name || ''}</span>
                  </td>
                  <td className="table-cell">
                    <span className="font-bold text-slate-900">{product.minPrice?.toLocaleString()}đ - {product.maxPrice?.toLocaleString()}đ</span>
                  </td>
                  <td className="table-cell">
                    {product.status === 'PENDING' && <Badge variant="warning">⏳ Chờ Duyệt</Badge>}
                    {product.status === 'ACTIVE' && <Badge variant="success">Đang Bán</Badge>}
                    {product.status === 'REJECTED' && <Badge variant="danger">Vi Phạm</Badge>}
                  </td>
                  <td className="table-cell text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button className="btn-icon" onClick={() => handleEdit(product)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon-danger" onClick={() => handleDeleteClick(product)}>
                        <Trash2 size={16} />
                      </button>
                      <button className="btn-icon">
                        <MoreVertical size={16} />
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

      {/* Dialogs */}

      <ConfirmDialog 
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('delete_product')}
        message={t('delete_product_confirm', { name: productToDelete?.name })}
        confirmText={t('delete_permanently')}
        variant="danger"
      />
    </DashboardSection>
  );
}
