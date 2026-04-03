import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShieldCheck, MessageSquare, ShoppingCart, Share2, Heart, ChevronRight, Check, Info, Award, Globe, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { products, suppliers } from '../data/mockData';
import { cn } from '../utils/cn';
import { ProductCard } from '../components/ProductCard';

export function ProductDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const product = products.find((p) => p.id === id);
  const supplier = suppliers.find((s) => s.id === product?.supplierId);
  const [activeImage, setActiveImage] = React.useState(0);
  const [isFavorite, setIsFavorite] = React.useState(false);

  if (!product || !supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">{t('product_not_found')}</h2>
          <Link to="/products" className="text-viet-red font-bold underline">{t('back_to_products')}</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-viet-red">{t('home')}</Link>
          <ChevronRight size={12} />
          <Link to="/products" className="hover:text-viet-red">{t('products_breadcrumb')}</Link>
          <ChevronRight size={12} />
          <Link to={`/products?category=${product.category}`} className="hover:text-viet-red">{t(product.category)}</Link>
          <ChevronRight size={12} />
          <span className="text-slate-900 font-medium truncate">{product.name}</span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Images */}
          <div className="lg:col-span-5 space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden relative group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className={cn(
                  "absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all",
                  isFavorite ? "bg-viet-red text-white" : "bg-white text-slate-400 hover:text-viet-red"
                )}
              >
                <Heart size={20} className={isFavorite ? "fill-white" : ""} />
              </button>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[product.image, ...Array(3).fill('https://picsum.photos/seed/detail/600/600')].map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={cn(
                    "aspect-square rounded-lg border-2 overflow-hidden transition-all",
                    activeImage === idx ? "border-viet-red" : "border-transparent hover:border-slate-300"
                  )}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          </div>

          {/* Middle Column: Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                  {t(product.category)}
                </span>
                <div className="flex items-center gap-1 text-viet-gold">
                  <Star size={14} className="fill-viet-gold" />
                  <span className="text-xs font-bold text-slate-700">{product.rating}</span>
                  <span className="text-xs text-slate-400">{t('reviews_count', { count: product.reviews })}</span>
                </div>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-viet-red">{product.priceRange}</span>
                <span className="text-slate-400 text-sm">{t('per_unit')}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="text-xs text-slate-500 mb-1">{t('min_order')}</div>
                  <div className="font-bold text-slate-900">{product.moq}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-500 mb-1">{t('lead_time')}</div>
                  <div className="font-bold text-slate-900">15 - 30 {t('days')}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">{t('key_features')}</h3>
              <ul className="space-y-2">
                {[
                  t('authentic_vietnamese_origin'),
                  t('verified_export_quality'),
                  t('customizable_packaging'),
                  t('eco_friendly_process')
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                    <Check size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <button className="flex-1 bg-viet-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg hover:shadow-red-900/20 flex items-center justify-center gap-2">
                <MessageSquare size={20} />
                {t('send_inquiry')}
              </button>
              <button className="p-4 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-viet-red hover:border-viet-red transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Right Column: Supplier Info */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4">{t('supplier_information')}</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg border border-slate-100 p-1 shrink-0">
                    <img src={supplier.logo} alt={supplier.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <Link to={`/suppliers/${supplier.id}`} className="font-bold text-slate-900 hover:text-viet-red transition-colors block">
                      {supplier.name}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-emerald-600 font-bold mt-1">
                      <ShieldCheck size={14} />
                      <span>{t('verified_supplier')}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4 bg-slate-50/50">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin size={16} className="text-slate-400" />
                  <span>{supplier.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Award size={16} className="text-slate-400" />
                  <span>{supplier.certifications.join(', ')}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Globe size={16} className="text-slate-400" />
                  <span>{t('exports_to', { markets: supplier.markets.join(', ') })}</span>
                </div>
                <Link to={`/suppliers/${supplier.id}`} className="block w-full text-center py-2 text-sm font-bold text-viet-red border border-viet-red rounded-lg hover:bg-red-50 transition-colors">
                  {t('view_profile')}
                </Link>
              </div>
            </div>

            <div className="bg-viet-gold/10 rounded-2xl p-6 border border-viet-gold/20 space-y-4">
              <div className="flex items-center gap-2 text-viet-gold-dark">
                <span className="font-bold text-sm">{t('trade_assurance')}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {t('trade_assurance_desc')}
              </p>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className="mt-16 space-y-8">
          <div className="border-b border-slate-200">
            <div className="flex gap-8">
              {[
                { key: 'description_tab', label: t('description_tab') },
                { key: 'specifications_tab', label: t('specifications_tab') },
                { key: 'company_profile_tab', label: t('company_profile_tab') },
                { key: 'reviews_tab', label: t('reviews_tab') }
              ].map((tab, idx) => (
                <button
                  key={tab.key}
                  className={cn(
                    "pb-4 text-sm font-bold transition-all relative",
                    idx === 0 ? "text-viet-red" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  {tab.label}
                  {idx === 0 && <div className="absolute bottom-0 left-0 w-full h-1 bg-viet-red rounded-full" />}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-slate-900">{t('product_description')}</h3>
              <p className="text-slate-600 leading-relaxed">
                {product.description}
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800">{t('specifications_tab')}</h4>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {[
                        [t('origin_label'), t('vietnam')],
                        [t('material_label'), t('natural_organic')],
                        [t('processing_label'), t('standard_export')],
                        [t('shelf_life_label'), t('24_months')],
                        [t('packaging_label'), t('customizable')]
                      ].map(([key, val]) => (
                        <tr key={key}>
                          <td className="py-2 text-slate-500">{key}</td>
                          <td className="py-2 font-medium text-slate-900">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800">{t('shipping_info')}</h4>
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-slate-100">
                      {[
                        [t('port_label'), 'Hai Phong / Cat Lai'],
                        [t('payment_label'), 'L/C, T/T, Western Union'],
                        [t('sample_label'), t('available_on_request')],
                        [t('delivery_label'), t('sea_air_freight')]
                      ].map(([key, val]) => (
                        <tr key={key}>
                          <td className="py-2 text-slate-500">{key}</td>
                          <td className="py-2 font-medium text-slate-900">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-slate-900">{t('related_products')}</h3>
              <div className="space-y-4">
                {relatedProducts.slice(0, 3).map((p) => (
                  <Link key={p.id} to={`/products/${p.id}`} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-viet-red transition-colors">{p.name}</h4>
                      <div className="text-viet-red font-bold text-sm mt-1">{p.priceRange}</div>
                      <div className="text-[10px] text-slate-400 mt-1">{t('moq_label')} {p.moq}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
