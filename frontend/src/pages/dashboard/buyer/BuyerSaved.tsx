import React, { useState, useEffect } from 'react';
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
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('saved_products_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('saved_products_subtitle')}</p>
      </div>
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 size={32} className="animate-spin text-primary" />
           </div>
        ) : savedProducts.map((product) => (
          <div key={product.id} className="p-6 bg-canvas border border-hairline flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-1 transition-colors group cursor-pointer" style={{ borderRadius: 0 }}>
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-surface-1 overflow-hidden shrink-0 border border-hairline" style={{ borderRadius: 0 }}>
                <img src={product.images?.[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" style={{ borderRadius: 0 }} />
              </div>
              <div className="space-y-1">
                <Link to={`/products/${product.id}`} className="text-sm font-normal text-ink group-hover:text-primary transition-colors block" style={{ letterSpacing: '0.16px' }}>{product.name}</Link>
                <div className="flex items-center gap-4 text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>
                  <span>{product.minPrice} - {product.maxPrice} {product.currency || 'VND'}</span>
                  {product.moq && <span>{t('min_order')}: {product.moq} {product.moqUnit}</span>}
                </div>
                {/* Mock rating for now, would be from product real rating */}
                <div className="flex items-center gap-1 mt-2">
                  <Star size={12} className="text-amber-500 fill-current" />
                  <span className="text-[10px] font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{product.rating || 0} ({product.reviewCount || 0} reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => handleUnsave(product.id)} className="p-2 text-ink-subtle hover:text-red-500 transition-colors" title="Bỏ lưu">
                <Trash2 size={18} />
              </button>
              <Link to={`/products/${product.id}`} className="bg-primary text-white px-6 py-2 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
                <ShoppingCart size={14} /> {t('view_product')}
              </Link>
              <ChevronRight size={16} className="text-hairline group-hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
      {!loading && savedProducts.length === 0 && (
        <div className="p-20 text-center space-y-4 border border-hairline bg-canvas" style={{ borderRadius: 0 }}>
          <div className="w-20 h-20 bg-surface-1 border border-hairline flex items-center justify-center mx-auto" style={{ borderRadius: 0 }}>
            <Heart size={40} className="text-ink-subtle" />
          </div>
          <h3 className="text-lg font-normal text-ink uppercase tracking-tight" style={{ letterSpacing: '0.32px' }}>{t('no_saved_title')}</h3>
          <p className="text-ink-muted text-sm max-w-xs mx-auto" style={{ letterSpacing: '0.16px' }}>{t('no_saved_desc')}</p>
          <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
            {t('browse_products')}
          </Link>
        </div>
      )}
    </div>
  );
}
