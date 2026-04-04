import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, Search, SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { products, categories } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';

export function ProductListing() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');

  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs & Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
            <Link to="/" className="hover:text-primary">{t('home')}</Link>
            <span>/</span>
            <span className="text-slate-900 font-medium">{t('products_breadcrumb')}</span>
          </nav>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 tracking-tight">
              {categoryFilter ? `${categoryFilter} ${t('products_breadcrumb')}` : t('all_products')}
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative flex-1 md:w-80">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('search_in_results')}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg text-slate-600"
              >
                <Filter size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 space-y-10">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-primary" />
                  {t('categories')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSearchParams({})}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                      !categoryFilter
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white text-slate-600 border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                    )}
                  >
                    {t('all_categories')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSearchParams({ category: cat })}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                        categoryFilter === cat
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "bg-white text-slate-600 border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                      )}
                    >
                      {t(cat)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-primary" />
                  {t('supplier_type')}
                </h3>
                <div className="space-y-3">
                  {[
                    { key: 'verified_supplier_filter', label: t('verified_supplier_filter') },
                    { key: 'premium_member_filter', label: t('premium_member_filter') },
                    { key: 'factory_direct_filter', label: t('factory_direct_filter') }
                  ].map((type) => (
                    <label key={type.key} className="flex items-center gap-3 group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded-md checked:bg-primary checked:border-primary transition-all" />
                        <Search size={12} className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                      </div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-primary transition-colors">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-primary/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <h4 className="text-sm font-black uppercase tracking-widest mb-2 relative z-10">{t('need_help')}</h4>
                <p className="text-xs text-slate-400 font-medium mb-4 relative z-10 leading-relaxed">{t('sourcing_experts_desc')}</p>
                <Link to="/rfq" className="block w-full text-center bg-primary py-2.5 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-primary-dark transition-colors relative z-10">
                  {t('post_rfq_btn')}
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <LayoutGrid size={20} className="text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-500">
                  {t('showing')} <span className="text-slate-900">{filteredProducts.length}</span> {t('results')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('sort_by')}</span>
                <select className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary transition-colors">
                  <option>{t('most_relevant')}</option>
                  <option>{t('price_low_to_high')}</option>
                  <option>{t('price_high_to_low')}</option>
                  <option>{t('newest_arrivals')}</option>
                </select>
              </div>
            </div>

            {filteredProducts.length > 0 ? (
              <div className={cn(
                "grid gap-8",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{t('no_products_found')}</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">{t('no_products_desc')}</p>
                <button
                  onClick={clearFilters}
                  className="mt-8 text-primary font-black uppercase tracking-widest text-xs hover:underline"
                >
                  {t('clear_all_filters')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute top-0 right-0 w-[280px] max-w-[85vw] h-full bg-white shadow-2xl p-5 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900">{t('filters')}</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-8 pb-8">
              {/* Same filters as desktop */}
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">{t('categories')}</h3>
                <div className="grid grid-cols-1 gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => { setSearchParams({ category: cat }); setIsSidebarOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        categoryFilter === cat ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {t(cat)}
                    </button>
                  ))}
                </div>
              </div>
              {/* Add other filter sections here for mobile */}
            </div>
            <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
              <button onClick={clearFilters} className="py-3 text-sm font-bold text-slate-600 border border-slate-200 rounded-lg">
                {t('reset')}
              </button>
              <button onClick={() => setIsSidebarOpen(false)} className="py-3 text-sm font-bold bg-primary text-white rounded-lg">
                {t('apply')}
              </button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
