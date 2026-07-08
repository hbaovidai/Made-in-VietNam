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
        if (p.categoryId) { try { const c = await api.get(`/products?categoryId=${p.categoryId}&limit=6`); setCategoryProducts((c.data.data || []).filter((x: any) => x.id !== p.id).slice(0, 5)); } catch {} }
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
    navigate(user.role === 'SUPPLIER' ? '/dashboard/supplier/messages' : '/dashboard/buyer/messages');
  };

  const handleAddToCart = async () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để thêm vào Giỏ yêu cầu.'); setIsAuthModalOpen(true); return; }
    try { await api.post('/cart/items', { productId: product.id, quantity: 1 }); addToast({ type: 'success', title: 'Thành công', message: 'Đã thêm vào Giỏ yêu cầu' }); } catch { addToast({ type: 'error', title: 'Lỗi', message: 'Không thể thêm' }); }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy sản phẩm</h2>
        <Link to="/products" className="text-primary font-bold underline">{t('product_back_to_list')}</Link>
      </div>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : ['https://picsum.photos/seed/' + product.id + '/600/600'];
  const hasPricing = product.minPrice || product.maxPrice;
  const memberSince = supplier?.createdAt ? new Date(supplier.createdAt).getFullYear() : '2024';

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <SEOHead title={product.name} description={product.description?.substring(0, 160) || product.name} canonical={`/products/${product.id}`} />

      {/* Main Container */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* Breadcrumb - Small, light gray-blue, chevron separators */}
        <nav className="flex items-center flex-wrap gap-1.5 text-[11px] text-slate-500 mb-4">
          <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
          <ChevronRight size={10} className="text-slate-400" />
          <Link to="/products" className="hover:text-primary transition-colors">{t('supplier_products_tab')}</Link>
          {product.category && (
            <>
              <ChevronRight size={10} className="text-slate-400" />
              <Link to={`/products?category=${product.category.slug}`} className="hover:text-primary transition-colors">
                {product.category.name}
              </Link>
            </>
          )}
          <ChevronRight size={10} className="text-slate-400" />
          <span className="text-slate-800 font-semibold truncate max-w-[250px]">{product.name}</span>
        </nav>

        {/* Two-Column Grid: Left (50% lg:col-span-6), Right (50% lg:col-span-6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* LEFT COLUMN: Gallery & Supplier Card */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Gallery Card */}
            <div className="bg-white border border-slate-300 rounded-xl p-5">
              <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-4 relative group flex items-center justify-center">
                <img src={images[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain" />
                <button
                  onClick={handleToggleFavorite}
                  className={cn(
                    "absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-lg",
                    isFavorite ? "bg-red-500 text-white" : "bg-white/95 text-slate-400 hover:text-red-500"
                  )}
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
                          "aspect-square rounded-lg border-2 overflow-hidden relative flex items-center justify-center bg-slate-50 transition-all",
                          isActive ? "border-primary ring-1 ring-primary/20" : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        {isLast ? (
                          <div className="absolute inset-0 bg-slate-100 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-primary">+{images.length - 4}</span>
                            <span className="text-[10px] font-medium text-slate-500">Ảnh</span>
                          </div>
                        ) : (
                          <>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {idx === 1 && (
                              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                                  <Play size={14} className="text-slate-700 fill-slate-700 ml-0.5" />
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
                <span className="text-[10px] font-bold tracking-wider uppercase bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck size={12} /> {t('status_verified')}
                </span>
              </div>

              <h1 className="text-xl lg:text-2xl font-bold text-slate-900 leading-tight mb-2">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                {product.sku && <span>{t('product_sku_label')} <span className="font-semibold text-slate-700">{product.sku}</span></span>}
                <span>|</span>
                <div className="flex items-center gap-1">
                  <Star size={13} className="text-amber-400 fill-amber-400" />
                  <span className="font-bold text-slate-700">4.9/5</span>
                  <span className="text-slate-400">{t('product_orders_count')}</span>
                </div>
              </div>
            </div>

            {/* Price Tiers Card */}
            <div className="bg-white border border-slate-300 rounded-xl p-6">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                {t('product_moq_pricing')}
              </h3>

              {hasPricing ? (
                <div className="grid grid-cols-3 gap-3">
                  {/* Tier 1 */}
                  <button
                    type="button"
                    onClick={() => setRfqQuantity(50)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]",
                      rfqQuantity < 100
                        ? "border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm"
                        : "border-slate-200/70 bg-slate-50/50 hover:border-slate-300"
                    )}
                  >
                    <div className="text-[10px] font-medium text-slate-500 mb-1">
                      1 - 99 {product.unit || 'cái'}
                    </div>
                    <div className="text-sm lg:text-base font-bold text-primary">
                      {(product.maxPrice || product.minPrice)?.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {product.currency || 'VND'}
                    </div>
                  </button>

                  {/* Tier 2 */}
                  <button
                    type="button"
                    onClick={() => setRfqQuantity(500)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]",
                      rfqQuantity >= 100 && rfqQuantity < 1000
                        ? "border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm"
                        : "border-slate-200/70 bg-slate-50/50 hover:border-slate-300"
                    )}
                  >
                    <div className="text-[10px] font-medium text-slate-500 mb-1">
                      100 - 999 {product.unit || 'cái'}
                    </div>
                    <div className="text-sm lg:text-base font-bold text-primary">
                      {Math.round((product.minPrice + (product.maxPrice || product.minPrice)) / 2)?.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {product.currency || 'VND'}
                    </div>
                  </button>

                  {/* Tier 3 */}
                  <button
                    type="button"
                    onClick={() => setRfqQuantity(1000)}
                    className={cn(
                      "p-3 rounded-lg border text-center transition-all cursor-pointer hover:scale-[1.03] active:scale-[0.98]",
                      rfqQuantity >= 1000
                        ? "border-primary bg-primary/5 ring-1 ring-primary/10 shadow-sm"
                        : "border-slate-200/70 bg-slate-50/50 hover:border-slate-300"
                    )}
                  >
                    <div className="text-[10px] font-medium text-slate-500 mb-1">
                      ≥ 1,000 {product.unit || 'cái'}
                    </div>
                    <div className="text-sm lg:text-base font-bold text-primary">
                      {product.minPrice?.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400">
                      {product.currency || 'VND'}
                    </div>
                  </button>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 border-dashed rounded-lg p-6 text-center">
                  <p className="text-xs text-slate-500 font-medium">
                    Chưa có bảng giá theo số lượng
                  </p>
                </div>
              )}
            </div>

            {/* RFQ Form Card */}
            <div className="bg-white border border-slate-300 rounded-xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-4">
                {t('create_rfq')}
              </h3>
              <form onSubmit={handleLocalRFQSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('expected_quantity')}
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(Number(e.target.value) || 1)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {t('requirements')}
                  </label>
                  <textarea
                    rows={4}
                    value={rfqMessage}
                    onChange={(e) => setRfqMessage(e.target.value)}
                    placeholder={t('rfq_placeholder')}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 placeholder:text-slate-400"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  <button
                    type="submit"
                    className="bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Send size={15} /> {t('send_rfq')}
                  </button>
                  <button
                    type="button"
                    onClick={handleContact}
                    className="border border-primary text-primary font-bold py-3 px-4 rounded-lg hover:bg-primary/5 transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    <MessageSquare size={15} /> {t('chat_with_supplier')}
                  </button>
                </div>
              </form>
            </div>

          </div>

        </div>

        {/* Tabbed Info Section */}
        <div className="mt-8 bg-white border border-slate-300 rounded-xl overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-100 overflow-x-auto bg-slate-50/50">
            {[
              { id: 'overview', name: t('tab_description') },
              { id: 'certs', name: t('tab_certifications') },
              { id: 'company', name: t('tab_supplier_info') }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px",
                  activeTab === tab.id
                    ? "text-primary border-primary bg-primary/[0.03]"
                    : "text-slate-500 border-transparent hover:text-slate-700"
                )}
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
                  <h3 className="text-base font-bold text-slate-900 mb-3">{t('product_description_section')}</h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                    {product.description || 'Chưa có mô tả.'}
                  </div>
                </div>

                {/* Technical Specifications inside Specifications Tab */}
                <div className="border-t border-slate-100 pt-6">
                  <h3 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4">
                    {t('product_specifications_section')}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(product.specifications ? Object.entries(product.specifications) : [
                      [t('spec_origin'), product.origin || t('vietnam')],
                      [t('spec_unit'), product.unit || t('spec_unit_piece')],
                      [t('spec_moq'), `${product.moq || 1}`],
                      [t('spec_brand'), product.brand || '—'],
                    ]).map(([key, val]: any, i: number) => (
                      <div key={i} className="flex justify-between items-center py-2 px-3 border-b border-slate-100 text-sm">
                        <span className="font-medium text-slate-500">{key}</span>
                        <span className="font-semibold text-slate-800">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certs' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 mb-2">{t('product_business_certs')}</h3>
                {supplier?.certifications?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {supplier.certifications.map((cert: any, i: number) => (
                      <div key={i} className="flex items-center gap-3 border border-emerald-100 bg-emerald-50/40 rounded-lg p-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                          <ShieldCheck size={16} className="text-emerald-600" />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-slate-900">{cert.name}</div>
                          {cert.issuedBy && <div className="text-[10px] text-slate-500">{cert.issuedBy}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-slate-400 text-sm">
                    {t('supplier_no_certs')}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'company' && supplier && (() => {
              const memberSinceYear = supplier.yearEstablished || (supplier.createdAt ? new Date(supplier.createdAt).getFullYear() : 2024);
              const verifiedYears = new Date().getFullYear() - memberSinceYear;
              const supplierLocation = supplier.streetAddress || supplier.address
                ? `${supplier.streetAddress || supplier.address}${supplier.city ? `, ${supplier.city}` : ''}${supplier.province ? `, ${supplier.province}` : ''}`
                : (supplier.city ? `${supplier.city}, ${supplier.province || ''}` : t('vietnam'));
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
                    <h3 className="text-lg font-extrabold text-[#1a2e4a] mb-2 leading-snug">
                      {supplier.companyName}
                    </h3>
                    {supplier.status === SupplierStatus.VERIFIED && (
                      <div className="flex items-center gap-1.5 text-sm text-emerald-600 font-bold mb-5">
                        <ShieldCheck size={16} className="shrink-0" />
                        <span>{t('verified_supplier_years')} ({verifiedYears} {t('years_count')})</span>
                      </div>
                    )}

                    <div className="divide-y divide-slate-100">
                      {[
                        { label: t('tax_code_label'), value: supplier.taxCode || '—' },
                        { label: t('office_address'), value: supplierLocation },
                        { label: t('factory_address'), value: supplier.factoryAddress || supplierLocation },
                        { label: t('contact_email'), value: supplier.companyEmail || supplier.user?.email || '—', isEmail: true },
                        { label: t('hotline'), value: supplier.companyPhone || '—' },
                      ].map((row, i) => (
                        <div key={i} className="flex flex-col sm:flex-row py-3.5 gap-1 sm:gap-0">
                          <span className="text-sm text-slate-400 font-medium sm:w-[140px] shrink-0">{row.label}</span>
                          {row.isEmail ? (
                            <a href={`mailto:${row.value}`} className="text-sm text-primary font-bold hover:underline break-all">{row.value}</a>
                          ) : (
                            <span className="text-sm text-slate-900 font-bold">{row.value}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ── Right Column: Sales Channels + Short Intro ── */}
                  <div className="space-y-6">
                    {/* Sales & Communication Channels */}
                    <div>
                      <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-3">
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
                              className="inline-flex items-center gap-2 px-4 py-2 rounded-md text-white text-xs font-bold shadow-sm hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: bg }}
                            >
                              <ExternalLink size={13} />
                              {ch.name}
                            </a>
                          );
                        })}
                      </div>
                    </div>

                    {/* Short Introduction */}
                    <div className="bg-slate-50 border-l-4 border-primary rounded-r-lg p-5">
                      <h4 className="text-sm font-extrabold text-slate-800 italic mb-2">
                        {t('short_intro')}
                      </h4>
                      <p className="text-sm text-slate-600 leading-relaxed">
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
        <div className="mt-8 bg-white border border-slate-300 rounded-xl p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">{t('product_similar_items')}</h2>
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
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-300 flex flex-col h-full"
                  >
                    {/* Image — 60% height */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                      <img
                        src={rpImage}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="p-3.5 flex flex-col flex-1">
                      {/* Product Name — bold, 2 lines max */}
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug mb-2">
                        {rp.name}
                      </h3>

                      {/* Price — prominent, dark blue */}
                      <p className="text-base font-extrabold text-[#0f2a4a] mb-1">
                        {rpPrice}
                      </p>

                      {/* MOQ */}
                      {rpMoq && (
                        <p className="text-xs text-slate-500 mb-auto">
                          MOQ: <span className="font-semibold text-slate-600">{rpMoq}</span>
                        </p>
                      )}

                      {/* Supplier — with separator */}
                      {rpSupplier && (
                        <div className="mt-3 pt-2.5 border-t border-slate-100">
                          <p className="text-[11px] text-slate-400 truncate">
                            Nhà cung cấp: <span className="font-medium text-slate-500">{rpSupplier}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 text-sm">
              Chưa có sản phẩm tương tự
            </div>
          )}
        </div>

      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
