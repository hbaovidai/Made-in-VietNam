import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Zap, Award, CheckCircle2, MessageSquare, ChevronRight, ChevronLeft, LayoutGrid, Star, Factory, Shield, Loader2, Wrench, Beaker, Shirt, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { CategorySidebar } from '../components/CategorySidebar';
import { SEOHead } from '../components/SEOHead';
import { SupplierCard } from '../components/SupplierCard';
import { api } from '../lib/api';
import { useAppearance } from '../contexts/AppearanceContext';

export function Home() {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { settings: siteSettings } = useAppearance();



  const defaultSlides = [
    { image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", title: "VIEproduct - Nền tảng kết nối thương mại minh bạch & tin cậy", desc: "Hỗ trợ Nhà cung cấp chuyển đổi số hồ sơ doanh nghiệp chuyên nghiệp và Người mua tìm kiếm nguồn hàng chất lượng từ các Nhà cung cấp uy tín nhanh chóng.", link: '/products' },
    { image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200", title: "Tạo hồ sơ số hóa Doanh nghiệp chuyên nghiệp", desc: "Khẳng định sự minh bạch, tăng độ tin cậy với đối tác và nâng cao lợi thế cạnh tranh trên thị trường thông qua hồ sơ Verified Supplier tại VIEproduct.", link: '/register' },
    { image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200", title: t('secured_trading_service'), desc: t('trade_assurance', 'Đảm bảo giao dịch an toàn xuyên quốc gia'), link: '/products' },
  ];

  const heroSlides = React.useMemo(() => {
    try {
      const banners = JSON.parse(siteSettings.hero_banners || '[]');
      const validBanners = banners.filter((b: any) => b.image && b.image.trim() !== '' && b.status !== 'hidden');
      if (validBanners.length > 0) {
        return validBanners.map((b: any) => ({
          image: b.image,
          title: i18n.language?.startsWith('vi') ? (b.titleVi || b.title) : b.title,
          desc: i18n.language?.startsWith('vi') ? (b.descVi || b.desc) : b.desc,
          link: b.link || '/products',
        }));
      }
    } catch {}
    return defaultSlides;
  }, [siteSettings.hero_banners, i18n.language]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, suppRes, catRes] = await Promise.all([
          api.get('/products?limit=3'),
          api.get('/suppliers?limit=5'),
          api.get('/categories')
        ]);
        setProducts(prodRes.data.data);
        setSuppliers(suppRes.data.data);
        setCategories(catRes.data.filter((c: any) => !c.parentId));
      } catch (error) {
        console.error('Home Loading Error:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  // Format price from real DB data
  const formatVND = (n: number) => {
    return n.toLocaleString('vi-VN') + ' ₫';
  };

  const getPriceDisplay = (product: any) => {
    const price = product.minPrice ?? product.price;
    if (price != null) return `${formatVND(price)} / ${product.unit || 'cái'}`;
    return 'Liên hệ báo giá';
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEOHead
        title="Trang chủ"
        description="VIEProduct - Nền tảng B2B kết nối nhà cung cấp Việt Nam uy tín với thị trường toàn cầu. Tìm sản phẩm, nhà sản xuất và dịch vụ thương mại quốc tế."
        canonical="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "VIEProduct",
          "url": "https://vieproduct.com",
          "description": "Nền tảng B2B hàng đầu kết nối nhà cung cấp Việt Nam với thị trường toàn cầu",
          "sameAs": [],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "availableLanguage": ["Vietnamese", "English"]
          }
        }}
      />

      {/* ═══ Hero Banner ═══ */}
      <section>
        <div className="relative group overflow-hidden bg-slate-200 h-[240px] sm:h-[360px] lg:h-[480px]">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-6 sm:px-12 lg:px-16 text-white">
                <motion.div
                  key={`text-${idx}`}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="max-w-2xl space-y-3 sm:space-y-5"
                >
                  <h2 className="text-xl sm:text-3xl lg:text-5xl font-extrabold leading-tight drop-shadow-md">{slide.title}</h2>
                  <p className="text-slate-200 text-xs sm:text-sm leading-relaxed drop-shadow-sm max-w-xl">{slide.desc}</p>
                  
                  <div className="flex flex-wrap gap-3 pt-2">
                    <Link to={slide.link} className="bg-white text-slate-900 px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-slate-100 transition-all shadow-lg flex items-center gap-1.5">
                      {idx === 1 ? 'Đăng ký ngay' : 'Khám phá ngay'} {idx === 1 && <ArrowRight size={14} />}
                    </Link>
                    <Link to="/about" className="border border-white/40 text-white px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-white/10 transition-all">
                      {idx === 1 ? 'Tìm hiểu quy trình' : 'Tìm hiểu thêm'}
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>
          ))}

          {/* Arrow Navigation */}
          <button 
            onClick={prevSlide}
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button 
            onClick={nextSlide}
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slider Dots */}
          <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 rounded-full outline-none ${
                  idx === currentSlide ? 'w-7 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        </div>
      </section>


      {/* ═══ Featured Categories ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900">{t('home_featured_categories')}</h2>
          <Link to="/products" className="text-xs sm:text-sm text-slate-500 hover:text-primary flex items-center gap-1 font-semibold">
            {t('view_more')} <ChevronRight size={14} />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl p-12 text-center">
            <p className="text-sm text-slate-400">{t('home_no_categories')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat, idx) => {
              const imgSrc = `https://picsum.photos/seed/${cat.slug}/400/300`;

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden bg-slate-50 border-b border-slate-100">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center flex-1 flex items-center justify-center">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors line-clamp-2">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>      {/* ═══ Verified Suppliers Section ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-slate-900">{t('home_featured_suppliers')}</h2>
          <Link to="/suppliers" className="text-xs sm:text-sm text-slate-500 hover:text-primary flex items-center gap-1 font-semibold">
            {t('view_more')} <ChevronRight size={14} />
          </Link>
        </div>

        {suppliers.length === 0 ? (
          <div className="bg-white border border-slate-200/80 rounded-xl py-12 text-center text-slate-400 text-sm">
            Chưa có nhà cung cấp nào
          </div>
        ) : (
          <div>
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden overflow-x-auto pb-4">
              <div className="flex gap-4 w-max">
                {suppliers.slice(0, 5).map((supplier, idx) => {
                  const name = supplier.companyName || supplier.name;
                  const location = supplier.location || (supplier.city ? `${supplier.city}, ${supplier.province || ''}` : 'Việt Nam');
                  const industries = supplier.industries 
                    ? supplier.industries.map((i: any) => i.industry) 
                    : (supplier.industry || []);
                  
                  return (
                    <div key={supplier.id} className="w-[280px] shrink-0 bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden shrink-0">
                          {supplier.logo ? (
                            <img src={supplier.logo} alt="" className="w-full h-full object-cover" />
                          ) : (
                            idx % 5 === 0 ? <Factory size={24} className="text-slate-400" /> :
                            idx % 5 === 1 ? <Wrench size={24} className="text-slate-400" /> :
                            idx % 5 === 2 ? <Beaker size={24} className="text-slate-400" /> :
                            idx % 5 === 3 ? <Shirt size={24} className="text-slate-400" /> :
                            <Zap size={24} className="text-slate-400" />
                          )}
                        </div>
                        <h3 className="font-extrabold text-slate-800 text-xs mb-1 uppercase line-clamp-2 h-10 flex items-center justify-center px-1">
                          {name}
                        </h3>
                        <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-3 justify-center">
                          <MapPin size={12} className="shrink-0 text-slate-400" />
                          <span className="truncate max-w-[200px]">{location}</span>
                        </div>
                        <div className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[32px] px-1">
                          <span className="font-bold text-slate-700">{t('home_industry_label')} </span>
                          {industries.join(', ') || 'Đang cập nhật'}
                        </div>
                      </div>
                      <Link
                        to={`/suppliers/${supplier.id}`}
                        className="w-full border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center block"
                      >
                        Xem hồ sơ
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop: Grid */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-5 gap-4">
              {suppliers.slice(0, 5).map((supplier, idx) => {
                const name = supplier.companyName || supplier.name;
                const location = supplier.location || (supplier.city ? `${supplier.city}, ${supplier.province || ''}` : 'Việt Nam');
                const industries = supplier.industries 
                  ? supplier.industries.map((i: any) => i.industry) 
                  : (supplier.industry || []);
                
                return (
                  <div key={supplier.id} className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm flex flex-col justify-between h-full hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden shrink-0">
                        {supplier.logo ? (
                          <img src={supplier.logo} alt="" className="w-full h-full object-cover" />
                        ) : (
                          idx % 5 === 0 ? <Factory size={24} className="text-slate-400" /> :
                          idx % 5 === 1 ? <Wrench size={24} className="text-slate-400" /> :
                          idx % 5 === 2 ? <Beaker size={24} className="text-slate-400" /> :
                          idx % 5 === 3 ? <Shirt size={24} className="text-slate-400" /> :
                          <Zap size={24} className="text-slate-400" />
                        )}
                      </div>
                      <h3 className="font-extrabold text-slate-800 text-xs mb-1 uppercase line-clamp-2 h-10 flex items-center justify-center px-1">
                        {name}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mb-3 justify-center">
                        <MapPin size={12} className="shrink-0 text-slate-400" />
                        <span className="truncate max-w-[150px]">{location}</span>
                      </div>
                      <div className="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[32px] px-1">
                        <span className="font-bold text-slate-700">{t('home_industry_label')} </span>
                        {industries.join(', ') || 'Đang cập nhật'}
                      </div>
                    </div>
                    <Link
                      to={`/suppliers/${supplier.id}`}
                      className="w-full border border-slate-200 text-slate-700 text-xs font-bold py-2 rounded-lg hover:bg-slate-50 hover:border-slate-300 transition-all text-center block"
                    >
                      Xem hồ sơ
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>


      {/* ═══ Register Digital Profile Section ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div 
          className="relative bg-[#0f3460] text-white p-8 sm:p-12 rounded-2xl flex flex-col items-center justify-center overflow-hidden border border-slate-200/5 shadow-inner"
          style={{
            backgroundImage: `radial-gradient(circle at 10% 20%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 8%, transparent 8%, transparent 92%), radial-gradient(circle at 90% 80%, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.03) 8%, transparent 8%, transparent 92%)`,
            backgroundSize: '24px 24px'
          }}
        >
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white mb-6 border border-white/10 shadow-inner">
            <ShieldCheck size={26} />
          </div>
          
          <h2 className="text-xl sm:text-3xl font-extrabold text-white text-center mb-3 tracking-tight max-w-2xl leading-tight">
            Tạo hồ sơ số hóa Doanh nghiệp chuyên nghiệp
          </h2>
          
          <p className="text-slate-200/90 text-xs sm:text-sm max-w-2xl text-center mb-8 leading-relaxed">
            {t('home_verified_cta_text')} <span className="font-bold text-white">Verified Supplier</span> tại VIEproduct.
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link to="/register" className="bg-white text-[#0f3460] px-6 py-3 rounded-full text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-2 shadow-lg shadow-black/10">
              Đăng ký ngay <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="border border-white/20 hover:border-white/40 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-white/5 transition-all">
              Tìm hiểu quy trình
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
