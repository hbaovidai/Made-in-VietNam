import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
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
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải lịch sử duyệt' });
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
    if (!window.confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch sử?')) return;
    try {
      await api.delete(`/users/${user?.id}/history`);
      setHistoryProducts([]);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa toàn bộ lịch sử' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <DashboardSection 
      title={t('browsing_history_title')} 
      subtitle={t('browsing_history_subtitle')}
      actions={
        historyProducts.length > 0 && (
          <button 
            onClick={handleClearHistory}
            className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs"
          >
            {t('clear_history')}
          </button>
        )
      }
    >
      <div className="divide-y divide-slate-100">
        {loading ? (
           <div className="flex justify-center items-center py-20">
             <Loader2 size={32} className="animate-spin text-primary" />
           </div>
        ) : historyProducts.map((product) => (
          <div key={product.historyId} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
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
                <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={12} />
                  <span>{new Date(product.viewedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => handleDeleteItem(product.historyId)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Xóa">
                <Trash2 size={18} />
              </button>
              <Link to={`/products/${product.id}`} className="bg-slate-900 text-white px-6 py-2 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/20 flex items-center gap-2">
                <Eye size={14} /> {t('view_again')}
              </Link>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-primary" />
            </div>
          </div>
        ))}
      </div>
      {!loading && historyProducts.length === 0 && (
        <div className="p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Clock size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('no_history_title')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_history_desc')}</p>
          <Link to="/products" className="inline-block bg-primary text-white px-8 py-3 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs">
            {t('browse_products')}
          </Link>
        </div>
      )}
    </DashboardSection>
  );
}
