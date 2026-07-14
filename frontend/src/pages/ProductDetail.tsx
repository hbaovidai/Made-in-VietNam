import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MessageSquare, ChevronRight, MapPin, Loader2, Building2, Clock, Package, Globe, Award, Factory, Users, Calendar, ExternalLink, Heart, Play, Check, Zap, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { AuthRequireModal } from '../components/ui/AuthRequireModal';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { SEOHead } from '../components/SEOHead';
import { SupplierStatus } from '../lib/enums';
import { parseMarkdownToHtml } from '../utils/markdown';

export function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [product, setProduct] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [categoryProducts, setCategoryProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');
  const [selectedAttrs, setSelectedAttrs] = useState<Record<string, string>>({});
  const [rfqQuantity, setRfqQuantity] = useState(1000);
  const [rfqMessage, setRfqMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prodRes = await api.get(`/products/${id}`);
        const p = prodRes.data;
        setProduct(p);
        if (p.supplierId) {
          try { const s = await api.get(`/suppliers/${p.supplierId}`); setSupplier(s.data); } catch {}
        }
        try { const r = await api.get(`/products/${p.id}/related`); setRelatedProducts(r.data || []); } catch {}
        if (p.category?.slug) { try { const c = await api.get(`/products?category=${p.category.slug}&limit=6`); setCategoryProducts((c.data.data || []).filter((x: any) => x.id !== p.id).slice(0, 5)); } catch {} }
        if (user?.id) { try { await api.post(`/users/${user.id}/history`, { productId: p.id }); } catch {} }
      } catch {
        setProduct(null);
      } finally { setLoading(false); }
    }
    if (id) loadData();
  }, [id, user]);

  const handleToggleFavorite = async () => {
    if (!user) { addToast({ type: 'error', title: 'Thông báo', message: 'Vui lòng đăng nhập' }); return; }
    try {
      if (isFavorite) { await api.delete(`/users/${user.id}/saved/${product.id}`); setIsFavorite(false); }
      else { await api.post(`/users/${user.id}/saved`, { productId: product.id }); setIsFavorite(true); }
    } catch {}
  };

  const handleRFQ = () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để gửi Yêu cầu Báo giá.'); setIsAuthModalOpen(true); return; }
    navigate(`/rfq?productId=${product.id}&productName=${encodeURIComponent(product.name)}`);
  };

  const handleLocalRFQSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để gửi Yêu cầu Báo giá.'); setIsAuthModalOpen(true); return; }
    navigate(`/rfq?productId=${product.id}&productName=${encodeURIComponent(product.name)}&quantity=${rfqQuantity}&message=${encodeURIComponent(rfqMessage)}`);
  };

  const handleContact = () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để liên hệ nhà cung cấp.'); setIsAuthModalOpen(true); return; }
    
    if (user.id === supplier?.userId) {
      addToast({ type: 'error', title: 'Thông báo', message: 'Bạn không thể tự trò chuyện với chính mình' });
      return;
    }

    const supplierUserId = supplier?.userId;
    if (!supplierUserId) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không tìm thấy thông tin tài khoản nhà cung cấp' });
      return;
    }

    window.dispatchEvent(new CustomEvent('open-trade-chat', {
      detail: {
        supplierUserId,
        initialMessage: `Xin chào ${supplier.companyName}! 👋 Tôi muốn trao đổi về sản phẩm "${product.name}".`
      }
    }));
  };

  const handleAddToCart = async () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để thêm vào Giỏ yêu cầu.'); setIsAuthModalOpen(true); return; }
    try { await api.post('/cart/items', { productId: product.id, quantity: 1 }); addToast({ type: 'success', title: 'Thành công', message: 'Đã thêm vào Giỏ yêu cầu' }); } catch { addToast({ type: 'error', title: 'Lỗi', message: 'Không thể thêm' }); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-canvas"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-normal text-ink">{t('không tìm thấy sản phẩm')}</h2>
        <Link to="/products" className="text-primary font-normal hover:underline">{t('product_back_to_list')}</Link>
      </div>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : ['https://picsum.photos/seed/' + product.id + '/600/600'];
  const hasPricing = product.minPrice || product.maxPrice;
  const memberSince = supplier?.createdAt ? new Date(supplier.createdAt).getFullYear() : '2024';

  return (
    <div className="bg-canvas min-h-screen pb-16">
      <SEOHead title={product.name} description={product.description?.substring(0, 160) || product.name} canonical={`/products/${product.id}`} />

      {/* Main Container */}
      <div className="max-w-[1600px] mx-auto px-4 py-4">
        {/* Breadcrumb - Small, light gray-blue, chevron separators */}
        <nav className="flex items-center flex-wrap gap-1.5 text-[11px] text-ink-subtle mb-4">
          <Link to="/" className="hover:text-primary transition-colors font-normal" style={{ letterSpacing: '0.16px' }}>Trang chủ</Link>
          <ChevronRight size={10} className="text-hairline" />
          <Link to="/products" className="hover:text-primary transition-colors font-normal" style={{ letterSpacing: '0.16px' }}>{t('supplier_products_tab')}</Link>
          {product.category && (
            <>
              <ChevronRight size={10} className="text-hairline" />
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors font-normal" style={{ letterSpacing: '0.16px' }}>
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={10} className="text-hairline" />
          <span className="text-ink font-normal truncate max-w-[250px]" style={{ letterSpacing: '0.16px' }}>{product.name}</span>
        </nav>

        {/* Two-Column Grid: Left (50% lg:col-span-6), Right (50% lg:col-span-6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Gallery & Supplier Card */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Gallery Card */}
            <div className="bg-canvas border border-hairline p-5" style={{ borderRadius: 0 }}>
              <div className="aspect-square bg-surface-1 overflow-hidden mb-4 relative group flex items-center justify-center" style={{ borderRadius: 0 }}>
                <img src={images[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain" />
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "absolute top-3 right-3 w-10 h-10 flex items-center justify-center transition-colors border border-hairline",
                    isFavorite ? "bg-red-500 text-white" : "bg-surface-1 text-ink-subtle hover:text-red-500"
                  )}
                  style={{ borderRadius: 0 }}
                >
                  <Heart size={20} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {images.slice(0, 5).map((img: string, idx: number) => {
                    const isLast = idx === 4 && images.length > 5;
                    const isActive = idx === activeImage;
                    return (
                      <button
                        key={idx}
                        onClick={() => !isLast && setActiveImage(idx)}
                        className={cn(
                          "aspect-square border overflow-hidden relative flex items-center justify-center bg-surface-1 transition-colors",
                          isActive ? "border-2 border-primary" : "border-hairline hover:border-ink-muted"
                        )}
                        style={{ borderRadius: 0 }}
                      >
                        {isLast ? (
                          <div className="absolute inset-0 bg-surface-2 flex flex-col items-center justify-center">
                            <span className="text-lg font-normal text-primary">+{images.length - 4}</span>
                            <span className="text-[10px] font-normal text-ink-subtle">Ảnh</span>
                          </div>
                        ) : (
                          <>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {idx === 1 && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="w-8 h-8 bg-surface-1/90 flex items-center justify-center" style={{ borderRadius: 0 }}>
                                  <Play size={14} className="text-ink fill-ink ml-0.5" />
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Product Info, Price Tiers, RFQ Form */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Product Info — no card, sits on background */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-normal tracking-wider uppercase bg-surface-2 border border-hairline text-amber-700 px-2 py-0.5 flex items-center gap-1" style={{ borderRadius: 0, letterSpacing: '0.32px' }}>
                  <ShieldCheck size={12} /> {t('status_verified')}
                </span>
              </div>

              <h1 className="text-xl lg:text-2xl font-light text-ink leading-tight mb-2" style={{ letterSpacing: '0.16px' }}>
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-subtle">
                {product.sku && <span style={{ letterSpacing: '0.16px' }}>{t('product_sku_label')} <span className="font-normal text-ink">{product.sku}</span></span>}
                <span className="text-hairline">|</span>
                <div className="flex items-center gap-1" style={{ letterSpacing: '0.16px' }}>
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-normal text-ink">4.9/5</span>
                  <span className="text-ink-subtle">{t('product_orders_count')}</span>
                </div>
              </div>
            </div>

            {/* Price Tiers Card */}
            <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
              <h3 className="text-xs font-normal text-ink-subtle uppercase mb-3" style={{ letterSpacing: '0.32px' }}>
                {t('product_moq_pricing')}
              </h3>

              {hasPricing ? (
                <div className="grid grid-cols-3 gap-3">
                  {/* Tier 1 */}
                  <button
                    type="button"
                    onClick={() => setRfqQuantity(50)}
                    className={cn(
                      "p-3 border text-center transition-colors cursor-pointer",
                      rfqQuantity < 100
                        ? "border-2 border-primary bg-surface-1"
                        : "border-hairline bg-canvas hover:border-ink-muted"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="text-[10px] font-normal text-ink-subtle mb-1" style={{ letterSpacing: '0.16px' }}>
                      1 - 99 {product.unit || 'cái'}
                    </div>
                    <div className="text-sm lg:text-base font-normal text-primary" style={{ letterSpacing: '0.16px' }}>
                      {(product.maxPrice || product.minPrice)?.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                      {product.currency || 'VND'}
                    </div>
                  </button>

                  {/* Tier 2 */}
                  <button
                    type="button"
                    onClick={() => setRfqQuantity(500)}
                    className={cn(
                      "p-3 border text-center transition-colors cursor-pointer",
                      rfqQuantity >= 100 && rfqQuantity < 1000
                        ? "border-2 border-primary bg-surface-1"
                        : "border-hairline bg-canvas hover:border-ink-muted"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="text-[10px] font-normal text-ink-subtle mb-1" style={{ letterSpacing: '0.16px' }}>
                      100 - 999 {product.unit || 'cái'}
                    </div>
                    <div className="text-sm lg:text-base font-normal text-primary" style={{ letterSpacing: '0.16px' }}>
                      {Math.round((product.minPrice + (product.maxPrice || product.minPrice)) / 2)?.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                      {product.currency || 'VND'}
                    </div>
                  </button>

                  {/* Tier 3 */}
                  <button
                    type="button"
                    onClick={() => setRfqQuantity(1000)}
                    className={cn(
                      "p-3 border text-center transition-colors cursor-pointer",
                      rfqQuantity >= 1000
                        ? "border-2 border-primary bg-surface-1"
                        : "border-hairline bg-canvas hover:border-ink-muted"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    <div className="text-[10px] font-normal text-ink-subtle mb-1" style={{ letterSpacing: '0.16px' }}>
                      ≥ 1,000 {product.unit || 'cái'}
                    </div>
                    <div className="text-sm lg:text-base font-normal text-primary" style={{ letterSpacing: '0.16px' }}>
                      {product.minPrice?.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                      {product.currency || 'VND'}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="bg-surface-1 border border-hairline border-dashed p-6 text-center" style={{ borderRadius: 0 }}>
                  <p className="text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>
                    Chưa có bảng giá theo số lượng
                  </p>
                </div>
              )}
            </div>

            {/* RFQ Form Card */}
            <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
              <h3 className="text-base font-normal text-ink mb-4" style={{ letterSpacing: '0.16px' }}>
                {t('create_rfq')}
              </h3>
              <form onSubmit={handleLocalRFQSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-normal text-ink mb-1.5" style={{ letterSpacing: '0.16px' }}>
                    {t('expected_quantity')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(Number(e.target.value) || 1)}
                    className="w-full bg-surface-1 border border-hairline px-3 py-2 text-sm outline-none focus:border-b-2 focus:border-b-primary" style={{ borderRadius: 0 }}
                  />
                </div>

                <div>
                  <label className="block text-xs font-normal text-ink mb-1.5" style={{ letterSpacing: '0.16px' }}>
                    {t('requirements')}
                  </label>
                  <textarea
                    rows={4}
                    value={rfqMessage}
                    onChange={(e) => setRfqMessage(e.target.value)}
                    placeholder={t('rfq_placeholder')}
                    className="w-full bg-surface-1 border border-hairline px-3 py-2 text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle" style={{ borderRadius: 0 }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white font-normal py-3 px-4 hover:bg-primary-hover transition-colors text-sm flex items-center justify-center gap-2"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  >
                    <Send size={15} /> {t('send_rfq')}
                  </button>
                  <button
                    type="button"
                    onClick={handleContact}
                    className="border border-primary text-primary font-normal py-3 px-4 hover:bg-surface-1 transition-colors text-sm flex items-center justify-center gap-2"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  >
                    <MessageSquare size={15} /> {t('chat_with_supplier')}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

        {/* Tabbed Info Section */}
        <div className="mt-8 bg-canvas border border-hairline" style={{ borderRadius: 0 }}>
          {/* Tab Headers */}
          <div className="flex border-b border-hairline overflow-x-auto bg-surface-1">
            {[
              { id: 'overview', name: t('tab_description') },
              { id: 'certs', name: t('tab_certifications') },
              { id: 'company', name: t('tab_supplier_info') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3.5 text-sm font-normal whitespace-nowrap transition-colors border-b-2 -mb-px",
                  activeTab === tab.id
                    ? "text-primary border-primary bg-canvas"
                    : "text-ink-subtle border-transparent hover:text-ink hover:bg-surface-2"
                )}
                style={{ letterSpacing: '0.16px' }}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-normal text-ink mb-3" style={{ letterSpacing: '0.16px' }}>{t('product_description_section')}</h3>
                  <div 
                    className="text-sm text-ink-muted leading-relaxed rich-text-content"
                    dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(product.description) }}
                  />
                </div>

                {/* Technical Specifications inside Specifications Tab */}
                <div className="border-t border-hairline pt-6">
                  <h3 className="text-base font-normal text-ink uppercase mb-4" style={{ letterSpacing: '0.32px' }}>
                    {t('product_specifications_section')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(product.specifications ? Object.entries(product.specifications) : [
                      [t('spec_origin'), product.origin || t('vietnam')],
                      [t('spec_unit'), product.unit || t('spec_unit_piece')],
                      [t('spec_moq'), `${product.moq || 1}`],
                      [t('spec_brand'), product.brand || '—'],
                    ]).map(([key, val]: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 px-3 border-b border-hairline text-sm hover:bg-surface-1">
                        <span className="font-normal text-ink-subtle">{key}</span>
                        <span className="font-normal text-ink">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="space-y-4">
                <h3 className="text-base font-normal text-ink mb-2" style={{ letterSpacing: '0.16px' }}>{t('product_business_certs')}</h3>
                {supplier?.certifications?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supplier.certifications.map((cert: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 border border-hairline bg-surface-1 p-3" style={{ borderRadius: 0 }}>
                        <div className="w-8 h-8 bg-surface-2 border border-hairline flex items-center justify-center shrink-0" style={{ borderRadius: 0 }}>
                          <ShieldCheck size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{cert.name}</div>
                          {cert.issuedBy && <div className="text-[10px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{cert.issuedBy}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-ink-subtle text-sm" style={{ letterSpacing: '0.16px' }}>
                    {t('supplier_no_certs')}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'company' && supplier && (() => {
              const memberSinceYear = supplier.yearEstablished || (supplier.createdAt ? new Date(supplier.createdAt).getFullYear() : 2024);
              const verifiedYears = new Date().getFullYear() - memberSinceYear;

              const primaryRecord = supplier.addresses?.find(record => record.isPrimary);
              const primaryLocation = primaryRecord ? primaryRecord.address : '';

              const channels: { name: string; url?: string; color?: string }[] = Array.isArray(supplier.salesChannels)
                ? supplier.salesChannels
                : [{ name: 'Shopee', color: '#ee4d2d' }, { name: 'Facebook', color: '#1877f2' }, { name: 'Website', color: '#475569' }];
              const colorMap: Record<string, string> = {
                shopee: '#ee4d2d', facebook: '#1877f2', tiktok: '#000000',
                instagram: '#e4405f', website: '#475569', zalo: '#0068ff',
              };

              return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ── Left Column: Company Details ── */}
                  <div>
                    <h3 className="text-lg font-normal text-ink mb-2 leading-snug" style={{ letterSpacing: '0.16px' }}>
                      {supplier.companyName}
                    </h3>
                    {supplier.status === SupplierStatus.VERIFIED && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-normal mb-5" style={{ letterSpacing: '0.16px' }}>
                        <ShieldCheck size={16} className="shrink-0" />
                        <span>{t('verified_supplier_years')} ({verifiedYears} {t('years_count')})</span>
                      </div>
                    )}

                    <div className="divide-y divide-hairline">
                      {[
                        { label: t('tax_code_label'), value: supplier.taxCode || '—' },
                        { label: t('office_address'), value: primaryLocation },
                        { label: t('factory_address'), value: supplier.factoryAddress || primaryLocation },
                        { label: t('contact_email'), value: supplier.companyEmail || supplier.user?.email || '—', isEmail: true },
                        { label: t('hotline'), value: supplier.companyPhone || '—' },
                      ].map((row, i) => (
                        <div key={i} className="flex flex-col sm:flex-row py-3.5 gap-1 sm:gap-0">
                          <span className="text-sm text-ink-subtle font-normal sm:w-[140px] shrink-0" style={{ letterSpacing: '0.16px' }}>{row.label}</span>
                          {row.isEmail ? (
                            <a href={`mailto:${row.value}`} className="text-sm text-primary font-normal hover:underline break-all" style={{ letterSpacing: '0.16px' }}>{row.value}</a>
                          ) : (
                            <span className="text-sm text-ink font-normal" style={{ letterSpacing: '0.16px' }}>{row.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Right Column: Sales Channels + Short Intro ── */}
                  <div className="space-y-6">
                    {/* Sales & Communication Channels */}
                    <div>
                      <h4 className="text-xs font-normal text-ink-subtle uppercase mb-3" style={{ letterSpacing: '0.32px' }}>
                        {t('sales_channels_title')}
                      </h4>
                      <div className="flex flex-wrap gap-2.5">
                        {channels.map((ch) => {
                          const bg = ch.color || colorMap[ch.name.toLowerCase()] || '#475569';
                          return (
                            <a
                              key={ch.name}
                              href={ch.url || supplier.website || '#'}
                              target={ch.url || supplier.website ? '_blank' : undefined}
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 text-white text-xs font-normal transition-opacity hover:opacity-90"
                              style={{ backgroundColor: bg, borderRadius: 0, letterSpacing: '0.16px' }}
                            >
                              <ExternalLink size={13} />
                              {ch.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Short Introduction */}
                    <div className="bg-surface-1 border-l-2 border-primary p-5" style={{ borderRadius: 0 }}>
                      <h4 className="text-sm font-normal text-ink italic mb-2" style={{ letterSpacing: '0.16px' }}>
                        {t('short_intro')}
                      </h4>
                      <p className="text-sm text-ink-muted leading-relaxed" style={{ letterSpacing: '0.16px' }}>
                        {supplier.description || t('no_description')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-8 bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
          <h2 className="text-base font-normal text-ink mb-4" style={{ letterSpacing: '0.16px' }}>{t('product_similar_items')}</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map((rp: any) => {
                const rpImage = rp.images?.[0] || rp.image || 'https://via.placeholder.com/300';
                const rpPrice = (() => {
                  if (rp.minPrice != null && rp.maxPrice != null && rp.minPrice !== rp.maxPrice) {
                    return `${rp.minPrice.toLocaleString('vi-VN')} - ${rp.maxPrice.toLocaleString('vi-VN')} ${rp.currency || 'VND'}`;
                  }
                  if (rp.minPrice != null) return `${rp.minPrice.toLocaleString('vi-VN')} ${rp.currency || 'VND'}`;
                  if (rp.maxPrice != null) return `${rp.maxPrice.toLocaleString('vi-VN')} ${rp.currency || 'VND'}`;
                  return rp.priceRange || 'Liên hệ';
                })();
                const rpMoq = rp.moq ? `${rp.moq.toLocaleString('vi-VN')} ${rp.moqUnit || rp.unit || 'cái'}` : null;
                const rpSupplier = rp.supplier?.companyName || '';

                return (
                  <Link
                    key={rp.id}
                    to={`/products/${rp.slug || rp.id}`}
                    className="group bg-canvas border border-hairline overflow-hidden hover:border-primary transition-colors duration-300 flex flex-col h-full"
                    style={{ borderRadius: 0 }}
                  >
                    {/* Image — 60% height */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-surface-1">
                      <img
                        src={rpImage}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3.5 flex flex-col flex-1">
                      {/* Product Name — bold, 2 lines max */}
                      <h3 className="text-sm font-normal text-ink line-clamp-2 leading-snug mb-2" style={{ letterSpacing: '0.16px' }}>
                        {rp.name}
                      </h3>

                      {/* Price — prominent, dark blue */}
                      <p className="text-base font-normal text-primary mb-1" style={{ letterSpacing: '0.16px' }}>
                        {rpPrice}
                      </p>

                      {/* MOQ */}
                      {rpMoq && (
                        <p className="text-xs text-ink-muted mb-auto" style={{ letterSpacing: '0.16px' }}>
                          MOQ: <span className="font-normal text-ink">{rpMoq}</span>
                        </p>
                      )}

                      {/* Supplier — with separator */}
                      {rpSupplier && (
                        <div className="mt-3 pt-2.5 border-t border-hairline">
                          <p className="text-[11px] text-ink-subtle truncate" style={{ letterSpacing: '0.16px' }}>
                            Nhà cung cấp: <span className="font-normal text-ink-muted">{rpSupplier}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-ink-subtle text-sm" style={{ letterSpacing: '0.16px' }}>
              Chưa có sản phẩm tương tự
            </div>
          )}
        </div>

      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
