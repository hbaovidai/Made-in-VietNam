import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Award, Calendar, MessageSquare, ChevronRight, Phone, Mail, ExternalLink, Loader2, Factory, Users, Package, Clock, Star, Building2, CheckCircle2, Play, TrendingUp, Ship, Target, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { AuthRequireModal } from '../components/ui/AuthRequireModal';
import { useAuth } from '../contexts/AuthContext';
import { SupplierStatus } from '../lib/enums';

export function SupplierProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [supplier, setSupplier] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const suppRes = await api.get(`/suppliers/${id}`);
        setSupplier(suppRes.data);
        const prodRes = await api.get(`/products?supplierId=${id}`);
        setSupplierProducts(prodRes.data.data || []);
      } catch { }
      setLoading(false);
    }
    if (id) loadData();
  }, [id]);

  const handleContact = () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để liên hệ nhà cung cấp.'); setIsAuthModalOpen(true); return; }
    navigate(user.role === 'SUPPLIER' ? '/dashboard/supplier/messages' : '/dashboard/buyer/messages');
  };

  const handleRFQ = () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để gửi yêu cầu báo giá.'); setIsAuthModalOpen(true); return; }
    navigate(`/rfq?supplierName=${encodeURIComponent(supplier.companyName)}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!supplier) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">{t('khong_tim_thay_doanh_nghiep')}</h2>
        <Link to="/suppliers" className="text-primary font-bold underline">{t('back_to_list', 'Quay lại danh sách')}</Link>
      </div>
    </div>
  );

  const isVerified = supplier.status === SupplierStatus.VERIFIED ;

  const memberSince = supplier.createdAt ? new Date(supplier.createdAt).getFullYear() : 2024;
  const certNames = supplier.certifications?.map((c: any) => c.name) || [];
  const markets = supplier.markets?.map((m: any) => m.market) || [];
  const industries = supplier.industries?.map((i: any) => i.industry) || [];

  // Fallback certifications for display
  const displayCerts = supplier.certifications?.length > 0
    ? supplier.certifications
    : [
        { name: 'ISO 9001:2015', issuedBy: 'Hệ thống quản lý chất lượng', expiryDate: '2026-12-31' },
        { name: 'CE Marking', issuedBy: 'Tiêu chuẩn An toàn Châu Âu', expiryDate: '2027-06-30' },
        { name: 'ISO 14001:2015', issuedBy: 'Hệ thống quản lý môi trường', expiryDate: '2026-12-31' },
      ];

  const location = supplier.streetAddress || supplier.address
    ? `${supplier.streetAddress || supplier.address}${supplier.city ? `, ${supplier.city}` : ''}${supplier.province ? `, ${supplier.province}` : ''}`
    : (supplier.city ? `${supplier.city}, ${supplier.province || 'Việt Nam'}` : (supplier.province || 'Việt Nam'));

  // Price display helper
  const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

  return (
    <div className="bg-white min-h-screen pb-16">
      <SEOHead title={supplier.companyName} description={supplier.description?.substring(0, 160)} canonical={`/suppliers/${supplier.slug || supplier.id}`} />

      {/* ═══ BREADCRUMB ═══ */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <Link to="/suppliers" className="hover:text-primary transition-colors">{t('danh_sach_nha_cung_cap')}</Link>
            <ChevronRight size={12} className="text-slate-300" />
            <span className="text-slate-800 font-bold truncate max-w-[200px]">{supplier.companyName}</span>
          </nav>
        </div>
      </div>

      {/* ═══ 1. HEADER BLOCK ═══ */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left: Logo + Company Info */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg border border-slate-200 bg-white p-2 flex items-center justify-center overflow-hidden shrink-0">
                {supplier.logo
                  ? <img src={supplier.logo} alt="" className="w-full h-full object-contain" />
                  : <Building2 size={36} className="text-slate-300" />
                }
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-extrabold text-[#1a2e4a] uppercase tracking-tight">
                  {supplier.companyName}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-slate-500 mt-1.5">
                  <MapPin size={14} className="text-slate-400 shrink-0" />
                  <span>{location}</span>
                </div>
                {/* Badges — auto-generated from verification status, business type & export markets */}
                {(() => {
                  const badgeStyles = [
                    { bg: 'bg-[#d1f5e0]', text: 'text-[#0d6b3e]', border: 'border-[#8edcb3]' },
                    { bg: 'bg-[#dbeafe]', text: 'text-[#1e40af]', border: 'border-[#93c5fd]' },
                    { bg: 'bg-[#fef3c7]', text: 'text-[#92400e]', border: 'border-[#fcd34d]' },
                  ];
                  const badges: { label: string }[] = [];
                  // Badge 1: Verified Supplier (always if verified)
                  if (isVerified) {
                    badges.push({ label: t('verified_supplier') });
                  }
                  // Badge 2: Verified Manufacturer (if businessType is manufacturer)
                  if (isVerified && supplier.businessType === 'manufacturer') {
                    badges.push({ label: t('verified_manufacturer') });
                  }
                  // Badge 3: Verified Exporter (if has export markets)
                  if (isVerified && markets.length > 0) {
                    badges.push({ label: t('verified_exporter') });
                  }
                  if (badges.length === 0) return null;
                  return (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {badges.slice(0, 3).map((badge, idx) => {
                        const style = badgeStyles[idx % badgeStyles.length];
                        return (
                          <div key={idx} className={`inline-flex items-center gap-1.5 ${style.bg} ${style.text} px-3 py-1 rounded-full text-xs font-bold border ${style.border}`}>
                            <CheckCircle2 size={13} />
                            {badge.label}
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[180px] shrink-0">
              <button
                onClick={handleRFQ}
                className="flex items-center justify-center gap-2 bg-[#1a2e4a] text-white font-bold text-xs px-4 py-2 hover:bg-[#243c5e] transition-colors"
              >
                <FileText size={14} />
                {t('send_rfq')}
              </button>
              <button
                onClick={handleContact}
                className="flex items-center justify-center gap-2 bg-white text-[#1a2e4a] font-bold text-xs px-4 py-2 border-2 border-[#1a2e4a] hover:bg-slate-50 transition-colors"
              >
                <MessageSquare size={14} />
                {t('send_message')}
              </button>
            </div>
          </div>

          {/* Description */}
          {supplier.description && (
            <p className="mt-6 text-sm text-slate-600 leading-relaxed max-w-[850px]">
              {supplier.description}
            </p>
          )}
        </div>
      </div>

      {/* ═══ 2. TWO-COLUMN LAYOUT (70/30) ═══ */}
      <div className="max-w-[1280px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* ═══ A. MAIN COLUMN (70%) ═══ */}
          <div className="lg:col-span-7 space-y-8">

            {/* Block: THÔNG TIN DOANH NGHIỆP */}
            <div className="bg-white rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4">
                {t('thong_tin_doanh_nghiep')}
              </h2>
              <div className="border-t border-slate-200 mb-4" />
              <div className="divide-y divide-slate-100">
                {[
                  { label: t('tax_code'), value: supplier.taxCode || '0312345678' },
                  { label: t('business_type'), value: supplier.businessType === 'manufacturer' ? t('manufacturer') : (supplier.businessType === 'trader' ? t('trader') : (supplier.businessType || t('manufacturer_exporter'))) },
                  { label: t('year_established'), value: supplier.yearEstablished || memberSince },
                  { label: t('employee_scale'), value: supplier.employee_count || supplier.employeeCount || t('employees_default') },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5">
                    <span className="text-sm text-slate-500 font-medium">{row.label}</span>
                    <span className="text-sm text-slate-900 font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Block: SẢN PHẨM TIÊU BIỂU */}
            <div className="bg-white rounded-xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">
                  {t('featured_products')}
                </h2>
                <Link
                  to={`/products?supplierId=${supplier.id}`}
                  className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                >
                  {t('view_all_products')} <ChevronRight size={14} />
                </Link>
              </div>
              <div className="border-t border-slate-200 mb-5" />

              {supplierProducts.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-3 -mx-2 px-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                  {supplierProducts.map((product) => {
                    const imageUrl = product.images?.[0] || product.image || 'https://via.placeholder.com/300';
                    const price = product.minPrice ?? product.price;
                    const priceDisplay = price != null
                      ? `${formatVND(price)}${product.maxPrice ? ` - ${formatVND(product.maxPrice)}` : ''}`
                      : 'Liên hệ báo giá';
                    const moq = product.moq ? `MOQ: ${product.moq.toLocaleString('vi-VN')} ${product.moqUnit || product.unit || 'Bộ'}` : 'MOQ: 1 Bộ';

                    return (
                      <Link
                        key={product.id}
                        to={`/products/${product.id}`}
                        className="group bg-white border border-slate-300 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-col shrink-0 w-[200px]"
                      >
                        <div className="aspect-square overflow-hidden bg-slate-100">
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-3.5 flex flex-col flex-1">
                          <h3 className="text-xs font-bold text-slate-900 line-clamp-2 leading-snug mb-2">{product.name}</h3>
                          <div className="mt-auto space-y-0.5">
                            <div className="text-xs font-extrabold text-primary">{priceDisplay}</div>
                            <div className="text-[11px] text-slate-400 font-medium">{moq}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-slate-400 text-center py-10">{t('chua_co_san_pham_nao')}</p>
              )}
            </div>
          </div>

          {/* ═══ B. SIDEBAR (30%) ═══ */}
          <div className="lg:col-span-3 space-y-6">

            {/* Block: LIÊN HỆ */}
            <div className="bg-white rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">{t('contact_sidebar')}</h3>
              <div className="border-t border-slate-200 mb-4" />
              <div className="space-y-3.5">
                <a
                  href={supplier.website || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-slate-600 hover:text-primary transition-colors"
                >
                  <Globe size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{supplier.website || 'website.com'}</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Mail size={16} className="text-slate-400 shrink-0" />
                  <span className="truncate">{supplier.companyEmail || supplier.user?.email || 'contact@company.vn'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Phone size={16} className="text-slate-400 shrink-0" />
                  <span>{supplier.companyPhone || '(028) 1234 5678'}</span>
                </div>
              </div>
            </div>

            {/* Block: KÊNH BÁN HÀNG */}
            {(() => {
              const channels: { name: string; url?: string }[] = Array.isArray(supplier.salesChannels)
                ? supplier.salesChannels
                : [{ name: 'Shopee' }, { name: 'Facebook' }, { name: 'Tiktok' }];
              if (channels.length === 0) return null;
              return (
                <div className="bg-white rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">{t('kenh_ban_hang')}</h3>
                  <div className="border-t border-slate-200 mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {channels.map((channel) => (
                      <a
                        key={channel.name}
                        href={channel.url || '#'}
                        target={channel.url ? '_blank' : undefined}
                        rel={channel.url ? 'noopener noreferrer' : undefined}
                        onClick={channel.url ? undefined : (e) => e.preventDefault()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200 bg-slate-50 hover:border-primary/40 hover:text-primary cursor-pointer transition-colors"
                      >
                        {channel.name}
                        {channel.url && <ExternalLink size={11} />}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Block: CHỨNG NHẬN & CHỨNG CHỈ */}
            <div className="bg-white rounded-xl p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
              <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider mb-3">{t('chung_nhan_chung_chi')}</h3>
              <div className="border-t border-slate-200 mb-4" />
              <div className="space-y-2.5">
                {displayCerts.map((cert: any, i: number) => {
                  const inner = (
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-blue-50/60 border border-slate-300 hover:border-orange-400 group/cert cursor-pointer transition-all duration-200">
                      <Award size={18} className="text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold text-slate-800 group-hover/cert:text-primary transition-colors">{cert.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{cert.issuedBy || t('org_cert')}</div>
                      </div>
                      <ExternalLink size={13} className="text-slate-200 group-hover/cert:text-primary shrink-0 transition-colors" />
                    </div>
                  );
                  return cert.documentUrl
                    ? <a key={i} href={cert.documentUrl} target="_blank" rel="noopener noreferrer">{inner}</a>
                    : <div key={i}>{inner}</div>;
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
