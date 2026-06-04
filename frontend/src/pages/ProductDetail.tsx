import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, MessageSquare, ChevronRight, MapPin, Loader2, Building2, Clock, Package, Globe, Award, Factory, Users, Calendar, ExternalLink, Heart, Play, Check, Zap } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { ProductCard } from '../components/ProductCard';
import { AuthRequireModal } from '../components/ui/AuthRequireModal';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { SEOHead } from '../components/SEOHead';

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
        <Link to="/products" className="text-primary font-bold underline">Quay lại danh sách</Link>
      </div>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : ['https://picsum.photos/seed/' + product.id + '/600/600'];
  const hasPricing = product.minPrice || product.maxPrice;
  const memberSince = supplier?.createdAt ? new Date(supplier.createdAt).getFullYear() : '2024';

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <SEOHead title={product.name} description={product.description?.substring(0, 160) || product.name} canonical={`/products/${product.id}`} />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <nav className="flex items-center gap-1.5 text-xs text-slate-500">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight size={12} />
            <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
            {product.category && <><ChevronRight size={12} /><Link to={`/products?category=${product.category.slug}`} className="hover:text-primary">{product.category.name}</Link></>}
            <ChevronRight size={12} />
            <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* ═══ HERO: 3-Column Layout ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">

            {/* COL 1: Gallery */}
            <div className="lg:col-span-4 p-5 border-r border-slate-100">
              <div className="aspect-square bg-slate-50 rounded-lg overflow-hidden mb-3 relative group">
                <img src={images[activeImage]} alt={product.name} className="w-full h-full object-contain" />
                <button onClick={handleToggleFavorite} className={cn("absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-md", isFavorite ? "bg-red-500 text-white" : "bg-white/90 text-slate-400 hover:text-red-500")}>
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {images.map((img: string, idx: number) => (
                    <button key={idx} onClick={() => setActiveImage(idx)} className={cn("w-16 h-16 rounded border-2 overflow-hidden shrink-0 transition-all", idx === activeImage ? "border-primary" : "border-transparent hover:border-slate-300")}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Supplier Card — below gallery */}
              <div className="mt-4 border border-slate-200 rounded-lg p-4 bg-white">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden">
                    {supplier?.logo ? <img src={supplier.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={22} className="text-slate-300" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">{supplier?.companyName || 'Nhà cung cấp'}</h3>
                    {supplier?.isVerified && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <ShieldCheck size={10} /> Đã xác minh
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-slate-500 mb-3">
                  <div className="flex items-center gap-2"><Calendar size={12} className="text-slate-400" /> Tham gia từ {memberSince}</div>
                  <div className="flex items-center gap-2"><MapPin size={12} className="text-slate-400" /> {supplier?.city || 'Việt Nam'}</div>
                  <div className="flex items-center gap-2"><Package size={12} className="text-slate-400" /> {supplier?._count?.products || '—'} sản phẩm</div>
                  <div className="flex items-center gap-2"><Star size={12} className="text-amber-400" /> Phản hồi: {supplier?.responseRate || '95'}%</div>
                </div>
                {supplier?.slug && (
                  <Link to={`/suppliers/${supplier.slug}`} className="w-full border border-slate-200 text-slate-600 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5">
                    <ExternalLink size={12} /> Xem hồ sơ doanh nghiệp
                  </Link>
                )}
              </div>
            </div>

            {/* COL 2: Product Info */}
            <div className="lg:col-span-5 p-6 border-r border-slate-100 overflow-y-auto">
              <h1 className="text-xl font-bold text-slate-900 leading-tight mb-1">{product.name}</h1>
              <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
                {product.sku && <span>SKU: {product.sku}</span>}
                {product.category && <><span>•</span><Link to={`/products?category=${product.category.slug}`} className="text-primary hover:underline">{product.category.name}</Link></>}
                {product.brand && <><span>•</span><span>{product.brand}</span></>}
              </div>

              {/* Pricing */}
              {hasPricing ? (
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-lg p-4 mb-4">
                  <div className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Giá tham khảo (FOB)</div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-orange-600">{product.minPrice?.toLocaleString()}</span>
                    {product.maxPrice && product.maxPrice !== product.minPrice && (
                      <span className="text-lg text-orange-400"> - {product.maxPrice?.toLocaleString()}</span>
                    )}
                    <span className="text-sm text-orange-500 font-medium ml-1">{product.currency || 'VND'}/{product.unit || 'cái'}</span>
                  </div>
                  <table className="w-full mt-2 text-xs">
                    <thead><tr className="border-b border-orange-200/50">
                      <th className="text-left py-1 text-orange-500 font-semibold">Số lượng</th>
                      <th className="text-right py-1 text-orange-500 font-semibold">Đơn giá</th>
                    </tr></thead>
                    <tbody className="text-slate-700">
                      <tr className="border-b border-orange-100/50"><td className="py-1">1 - 99 {product.unit || 'cái'}</td><td className="text-right font-semibold">{product.maxPrice?.toLocaleString() || 'Liên hệ'}</td></tr>
                      <tr className="border-b border-orange-100/50"><td className="py-1">100 - 999 {product.unit || 'cái'}</td><td className="text-right font-semibold">{((product.minPrice + product.maxPrice) / 2)?.toLocaleString() || 'Liên hệ'}</td></tr>
                      <tr><td className="py-1">≥ 1000 {product.unit || 'cái'}</td><td className="text-right font-semibold text-orange-600">{product.minPrice?.toLocaleString() || 'Liên hệ'}</td></tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4 text-center">
                  <p className="text-sm text-slate-500 mb-1">Giá sản phẩm này cần liên hệ trực tiếp</p>
                  <p className="text-lg font-bold text-primary">Liên hệ báo giá</p>
                </div>
              )}

              {/* ═══ Dynamic Attribute Selector ═══ */}
              {product.attributes && Object.keys(product.attributes).length > 0 && (
                <div className="mb-4 space-y-3">
                  <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">Lựa chọn sản phẩm</div>
                  {Object.entries(product.attributes).map(([attrName, values]: [string, any]) => (
                    <div key={attrName}>
                      <div className="text-xs font-semibold text-slate-500 mb-1.5">{attrName}</div>
                      <div className="flex flex-wrap gap-2">
                        {(Array.isArray(values) ? values : [values]).map((val: string) => {
                          const isSelected = selectedAttrs[attrName] === val;
                          return (
                            <button key={val} onClick={() => setSelectedAttrs(prev => ({ ...prev, [attrName]: isSelected ? '' : val }))} className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1",
                              isSelected ? "border-primary bg-primary/5 text-primary ring-1 ring-primary/20" : "border-slate-200 text-slate-600 hover:border-primary/40 hover:text-primary"
                            )}>
                              {isSelected && <Check size={12} className="text-primary" />}
                              {val}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ═══ OEM/ODM Customization ═══ */}
              {product.customizations && product.customizations.length > 0 && (
                <div className="mb-4 border border-slate-100 rounded-lg p-3 bg-slate-50/50">
                  <div className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1"><Zap size={12} className="text-primary" /> Khả năng tùy chỉnh</div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    {product.customizations.map((c: string, i: number) => (
                      <span key={i} className="text-xs text-slate-600 flex items-center gap-1"><Check size={11} className="text-emerald-500" /> {c}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* ═══ Quick Info Badges ═══ */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full"><Package size={10} /> MOQ: {product.moq || 1} {product.unit || 'cái'}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full"><Clock size={10} /> Lead Time: {product.leadTime || '15-30 ngày'}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full"><MapPin size={10} /> Xuất xứ: {product.origin || 'Việt Nam'}</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full"><Factory size={10} /> Công suất: {product.productionCapacity || '10,000/tháng'}</span>
              </div>
            </div>

            {/* COL 3: CTA Sticky Panel */}
            <div className="lg:col-span-3 p-5 bg-slate-50/50">
              <div className="lg:sticky lg:top-24 space-y-3">
                <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">Liên hệ ngay</div>
                <button onClick={handleRFQ} className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm">
                  Yêu cầu báo giá
                </button>
                <button onClick={handleContact} className="w-full border-2 border-primary text-primary font-bold py-3 rounded-lg hover:bg-primary/5 transition-colors text-sm flex items-center justify-center gap-2">
                  <MessageSquare size={16} /> Liên hệ nhà cung cấp
                </button>
                <button onClick={handleAddToCart} className="w-full border border-slate-200 text-slate-600 font-medium py-2.5 rounded-lg hover:bg-white transition-colors text-sm">
                  + Thêm vào Giỏ yêu cầu
                </button>

                {/* Quick Summary */}
                <div className="border-t border-slate-200 pt-3 mt-3 space-y-2 text-xs text-slate-500">
                  <div className="flex justify-between"><span>MOQ</span><span className="font-semibold text-slate-800">{product.moq || 1} {product.unit || 'cái'}</span></div>
                  <div className="flex justify-between"><span>Lead Time</span><span className="font-semibold text-slate-800">{product.leadTime || '15-30 ngày'}</span></div>
                  <div className="flex justify-between"><span>Xuất xứ</span><span className="font-semibold text-slate-800">{product.origin || 'Việt Nam'}</span></div>
                  <div className="flex justify-between"><span>Cảng XK</span><span className="font-semibold text-slate-800">{product.port || '—'}</span></div>
                </div>

                {/* Trust badges */}
                <div className="border-t border-slate-200 pt-3 mt-2 space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500"><ShieldCheck size={12} className="text-emerald-500" /> Giao dịch an toàn</div>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500"><Award size={12} className="text-amber-500" /> Đảm bảo chất lượng</div>
                  <div className="flex items-center gap-2 text-[10px] font-medium text-slate-500"><Clock size={12} className="text-blue-500" /> Phản hồi nhanh &lt; 24h</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ Supply Ability Card ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Factory size={16} className="text-primary" /> Năng lực cung ứng
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'MOQ', value: `${product.moq || 1} ${product.unit || 'cái'}` },
              { label: 'Công suất/tháng', value: product.productionCapacity || '10,000 units' },
              { label: 'Lead Time', value: product.leadTime || '15-30 ngày' },
              { label: 'Cảng xuất khẩu', value: product.port || 'Hồ Chí Minh' },
              { label: 'Thị trường XK', value: product.exportMarkets || 'Toàn cầu' },
            ].map((item, i) => (
              <div key={i} className="text-center p-3 bg-slate-50 rounded-lg">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-sm font-semibold text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ Certifications ═══ */}
      {supplier?.certifications?.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 mb-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Award size={16} className="text-primary" /> Chứng nhận doanh nghiệp
            </h2>
            <div className="flex flex-wrap gap-3">
              {supplier.certifications.map((cert: any, i: number) => (
                <div key={i} className="flex items-center gap-2.5 border border-emerald-100 bg-emerald-50/40 rounded-lg px-4 py-2.5">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <ShieldCheck size={15} className="text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{cert.name}</div>
                    {cert.issuedBy && <div className="text-[10px] text-slate-500">{cert.issuedBy}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="max-w-[1400px] mx-auto px-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          {/* Tab Headers */}
          <div className="flex border-b border-slate-200 overflow-x-auto">
            {['overview', 'specs', 'company', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={cn(
                "px-6 py-3.5 text-sm font-bold whitespace-nowrap transition-colors border-b-2 -mb-px",
                activeTab === tab ? "text-primary border-primary bg-primary/5" : "text-slate-500 border-transparent hover:text-slate-700"
              )}>
                {{ overview: 'Tổng quan', specs: 'Thông số kỹ thuật', company: 'Doanh nghiệp', reviews: 'Đánh giá' }[tab]}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-3">Mô tả sản phẩm</h3>
                  <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.description || 'Chưa có mô tả.'}</div>
                </div>
                {product.features && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">Ưu điểm sản phẩm</h3>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.features}</div>
                  </div>
                )}
                {product.applications && (
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-3">Ứng dụng</h3>
                    <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{product.applications}</div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-4">Thông số kỹ thuật</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {(product.specifications ? Object.entries(product.specifications) : [
                      ['Xuất xứ', product.origin || 'Việt Nam'],
                      ['Đơn vị', product.unit || 'cái'],
                      ['MOQ', `${product.moq || 1}`],
                      ['Thương hiệu', product.brand || '—'],
                    ]).map(([key, val]: any, i: number) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : ''}>
                        <td className="py-2.5 px-4 font-medium text-slate-700 w-1/3 border border-slate-100">{key}</td>
                        <td className="py-2.5 px-4 text-slate-600 border border-slate-100">{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'company' && supplier && (
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                    {supplier.logo ? <img src={supplier.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={32} className="text-slate-300" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{supplier.companyName}</h3>
                    {supplier.isVerified && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full"><ShieldCheck size={12} /> Đã xác minh</span>}
                    <p className="text-sm text-slate-500 mt-2 leading-relaxed">{supplier.description || 'Chưa có mô tả.'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { icon: Calendar, label: 'Năm thành lập', value: supplier.yearEstablished || memberSince },
                    { icon: Users, label: 'Quy mô', value: supplier.employeeCount || '—' },
                    { icon: MapPin, label: 'Địa chỉ', value: `${supplier.city || ''} ${supplier.province || ''}`.trim() || 'Việt Nam' },
                    { icon: Globe, label: 'Thị trường XK', value: supplier.exportMarkets?.join(', ') || 'Toàn cầu' },
                    { icon: Factory, label: 'Loại hình', value: supplier.businessType || '—' },
                    { icon: Award, label: 'Chứng nhận', value: supplier.certifications?.map((c: any) => c.name).join(', ') || '—' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                      <item.icon size={16} className="text-primary mt-0.5 shrink-0" />
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</div>
                        <div className="text-sm font-medium text-slate-700">{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="text-center py-12">
                <Star size={40} className="text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">Chưa có đánh giá nào cho sản phẩm này.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ═══ Related Products ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <h2 className="text-base font-bold text-slate-900 mb-4">Sản phẩm liên quan</h2>
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {relatedProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Chưa có sản phẩm nào khác từ nhà cung cấp này.</p>
          )}
        </div>
      </div>

      {/* ═══ Category Products ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mb-10">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">Sản phẩm cùng danh mục</h2>
            {product.category && (
              <Link to={`/products?category=${product.category.slug}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight size={14} />
              </Link>
            )}
          </div>
          {categoryProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {categoryProducts.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-8">Chưa có sản phẩm nào cùng danh mục.</p>
          )}
        </div>
      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
