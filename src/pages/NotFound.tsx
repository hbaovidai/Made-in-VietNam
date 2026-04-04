import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Home, LayoutGrid, Search } from 'lucide-react';

export function NotFound() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50 px-4 py-20 text-center">
      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-8">
        <span className="text-4xl font-black text-primary">404</span>
      </div>
      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter mb-4">
        {t('page_not_found_title')}
      </h1>
      <p className="text-slate-600 text-lg max-w-md mb-12 leading-relaxed">
        {t('page_not_found_desc')}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
        <Link 
          to="/" 
          className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 font-bold hover:bg-primary-dark transition-all uppercase tracking-widest text-sm shadow-lg shadow-primary/20"
        >
          <Home size={18} /> {t('back_to_home')}
        </Link>
        <Link 
          to="/categories" 
          className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 font-bold hover:bg-slate-800 transition-all uppercase tracking-widest text-sm shadow-lg shadow-slate-900/20"
        >
          <LayoutGrid size={18} /> {t('browse_categories')}
        </Link>
      </div>

      <div className="mt-16 w-full max-w-md">
        <div className="relative">
          <input 
            type="text" 
            placeholder={t('search_placeholder', { type: t('products').toLowerCase() })} 
            className="w-full px-6 py-4 bg-white border border-slate-200 rounded-sm outline-none focus:border-primary transition-colors"
          />
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">
            <Search size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
