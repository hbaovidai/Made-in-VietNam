import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Heart, ChevronRight, Star, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';

export function BuyerSaved() {
  const { t } = useTranslation();
  const savedProducts = products.slice(0, 4);

  return (
    <DashboardSection 
      title={t('saved_products_title')} 
      subtitle={t('saved_products_subtitle')}
      actions={
        <button className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">
          {t('clear_all')}
        </button>
      }
    >
      <div className="divide-y divide-slate-100">
        {savedProducts.map((product) => (
          <div key={product.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50 transition-colors group cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-100">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{product.name}</div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <span>{product.priceRange}</span>
                  <span>{t('min_order')}: {product.moq}</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <Star size={12} className="text-yellow-500 fill-current" />
                  <span className="text-[10px] font-bold text-slate-700">4.9 (120 reviews)</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-slate-400 hover:text-primary transition-colors">
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
      {savedProducts.length === 0 && (
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
