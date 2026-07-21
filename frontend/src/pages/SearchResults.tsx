import React, { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft, 
  Search, 
  Loader2, 
  Menu, 
  ShieldCheck, 
  Sprout, 
  ShieldAlert, 
  Truck, 
  Factory, 
  Shirt, 
  Wrench, 
  Settings, 
  Heart 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { m } from 'motion/react';
import { cn } from '../utils/cn';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { useLocalized } from '../hooks/useLocalized';
import { SearchHeader } from '../components/SearchHeader';
import { CustomSelect } from '../components/CustomSelect';
import { PricingMode } from '../lib/enums';


const SIDEBAR_ICONS: Record<number, React.ReactNode> = {
  0: <Sprout size={20} />,
  1: <ShieldAlert size={20} />,
  2: <Truck size={20} />,
  3: <Factory size={20} />,
  4: <Shirt size={20} />,
  5: <Wrench size={20} />,
};

const ITEMS_PER_PAGE = 12;

export function SearchResults() {
  const { t } = useTranslation();
  const localized = useLocalized();
  const [searchParams, setSearchParams] = useSearchParams();

  // Left sidebar & Drawer states
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<any[]>([]);

  // Search local input state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  // Products and pagination states
  const [products, setProducts] = useState<any[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Favorites local toggle state
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});



  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  // Fetch L1 categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setAllCategories(res.data || []);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Filter root categories
  const l1Categories = useMemo(() => {
    return allCategories.filter((c: any) => !c.parentId);
  }, [allCategories]);

  // Sync search input with URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  // Fetch products based on query parameters
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
        
        const search = searchParams.get('search') || '';
        if (search) queryParams.set('search', search);

        const category = searchParams.get('category') || '';
        if (category) queryParams.set('category', category);

        const sortBy = searchParams.get('sortBy') || '';
        if (sortBy) queryParams.set('sortBy', sortBy);

        const sortOrder = searchParams.get('sortOrder') || '';
        if (sortOrder) queryParams.set('sortOrder', sortOrder);

        queryParams.set('page', currentPage.toString());
        queryParams.set('limit', ITEMS_PER_PAGE.toString());

        const res = await api.get(`/products?${queryParams.toString()}`);
        const newProducts = res.data.data || [];
        if (isLoadMore) {
          setProducts(prev => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }
        setTotalProducts(res.data.meta?.total || res.data.total || 0);
        setTotalPages(res.data.meta?.totalPages || res.data.totalPages || Math.ceil((res.data.meta?.total || res.data.total || 0) / ITEMS_PER_PAGE) || 1);
      } catch (err) {
        console.error('Failed to fetch products', err);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    }
    fetchProducts();
  }, [searchParams, currentPage]);

  // Handler for search box submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery.trim()) {
      newParams.set('search', searchQuery.trim());
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Handler for suggestion badge click
  const handleSuggestionClick = (val: string) => {
    setSearchQuery(val);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('search', val);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSortChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');

    if (value === 'price-asc') {
      newParams.set('sortBy', 'minPrice');
      newParams.set('sortOrder', 'asc');
    } else if (value === 'price-desc') {
      newParams.set('sortBy', 'minPrice');
      newParams.set('sortOrder', 'desc');
    } else if (value === 'newest') {
      newParams.set('sortBy', 'createdAt');
      newParams.set('sortOrder', 'desc');
    } else {
      newParams.delete('sortBy');
      newParams.delete('sortOrder');
    }
    setSearchParams(newParams);
  };

  // Handler for category selection
  const handleCategorySelect = (slug: string | null) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug) {
      newParams.set('category', slug);
    } else {
      newParams.delete('category');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  // Infinite scroll via IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = currentPage < totalPages;

  const handleLoadMore = useCallback(() => {
    if (loadingMore || loading || !hasMore) return;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', (currentPage + 1).toString());
    setSearchParams(newParams);
  }, [loadingMore, loading, hasMore, searchParams, currentPage, setSearchParams]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const toggleFavorite = (productId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  return (
        <div className="w-full min-h-screen bg-canvas flex flex-col">
      <SEOHead 
        title={`${searchParams.get('search') ? `Tìm kiếm: "${searchParams.get('search')}"` : 'Kết quả tìm kiếm'} - MIVN`}
        description="Trang tìm kiếm sản phẩm và nhà cung cấp MIVN"
      />

      {/* ═══ Custom Search Page Header ═══ */}
      <SearchHeader />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* ═══ Left Sidebar (Desktop/Tablet) ═══ */}
        <aside className="hidden md:flex flex-col bg-canvas border-r border-hairline shrink-0 transition-all duration-300 w-16 lg:w-[280px]">
          <div className="p-4 lg:p-5 border-b border-hairline flex items-center justify-center lg:justify-start">
            <h2 className="text-base font-normal text-ink lg:block hidden" style={{ letterSpacing: '0.16px' }}>Danh mục sản phẩm</h2>
            <span className="lg:hidden text-center block text-[10px] font-normal text-ink-subtle uppercase tracking-wider">{t('search_items_label')}</span>
          </div>
          
          <div className="flex-1 py-4 overflow-y-auto px-2 lg:px-3">
            {l1Categories.map((cat, idx) => {
              const icon = SIDEBAR_ICONS[idx % 6] || <Settings size={20} />;
              const isActive = searchParams.get('category') === cat.slug;
              return (
                <button
                  key={cat.slug}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={cn(
                    "w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 text-sm font-normal transition-all duration-200 text-left mb-1",
                    isActive
                      ? "bg-surface-1 text-primary border-l-2 border-primary"
                      : "text-ink-muted hover:bg-surface-1 hover:text-ink"
                  )}
                  style={{ borderRadius: 0 }}
                  title={cat.name}
                >
                  <span className="shrink-0">{icon}</span>
                  <span className="truncate lg:block hidden" style={{ letterSpacing: '0.16px' }}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* ═══ Main Content Area ═══ */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-light text-ink uppercase tracking-tight mb-4" style={{ letterSpacing: '0.16px' }}>
              Kết quả tìm kiếm
            </h1>

            {/* Search inputs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <form onSubmit={handleSearchSubmit} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm, nhà cung cấp..."
                  className="w-full pl-11 pr-4 py-2.5 bg-surface-1 border border-hairline text-sm text-ink placeholder-ink-subtle outline-none focus:border-b-2 focus:border-b-primary transition-all"
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                />
              </form>
              
              <div className="sm:w-56">
                <CustomSelect
                  value={searchParams.get('sortBy') === 'minPrice' ? (searchParams.get('sortOrder') === 'asc' ? 'price-asc' : 'price-desc') : (searchParams.get('sortBy') === 'createdAt' ? 'newest' : 'default')}
                  onChange={handleSortChange}
                  options={[
                    { value: 'default', label: t('search_sort_default') },
                    { value: 'price-asc', label: t('search_price_asc') },
                    { value: 'price-desc', label: t('search_price_desc') },
                    { value: 'newest', label: t('search_newest') },
                  ]}
                />
              </div>
            </div>

            {/* Chips Suggestions */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('goi_y')}</span>
              {['Phụ tùng CNC', 'Inox 304', 'Nhôm định hình', 'Động cơ điện'].map(chip => (
                <button
                  key={chip}
                  onClick={() => handleSuggestionClick(chip)}
                  className="text-xs font-normal px-3 py-1.5 bg-surface-1 hover:bg-surface-2 text-ink transition-colors cursor-pointer border border-hairline"
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product, index) => {
                  const imageUrl = product.images?.[0] || product.image || 'https://via.placeholder.com/300';
                  const isLiked = favorites[product.id] || false;

                  const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
                  const priceDisplay = (() => {
                    if (!product.pricingMode) return t('price_display_contact');
                    if (product.pricingMode === PricingMode.STANDARD) return formatVND(product.minPrice);
                    if (product.pricingMode === PricingMode.TIERED) {
                      const priceRange = `${formatVND(product.minPrice)} - ${formatVND(product.maxPrice)}`;
                      return priceRange;
                    }
                    if (product.pricingMode === PricingMode.CONTACT) return t('price_display_contact');
                  })();

                  const unitDisplay = (product.pricingMode !== PricingMode.CONTACT) ? ('/' + product.unit || 'Cái') : '';
                  const moqDisplay = product.moq ? `${product.moq.toLocaleString('vi-VN')} ${product.unit || 'Cái'}` : '100 Cái';

                  return (
                    <m.div
                      key={product.id}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.25, delay: Math.min(index, 12) * 0.04 }}
                      className="group bg-canvas border border-hairline overflow-hidden flex flex-col h-full hover:border-primary transition-[border-color] duration-150 relative"
                      style={{ borderRadius: 0 }}
                    >
                      {/* Image Block */}
                      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-surface-2 border-b border-hairline">
                        <m.img
                          layoutId={`product-image-${product.id}`}
                          src={imageUrl}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-200 ease-out"
                        />
                        <div className="absolute top-3 left-3 bg-surface-1 text-primary px-2.5 py-1 border border-hairline flex items-center gap-1 text-[9px] font-normal tracking-widest uppercase" style={{ borderRadius: 0 }}>
                          <ShieldCheck size={12} className="fill-primary text-white" />
                          VERIFIED
                        </div>
                        {/* Favorite button */}
                        <button
                          onClick={(e) => toggleFavorite(product.id, e)}
                          className="absolute top-3 right-3 w-8 h-8 bg-surface-1/90 hover:bg-surface-1 border border-hairline flex items-center justify-center transition-colors duration-150 z-10"
                          style={{ borderRadius: 0 }}
                        >
                          <Heart 
                            size={16} 
                            className={cn("transition-colors duration-150", isLiked ? "fill-red-500 text-red-500" : "text-ink-subtle hover:text-red-500")} 
                          />
                        </button>
                      </Link>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col flex-1">
                        <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
                          <h3 className="text-sm font-normal text-ink line-clamp-2 leading-snug mb-2 min-h-[2.6em] hover:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>
                            {localized(product, 'name')}
                          </h3>
                          
                          {/* Price */}
                          <div className="text-base font-normal text-primary mb-1" style={{ letterSpacing: '0.16px' }}>
                            {priceDisplay} <span className="text-xs font-normal text-ink-subtle">{unitDisplay}</span>
                          </div>

                          {/* MOQ */}
                          <div className="mb-3">
                            <span className="inline-block bg-surface-1 text-ink-muted text-[10px] font-normal px-2 py-1 border border-hairline" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
                              MOQ: {moqDisplay}
                            </span>
                          </div>

                          {/* Supplier Name */}
                          <div className="mt-auto pt-2 border-t border-hairline mb-4">
                            <span className="text-[11px] font-normal text-ink-subtle hover:text-primary transition-colors truncate block" style={{ letterSpacing: '0.16px' }}>
                              {product.supplier?.companyName || 'Công ty TNHH MIVN'}
                            </span>
                          </div>
                        </Link>

                        {/* CTA Buttons */}
                        <div className="flex flex-col gap-2">
                          <Link
                            to={`/rfq?product=${product.id}`}
                            className="w-full py-2 bg-primary hover:bg-primary-hover text-white font-normal text-xs text-center transition-colors"
                            style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                          >
                            {t('product_request_quote')}
                          </Link>
                          <Link
                            to={`/products/${product.id}`}
                            className="w-full py-2 bg-surface-1 border border-hairline text-ink hover:bg-surface-2 font-normal text-xs text-center transition-colors"
                            style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                          >
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </m.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center mx-auto mb-4" style={{ borderRadius: 0 }}>
                  <Search size={28} className="text-ink-subtle" />
                </div>
                <h3 className="text-lg font-normal text-ink mb-1" style={{ letterSpacing: '0.16px' }}>Không tìm thấy sản phẩm</h3>
                <p className="text-ink-muted text-sm max-w-xs mx-auto mb-4" style={{ letterSpacing: '0.16px' }}>{t('thu_nhap_tu_khoa_khac_hoac_xoa_bo_loc')}</p>
                <button
                  onClick={() => setSearchParams({})}
                  className="text-primary font-normal text-sm hover:text-primary-hover"
                  style={{ letterSpacing: '0.16px' }}
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Infinite scroll sentinel */}
          {!loading && hasMore && (
            <div ref={sentinelRef} className="flex flex-col items-center gap-3 mt-10 py-6">
              {loadingMore && (
                <div className="flex items-center gap-2 text-primary">
                  <Loader2 size={20} className="animate-spin" />
                  <span className="text-xs font-normal text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('dang_tai_them_san_pham')}</span>
                </div>
              )}
            </div>
          )}

          {/* Show count when all loaded */}
          {!loading && !hasMore && products.length > 0 && (
            <div className="flex items-center justify-center mt-8">
              <p className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>
                Đã hiển thị tất cả {totalProducts} sản phẩm
              </p>
            </div>
          )}
        </main>
      </div>

      {/* ═══ Mobile Sidebar Drawer Toggle Button ═══ */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="flex items-center justify-center w-12 h-12 bg-primary text-white hover:bg-primary-hover transition-colors"
          style={{ borderRadius: 0 }}
        >
          <Menu size={20} />
        </button>
      </div>

      {/* ═══ Mobile Sidebar Drawer ═══ */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="absolute top-0 left-0 w-[280px] max-w-[85vw] h-full bg-canvas border-r border-hairline flex flex-col" style={{ borderRadius: 0 }}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
              <h2 className="text-lg font-normal text-ink" style={{ letterSpacing: '0.16px' }}>Danh mục sản phẩm</h2>
              <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 text-ink-subtle hover:text-ink">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-2 px-3">
              {l1Categories.map((cat, idx) => {
                const icon = SIDEBAR_ICONS[idx % 6] || <Settings size={20} />;
                const isActive = searchParams.get('category') === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      handleCategorySelect(cat.slug);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 text-sm font-normal transition-all duration-200 text-left mb-1",
                      isActive
                        ? "bg-surface-1 text-primary border-l-2 border-primary"
                        : "text-ink-muted hover:bg-surface-1"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    <span className="shrink-0">{icon}</span>
                    <span style={{ letterSpacing: '0.16px' }}>{cat.name}</span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
