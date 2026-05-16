import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, ChevronDown, ChevronRight, Search, SlidersHorizontal, LayoutGrid, List, X, Loader2 } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { ALL_CATEGORIES_LIST, CATEGORY_GROUPS } from '../data/categories';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { useLocalized } from '../hooks/useLocalized';

export function ProductListing() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const activeCategoryGroup = React.useMemo(() => {
    if (!categoryFilter) return null;
    const group = CATEGORY_GROUPS.find(g => 
      g.slug === categoryFilter || 
      g.sections.some(s => s.subcategories.some(sub => sub.href.includes(categoryFilter)))
    );
    return group ? group.slug : categoryFilter;
  }, [categoryFilter]);

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        
        // Pass all valid searchParams to backend
        searchParams.forEach((value, key) => {
          queryParams.append(key, value);
        });

        const res = await api.get(`/products?${queryParams.toString()}`);
        setProducts(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [searchParams]);

  const clearFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEOHead
        title={categoryFilter ? t('seo_products_title_category', { category: categoryFilter }) : t('seo_products_title_all')}
        description={categoryFilter ? t('seo_products_desc', { category: categoryFilter }) : t('seo_products_desc_all')}
        keywords={t('seo_products_keywords', { category: categoryFilter || 'export' })}
        canonical="/products"
      />
      {/* Premium Header */}
      <div className="bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-200 pt-4 pb-12 relative overflow-hidden">
        {/* Soft Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-viet-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-primary font-bold">
              {activeCategoryGroup ? localized(CATEGORY_GROUPS.find(g => g.slug === activeCategoryGroup), 'name') : t('products_breadcrumb')}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-4xl space-y-4">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight drop-shadow-sm pb-1">
                {activeCategoryGroup ? localized(CATEGORY_GROUPS.find(g => g.slug === activeCategoryGroup), 'name') : t('all_products')}
              </h1>
            </div>
            
            <div className="flex bg-slate-50/80 rounded-lg items-center px-4 py-2 shrink-0 border border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-3">{t('sort_by')}</span>
               <select 
                 className="bg-transparent text-sm font-bold text-[#1E293B] outline-none appearance-none pr-6 cursor-pointer"
                 value={searchParams.get('sortBy') === 'minPrice' ? (searchParams.get('sortOrder') === 'asc' ? 'price-asc' : 'price-desc') : 'popular'}
                 onChange={(e) => {
                   const val = e.target.value;
                   const newParams = new URLSearchParams(searchParams);
                   if (val === 'price-asc') {
                     newParams.set('sortBy', 'minPrice');
                     newParams.set('sortOrder', 'asc');
                   } else if (val === 'price-desc') {
                     newParams.set('sortBy', 'minPrice');
                     newParams.set('sortOrder', 'desc');
                   } else {
                     newParams.delete('sortBy');
                     newParams.delete('sortOrder');
                   }
                   newParams.set('page', '1');
                   setSearchParams(newParams);
                 }}
               >
                 <option value="popular">{t('sort_popular')}</option>
                 <option value="price-asc">{t('sort_price_low_high')}</option>
                 <option value="price-desc">{t('sort_price_high_low')}</option>
               </select>
               <div className="pointer-events-none -ml-4">
                 <ChevronDown size={14} className="text-slate-500" />
               </div>
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
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <div className="w-4 h-[2px] bg-[#043365]" />
                  {t('categories')}
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSearchParams({})}
                    className={cn(
                      "w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all",
                      !categoryFilter
                        ? "bg-[#043365] text-white shadow-md ring-2 ring-offset-2 ring-[#043365]"
                        : "bg-white text-slate-700 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md"
                    )}
                  >
                    {t('all_categories')}
                  </button>
                  {ALL_CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => setSearchParams({ category: cat.slug })}
                      className={cn(
                        "w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all",
                        activeCategoryGroup === cat.slug
                          ? "bg-[#043365] text-white shadow-md ring-2 ring-offset-2 ring-[#043365]"
                          : "bg-white text-slate-700 border border-slate-100 shadow-sm hover:border-slate-200 hover:shadow-md"
                      )}
                    >
                      {localized(cat, 'name')}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-3">
                  <div className="w-4 h-[2px] bg-[#043365]" />
                  {t('supplier_type')}
                </h3>
                <div className="space-y-4">
                  {[
                    { key: 'verified_supplier_filter', label: t('verified_supplier_filter') },
                    { key: 'premium_member_filter', label: t('premium_member_filter') },
                    { key: 'factory_direct_filter', label: t('factory_direct_filter') }
                  ].map((type) => (
                    <label key={type.key} className="flex items-center gap-4 cursor-pointer group">
                      <div className="relative flex items-center justify-center">
                        <input type="checkbox" className="peer appearance-none w-5 h-5 border-2 border-slate-200 rounded text-[#043365] focus:ring-[#043365] transition-all bg-white" />
                        <svg className="absolute w-3.5 h-3.5 text-[#043365] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="text-sm font-bold text-slate-700 group-hover:text-[#043365] transition-colors">{type.label}</span>
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
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8">
              <div className="text-sm font-bold text-[#1E293B]">
                {products.length} <span className="font-medium text-slate-500">{t('results')}</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm"
                >
                  <Filter size={18} />
                </button>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={cn("p-2 rounded bg-slate-100 text-slate-600", viewMode === 'grid' && "bg-[#E2E8F0] text-[#1E293B]")}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={cn("p-2 rounded text-slate-400 hover:text-slate-600", viewMode === 'list' && "bg-[#E2E8F0] text-[#1E293B]")}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : products.length > 0 ? (
              <div className={cn(
                "grid gap-8",
                viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              )}>
                {products.map((product) => (
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
                  {ALL_CATEGORIES_LIST.map((cat) => (
                    <button
                      key={cat.slug}
                      onClick={() => { setSearchParams({ category: cat.slug }); setIsSidebarOpen(false); }}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        activeCategoryGroup === cat.slug ? "bg-primary text-white" : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {localized(cat, 'name')}
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
