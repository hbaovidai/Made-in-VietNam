import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Award, Calendar, MessageSquare, ChevronRight, Phone, Mail, ExternalLink, CheckCircle2, FileText, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';
import { api } from '../lib/api';

export function SupplierProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  
  const [supplier, setSupplier] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('Home');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const suppRes = await api.get(`/suppliers/${id}`);
        setSupplier(suppRes.data);

        const prodRes = await api.get(`/products?supplierId=${id}`);
        setSupplierProducts(prodRes.data.data || []);
      } catch (err) {
        console.error('Failed to load supplier details', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">{t('supplier_not_found')}</h2>
          <Link to="/suppliers" className="text-primary font-bold underline">{t('back_to_suppliers')}</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Banner & Logo */}
      <div className="relative h-72 md:h-96 bg-slate-200">
        <img src={supplier.banner || 'https://via.placeholder.com/1200x400'} alt={supplier.companyName || supplier.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
          <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-end gap-8">
            <div className="relative shrink-0">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-[2rem] bg-white border-4 border-white shadow-2xl p-4 overflow-hidden">
                <img src={supplier.logo || 'https://via.placeholder.com/200'} alt={supplier.companyName || supplier.name} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
              </div>
              {supplier.isVerified && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2.5 rounded-2xl shadow-lg border-4 border-white">
                  <ShieldCheck size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 text-white space-y-4 pb-4">
              <div className="space-y-2">
                <div className="flex items-center gap-4">
                  <h1 className="text-3xl md:text-5xl font-black tracking-tight">{supplier.companyName || supplier.name}</h1>
                  <div className="bg-primary text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">
                    {t('verified_manufacturer')}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-6 text-sm font-bold opacity-90">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-primary shrink-0" />
                    <span>{supplier.city ? `${supplier.city}, ${supplier.province}` : 'Viet Nam'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-viet-gold shrink-0" />
                    <span>{t('est')} {supplier.yearEstablished || 2010}</span>
                  </div>
                  {(supplier.markets?.length > 0) && (
                    <div className="flex items-center gap-2">
                      <Globe size={18} className="text-blue-400 shrink-0" />
                      <span>{t('main_markets_label')} {supplier.markets.map((m: any) => m.market || m).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-4 pb-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none bg-white text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all shadow-xl flex items-center justify-center gap-2">
                <MessageSquare size={18} />
                {t('contact')}
              </button>
              <button className="flex-1 md:flex-none bg-primary text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary-dark transition-all shadow-xl flex items-center justify-center gap-2">
                <FileText size={18} />
                {t('request_rfq')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-20 z-40 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-10">
            {[
              { id: 'Home', label: t('home') },
              { id: 'Products', label: t('products') },
              { id: 'Company Profile', label: t('company_profile') },
              { id: 'Certifications', label: t('certifications') },
              { id: 'Contact', label: t('contact') }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "py-6 text-xs font-black uppercase tracking-widest transition-all relative",
                  activeTab === tab.id ? "text-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* About Section */}
            <section className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">{t('about_supplier', { name: supplier.companyName || supplier.name })}</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {supplier.description || 'Welcome to our company.'}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {[
                  { label: t('business_type'), value: t('manufacturer_exporter') },
                  { label: t('main_products'), value: supplier.industries?.map((i: any) => i.industry || i).join(', ') || 'Various' },
                  { label: t('total_employees'), value: t('employees_range') },
                  { label: t('annual_revenue'), value: t('revenue_range') },
                  { label: t('main_markets'), value: supplier.markets?.map((m: any) => m.market || m).join(', ') || 'Global' },
                  { label: t('export_percentage'), value: t('export_range') }
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-bold text-slate-800">{item.value}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="space-y-6">
              <div className="flex justify-between items-end">
                <h2 className="text-2xl font-bold text-slate-900">{t('featured_products_title')}</h2>
                <button onClick={() => setActiveTab('Products')} className="text-primary font-bold text-sm hover:underline">
                  {t('view_all_products')}
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {supplierProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>

            {/* Certifications */}
            {(supplier.certifications?.length > 0) && (
              <section className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
                <h2 className="text-2xl font-bold text-slate-900">{t('certifications_compliance')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supplier.certifications.map((cert: any, i: number) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-viet-gold shadow-sm border border-slate-100">
                        <Award size={24} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{cert.name || cert}</div>
                        <div className="text-xs text-slate-500">{t('verified_valid')}</div>
                      </div>
                      <CheckCircle2 size={20} className="ml-auto text-emerald-500" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            {/* Verification Card */}
            <div className="bg-slate-900 rounded-2xl p-8 text-white space-y-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">{t('verified_supplier')}</h3>
                  <p className="text-xs text-slate-400">{t('since')} {supplier.yearEstablished}</p>
                </div>
              </div>
              <ul className="space-y-4">
                {[
                  t('factory_audit_completed'),
                  t('business_license_verified'),
                  t('export_license_validated'),
                  t('onsite_inspection_passed')
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-slate-300">
                    <CheckCircle2 size={18} className="text-viet-gold" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-slate-100 transition-colors">
                {t('view_audit_report')}
              </button>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 space-y-6">
              <h3 className="font-bold text-slate-900">{t('contact_details')}</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('phone')}</div>
                    <div className="text-sm font-bold text-slate-800">{supplier.phone || '+84 (28) 1234 5678'}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('email')}</div>
                    <div className="text-sm font-bold text-slate-800">{supplier.email || `sales@company.com`}</div>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                    <ExternalLink size={18} />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('website')}</div>
                    <a href="#" className="text-sm font-bold text-primary hover:underline">{supplier.website || 'www.company.vn'}</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
