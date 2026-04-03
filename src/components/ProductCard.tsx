import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Product } from '../data/mockData';

interface ProductCardProps {
  key?: string;
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  return (
    <Link
      to={`/products/${product.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(200,16,46,0.1)] transition-all duration-500 flex flex-col h-full hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-slate-700 uppercase tracking-widest shadow-sm">
          {product.category}
        </div>
        <div className="absolute bottom-3 right-3 bg-viet-red text-white px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter shadow-lg">
          {t('export_ready')}
        </div>
      </div>
      <div className="p-6 flex flex-col flex-1 space-y-4">
        <h3 className="text-base font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-viet-red transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto space-y-3">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('wholesale_price')}</span>
            <div className="text-xl font-black text-viet-red tracking-tight">
              {product.priceRange}
            </div>
          </div>
          <div className="flex items-center justify-between text-xs py-2 border-y border-slate-50">
            <div className="flex flex-col">
              <span className="text-slate-400 font-bold uppercase text-[9px]">{t('min_order')}</span>
              <span className="font-black text-slate-800">{product.moq}</span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-slate-400 font-bold uppercase text-[9px]">{t('lead_time')}</span>
              <span className="font-black text-slate-800">15-30 {t('days')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1">
              <Star size={14} className="text-viet-gold fill-viet-gold" />
              <span className="text-xs font-black text-slate-700">{product.rating}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">({product.reviews} {t('orders')})</span>
            <div className="ml-auto flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border border-emerald-100">
              <ShieldCheck size={12} />
              {t('verified')}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
