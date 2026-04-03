import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Clock, ChevronRight, Search, Filter, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';

export function BuyerHistory() {
  const { t } = useTranslation();
  const historyProducts = products.slice(0, 6);

  return (
    <DashboardSection 
      title={t('browsing_history_title')} 
      subtitle={t('browsing_history_subtitle')}
      actions={
        <button className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">
          {t('clear_history')}
        </button>
      }
    >
      <div className="divide-y divide-slate-100">
        {historyProducts.map((product) => (
          <div key={product.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-viet-red transition-colors">{product.name}</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{product.priceRange}</span>
                  <span>{t('min_order')}: {product.moq}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <Clock size={12} />
                  <span>{t('viewed_ago')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-viet-red transition-colors">
                <Trash2 size={18} />
              </button>
              <Link to={`/products/${product.id}`} className="bg-slate-900 text-white px-6 py-2 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-[10px] shadow-lg shadow-slate-900/20 flex items-center gap-2">
                <Eye size={14} /> {t('view_again')}
              </Link>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-viet-red" />
            </div>
          </div>
        ))}
      </div>
      {historyProducts.length === 0 && (
        <div className="p-20 text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
            <Clock size={40} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight">{t('no_history_title')}</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">{t('no_history_desc')}</p>
          <Link to="/products" className="inline-block bg-viet-red text-white px-8 py-3 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs">
            {t('browse_products')}
          </Link>
        </div>
      )}
    </DashboardSection>
  );
}
