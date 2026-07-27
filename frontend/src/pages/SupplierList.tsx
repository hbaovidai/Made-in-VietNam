import React, { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, ShieldCheck, Star, ChevronRight, ChevronLeft, Award, Globe, Loader2, Menu, Sprout, ShieldAlert, Truck, Factory, Shirt, Wrench, Zap, FlaskConical, Leaf, TreePine, Sofa, Hammer, Package, Layers, Send } from 'lucide-react';
import { m } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { SupplierCard } from '../components/SupplierCard';
import { cn } from '../utils/cn';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';

// Icon map by category slug — add new entries when creating categories
const SLUG_ICON_MAP: Record<string, React.ReactNode> = {
  'bao-bi-in-an':               <Package size={20} />,
  'co-khi-gia-cong-kim-loai':   <Wrench size={20} />,
  'det-may-thoi-trang':         <Shirt size={20} />,
  'hoa-chat-duoc-pham':         <FlaskConical size={20} />,
  'logistics-van-tai':          <Truck size={20} />,
  'nong-nghiep-thuc-pham':      <Sprout size={20} />,
  'nang-luong-moi-truong':      <Leaf size={20} />,
  'noi-that-trang-tri':         <Sofa size={20} />,
  'vat-lieu-xay-dung':          <Hammer size={20} />,
  'dien-dien-tu':               <Zap size={20} />,
  'do-go-noi-that':             <TreePine size={20} />,
};

function getCategoryIcon(slug: string, size = 20): React.ReactNode {
  return SLUG_ICON_MAP[slug] || <Layers size={size} />;
}

