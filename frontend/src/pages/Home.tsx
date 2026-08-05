import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Zap, Award, CheckCircle2, MessageSquare, ChevronRight, ChevronLeft, LayoutGrid, Star, Factory, Shield, Loader2, Wrench, Beaker, Shirt, MapPin } from 'lucide-react';
import { m } from 'motion/react';
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
  const [slideKey, setSlideKey] = useState(0);

  const { settings: siteSettings } = useAppearance();

  const defaultSlides = [
    { image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200", title: t('hero_slide1_title'), desc: t('hero_slide1_desc'), link: '/products' },
    { image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200", title: t('hero_slide2_title'), desc: t('hero_slide2_desc'), link: '/profile-submission' },
    { image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200", title: t('secured_trading_service'), desc: t('trade_assurance'), link: '/products' },
  ];

  const heroSlides = React.useMemo(() => {
    if (!siteSettings || !('hero_banners' in siteSettings)) {
      return defaultSlides;
    }
    try {
      const banners = JSON.parse(siteSettings.hero_banners || '[]');
      const validBanners = banners.filter((b: any) => b.image && b.image.trim() !== '' && b.status !== 'hidden');
      return validBanners.map((b: any) => ({
        image: b.image,
        title: i18n.language?.startsWith('vi') ? (b.titleVi || b.title) : b.title,
        desc: i18n.language?.startsWith('vi') ? (b.descVi || b.desc) : b.desc,
        link: b.link || '/products',
      }));
    } catch { }
    return [];
  }, [siteSettings, i18n.language]);

  const SLIDE_INTERVAL = 5000;

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setSlideKey((k) => k + 1);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setSlideKey((k) => k + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setSlideKey((k) => k + 1);
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

        const lvl1Cats: any[] = catRes.data || [];
        if (lvl1Cats.length === 0) return;

        const lvl2Cats: any[] = lvl1Cats.flatMap(c1 => c1.children || []);
        const lvl3Cats: any[] = lvl2Cats.flatMap(c2 => c2.children || []);

        if (lvl3Cats.length > 0) {
          setCategories(lvl3Cats);
        } else if (lvl2Cats.length > 0) {
          setCategories(lvl2Cats);
        } else {
          setCategories(lvl1Cats);
        }

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
      <div className="flex items-center justify-center min-h-screen bg-canvas">
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
    return t('contact_for_price');
  };

  return (
    <div className="bg-canvas min-h-screen pb-20">
      <SEOHead
        title={t('seo_home_title')}
        description={t('seo_home_desc')}
        canonical="/"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "VIEProduct",
          "url": "https://vieproduct.com",
          "description": t('seo_home_org_desc'),
          "sameAs": [],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer support",
            "availableLanguage": ["Vietnamese", "English"]
          }
        }}
      />

      {/* ═══ Hero Banner ═══ */}
      {heroSlides.length > 0 && (
        <section>
          <div className="relative group overflow-hidden bg-surface-2 h-[240px] sm:h-[360px] lg:h-[480px]">
            {heroSlides.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-500 ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent flex flex-col justify-center px-6 sm:px-12 lg:px-16 text-white">
                  <m.div
                    key={`text-${idx}`}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-2xl space-y-3 sm:space-y-5"
                  >
                    <h2 className="text-xl sm:text-3xl lg:text-5xl font-light leading-tight" style={{ letterSpacing: '-0.4px' }}>{slide.title}</h2>
                    <p className="text-white/80 text-xs sm:text-sm leading-relaxed max-w-xl" style={{ letterSpacing: '0.16px' }}>{slide.desc}</p>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <Link to={slide.link} className="bg-white text-ink px-6 py-3 text-xs sm:text-sm font-normal hover:bg-surface-1 transition-colors flex items-center gap-1.5" style={{ letterSpacing: '0.16px' }}>
                        {idx === 1 ? t('register_now') : t('explore_now')} {idx === 1 && <ArrowRight size={14} />}
                      </Link>
                      <Link to="/about" className="border border-white/40 text-white px-6 py-3 text-xs sm:text-sm font-normal hover:bg-white/10 transition-colors" style={{ letterSpacing: '0.16px' }}>
                        {idx === 1 ? t('learn_process') : t('learn_more')}
                      </Link>
                    </div>
                  </m.div>
                </div>
              </div>
            ))}

            {/* Arrow Navigation */}
            {heroSlides.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/20 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-[opacity,background-color] z-20"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 bg-black/20 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-[opacity,background-color] z-20"
                  aria-label="Next slide"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Slider Dots */}
            {heroSlides.length > 1 && (
              <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20">
                <div className="flex gap-2">
                  {heroSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentSlide(idx); setSlideKey((k) => k + 1); }}
                      className={`transition-[width,background-color] duration-300 outline-none ${idx === currentSlide ? 'w-7 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'
                        }`}
                    />
                  ))}
                </div>
                {/* Auto-progress bar */}
                <div className="w-24 h-[2px] bg-white/20 overflow-hidden" style={{ borderRadius: 1 }}>
                  <div
                    key={slideKey}
                    className="h-full bg-white animate-slide-progress"
                    style={{ '--slide-duration': `${SLIDE_INTERVAL}ms` } as React.CSSProperties}
                  />
                </div>
              </div>
            )}
          </div>
        </section>
      )}


      {/* ═══ Featured Categories ═══ */}
      <section className="max-w-[1584px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-light text-ink" style={{ letterSpacing: 0 }}>{t('home_featured_categories')}</h2>
          <Link to="/products" className="text-sm text-primary hover:underline flex items-center gap-1 font-normal" style={{ letterSpacing: '0.16px' }}>
            {t('view_more')} <ChevronRight size={14} />
          </Link>
        </div>

        {categories.length === 0 ? (
          <div className="bg-canvas border border-hairline p-12 text-center">
            <p className="text-sm text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('home_no_categories')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.slice(0, 10).map((cat, idx) => {
              const imgSrc = `https://picsum.photos/seed/${cat.slug}/400/300`;

              return (
                <Link
                  key={cat.id}
                  to={`/products?category=${cat.slug}`}
                  className="bg-canvas border border-hairline overflow-hidden hover:bg-surface-1 hover:border-ink-subtle transition-[background-color,border-color] duration-150 group flex flex-col"
                >
                  <div className="w-full aspect-[4/3] overflow-hidden bg-surface-1 border-b border-hairline">
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200 ease-out"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4 text-center flex-1 flex items-center justify-center">
                    <h3 className="text-xs sm:text-sm font-normal text-ink group-hover:text-primary transition-colors line-clamp-2" style={{ letterSpacing: '0.16px' }}>
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>      {/* ═══ Verified Suppliers Section ═══ */}
      <section className="max-w-[1584px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-light text-ink" style={{ letterSpacing: 0 }}>{t('home_featured_suppliers')}</h2>
          <Link to="/suppliers" className="text-sm text-primary hover:underline flex items-center gap-1 font-normal" style={{ letterSpacing: '0.16px' }}>
            {t('view_more')} <ChevronRight size={14} />
          </Link>
        </div>

        {suppliers.length === 0 ? (
          <div className="bg-canvas border border-hairline py-12 text-center text-ink-subtle text-sm">
            {t('no_suppliers_yet')}
          </div>
        ) : (
          <div>
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden overflow-x-auto pb-4">
              <div className="flex gap-4 w-max">
                {suppliers.slice(0, 5).map((supplier, idx) => {
                  const name = supplier.companyName || supplier.name;
                  const primaryRecord = supplier.addresses?.find(record => record.isPrimary);
                  const primaryLocation = primaryRecord ? primaryRecord.address : '';
                  const industries = supplier.industries 
                    ? supplier.industries.map((i: any) => i.industry) 
                    : (supplier.industry || []);

                  return (
                    <div key={supplier.id} className="w-[280px] shrink-0 bg-canvas border border-hairline p-6 flex flex-col justify-between h-full">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-14 h-14 bg-surface-1 border border-hairline flex items-center justify-center mb-4 overflow-hidden shrink-0 p-1">
                          {supplier.logo ? (
                            <img src={supplier.logo} alt="" className="max-w-full max-h-full object-contain" />
                          ) : (
                            idx % 5 === 0 ? <Factory size={24} className="text-ink-subtle" /> :
                              idx % 5 === 1 ? <Wrench size={24} className="text-ink-subtle" /> :
                                idx % 5 === 2 ? <Beaker size={24} className="text-ink-subtle" /> :
                                  idx % 5 === 3 ? <Shirt size={24} className="text-ink-subtle" /> :
                                    <Zap size={24} className="text-ink-subtle" />
                          )}
                        </div>
                        <h3 className="font-semibold text-ink text-xs mb-1 line-clamp-2 h-10 flex items-center justify-center px-1" style={{ letterSpacing: '0.16px' }}>
                          {name}
                        </h3>
                        <div className="flex items-center gap-1 text-ink-subtle text-[11px] mb-3 justify-center" style={{ letterSpacing: '0.32px' }}>
                          <MapPin size={12} className="shrink-0 text-ink-subtle" />
                          <span className="truncate max-w-[200px]">{primaryLocation}</span>
                        </div>
                        <div className="text-xs text-ink-muted mb-4 line-clamp-2 min-h-[32px] px-1" style={{ letterSpacing: '0.16px' }}>
                          <span className="font-semibold text-ink">{t('home_industry_label')} </span>
                          {industries.join(', ') || t('updating')}
                        </div>
                      </div>
                      <Link
                        to={`/suppliers/${supplier.id}`}
                        className="w-full border border-hairline text-primary text-xs font-normal py-2.5 hover:bg-surface-1 hover:border-ink-subtle transition-all text-center block" style={{ letterSpacing: '0.16px' }}
                      >
                        {t('view_profile')}
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
                const primaryRecord = supplier.addresses?.find(record => record.isPrimary);
                const primaryLocation = primaryRecord ? primaryRecord.address : '';
                const industries = supplier.industries 
                  ? supplier.industries.map((i: any) => i.industry) 
                  : (supplier.industry || []);

                return (
                  <div key={supplier.id} className="bg-canvas border border-hairline p-6 flex flex-col justify-between h-full hover:bg-surface-1 hover:border-ink-subtle transition-[background-color,border-color] duration-150">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-14 h-14 bg-surface-1 border border-hairline flex items-center justify-center mb-4 overflow-hidden shrink-0 p-1">
                        {supplier.logo ? (
                          <img src={supplier.logo} alt="" className="max-w-full max-h-full object-contain" />
                        ) : (
                          idx % 5 === 0 ? <Factory size={24} className="text-ink-subtle" /> :
                            idx % 5 === 1 ? <Wrench size={24} className="text-ink-subtle" /> :
                              idx % 5 === 2 ? <Beaker size={24} className="text-ink-subtle" /> :
                                idx % 5 === 3 ? <Shirt size={24} className="text-ink-subtle" /> :
                                  <Zap size={24} className="text-ink-subtle" />
                        )}
                      </div>
                      <h3 className="font-semibold text-ink text-xs mb-1 line-clamp-2 h-10 flex items-center justify-center px-1" style={{ letterSpacing: '0.16px' }}>
                        {name}
                      </h3>
                      <div className="flex items-center gap-1 text-ink-subtle text-[11px] mb-3 justify-center" style={{ letterSpacing: '0.32px' }}>
                        <MapPin size={12} className="shrink-0 text-ink-subtle" />
                        <span className="truncate max-w-[150px]">{primaryLocation}</span>
                      </div>
                      <div className="text-xs text-ink-muted mb-4 line-clamp-2 min-h-[32px] px-1" style={{ letterSpacing: '0.16px' }}>
                        <span className="font-semibold text-ink">{t('home_industry_label')} </span>
                        {industries.join(', ') || t('updating')}
                      </div>
                    </div>
                    <Link
                      to={`/suppliers/${supplier.id}`}
                      className="w-full border border-hairline text-primary text-xs font-normal py-2.5 hover:bg-surface-1 hover:border-ink-subtle transition-all text-center block" style={{ letterSpacing: '0.16px' }}
                    >
                      {t('view_profile')}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>


      {/* ═══ Register Digital Profile Section ═══ */}
      <section className="max-w-[1584px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div
          className="relative bg-primary text-white p-12 sm:p-16 flex flex-col items-center justify-center overflow-hidden"
        >
          <div className="w-12 h-12 bg-white/10 flex items-center justify-center text-white mb-6 border border-white/10">
            <ShieldCheck size={26} />
          </div>

          <h2 className="text-xl sm:text-3xl font-light text-white text-center mb-3 max-w-2xl leading-tight" style={{ letterSpacing: '-0.4px' }}>
            {t('home_digital_profile_title')}
          </h2>

          <p className="text-white/80 text-xs sm:text-sm max-w-2xl text-center mb-8 leading-relaxed" style={{ letterSpacing: '0.16px' }}>
            {t('home_digital_profile_desc')} <span className="font-semibold text-white">Verified Supplier</span> {t('at_vieproduct', 'tại VIEproduct')}.
          </p>

          <div className="flex flex-wrap gap-4 justify-center items-center">
            <Link to="/profile-submission" className="bg-white text-primary px-6 py-3 text-sm font-normal hover:bg-surface-1 transition-all flex items-center gap-2" style={{ letterSpacing: '0.16px' }}>
              {t('register_now')} <ArrowRight size={16} />
            </Link>
            <Link to="/about" className="border border-white/30 hover:border-white/60 text-white px-6 py-3 text-sm font-normal hover:bg-white/5 transition-all" style={{ letterSpacing: '0.16px' }}>
              {t('learn_process')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
