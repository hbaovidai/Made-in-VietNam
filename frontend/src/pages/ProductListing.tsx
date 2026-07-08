import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronRight, ChevronLeft, Search, Loader2, Menu, ShieldCheck, Sprout, ShieldAlert, Truck, Factory, Shirt, Wrench, Settings, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '../utils/cn';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { useLocalized } from '../hooks/useLocalized';

// Icon map for sidebar categories
const SIDEBAR_ICONS: Record<number, React.ReactNode> = {
  0: <Sprout size={20} />,
  1: <ShieldAlert size={20} />,
  2: <Truck size={20} />,
  3: <Factory size={20} />,
  4: <Shirt size={20} />,
  5: <Wrench size={20} />,
};

export function ProductListing() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarHover, setSidebarHover] = useState(false);

  // All categories (tree from API — roots have children[])
  const [allCategories, setAllCategories] = useState<any[]>([]);

  // Drill-down state: selected slugs at each level
  const [selectedL2, setSelectedL2] = useState<string | null>(null);
  const [selectedL3, setSelectedL3] = useState<string | null>(null);
  const [selectedL4, setSelectedL4] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        // API returns tree: roots with children[]
        setAllCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Top-level (L1) categories = roots
  const l1Categories = useMemo(() => allCategories.filter((c: any) => !c.parentId), [allCategories]);

  // Find path of the current categoryFilter in the tree
  const categoryPath = useMemo(() => {
    if (!categoryFilter || allCategories.length === 0) return [];
    const findPath = (list: any[], slug: string, path: any[] = []): any[] | null => {
      for (const item of list) {
        const current = [...path, item];
        if (item.slug === slug) return current;
        if (item.children && item.children.length > 0) {
          const res = findPath(item.children, slug, current);
          if (res) return res;
        }
      }
      return null;
    };
    return findPath(allCategories, categoryFilter) || [];
  }, [allCategories, categoryFilter]);

  // Find current active L1 category object
  const activeL1 = useMemo(() => {
    return categoryPath[0] || null;
  }, [categoryPath]);

  // L2 = children of active L1
  const l2Categories = useMemo(() => activeL1?.children || [], [activeL1]);

  // Active L2 object
  const activeL2 = useMemo(() => {
    if (!selectedL2) return null;
    return l2Categories.find((c: any) => c.slug === selectedL2) || null;
  }, [selectedL2, l2Categories]);

  // L3 = children of active L2
  const l3Categories = useMemo(() => activeL2?.children || [], [activeL2]);

  // Active L3 object
  const activeL3 = useMemo(() => {
    if (!selectedL3) return null;
    return l3Categories.find((c: any) => c.slug === selectedL3) || null;
  }, [selectedL3, l3Categories]);

  // L4 = children of active L3
  const l4Categories = useMemo(() => activeL3?.children || [], [activeL3]);

  // Sync selected subcategories when categoryFilter or path changes
  useEffect(() => {
    if (categoryPath.length > 0) {
      setSelectedL2(categoryPath[1]?.slug || null);
      setSelectedL3(categoryPath[2]?.slug || null);
      setSelectedL4(categoryPath[3]?.slug || null);
    } else {
      setSelectedL2(null);
      setSelectedL3(null);
      setSelectedL4(null);
    }
  }, [categoryPath]);

  // Determine the deepest active filter slug for API
  const activeCategorySlug = selectedL4 || selectedL3 || selectedL2 || categoryFilter;

  // Products
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    async function fetchProducts() {
      const isLoadMore = currentPage > 1;
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setProducts([]);
      }
      try {
        const queryParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
          if (key !== 'category') queryParams.append(key, value);
        });
        // Use the deepest selected category for filtering
        if (activeCategorySlug) queryParams.set('category', activeCategorySlug);
        if (!queryParams.has('limit')) queryParams.set('limit', '12');

        const res = await api.get(`/products?${queryParams.toString()}`);
        const newProducts = res.data.data || [];
        if (isLoadMore) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }
        setTotalProducts(res.data.meta?.total || res.data.total || res.data.data?.length || 0);
        setTotalPages(res.data.meta?.totalPages || res.data.totalPages || Math.ceil((res.data.meta?.total || res.data.total || 0) / 12) || 1);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    fetchProducts();
  }, [searchParams, activeCategorySlug]);

  const clearFilters = () => {
    setSearchParams({});
    setSelectedL2(null);
    setSelectedL3(null);
    setSelectedL4(null);
  };

  const handleCategoryClick = (slug: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('category', slug);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handle subcategory drill-down: only update local state (don't change URL ?category=)
  const handleL2Click = (slug: string) => {
    if (selectedL2 === slug) {
      setSelectedL2(null);
      setSelectedL3(null);
      setSelectedL4(null);
    } else {
      setSelectedL2(slug);
      setSelectedL3(null);
      setSelectedL4(null);
    }
  };

  const handleL3Click = (slug: string) => {
    if (selectedL3 === slug) {
      setSelectedL3(null);
      setSelectedL4(null);
    } else {
      setSelectedL3(slug);
      setSelectedL4(null);
    }
  };

  const handleL4Click = (slug: string) => {
    if (selectedL4 === slug) {
      setSelectedL4(null);
    } else {
      setSelectedL4(slug);
    }
  };

  const handleLoadMore = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(currentPage + 1));
    setSearchParams(newParams);
  };

  // Price display helper
  const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
  const getPriceDisplay = (product: any) => {
    const price = product.minPrice ?? product.price;
    if (price != null) return formatVND(price);
    return 'Liên hệ';
  };
  const getMoqDisplay = (product: any) => {
    if (product.moq) return `${product.moq.toLocaleString('vi-VN')} ${product.unit || 'pcs'}`;
    return `100 pcs`;
  };


  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SEOHead
        title={categoryFilter ? t('seo_products_title_category', { category: categoryFilter }) : t('seo_products_title_all')}
        description={categoryFilter ? t('seo_products_desc', { category: categoryFilter }) : t('seo_products_desc_all')}
        keywords={t('seo_products_keywords', { category: categoryFilter || 'export' })}
        canonical="/products"
      />

      <div className="flex min-h-[calc(100vh-64px)]">
        {/* ═══ Sidebar — Collapsed icon bar, expands on hover ═══ */}
        <aside
          className={cn(
            "hidden lg:flex flex-col bg-white border-r border-slate-200 shrink-0 sticky top-0 h-screen z-30 transition-all duration-300 ease-in-out overflow-hidden",
            sidebarHover ? "w-[260px] shadow-xl" : "w-[72px]"
          )}
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
        >
          {/* Menu icon at top */}
          <div className="flex items-center h-14 px-5 border-b border-slate-100 shrink-0">
            <Menu size={22} className="text-slate-500 shrink-0" />
            <span className={cn(
              "ml-4 text-sm font-bold text-slate-700 whitespace-nowrap transition-opacity duration-200",
              sidebarHover ? "opacity-100" : "opacity-0"
            )}>
              Danh mục
            </span>
          </div>

          {/* Category items */}
          <nav className="flex-1 py-3 overflow-y-auto">
            {/* "All" item */}
            <button
              onClick={() => { setSearchParams({}); }}
              className={cn(
                "w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-200 relative group/item",
                !categoryFilter
                  ? "text-primary bg-primary/5"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
              )}
            >
              {!categoryFilter && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-primary rounded-r-full" />}
              <Search size={20} className="shrink-0" />
              <span className={cn(
                "text-sm font-semibold whitespace-nowrap transition-opacity duration-200",
                sidebarHover ? "opacity-100" : "opacity-0"
              )}>
                Tất cả sản phẩm
              </span>
            </button>

            {l1Categories.map((cat, idx) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={cn(
                  "w-full flex items-center gap-4 px-5 py-3 text-left transition-all duration-200 relative group/item",
                  activeL1?.slug === cat.slug
                    ? "text-primary bg-primary/5"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                {activeL1?.slug === cat.slug && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 bg-primary rounded-r-full" />}
                <span className="shrink-0">{SIDEBAR_ICONS[idx % 6] || <Settings size={20} />}</span>
                <span className={cn(
                  "text-sm font-semibold whitespace-nowrap transition-opacity duration-200 truncate",
                  sidebarHover ? "opacity-100" : "opacity-0"
                )}>
                  {cat.name}
                </span>
              </button>
            ))}


          </nav>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
            <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
              <ChevronRight size={12} className="text-slate-300" />
              <span className={cn(categoryFilter ? "hover:text-primary cursor-pointer" : "text-primary font-bold")}>
                {activeL1 ? activeL1.name : t('products_breadcrumb')}
              </span>
            </nav>
          </div>

          {/* ═══ Horizontal Drill-down Filters ═══ */}
          {activeL1 && l2Categories.length > 0 && (
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-4">
              <div className="bg-white border border-slate-300 rounded-lg overflow-hidden">
                {/* Level 2 */}
                <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1.5 px-3 py-2 overflow-x-auto">
                  {l2Categories.map((cat: any, i: number) => (
                    <React.Fragment key={cat.slug}>
                      {i > 0 && <span className="text-slate-200 mx-1 select-none">|</span>}
                      <button
                        onClick={() => handleL2Click(cat.slug)}
                        className={cn(
                          "text-xs px-2.5 py-0.5 rounded-md transition-all duration-200 whitespace-nowrap",
                          selectedL2 === cat.slug
                            ? "text-[#1a3a6b] font-bold bg-blue-50 border border-blue-200"
                            : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                        )}
                      >
                        {cat.name}
                      </button>
                    </React.Fragment>
                  ))}
                </div>

                {/* Level 3 */}
                {selectedL2 && l3Categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1.5 px-3 py-2 overflow-x-auto border-t border-dashed border-slate-200">
                    {l3Categories.map((cat: any, i: number) => (
                      <React.Fragment key={cat.slug}>
                        {i > 0 && <span className="text-slate-200 mx-1 select-none">|</span>}
                        <button
                          onClick={() => handleL3Click(cat.slug)}
                          className={cn(
                            "text-xs px-2.5 py-0.5 rounded-md transition-all duration-200 whitespace-nowrap",
                            selectedL3 === cat.slug
                              ? "text-[#1a3a6b] font-bold bg-blue-50 border border-blue-200"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                          )}
                        >
                          {cat.name}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* Level 4 */}
                {selectedL3 && l4Categories.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-0.5 gap-y-1.5 px-3 py-2 overflow-x-auto border-t border-dashed border-slate-200">
                    {l4Categories.map((cat: any, i: number) => (
                      <React.Fragment key={cat.slug}>
                        {i > 0 && <span className="text-slate-200 mx-1 select-none">|</span>}
                        <button
                          onClick={() => handleL4Click(cat.slug)}
                          className={cn(
                            "text-xs px-2.5 py-0.5 rounded-md transition-all duration-200 whitespace-nowrap",
                            selectedL4 === cat.slug
                              ? "text-[#1a3a6b] font-bold bg-blue-50 border border-blue-200"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900 font-medium"
                          )}
                        >
                          {cat.name}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ Sort Bar ═══ */}
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 mb-5">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-600">
                {/* Mobile filter button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden mr-3 p-2 text-slate-600 bg-white border border-slate-200 rounded-lg shadow-sm inline-flex items-center gap-1.5 text-xs font-bold"
                >
                  <Menu size={16} /> Danh mục
                </button>
                {totalProducts > 0 && (
                  <span><strong className="text-slate-800">{totalProducts}</strong> {t('listing_products_unit')}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden sm:inline">{t('listing_sort_by')}</span>
                <select
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 outline-none cursor-pointer appearance-none pr-8"
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
                  <option value="popular">Phù hợp nhất</option>
                  <option value="price-asc">{t('sort_price_low_high')}</option>
                  <option value="price-desc">{t('sort_price_high_low')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* ═══ Product Grid ═══ */}
          <div className="px-4 sm:px-6 lg:px-8">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {products.map((product, index) => {
                  const imageUrl = product.images?.[0] || product.image || 'https://via.placeholder.com/300';
                  const priceDisplay = getPriceDisplay(product);
                  const moqDisplay = getMoqDisplay(product);
                  const isContact = priceDisplay === 'Liên hệ';

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                    <Link
                      to={`/products/${product.id}`}
                      className="group bg-white border border-slate-300 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col cursor-pointer h-full"
                    >
                      {/* Image */}
                      <div className="relative aspect-square overflow-hidden bg-slate-100">
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                          referrerPolicy="no-referrer"
                          loading="lazy"
                        />
                        {/* Verified Badge */}
                        <div className="absolute top-2 left-2 bg-amber-500 text-white px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase flex items-center gap-1 shadow-sm">
                          <ShieldCheck size={10} /> VERIFIED
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-3 flex flex-col flex-1">
                        <h3 className="text-xs font-bold text-[#1a2b4a] line-clamp-2 leading-snug mb-2 min-h-[2.4em]">
                          {localized(product, 'name')}
                        </h3>

                        {/* MOQ chip */}
                        <div className="mb-3">
                          <span className="inline-block bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-1 rounded">
                            MOQ: {moqDisplay}
                          </span>
                        </div>

                        {/* Contact button */}
                        <button
                          onClick={(e) => { e.preventDefault(); navigate(`/rfq?productId=${product.id}&productName=${encodeURIComponent(product.name)}`); }}
                          className="w-full py-1.5 border border-primary text-primary text-[11px] font-bold rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 mb-2"
                        >
                          {t('listing_contact_btn')}
                        </button>

                        {/* Supplier */}
                        <div className="mt-auto pt-2 border-t border-slate-200">
                          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wide truncate block">
                            {product.supplier?.companyName || 'Nhà cung cấp'}
                          </span>
                        </div>
                      </div>
                    </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">{t('no_products_found')}</h3>
                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-4">{t('no_products_desc')}</p>
                <button
                  onClick={clearFilters}
                  className="text-primary font-bold text-sm hover:underline"
                >
                  {t('clear_all_filters')}
                </button>
              </div>
            )}

            {/* ═══ Load More ═══ */}
            {currentPage < totalPages && (
              <div className="flex flex-col items-center gap-3 mt-10">
                <p className="text-xs text-slate-400 font-medium">
                  Đang hiển thị {products.length} / {totalProducts} sản phẩm
                </p>
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="px-8 py-2.5 bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loadingMore ? (
                    <><Loader2 size={16} className="animate-spin" /> {t('loading_text')}</>
                  ) : (
                    'Xem thêm sản phẩm'
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ═══ Mobile Sidebar Overlay ═══ */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)} />
          <aside className="absolute top-0 left-0 w-[280px] max-w-[85vw] h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Danh mục</h2>
              <button onClick={() => setIsSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2">
              <button
                onClick={() => { setSearchParams({}); setIsSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors",
                  !categoryFilter ? "text-primary bg-primary/5" : "text-slate-600 hover:bg-slate-50"
                )}
              >
                <Search size={18} className="shrink-0" />
                Tất cả sản phẩm
              </button>
              {l1Categories.map((cat, idx) => (
                <button
                  key={cat.slug}
                  onClick={() => { handleCategoryClick(cat.slug); setIsSidebarOpen(false); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-5 py-3 text-sm font-semibold transition-colors",
                    activeL1?.slug === cat.slug ? "text-primary bg-primary/5" : "text-slate-600 hover:bg-slate-50"
                  )}
                >
                  <span className="shrink-0">{SIDEBAR_ICONS[idx % 6] || <Settings size={18} />}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
