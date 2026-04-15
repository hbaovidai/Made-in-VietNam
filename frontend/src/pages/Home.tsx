import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Zap, Award, CheckCircle2, MessageSquare, ChevronRight, ChevronLeft, LayoutGrid, Star, Factory, Shield, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { CategorySidebar } from '../components/CategorySidebar';
import { CATEGORY_GROUPS } from '../data/categories';
import { CategoryCard } from '../components/categories/CategoryCard';
import { SEOHead } from '../components/SEOHead';
import { ProductCard } from '../components/ProductCard';
import { SupplierCard } from '../components/SupplierCard';
import { api } from '../lib/api';

export function Home() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200",
      title: t('vietnam_top_hub'),
      desc: t('source_directly')
    },
    {
      image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200",
      title: t('top_ranking_products', 'Sản phẩm Xếp hạng Hàng đầu'),
      desc: t('verified_status_desc', 'Những nhà cung cấp và sản phẩm đã qua kiểm định')
    },
    {
      image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200",
      title: t('secured_trading_service'),
      desc: t('trade_assurance', 'Đảm bảo giao dịch an toàn xuyên quốc gia')
    }
  ];

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
        const [prodRes, suppRes] = await Promise.all([
          api.get('/products?limit=12'),
          api.get('/suppliers?limit=3')
        ]);
        setProducts(prodRes.data.data);
        setSuppliers(suppRes.data.data);
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
  const getPriceRange = (product: any) => {
    if (product.minPrice != null && product.maxPrice != null) {
      return `$${product.minPrice} - $${product.maxPrice}`;
    }
    if (product.minPrice != null) return `$${product.minPrice}`;
    return 'Contact for price';
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEOHead
        title="Trang chủ"
        description="Made in VietNam - Nền tảng B2B kết nối nhà cung cấp Việt Nam uy tín với thị trường toàn cầu. Tìm sản phẩm, nhà sản xuất và dịch vụ thương mại quốc tế."
      />

      {/* ═══ Top Section: Categories + Banner + Recommendations ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 sm:pt-6">
        <div className="flex gap-6 h-[220px] sm:h-[320px] lg:h-[450px]">
          {/* Left Column: Categories Sidebar — Desktop only */}
          <CategorySidebar />

          {/* Middle Column: Main Banner Carousel */}
          <div className="flex-1 relative group overflow-hidden bg-slate-200 border border-slate-200 rounded-xl sm:rounded-none">
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
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
                  <motion.div
                    key={`text-${idx}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-md space-y-2 sm:space-y-4"
                  >
                    <h2 className="text-xl sm:text-3xl lg:text-4xl font-black leading-tight drop-shadow-md">{slide.title}</h2>
                    <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 sm:line-clamp-none drop-shadow-sm">{slide.desc}</p>
                    <Link to="/products" className="inline-block bg-primary text-white px-5 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20">
                      {t('source_now')}
                    </Link>
                  </motion.div>
                </div>
              </div>
            ))}
            
            {/* Arrow Navigation */}
            <button 
              onClick={prevSlide}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} className="sm:hidden" />
              <ChevronLeft size={24} className="hidden sm:block" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 bg-black/20 hover:bg-black/50 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-20 backdrop-blur-sm"
              aria-label="Next slide"
            >
              <ChevronRight size={20} className="sm:hidden" />
              <ChevronRight size={24} className="hidden sm:block" />
            </button>

            {/* Slider Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`transition-all duration-300 rounded-full outline-none ${
                    idx === currentSlide ? 'w-6 h-2 sm:h-2.5 bg-primary' : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right Column: Recommendations — Desktop XL only */}
          <div className="hidden xl:flex flex-col w-72 bg-white border border-slate-200 shrink-0">
            <div className="px-4 py-3 border-b border-slate-200">
              <span className="font-bold text-slate-800">{t('you_may_like')}</span>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {products.slice(0, 3).map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="flex gap-3 group">
                  <div className="w-16 h-16 bg-slate-100 shrink-0 border border-slate-100 overflow-hidden">
                    <img src={product.images[0] || 'https://via.placeholder.com/150'} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs font-medium text-slate-800 line-clamp-2 group-hover:text-primary">{product.name}</span>
                    <span className="text-[10px] text-slate-400 mt-1">1,200+ {t('products')}</span>
                  </div>
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <Link to="/rfq" className="block w-full text-center py-2 border border-primary text-primary text-sm font-bold hover:bg-blue-50 transition-colors">
                {t('post_your_request_now')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Feature Cards Section ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-4 sm:mt-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          {[
            { icon: <Star className="text-orange-500" size={20} />, title: t('smart_expo'), desc: t('digital_trade_fair') },
            { icon: <Shield className="text-blue-500" size={20} />, title: t('secured_trading'), desc: t('trade_assurance') },
            { icon: <Factory className="text-slate-600" size={20} />, title: t('leading_factory'), desc: t('verified_manufacturers') },
            { icon: <Award className="text-primary" size={20} />, title: t('selected_supplier'), desc: t('top_rated_partners') }
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-3 sm:p-4 border border-slate-200 flex items-center gap-3 sm:gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-50 rounded-full flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 truncate">{item.title}</h4>
                <p className="text-[10px] sm:text-[11px] text-slate-500 truncate">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ Featured Products ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="bg-white border border-slate-200">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">{t('featured_products')}</h2>
            <Link to="/products" className="text-xs sm:text-sm text-slate-500 hover:text-primary flex items-center gap-1">
              {t('view_more')} <ChevronRight size={14} />
            </Link>
          </div>
          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="lg:hidden overflow-x-auto">
            <div className="flex gap-px bg-slate-200 w-max">
              {products.slice(0, 10).map((product) => (
                <Link key={product.id} to={`/products/${product.id}`} className="bg-white p-3 hover:shadow-lg transition-shadow group cursor-pointer w-[160px] sm:w-[200px] shrink-0">
                  <div className="aspect-square bg-slate-50 mb-3 overflow-hidden">
                    <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 mb-1 group-hover:text-primary h-8 sm:h-10">{product.name}</h3>
                  <span className="text-primary font-bold text-xs sm:text-sm">{getPriceRange(product)}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t('min_order')}: {product.moq} {product.unit}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-5 gap-px bg-slate-200">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} onClick={() => window.location.href = `/products/${product.id}`} className="bg-white p-4 hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-square bg-slate-50 mb-4 overflow-hidden">
                  <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-2 group-hover:text-primary h-10">{product.name}</h3>
                <div className="flex flex-col">
                  <span className="text-primary font-bold">{getPriceRange(product)}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{t('min_order')}: {product.moq} {product.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Verified Suppliers Section ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="bg-white border border-slate-200">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-base sm:text-xl font-bold text-slate-900">{t('verified_manufacturers')}</h2>
            <Link to="/suppliers" className="text-xs sm:text-sm text-slate-500 hover:text-primary flex items-center gap-1">
              {t('view_more')} <ChevronRight size={14} />
            </Link>
          </div>
          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="md:hidden overflow-x-auto p-4">
            <div className="flex gap-4 w-max">
              {suppliers.slice(0, 3).map((supplier) => (
                <div key={supplier.id} className="w-[280px] shrink-0">
                  {/* SupplierCard does not exactly match new properties (it used mock properties). We will fix SupplierCard later if it breaks, or map it properly now. For now passing 'supplier' obj. */}
                  <SupplierCard supplier={{
                    ...supplier,
                    name: supplier.companyName,
                    rating: 4.8,
                    responseRate: 98,
                    image: supplier.logo,
                    banner: supplier.banner,
                    products: [] // mock missing field
                  }} />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {suppliers.slice(0, 3).map((supplier) => (
              <SupplierCard key={supplier.id} supplier={{
                ...supplier,
                name: supplier.companyName,
                rating: 4.8,
                responseRate: 98,
                image: supplier.logo,
                banner: supplier.banner,
                products: [] // mock missing field
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Categories of Excellence ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="bg-[#EEF0FF] rounded-2xl p-6 sm:p-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Categories of <span className="text-primary">Excellence</span></h2>
              <p className="text-slate-500 text-sm mt-2 max-w-md">
                Khám phá các ngành sản xuất hàng đầu Việt Nam, tối ưu hóa cho chuỗi cung ứng toàn cầu.
              </p>
            </div>
            <Link to="/products" className="text-sm font-bold text-[#043365] hover:text-primary transition-colors shrink-0">
              Xem tất cả danh mục →
            </Link>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6">
            {[
              { name: 'Nông sản', slug: 'nong-san', icon: '/sectors/agriculture.png' },
              { name: 'Dệt may', slug: 'det-may-may-mac', icon: '/sectors/textiles.png' },
              { name: 'Nội thất', slug: 'noi-that-trang-tri', icon: '/sectors/furniture.png' },
              { name: 'Mỹ nghệ', slug: 'thu-cong-my-nghe', icon: '/sectors/handicrafts.png' },
              { name: 'Điện tử', slug: 'dien-tu', icon: '/sectors/electronics.png' },
              { name: 'F&B', slug: 'thuc-pham-do-uong', icon: '/sectors/food.png' },
            ].map((sector) => (
              <Link
                key={sector.slug}
                to={`/products?category=${sector.slug}`}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center gap-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow">
                  <img src={sector.icon} alt={sector.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-primary transition-colors text-center">{sector.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ RFQ Section ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="bg-slate-900 text-white p-5 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8 rounded-xl sm:rounded-none">
          <div className="space-y-1 sm:space-y-2 text-center md:text-left">
            <h2 className="text-lg sm:text-2xl font-bold">{t('easy_sourcing_rfq')}</h2>
            <p className="text-slate-400 text-xs sm:text-sm">{t('one_request_multiple_quotes')}</p>
          </div>
          <div className="flex gap-3 sm:gap-4 w-full md:w-auto">
            <input type="text" placeholder={t('what_looking_for')} className="flex-1 md:w-80 px-3 sm:px-4 py-2 text-sm text-slate-900 outline-none rounded-lg md:rounded-none" />
            <Link to="/rfq" className="bg-primary px-5 sm:px-8 py-2 font-bold hover:bg-primary-dark transition-colors shrink-0 text-sm sm:text-base rounded-lg md:rounded-none flex items-center">
              {t('post_rfQ')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
