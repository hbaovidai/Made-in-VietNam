import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Heart, ChevronRight, Star, ShoppingCart, Trash2, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

export function BuyerSaved() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [savedProducts, setSavedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadSavedProducts();
    }
  }, [user]);

  const loadSavedProducts = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${user?.id}/saved`);
      setSavedProducts(res.data);
    } catch (error) {
      console.error(error);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải sản phẩm đã lưu' });
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (productId: string) => {
    try {
      await api.delete(`/users/${user?.id}/saved/${productId}`);
      setSavedProducts(savedProducts.filter(p => p.id !== productId));
      addToast({ type: 'success', title: 'Thành công', message: 'Đã bỏ lưu sản phẩm' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa tất cả sản phẩm đã lưu?')) return;
    try {
      await api.delete(`/users/${user?.id}/saved`);
      setSavedProducts([]);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa tất cả sản phẩm đã lưu' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardSection 
      title={t('saved_products_title')} 
      subtitle={t('saved_products_subtitle')}
      actions={
        savedProducts.length > 0 && (
          <button 
            onClick={handleClearAll}
            className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs"
          >
            {t('clear_all')}
          </button>
        )
      }
    >
      <div className="divide-y divide-slate-100">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 size={32} className="animate-spin text-primary" />
           </div>
        ) : savedProducts.map((product) => (
          <div key={product.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <Link to={`/products/${product.id}`} className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors block">{product.name}</Link>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{product.minPrice} - {product.maxPrice} {product.currency || 'VND'}</span>
                  {product.moq && <span>{t('min_order')}: {product.moq} {product.moqUnit}</span>}
                </div>
                {/* Mock rating for now, would be from product real rating */}
                <div className="flex items-center gap-1 mt-2">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-[10px] font-bold text-slate-700">{product.rating || 0} ({product.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => handleUnsave(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Bỏ lưu">
                <Trash2 size={18} />
              </button>
              <Link to={`/products/${product.id}`} className="bg-primary text-white px-6 py-2 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 flex items-center gap-2">
                <ShoppingCart size={14} /> {t('view_product')}
              </Link>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
      {!loading && savedProducts.length === 0 && (
        <div className="p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Heart size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('no_saved_title')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_saved_desc')}</p>
          <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs">
            {t('browse_products')}
          </Link>
        </div>
      )}
    </DashboardSection>
  );
}
