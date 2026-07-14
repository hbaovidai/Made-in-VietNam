import React, { useState, useEffect } from 'react';
import { Clock, ChevronRight, Search, Filter, Trash2, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';

export function BuyerHistory() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [historyProducts, setHistoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    if (user?.id) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/users/${user?.id}/history`);
      setHistoryProducts(res.data);
    } catch (error) {
      console.error(error);
      addToast({ type: 'error', title: t('buyer_error'), message: t('buyer_update_error') });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteItem = async (historyId: string) => {
    try {
      await api.delete(`/users/${user?.id}/history/${historyId}`);
      setHistoryProducts(historyProducts.filter(p => p.historyId !== historyId));
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearHistory = async () => {
    if (!window.confirm(t('buyer_history_confirm'))) return;
    try {
      await api.delete(`/users/${user?.id}/history`);
      setHistoryProducts([]);
      addToast({ type: 'success', title: t('buyer_success'), message: t('buyer_history_cleared') });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('browsing_history_title')}</h1>
          <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('browsing_history_subtitle')}</p>
        </div>
        {historyProducts.length > 0 && (
          <button onClick={handleClearHistory} className="text-xs text-ink-muted hover:text-red-500 border border-hairline px-3 py-1.5 bg-canvas hover:bg-surface-1 uppercase tracking-widest font-normal" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
            Xóa lịch sử
          </button>
        )}
      </div>
      <div className="space-y-4">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 size={32} className="animate-spin text-primary" />
           </div>
        ) : historyProducts.map((product) => (
          <div key={product.historyId} className="p-6 bg-canvas border border-hairline flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-surface-1 transition-colors group cursor-pointer" style={{ borderRadius: 0 }}>
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
                <div className="flex items-center gap-2 mt-2 text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>
                  <Clock size={12} />
                  <span>{new Date(product.viewedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => handleDeleteItem(product.historyId)} className="p-2 text-ink-subtle hover:text-red-500 transition-colors" title={t('buyer_history_delete')}>
                <Trash2 size={18} />
              </button>
              <Link to={`/products/${product.id}`} className="bg-primary text-white px-6 py-2 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-[10px] flex items-center gap-2" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
                <Eye size={14} /> {t('view_again')}
              </Link>
              <ChevronRight size={16} className="text-hairline group-hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
      {!loading && historyProducts.length === 0 && (
        <div className="p-20 text-center space-y-4 border border-hairline bg-canvas" style={{ borderRadius: 0 }}>
          <div className="w-20 h-20 bg-surface-1 border border-hairline flex items-center justify-center mx-auto" style={{ borderRadius: 0 }}>
            <Clock size={40} className="text-ink-subtle" />
          </div>
          <h3 className="text-lg font-normal text-ink uppercase tracking-tight" style={{ letterSpacing: '0.32px' }}>{t('no_history_title')}</h3>
          <p className="text-ink-muted text-sm max-w-xs mx-auto" style={{ letterSpacing: '0.16px' }}>{t('no_history_desc')}</p>
          <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 font-normal hover:bg-primary-hover transition-colors uppercase tracking-widest text-xs" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
            {t('browse_products')}
          </Link>
        </div>
      )}
    </div>
  );
}
