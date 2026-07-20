import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MessageSquare, ChevronRight, ChevronLeft, MapPin, Loader2, Building2, Clock, Package, Globe, Award, Factory, Users, Calendar, ExternalLink, Heart, Play, Check, Zap, Send, MessageSquareOff, Upload, ThumbsUp, CheckCircle2, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { m } from 'motion/react';
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
  const [selectedTierIdx, setSelectedTierIdx] = useState<number | null>(null);
  
  // Reviews state variables
  const [productReviews, setProductReviews] = useState<any[]>([]);
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [selectedReviewFiles, setSelectedReviewFiles] = useState<File[]>([]);
  const [reviewPreviewUrls, setReviewPreviewUrls] = useState<string[]>([]);
  const [filterRating, setFilterRating] = useState<string>('all');
  const [likedReviews, setLikedReviews] = useState<string[]>([]);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

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
        try { const rev = await api.get(`/reviews/product/${p.id}`); setProductReviews(rev.data || []); } catch {}
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
    const params = new URLSearchParams({
      productId: product.id,
      productName: product.name,
      quantity: String(rfqQuantity),
      ...(product.category?.name && { category: product.category.name }),
      ...(rfqMessage && { message: rfqMessage }),
    });
    navigate(`/rfq?${params.toString()}`);
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

    let initialMessage = `Xin chào ${supplier.companyName}! 👋\nTôi muốn trao đổi về sản phẩm "${product.name}".`;
    if (rfqQuantity !== 1000) {
      initialMessage += `\n📦 Số lượng cần: ${rfqQuantity.toLocaleString()} ${product.unit || 'cái'}`;
    }
    if (rfqMessage.trim()) {
      initialMessage += `\n📝 Yêu cầu: ${rfqMessage.trim()}`;
    }

    window.dispatchEvent(new CustomEvent('open-trade-chat', {
      detail: {
        supplierUserId,
        initialMessage,
      }
    }));
  };

  const handleAddToCart = async () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để thêm vào Giỏ yêu cầu.'); setIsAuthModalOpen(true); return; }
    try { await api.post('/cart/items', { productId: product.id, quantity: 1 }); addToast({ type: 'success', title: 'Thành công', message: 'Đã thêm vào Giỏ yêu cầu' }); } catch { addToast({ type: 'error', title: 'Lỗi', message: 'Không thể thêm' }); }
  };

  const handleReviewFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    
    // Validate file sizes (limit to 5MB)
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(file.name);
      } else {
        validFiles.push(file);
      }
    });

    if (invalidFiles.length > 0) {
      addToast({
        type: 'error',
        title: 'Tập tin quá lớn',
        message: `Các tập tin sau vượt quá giới hạn 5MB: ${invalidFiles.join(', ')}`
      });
    }

    if (validFiles.length > 0) {
      setSelectedReviewFiles(prev => [...prev, ...validFiles]);
      const newUrls = validFiles.map(file => URL.createObjectURL(file));
      setReviewPreviewUrls(prev => [...prev, ...newUrls]);
    }
  };

  const removeSelectedReviewFile = (index: number) => {
    setSelectedReviewFiles(prev => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(reviewPreviewUrls[index]);
    setReviewPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleReviewHelpful = async (reviewId: string) => {
    if (likedReviews.includes(reviewId)) return;
    try {
      await api.patch(`/reviews/${reviewId}/helpful`);
      setLikedReviews(prev => [...prev, reviewId]);
      setProductReviews(prev => prev.map(r => r.id === reviewId ? { ...r, helpfulCount: (r.helpfulCount || 0) + 1 } : r));
      addToast({ type: 'success', title: 'Cảm ơn', message: 'Bạn đã đánh giá phản hồi này hữu ích.' });
    } catch { /* silent */ }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để viết đánh giá.'); setIsAuthModalOpen(true); return; }
    if (newReviewRating === 0) { addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng chọn số sao đánh giá.' }); return; }
    if (newReviewContent.trim().length < 10) { addToast({ type: 'error', title: 'Lỗi', message: 'Nội dung đánh giá phải có tối thiểu 10 ký tự.' }); return; }
    if (newReviewContent.trim().length > 500) { addToast({ type: 'error', title: 'Lỗi', message: 'Nội dung đánh giá không vượt quá 500 ký tự.' }); return; }

    setSubmittingReview(true);
    try {
      // Upload files first if any
      let uploadedUrls: string[] = [];
      if (selectedReviewFiles.length > 0) {
        for (const file of selectedReviewFiles) {
          const fd = new FormData();
          fd.append('file', file);
          const uploadRes = await api.post('/uploads', fd, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
          if (uploadRes.data?.url) {
            uploadedUrls.push(uploadRes.data.url);
          }
        }
      }

      await api.post('/reviews', {
        productId: product.id,
        rating: newReviewRating,
        content: newReviewContent,
        images: uploadedUrls,
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` }
      });
      addToast({ type: 'success', title: 'Thành công', message: 'Đánh giá của bạn đã được gửi và đang chờ quản trị viên duyệt.' });
      setNewReviewContent('');
      setNewReviewRating(0);
      setSelectedReviewFiles([]);
      reviewPreviewUrls.forEach(url => URL.revokeObjectURL(url));
      setReviewPreviewUrls([]);
    } catch (err: any) {
      console.error('Review submit failed:', err);
      const errMsg = err?.message || err?.response?.data?.message || 'Vui lòng thử lại sau.';
      addToast({ type: 'error', title: 'Lỗi', message: `Không thể gửi đánh giá. Chi tiết: ${errMsg}` });
    } finally {
      setSubmittingReview(false);
    }
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
          
          {/* LEFT COLUMN: Gallery */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-4 lg:self-start">
            
            {/* Gallery Card */}
            <div className="p-0" style={{ borderRadius: 0 }}>
              <div className="bg-surface-1 overflow-hidden mb-4 relative group flex items-center justify-center" style={{ borderRadius: 0, aspectRatio: '1/1', maxHeight: '520px' }}>
                <m.img
                  layoutId={`product-image-${product.id}`}
                  src={images[activeImage]}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />

                {/* Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImage(activeImage === 0 ? images.length - 1 : activeImage - 1)}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white border border-hairline flex items-center justify-center text-ink-muted hover:text-ink transition-all opacity-0 group-hover:opacity-100"
                      style={{ borderRadius: 0 }}
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setActiveImage(activeImage === images.length - 1 ? 0 : activeImage + 1)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 hover:bg-white border border-hairline flex items-center justify-center text-ink-muted hover:text-ink transition-all opacity-0 group-hover:opacity-100"
                      style={{ borderRadius: 0 }}
                    >
                      <ChevronRight size={20} />
                    </button>
                  </>
                )}

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

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-[10px] font-medium px-2 py-0.5" style={{ borderRadius: 0 }}>
                    {activeImage + 1} / {images.length}
                  </div>
                )}
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
                            <img src={img} alt="" className="w-full h-full object-cover" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* RIGHT COLUMN: Product Info, Price Tiers, RFQ Form */}
          <div className="lg:col-span-7 space-y-6">
            
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

            {/* Pricing Card */}
            {(() => {
              const pricingMode = product.pricingMode;
              const priceTiers = product.priceTiers;

              // === CONTACT: Liên hệ để nhận báo giá ===
              if (pricingMode === 'CONTACT') {
                return (
                  <div
                    className="border-2 border-primary p-8 text-center"
                    style={{
                      borderRadius: 0,
                      background: 'linear-gradient(135deg, rgba(31,56,100,0.06) 0%, rgba(31,56,100,0.12) 100%)',
                    }}
                  >
                    <div className="text-3xl font-semibold text-primary mb-3" style={{ letterSpacing: '-0.2px' }}>
                      Liên hệ để nhận báo giá
                    </div>
                    <p className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                      Gửi yêu cầu báo giá hoặc liên hệ trực tiếp nhà cung cấp để được tư vấn giá tốt nhất.
                    </p>
                  </div>
                );
              }

              // === TIERED: Giá theo số lượng ===
              if (pricingMode === 'TIERED' && priceTiers?.length > 0) {
                const colCount = priceTiers.length;
                return (
                  <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
                    <h3 className="text-xs font-semibold text-ink uppercase mb-4" style={{ letterSpacing: '0.5px' }}>
                      {t('product_moq_pricing')}
                    </h3>
                    <div
                      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3"
                    >
                      {priceTiers.map((tier: any, idx: number) => {
                        const isLast = !tier.maxQty;
                        const label = isLast
                          ? `≥ ${tier.minQty.toLocaleString()} ${product.unit || 'cái'}`
                          : `${tier.minQty.toLocaleString()} - ${tier.maxQty.toLocaleString()} ${product.unit || 'cái'}`;
                        const isSelected = selectedTierIdx === idx;

                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedTierIdx(idx);
                              setRfqQuantity(tier.minQty);
                            }}
                            className={cn(
                              "p-4 border text-center transition-all cursor-pointer",
                              isSelected
                                ? "border-2 border-primary bg-primary/5 shadow-sm"
                                : "border-hairline bg-canvas hover:border-primary/40 hover:bg-surface-1"
                            )}
                            style={{ borderRadius: 0 }}
                          >
                            <div className="text-[11px] font-medium text-ink-muted mb-2 uppercase" style={{ letterSpacing: '0.3px' }}>
                              {label}
                            </div>
                            <div className={cn(
                              "text-xl lg:text-2xl font-bold mb-1",
                              isSelected ? "text-primary" : "text-ink"
                            )} style={{ letterSpacing: '-0.2px' }}>
                              {tier.price.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-medium text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
                              {product.currency || 'VND'} / {product.unit || 'cái'}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              // === STANDARD / Legacy: Giá cố định ===
              if (hasPricing) {
                return (
                  <div
                    className="border border-hairline p-8 text-center"
                    style={{
                      borderRadius: 0,
                      background: 'linear-gradient(180deg, rgba(31,56,100,0.03) 0%, rgba(31,56,100,0.08) 100%)',
                    }}
                  >
                    <div className="text-[10px] font-semibold text-ink-muted uppercase tracking-widest mb-3">
                      Đơn giá
                    </div>
                    <div className="text-4xl font-bold text-primary mb-2" style={{ letterSpacing: '-0.5px' }}>
                      {product.minPrice?.toLocaleString()}
                    </div>
                    <div className="text-sm font-medium text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                      {product.currency || 'VND'} / {product.unit || 'cái'}
                    </div>
                  </div>
                );
              }

              return null;
            })()}

            {/* RFQ Form Card */}
            <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
              <h3 className="text-lg font-semibold text-ink mb-4" style={{ letterSpacing: '0.16px' }}>
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
                const rpPriceInfo = (() => {
                  if (rp.pricingMode === 'CONTACT') return { label: 'Liên hệ để báo giá', type: 'contact' };
                  if (rp.pricingMode === 'TIERED' && rp.priceTiers?.length > 0) {
                    const prices = rp.priceTiers.map((t: any) => t.price).filter(Boolean);
                    const min = Math.min(...prices);
                    const max = Math.max(...prices);
                    const c = rp.currency || 'VND';
                    return { label: min === max ? `${min.toLocaleString('vi-VN')} ${c}` : `${min.toLocaleString('vi-VN')} - ${max.toLocaleString('vi-VN')} ${c}`, type: 'tiered' };
                  }
                  if (rp.minPrice != null && rp.maxPrice != null && rp.minPrice !== rp.maxPrice) {
                    return { label: `${rp.minPrice.toLocaleString('vi-VN')} - ${rp.maxPrice.toLocaleString('vi-VN')} ${rp.currency || 'VND'}`, type: 'fixed' };
                  }
                  if (rp.minPrice != null) return { label: `${rp.minPrice.toLocaleString('vi-VN')} ${rp.currency || 'VND'}`, type: 'fixed' };
                  if (rp.maxPrice != null) return { label: `${rp.maxPrice.toLocaleString('vi-VN')} ${rp.currency || 'VND'}`, type: 'fixed' };
                  return { label: 'Liên hệ để báo giá', type: 'contact' };
                })();
                const rpMoq = rp.moq ? `${rp.moq.toLocaleString('vi-VN')} ${rp.moqUnit || rp.unit || 'cái'}` : `1 ${rp.unit || 'cái'}`;
                const rpSupplier = rp.supplier?.companyName || '';

                return (
                  <Link
                    key={rp.id}
                    to={`/products/${rp.slug || rp.id}`}
                    className="group bg-canvas border border-hairline overflow-hidden hover:border-primary transition-colors duration-300 flex flex-col h-full"
                    style={{ borderRadius: 0 }}
                  >
                    {/* Image — square */}
                    <div className="relative aspect-square overflow-hidden bg-surface-1">
                      <img
                        src={rpImage}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    {/* Content — flex column with pinned bottom */}
                    <div className="p-3.5 flex flex-col flex-1">
                      {/* Title zone — fixed min-height for 2 lines */}
                      <h3 className="text-sm font-normal text-ink line-clamp-2 leading-snug min-h-[2.5em]" style={{ letterSpacing: '0.16px' }}>
                        {rp.name}
                      </h3>

                      {/* Spacer pushes bottom zone down */}
                      <div className="flex-1" />

                      {/* Bottom zone — pinned: price, MOQ, supplier */}
                      <div className="mt-2">
                        {/* Price — gray frame */}
                        <div className="bg-slate-50 px-3 py-2.5 mb-2" style={{ borderRadius: 4 }}>
                          <p className="text-sm font-semibold leading-tight text-primary" style={{ letterSpacing: '0.16px' }}>
                            {rpPriceInfo.label}
                          </p>
                        </div>

                        {/* MOQ */}
                        <p className="text-xs text-ink-muted mb-2" style={{ letterSpacing: '0.16px' }}>
                          MOQ: <span className="font-normal text-ink">{rpMoq}</span>
                        </p>

                        {/* Supplier — with separator */}
                        {rpSupplier && (
                          <div className="pt-2.5 border-t border-hairline">
                            <p className="text-[11px] text-ink-subtle line-clamp-2" style={{ letterSpacing: '0.16px' }}>
                              Nhà cung cấp: <span className="font-normal text-ink-muted">{rpSupplier}</span>
                            </p>
                          </div>
                        )}
                      </div>
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

        {/* Reviews Section - Standalone block below Related Products */}
        <div className="mt-8 bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
          <h3 className="text-lg font-normal text-ink mb-6 pb-4 border-b border-hairline">
            {t('product_reviews_label') || 'Đánh giá sản phẩm'}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT COLUMN: Summary & Reviews List */}
            <div className="lg:col-span-7 space-y-6">
              {/* Review Summary Breakdown */}
              <div className="bg-surface-1 border border-hairline p-5">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  {/* Avg score */}
                  <div className="sm:col-span-4 text-center sm:border-r sm:border-hairline sm:pr-6 py-2">
                    <div className="text-5xl font-bold text-ink mb-1">
                      {product.rating || 0}
                    </div>
                    <div className="flex justify-center gap-1 mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={18}
                          fill={star <= Math.round(product.rating || 0) ? '#dba617' : 'none'}
                          color={star <= Math.round(product.rating || 0) ? '#dba617' : '#c3c4c7'}
                        />
                      ))}
                    </div>
                    <div className="text-xs text-ink-muted">
                      {product.reviewCount || 0} {t('reviews') || 'đánh giá công khai'}
                    </div>
                  </div>

                  {/* Histogram rating breakdown */}
                  <div className="sm:col-span-8 space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = productReviews.filter((r) => r.rating === star).length;
                      const pct = productReviews.length > 0 ? (count / productReviews.length) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3 text-xs">
                          <span className="w-10 text-ink-muted text-right">{star} sao</span>
                          <div className="flex-1 bg-surface-2 h-2.5 rounded-full overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="w-12 text-ink-muted text-left">
                            {count} ({Math.round(pct)}%)
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Filter Quick Tags */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: `Tất cả (${productReviews.length})` },
                  { id: 'has_image', label: `Có hình ảnh (${productReviews.filter(r => r.images && r.images.length > 0).length})` },
                  { id: '5', label: `5 Sao (${productReviews.filter(r => r.rating === 5).length})` },
                  { id: '4', label: `4 Sao (${productReviews.filter(r => r.rating === 4).length})` },
                  { id: '3', label: `3 Sao (${productReviews.filter(r => r.rating === 3).length})` },
                  { id: '2', label: `2 Sao (${productReviews.filter(r => r.rating === 2).length})` },
                  { id: '1', label: `1 Sao (${productReviews.filter(r => r.rating === 1).length})` },
                ].map(tag => (
                  <button
                    key={tag.id}
                    onClick={() => setFilterRating(tag.id)}
                    className={cn(
                      "px-3 py-1.5 text-xs transition-colors",
                      filterRating === tag.id
                        ? "bg-primary text-white"
                        : "bg-surface-1 text-ink-muted border border-hairline hover:bg-surface-2"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>

              {/* Reviews List */}
              <div className="space-y-4">
                {productReviews.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center bg-surface-1 border border-hairline">
                    <MessageSquareOff className="text-ink-subtle mb-3" size={48} strokeWidth={1.5} />
                    <p className="text-sm font-medium text-ink mb-1">Chưa có đánh giá nào cho sản phẩm này</p>
                    <p className="text-xs text-ink-muted max-w-sm">Hãy là người đầu tiên gửi đánh giá về chất lượng sản phẩm thực tế!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-hairline">
                    {productReviews
                      .filter((rev) => {
                        if (filterRating === 'all') return true;
                        if (filterRating === 'has_image') return rev.images && rev.images.length > 0;
                        return rev.rating.toString() === filterRating;
                      })
                      .map((rev) => {
                        const initials = rev.authorName ? rev.authorName.charAt(0).toUpperCase() : 'U';
                        const bgColors = [
                          'bg-blue-100 text-blue-700',
                          'bg-emerald-100 text-emerald-700',
                          'bg-amber-100 text-amber-700',
                          'bg-indigo-100 text-indigo-700',
                          'bg-rose-100 text-rose-700'
                        ];
                        const colorIndex = initials.charCodeAt(0) % bgColors.length;
                        const avatarStyle = `w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${bgColors[colorIndex]}`;

                        return (
                          <div key={rev.id} className="py-6 first:pt-0 last:pb-0">
                            {/* Author info row */}
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex items-center gap-3">
                                <div className={avatarStyle}>{initials}</div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-ink">{rev.authorName}</span>
                                    {rev.verifiedPurchase && (
                                      <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5" style={{ borderRadius: 12 }}>
                                        <CheckCircle2 size={10} /> Đã mua hàng
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-0.5 mt-0.5">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        size={12}
                                        fill={star <= rev.rating ? '#dba617' : 'none'}
                                        color={star <= rev.rating ? '#dba617' : '#c3c4c7'}
                                      />
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <span className="text-xs text-ink-subtle">
                                {new Date(rev.createdAt).toLocaleDateString('vi-VN')}
                              </span>
                            </div>

                            {/* Content text */}
                            <p className="text-sm text-ink-muted leading-relaxed whitespace-pre-wrap mt-2 pl-1">
                              {rev.content}
                            </p>

                            {/* Media Attachment Grid */}
                            {rev.images && rev.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mt-3 pl-1">
                                {rev.images.map((imgUrl: string, idx: number) => (
                                  <div
                                    key={idx}
                                    onClick={() => setLightboxImage(imgUrl)}
                                    className="w-20 h-20 bg-surface-1 border border-hairline overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                                  >
                                    <img src={imgUrl} alt="review attachment" className="w-full h-full object-cover" />
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Helpful row */}
                            <div className="flex items-center gap-4 mt-4 pl-1">
                              <button
                                onClick={() => handleReviewHelpful(rev.id)}
                                disabled={likedReviews.includes(rev.id)}
                                className={cn(
                                  "flex items-center gap-1 text-xs transition-colors",
                                  likedReviews.includes(rev.id)
                                    ? "text-primary font-medium"
                                    : "text-ink-subtle hover:text-ink"
                                )}
                              >
                                <ThumbsUp size={12} />
                                Hữu ích ({rev.helpfulCount || 0})
                              </button>
                            </div>

                            {/* Seller response */}
                            {rev.sellerReply && (
                              <div className="ml-10 mt-4 bg-slate-50 border-l-2 border-primary p-4" style={{ borderRadius: 0 }}>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="font-semibold text-xs text-ink uppercase tracking-wider">Phản hồi từ người bán</span>
                                  {rev.sellerRepliedAt && (
                                    <span className="text-[10px] text-ink-subtle">
                                      {new Date(rev.sellerRepliedAt).toLocaleDateString('vi-VN')}
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-ink-muted leading-relaxed whitespace-pre-wrap">
                                  {rev.sellerReply}
                                </p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN: Write a Review Form */}
            <div className="lg:col-span-5 bg-surface-1 border border-hairline p-6 lg:sticky lg:top-6">
              <h4 className="text-base font-semibold text-ink mb-4 pb-2 border-b border-hairline">
                Viết đánh giá của bạn
              </h4>
              {user ? (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-normal text-ink mb-2">
                      Chọn số sao đánh giá:
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const isFilled = hoverRating !== null ? star <= hoverRating : star <= newReviewRating;
                        return (
                          <button
                            key={star}
                            type="button"
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            onClick={() => setNewReviewRating(star)}
                            className="text-amber-500 hover:scale-110 transition-transform"
                          >
                            <Star
                              size={28}
                              fill={isFilled ? '#dba617' : 'none'}
                              color={isFilled ? '#dba617' : '#c3c4c7'}
                            />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-normal text-ink mb-1.5">
                      Nội dung đánh giá ({newReviewContent.length}/500 ký tự - tối thiểu 10 ký tự):
                    </label>
                    <textarea
                      rows={4}
                      maxLength={500}
                      value={newReviewContent}
                      onChange={(e) => setNewReviewContent(e.target.value)}
                      placeholder="Hãy chia sẻ nhận xét chi tiết của bạn về chất lượng sản phẩm..."
                      className="w-full bg-canvas border border-hairline px-3 py-2 text-sm outline-none focus:border-b-2 focus:border-b-primary placeholder:text-ink-subtle"
                      style={{ borderRadius: 0 }}
                    />
                  </div>

                  {/* Upload attachment area */}
                  <div>
                    <label className="block text-xs font-normal text-ink mb-2">
                      Hình ảnh/video thực tế (Tối đa 5MB mỗi file):
                    </label>
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Select button */}
                      <label className="w-20 h-20 border border-dashed border-hairline hover:border-primary flex flex-col items-center justify-center cursor-pointer transition-colors bg-canvas">
                        <Upload size={20} className="text-ink-subtle" />
                        <span className="text-[10px] text-ink-subtle mt-1">Tải ảnh</span>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleReviewFileChange}
                          className="hidden"
                        />
                      </label>

                      {/* Previews */}
                      {reviewPreviewUrls.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 border border-hairline bg-canvas group">
                          <img src={url} alt="review preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeSelectedReviewFile(idx)}
                            className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-0.5 shadow hover:bg-rose-600 transition-colors"
                          >
                            <X size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingReview || newReviewContent.trim().length < 10}
                    className="w-full bg-primary text-white font-normal py-2.5 hover:bg-primary-hover transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    style={{ borderRadius: 0 }}
                  >
                    {submittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                  </button>
                </form>
              ) : (
                <div className="bg-canvas p-4 border border-hairline text-sm text-ink-muted">
                  Vui lòng{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalMessage('Vui lòng đăng nhập để viết đánh giá.');
                      setIsAuthModalOpen(true);
                    }}
                    className="text-primary font-normal hover:underline"
                  >
                    đăng nhập
                  </button>{' '}
                  để gửi đánh giá của bạn.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxImage && (
          <div
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 cursor-zoom-out"
            onClick={() => setLightboxImage(null)}
          >
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
            <img
              src={lightboxImage}
              alt="fullscreen review attachment"
              className="max-w-full max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
