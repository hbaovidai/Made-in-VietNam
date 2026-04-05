import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Globe, Zap, Award, CheckCircle2, MessageSquare, ChevronRight, LayoutGrid, Star, Factory, Shield } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { products, suppliers } from '../data/mockData';
import { ProductCard } from '../components/ProductCard';
import { SupplierCard } from '../components/SupplierCard';
import { CategorySidebar } from '../components/CategorySidebar';
import { CATEGORY_GROUPS } from '../data/categories';
import { CategoryCard } from '../components/categories/CategoryCard';
import { SEOHead } from '../components/SEOHead';

export function Home() {
  const { t } = useTranslation();

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
            <img
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200"
              alt="Industrial Manufacturing"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent flex flex-col justify-center px-6 sm:px-12 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md space-y-2 sm:space-y-4"
              >
                <h2 className="text-xl sm:text-3xl lg:text-4xl font-black leading-tight">{t('vietnam_top_hub')}</h2>
                <p className="text-slate-200 text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">{t('source_directly')}</p>
                <Link to="/products" className="inline-block bg-primary text-white px-5 sm:px-8 py-2 sm:py-3 text-sm sm:text-base font-bold hover:bg-primary-dark transition-all">
                  {t('source_now')}
                </Link>
              </motion.div>
            </div>
            {/* Slider Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/40" />
              <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Right Column: Recommendations — Desktop XL only */}
          <div className="hidden xl:flex flex-col w-72 bg-white border border-slate-200 shrink-0">
            <div className="px-4 py-3 border-b border-slate-200">
              <span className="font-bold text-slate-800">{t('you_may_like')}</span>
            </div>
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
              {products.slice(0, 3).map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="flex gap-3 group">
                  <div className="w-16 h-16 bg-slate-100 shrink-0 border border-slate-100 overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" loading="lazy" />
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
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" loading="lazy" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-medium text-slate-800 line-clamp-2 mb-1 group-hover:text-primary h-8 sm:h-10">{product.name}</h3>
                  <span className="text-primary font-bold text-xs sm:text-sm">{product.priceRange}</span>
                  <div className="text-[10px] text-slate-400 mt-0.5">{t('min_order')}: {product.moq}</div>
                </Link>
              ))}
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-5 gap-px bg-slate-200">
            {products.slice(0, 10).map((product) => (
              <div key={product.id} className="bg-white p-4 hover:shadow-lg transition-shadow group cursor-pointer">
                <div className="aspect-square bg-slate-50 mb-4 overflow-hidden">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" loading="lazy" />
                </div>
                <h3 className="text-sm font-medium text-slate-800 line-clamp-2 mb-2 group-hover:text-primary h-10">{product.name}</h3>
                <div className="flex flex-col">
                  <span className="text-primary font-bold">{product.priceRange}</span>
                  <span className="text-[11px] text-slate-400 mt-1">{t('min_order')}: {product.moq}</span>
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
                  <SupplierCard supplier={supplier} />
                </div>
              ))}
            </div>
          </div>
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {suppliers.slice(0, 3).map((supplier) => (
              <SupplierCard key={supplier.id} supplier={supplier} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Browse by Category ═══ */}
      <section className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 mt-8 sm:mt-12">
        <div className="space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">{t('browse_by')} <span className="text-primary">{t('category')}</span></h2>
            <Link to="/categories" className="text-xs sm:text-sm font-bold text-slate-500 hover:text-primary flex items-center gap-1">
              {t('view_all_categories')} <ChevronRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {CATEGORY_GROUPS.map((group) => (
              <CategoryCard key={group.slug} group={group} />
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