export function SupplierList() {
  const { t } = useTranslation();
  const [urlParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(urlParams.get('search') || '');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);
  const [sidebarHover, setSidebarHover] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const ITEMS_PER_PAGE = 10;

  // Fetch categories from API
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

  // Filter to L1 categories only (no parentId)
  const categories = useMemo(() => {
    return allCategories.filter((c: any) => !c.parentId);
  }, [allCategories]);

  const selectedCategory = useMemo(() => {
    return categories.find((c: any) => c.slug === selectedCategorySlug);
  }, [categories, selectedCategorySlug]);

  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(true);
      const fields = [
        'id', 'logo', 'companyName',
        'status', 'supplierType', 'website'
      ];
      const relations = [
        'categories', 'addresses', 'channels'
      ];

      try {
        const queryParams = new URLSearchParams();
        if (selectedCategorySlug) {
          queryParams.append('categorySlug', selectedCategorySlug);
        }
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        queryParams.append('page', String(currentPage));
        queryParams.append('limit', String(ITEMS_PER_PAGE));

        queryParams.set('fields', fields.join(','))
        queryParams.set('include', relations.join(','))

        const res = await api.get(`/suppliers/experimental?${queryParams.toString()}`);
        setSuppliers(res.data.data || []);
        const meta = res.data.meta;
        if (meta) {
          setTotalPages(meta.totalPages || 1);
          setTotalSuppliers(meta.total || 0);
        }
      } catch (err) {
        console.error('Failed to fetch suppliers', err);
      } finally {
        setLoading(false);
      }
    }
    
    // Simple debounce approach inside useEffect
    const timeoutId = setTimeout(() => {
      fetchSuppliers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedCategorySlug, searchTerm, currentPage]);

  // Reset page when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategorySlug, searchTerm]);

  return (
    <div className="bg-canvas min-h-screen">
      <SEOHead
        title={t('seo_suppliers_title')}
        description={t('seo_suppliers_desc')}
        keywords={t('seo_suppliers_keywords')}
        canonical="/suppliers"
      />

      <div className="flex min-h-[calc(100vh-112px)] relative">
        {/* ═══ Sidebar — Sticky, always visible ═══ */}
        <aside className="hidden lg:flex flex-col bg-canvas border-r border-hairline shrink-0 self-start sticky top-[112px] h-[calc(100vh-112px)] z-30 w-[260px] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center h-12 px-5 border-b border-hairline shrink-0">
            <Menu size={20} className="text-ink-muted shrink-0" />
            <span className="ml-4 text-sm font-normal text-ink whitespace-nowrap" style={{ letterSpacing: '0.16px' }}>
              {t('nganh_hang')}
            </span>
          </div>

          {/* Category items */}
          <nav className="py-3 overflow-y-auto">
            {/* "All" item */}
            <button
              onClick={() => setSelectedCategorySlug(null)}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all duration-150 relative group/item",
                !selectedCategorySlug
                  ? "text-primary bg-surface-1"
                  : "text-ink-muted hover:bg-surface-1 hover:text-ink"
              )}
            >
              {!selectedCategorySlug && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />}
              <Search size={18} className="shrink-0" />
              <span className="text-[13px] font-normal whitespace-nowrap" style={{ letterSpacing: '0.16px' }}>
                Tất cả ngành hàng
              </span>
            </button>

            {categories.map((cat: any, idx: number) => (
              <button
                key={cat.slug || cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-2.5 text-left transition-all duration-150 relative group/item",
                  selectedCategorySlug === cat.slug
                    ? "text-primary bg-surface-1"
                    : "text-ink-muted hover:bg-surface-1 hover:text-ink"
                )}
              >
                {selectedCategorySlug === cat.slug && <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />}
                <span className="shrink-0">{getCategoryIcon(cat.slug)}</span>
                <span className="text-[13px] font-normal whitespace-nowrap truncate" style={{ letterSpacing: '0.16px' }}>
                  {cat.name}
                </span>
              </button>
            ))}
          </nav>

          {/* RFQ Button — pinned near bottom */}
          <div className="mt-auto px-4 py-5 border-t border-hairline">
            <Link
              to="/rfq"
              className="flex items-center justify-center gap-2 w-full bg-primary text-white text-sm font-normal py-3 hover:bg-primary-hover transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              <Send size={16} />
              {t('send_rfq')}
            </Link>
          </div>
        </aside>

        {/* Mobile Filter Button removed — replaced by horizontal category bar */}

        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/50 z-40"
          />
        )}

        {/* Mobile Drawer */}
        <aside
          className={cn(
            "lg:hidden fixed top-0 left-0 bottom-0 w-72 bg-canvas border-r border-hairline z-50 flex flex-col transition-transform duration-200 ease-in-out",
            isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between h-12 px-5 border-b border-hairline shrink-0">
            <span className="font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{t('nganh_hang')}</span>
            <button onClick={() => setIsMobileSidebarOpen(false)} className="text-xs font-normal text-ink-subtle" style={{ letterSpacing: '0.32px' }}>
              {t('close_action')}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            <button
              onClick={() => { setSelectedCategorySlug(null); setIsMobileSidebarOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 px-5 py-3 text-sm font-normal transition-colors text-left",
                !selectedCategorySlug ? "text-primary bg-surface-1" : "text-ink-muted hover:bg-surface-1"
              )}
            >
              <Search size={18} className="shrink-0" />
              Tất cả ngành hàng
            </button>
            {categories.map((cat: any, idx: number) => (
              <button
                key={cat.slug || cat.id}
                onClick={() => { setSelectedCategorySlug(cat.slug); setIsMobileSidebarOpen(false); }}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3 text-sm font-normal transition-colors text-left",
                  selectedCategorySlug === cat.slug ? "text-primary bg-surface-1" : "text-ink-muted hover:bg-surface-1"
                )}
              >
                <span className="shrink-0">{getCategoryIcon(cat.slug, 18)}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* ═══ Main Content Area ═══ */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="px-6 lg:px-10 pt-4 pb-2">
              <nav className="flex items-center gap-2 text-xs text-ink-muted font-normal mb-2" style={{ letterSpacing: '0.16px' }}>
                <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
                <ChevronRight size={12} className="text-hairline" />
                <span className="text-primary font-semibold">{t('suppliers')}</span>
              </nav>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-xl md:text-2xl font-light text-ink" style={{ letterSpacing: 0 }}>
                  {selectedCategory ? selectedCategory.name : t('suppliers')}
                </h1>
                <div className="relative w-full md:w-96 group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-subtle group-focus-within:text-primary transition-colors z-10" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={t('search_suppliers_placeholder')}
                    className="w-full pl-11 pr-4 py-[11px] bg-surface-1 border border-hairline text-sm text-ink placeholder-ink-subtle outline-none focus:border-b-2 focus:border-b-primary transition-all" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  />
                </div>
              </div>
          </div>

          {/* ═══ Mobile Horizontal Category Filter ═══ */}
          <div className="lg:hidden px-4 pb-3 -mt-1">
            <div
              className="flex items-center gap-2 overflow-x-auto pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
            >
              <style>{`.mobile-cat-scroll::-webkit-scrollbar { display: none; }`}</style>
              <button
                onClick={() => setSelectedCategorySlug(null)}
                className={cn(
                  "shrink-0 flex items-center gap-1.5 px-3 py-[7px] text-xs font-medium border transition-all whitespace-nowrap",
                  !selectedCategorySlug
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-ink-muted border-hairline hover:border-primary hover:text-primary"
                )}
                style={{ borderRadius: 0 }}
              >
                <Layers size={14} />
                Tất cả
              </button>
              {categories.map((cat: any) => (
                <button
                  key={cat.slug || cat.id}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3 py-[7px] text-xs font-medium border transition-all whitespace-nowrap",
                    selectedCategorySlug === cat.slug
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-ink-muted border-hairline hover:border-primary hover:text-primary"
                  )}
                  style={{ borderRadius: 0 }}
                >
                  <span className="shrink-0">{getCategoryIcon(cat.slug, 14)}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Supplier List Section */}
          <div className="w-full px-6 lg:px-10 py-4 flex-1 flex flex-col gap-4">

            {loading ? (
              <div className="flex items-center justify-center py-24 flex-1">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : suppliers.length > 0 ? (
              <div className="space-y-5 flex-1">
                {suppliers.map((supplier, index) => (
                  <m.div
                    key={supplier.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ duration: 0.25, delay: Math.min(index, 12) * 0.04 }}
                  >
                    <SupplierCard supplier={supplier} />
                  </m.div>
                ))}
              </div>
             ) : (
              <div className="text-center py-24 flex-1 flex flex-col justify-center items-center">
                <div className="w-16 h-16 bg-surface-1 border border-hairline flex items-center justify-center mx-auto mb-4" style={{ borderRadius: '4px' }}>
                  <Search size={28} className="text-ink-subtle" />
                </div>
                <h3 className="text-xl font-light text-ink mb-2">{t('no_suppliers_found')}</h3>
                <p className="text-ink-muted font-normal max-w-xs mx-auto text-sm" style={{ letterSpacing: '0.16px' }}>{t('no_suppliers_desc')}</p>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 pb-2 border-t border-hairline mt-4">
                <p className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.32px' }}>
                  Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1}–{Math.min(currentPage * ITEMS_PER_PAGE, totalSuppliers)} trong {totalSuppliers} nhà cung cấp
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    className="p-2 text-ink-muted hover:text-primary hover:bg-surface-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | 'dots')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('dots');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((item, idx) =>
                      item === 'dots' ? (
                        <span key={`dots-${idx}`} className="px-2 text-ink-subtle text-sm">…</span>
                      ) : (
                        <button
                          key={item}
                          onClick={() => { setCurrentPage(item as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className={`min-w-[32px] h-8 text-xs font-normal transition-colors ${
                            currentPage === item
                              ? 'bg-primary text-white'
                              : 'text-ink-muted hover:bg-surface-1 hover:text-primary'
                          }`} style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                        >
                          {item}
                        </button>
                      )
                    )}
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    className="p-2 text-ink-muted hover:text-primary hover:bg-surface-1 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
