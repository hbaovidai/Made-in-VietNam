import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, MessageSquare, ShoppingCart, Share2, Heart, ChevronRight, Check, Info, Award, Globe, MapPin, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../utils/cn';
import { ProductCard } from '../components/ProductCard';
import { api } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/ui/Toast';
import { products as mockProducts } from '../data/mockData';

export function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [supplier, setSupplier] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeImage, setActiveImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const { addToast } = useToast();

  const handleToggleFavorite = async () => {
    if (!user) {
      addToast({ type: 'error', title: 'Thông báo', message: 'Vui lòng đăng nhập để lưu sản phẩm' });
      return;
    }
    
    try {
      if (isFavorite) {
        await api.delete(`/users/${user.id}/saved/${product.id}`);
        setIsFavorite(false);
        addToast({ type: 'success', title: 'Thành công', message: 'Đã bỏ lưu sản phẩm' });
      } else {
        await api.post(`/users/${user.id}/saved`, { productId: product.id });
        setIsFavorite(true);
        addToast({ type: 'success', title: 'Thành công', message: 'Đã lưu sản phẩm' });
      }
    } catch (e) {
      console.error(e);
      addToast({ type: 'error', title: 'Lỗi', message: 'Không tìm thấy ID thực để lưu' });
    }
  };

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const prodRes = await api.get(`/products/${id}`);
        const p = prodRes.data;
        setProduct(p);

        if (p.supplierId) {
          try {
            const suppRes = await api.get(`/suppliers/${p.supplierId}`);
            setSupplier(suppRes.data);
          } catch (e) {
            console.error('Failed to load supplier detail:', e);
          }
        }

        try {
          const relatedRes = await api.get(`/products?category=${p.category?.slug || ''}&limit=4`);
          setRelatedProducts(relatedRes.data.data?.filter((ri: any) => ri.id !== id) || []);
        } catch (e) {
          console.error('Failed to load related products:', e);
        }

        // Record View History if user is logged in
        if (user?.id) {
          try {
            await api.post(`/users/${user.id}/history`, { productId: p.id });
          } catch (e) {
            console.error('Error recording view history:', e);
          }
        }
      } catch (err) {
        console.error('Failed to load product details from API', err);
        // Fallback to mockData
        const p = mockProducts.find(x => x.id === id);
        if (p) {
          setProduct({ ...p, moqUnit: 'unit', slug: 'mock-slug' });
          setRelatedProducts(mockProducts.filter(x => x.id !== id).slice(0, 4));
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id, user]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">{t('product_not_found')}</h2>
          <Link to="/products" className="text-primary font-bold underline">{t('back_to_products')}</Link>
        </div>
      </div>
    );
  }

  // Generate Fake Premium Tiers
  const tier1Price = product.maxPrice;
  const tier2Price = product.price || ((product.minPrice + product.maxPrice) / 2).toFixed(2);
  const tier3Price = product.minPrice;
  const moqBaseline = product.moq || 500;

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-1 sm:gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest overflow-x-auto no-scrollbar">
          <Link to="/" className="hover:text-primary shrink-0">{t('marketplace', 'MARKETPLACE')}</Link>
          <ChevronRight size={10} className="shrink-0" />
          <Link to="/products" className="hover:text-primary shrink-0">{t(product.category?.name || 'TEXTILES')}</Link>
          <ChevronRight size={10} className="shrink-0" />
          <span className="text-slate-900 font-bold truncate max-w-[120px] sm:max-w-none">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column: Gallery */}
          <div className="space-y-4">
            <div className="aspect-[4/5] bg-[#F4F1E9] overflow-hidden relative group">
              <img
                src={product.images?.[activeImage] || 'https://images.unsplash.com/photo-1596452290466-9a250325d0c7?q=80&w=2000&auto=format&fit=crop'}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-6 left-6 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-widest text-slate-800 px-4 py-2 flex items-center gap-2 shadow-sm">
                <Star size={12} className="text-amber-500 fill-amber-500" />
                PREMIUM ECO-MATERIAL
              </div>
              <button
                onClick={handleToggleFavorite}
                className={cn(
                  "absolute top-6 right-6 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-all",
                  isFavorite ? "text-red-500" : "text-slate-400 hover:text-red-500"
                )}
              >
                <Heart size={18} className={isFavorite ? "fill-red-500" : ""} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {(product.images?.length > 0 ? product.images : [
                'https://images.unsplash.com/photo-1596452290466-9a250325d0c7?q=80&w=300&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=300&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1584282431713-79cd175113eb?q=80&w=300&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1620799139886-fca5907def6c?q=80&w=300&auto=format&fit=crop'
              ]).slice(0, 4).map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square overflow-hidden relative group outline-none",
                    activeImage === idx ? "ring-2 ring-slate-900" : ""
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  {idx === 3 && product.images?.length > 4 && (
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white font-bold text-sm">
                      +{product.images.length - 4}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Info */}
          <div className="space-y-10">
            {/* Header */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0F172A] leading-[1.1] tracking-tight mb-4">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest flex-wrap">
                <span className="text-[#A2875E]">{supplier?.companyName || 'VietVibe Garment Factory'}</span>
                <span className="w-1 h-1 bg-slate-300 rounded-full mx-1"></span>
                <span>SKU: {product.slug || 'VT-OC-250-TW'}</span>
              </div>
            </div>

            {/* Pricing Tiers */}
            <div className="flex bg-slate-50 border border-slate-100 p-1">
              <div className="flex-1 text-center py-4 px-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{moqBaseline}-{moqBaseline*2}{product.moqUnit === 'unit' ? 'U' : 'M'}</div>
                <div className="text-2xl font-black text-slate-900">${tier1Price}</div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1">Per {product.unit || 'Meter'}</div>
              </div>
              <div className="flex-1 text-center py-4 px-2 bg-[#EEF2FC] shadow-sm transform scale-105 border border-blue-100 relative z-10">
                <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest mb-1">{moqBaseline*2}-{moqBaseline*10}{product.moqUnit === 'unit' ? 'U' : 'M'}</div>
                <div className="text-2xl font-black text-slate-900">${tier2Price}</div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1">Per {product.unit || 'Meter'}</div>
              </div>
              <div className="flex-1 text-center py-4 px-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{moqBaseline*10}{product.moqUnit === 'unit' ? 'U' : 'M'}+</div>
                <div className="text-2xl font-black text-slate-900">${tier3Price}</div>
                <div className="text-[9px] text-slate-400 uppercase font-bold tracking-wider mt-1">Per {product.unit || 'Meter'}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link to={`/rfq?product=${product.id}`} className="w-full flex items-center justify-center gap-2 bg-[#021833] text-white py-4 sm:py-5 font-bold hover:bg-[#0A2645] transition-colors uppercase tracking-widest text-xs md:text-sm">
                Request Quote <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </Link>
              <a 
                href={`https://zalo.me/${supplier?.phone?.replace(/\D/g, '') || ''}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#0068FF] text-white py-4 font-bold hover:bg-[#0055DD] transition-colors uppercase tracking-widest text-xs rounded-lg"
              >
                Liên hệ qua Zalo <MessageSquare size={14} />
              </a>
              <a 
                href={`mailto:${supplier?.email || ''}`}
                className="w-full flex items-center justify-center gap-2 bg-white border border-[#021833] text-[#021833] py-4 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs rounded-lg"
              >
                Gửi Email <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>

            {/* Tech Specs */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-900">Technical Specifications</h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Material</div>
                  <div className="text-sm font-bold text-slate-800">100% Organic Cotton</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Weight</div>
                  <div className="text-sm font-bold text-slate-800">250 GSM</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Width</div>
                  <div className="text-sm font-bold text-slate-800">150cm</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">MOQ</div>
                  <div className="text-sm font-bold text-slate-800">{product.moq} {product.moqUnit || 'Meters'}</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Lead Time</div>
                  <div className="text-sm font-bold text-slate-800">15-20 Days</div>
                </div>
                <div>
                  <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Finish</div>
                  <div className="text-sm font-bold text-slate-800">Natural Matte</div>
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="p-5 bg-[#EEF2FC]/50 border border-blue-50/50 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Award size={16} className="text-[#A2875E]" /> Verified Certifications
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="bg-white border border-slate-200 px-3 py-1.5 text-[9px] font-bold text-slate-700 uppercase tracking-widest">GOTS</span>
                <span className="bg-white border border-slate-200 px-3 py-1.5 text-[9px] font-bold text-slate-700 uppercase tracking-widest">OEKO-TEX STANDARD 100</span>
                <span className="bg-white border border-slate-200 px-3 py-1.5 text-[9px] font-bold text-slate-700 uppercase tracking-widest">RECYCLED CLAIM STANDARD</span>
              </div>
            </div>

            {/* Supplier Card */}
            <div className="border border-slate-200 p-6 flex flex-col sm:flex-row gap-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 -mr-6 -mt-6 rotate-12 z-0"></div>
              <div className="w-16 h-16 bg-[#021833] text-white flex items-center justify-center font-black text-xl shrink-0 z-10">
                {supplier?.companyName ? supplier.companyName.substring(0, 2).toUpperCase() : 'VV'}
              </div>
              <div className="flex-1 space-y-4 z-10">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">{supplier?.companyName || 'VietVibe Garment Factory'}</h4>
                  <div className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                    <Star size={10} className="fill-amber-600 outline-none" /> VERIFIED GOLD
                  </div>
                </div>
                
                <div className="space-y-2 py-3 border-y border-slate-100">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Experience</span>
                    <span className="font-bold text-slate-900">12 years</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Main Markets</span>
                    <span className="font-bold text-slate-900">Europe, USA</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500 font-medium">Response Rate</span>
                    <span className="font-bold text-slate-900">98% / 2h</span>
                  </div>
                </div>

                <Link to={`/suppliers/${product.supplierId || 'placeholder'}`} className="inline-flex items-center gap-2 text-[10px] font-bold text-[#A2875E] uppercase tracking-widest hover:text-[#8B7047] transition-colors">
                  View Factory Profile <ChevronRight size={14} />
                </Link>
              </div>
            </div>

          </div>
        </div>

        {/* Curated Selection */}
        <div className="mt-20 pt-10 border-t border-slate-200">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] font-bold text-[#A2875E] uppercase tracking-widest mb-1">CURATED SELECTION</div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Related Materials</h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex text-xs font-bold text-slate-900 border-b-2 border-slate-900 pb-0.5 hover:text-primary hover:border-primary transition-colors">
              Explore Marketplace
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.length > 0 ? relatedProducts.slice(0, 4).map((p) => (
              <Link key={p.id} to={`/products/${p.id}`} className="group block">
                <div className="aspect-[4/3] sm:aspect-square bg-slate-100 mb-4 overflow-hidden">
                  <img src={p.images?.[0] || p.image || 'https://images.unsplash.com/photo-1554162402-2826cfbe5fbb?q=80&w=600&auto=format&fit=crop'} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                </div>
                <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{p.name}</h3>
                <div className="text-[10px] text-slate-500 font-medium">
                  MOQ: {p.moq || 300}{p.moqUnit || 'm'} • ${p.price || p.minPrice || '5.20'}/{p.unit || 'm'}
                </div>
              </Link>
            )) : (
              // Fallback cards for visual matching
              [
                { img: 'https://images.unsplash.com/photo-1620799139507-2a76f79a2f4d?q=80&w=400&auto=format&fit=crop', name: 'Sustainable Bamboo Poplin', moq: '300m', price: '$5.20' },
                { img: 'https://images.unsplash.com/photo-1596452290466-9a250325d0c7?q=80&w=400&auto=format&fit=crop', name: 'Recycled Polyester Blend', moq: '1000m', price: '$3.45' },
                { img: 'https://images.unsplash.com/photo-1584282431713-79cd175113eb?q=80&w=400&auto=format&fit=crop', name: 'Premium Hemp Canvas', moq: '200m', price: '$7.80' },
                { img: 'https://images.unsplash.com/photo-1550186983-05ecbac0c487?q=80&w=400&auto=format&fit=crop', name: 'Organic Indigo Denim', moq: '500m', price: '$6.10' }
              ].map((fallback, idx) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-square bg-slate-100 mb-4 overflow-hidden">
                    <img src={fallback.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mb-1 group-hover:text-primary transition-colors line-clamp-1">{fallback.name}</h3>
                  <div className="text-[10px] text-slate-500 font-medium">
                    MOQ: {fallback.moq} • {fallback.price}/m
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
