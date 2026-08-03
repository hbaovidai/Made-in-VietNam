import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, Globe, Award,
  MessageSquare, ChevronRight, Phone,
  Mail, ExternalLink, Loader2,
  Building2, FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { AuthRequireModal } from '../components/ui/AuthRequireModal';
import { useAuth } from '../contexts/AuthContext';
import { BusinessTypeMap, SaleChannels, SaleChannelsMap, SupplierStatus } from '../lib/enums';
import { SupplierBadge } from '../components/ui/SupplierBadge';
import { useToast } from '../components/ui/Toast';
import { CertEntry, SaleChanEntry, AddressEntry } from '../lib/types';

export function SupplierProfile() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [supplier, setSupplier] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMessage, setAuthModalMessage] = useState('');

  const [websiteUrl, setWebsiteUrl] = useState('website.com');
  const [primaryLocation, setPrimaryLocation] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const suppRes = await api.get(`/suppliers/${id}`);
        setSupplier(suppRes.data);
        const prodRes = await api.get(`/products?supplierId=${id}`);
        setSupplierProducts(prodRes.data.data || []);
      } catch (error) { console.error(error); }
      setLoading(false);
    }
    if (id) loadData();
  }, [id]);

  useEffect(() => {
    if (supplier === null) return;
    supplier.channels?.forEach(( channel: SaleChanEntry ) => {
      if (channel.type === SaleChannels.CUSTOM_WEBSITE) {
        setWebsiteUrl(channel.url);
      }
    });

    const primaryRecord: AddressEntry = supplier.addresses?.find((record: AddressEntry) => record.isPrimary);
    setPrimaryLocation(primaryRecord ? primaryRecord.address : '');
  }, [supplier])

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

    window.dispatchEvent(new CustomEvent('open-trade-chat', {
      detail: {
        supplierUserId,
        initialMessage: `Xin chào ${supplier.companyName}! 👋`
      }
    }));
  };

  const handleRFQ = () => {
    if (!user) { setAuthModalMessage('Vui lòng đăng nhập để gửi yêu cầu báo giá.'); setIsAuthModalOpen(true); return; }
    navigate(`/rfq?supplierName=${encodeURIComponent(supplier.companyName)}`);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-canvas"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!supplier) return (
    <div className="min-h-screen flex items-center justify-center bg-canvas">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-normal text-ink">{t('khong_tim_thay_doanh_nghiep')}</h2>
        <Link to="/suppliers" className="text-primary font-normal hover:text-primary-hover">{t('back_to_list', 'Quay lại danh sách')}</Link>
      </div>
    </div>
  );

  const isVerified = supplier.status === SupplierStatus.VERIFIED ;

  const memberSince = supplier.createdAt ? new Date(supplier.createdAt).getFullYear() : 2024;
  const markets = supplier.markets?.map((m: any) => m.market) || [];

  // Fallback certifications for display
  const displayCerts: CertEntry[] = supplier.certifications?.length ?
    supplier.certifications : [];

  // Price display helper
  const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';

  return (
    <div className="bg-canvas min-h-screen pb-16">
      <SEOHead title={supplier.companyName} description={supplier.description?.substring(0, 160)} canonical={`/suppliers/${supplier.slug || supplier.id}`} />

      {/* ═══ BREADCRUMB ═══ */}
      <div className="bg-canvas border-b border-hairline">
        <div className="max-w-[1600px] mx-auto px-6 py-3">
          <nav className="flex items-center gap-2 text-xs text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>
            <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
            <ChevronRight size={12} className="text-hairline" />
            <Link to="/suppliers" className="hover:text-primary transition-colors">{t('danh_sach_nha_cung_cap')}</Link>
            <ChevronRight size={12} className="text-hairline" />
            <span className="text-ink truncate max-w-[200px] font-normal">{supplier.companyName}</span>
          </nav>
        </div>
      </div>

      {/* ═══ 1. HEADER BLOCK ═══ */}
      <div className="bg-canvas border-b border-hairline">
        <div className="max-w-[1600px] mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            {/* Left: Logo + Company Info */}
            <div className="flex items-start gap-5">
              <div className="w-20 h-20 md:w-24 md:h-24 border border-hairline bg-surface-1 p-2 flex items-center justify-center overflow-hidden shrink-0" style={{ borderRadius: 0 }}>
                {supplier.logo
                  ? <img
                      src={supplier.logo}
                      alt=""
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/150';
                      }}
                    />
                  : <Building2 size={36} className="text-ink-subtle" />
                }
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-light text-ink uppercase" style={{ letterSpacing: '0.16px' }}>
                  {supplier.companyName}
                </h1>
                <div className="flex items-center gap-1.5 text-sm text-ink-muted mt-1.5" style={{ letterSpacing: '0.16px' }}>
                  <MapPin size={14} className="text-ink-subtle shrink-0" />
                  <span>{primaryLocation}</span>
                </div>
                {/* Badges — auto-generated from verification status, business type & export markets */}
                {(() => {
                  const hasManufacturer = !!supplier.manufacturerProfile || supplier.supplierType === 'MANUFACTURER' || supplier.supplierType === 'MANU_EXPORT';
                  const hasExporter = !!supplier.exporterProfile || supplier.supplierType === 'EXPORTER' || supplier.supplierType === 'MANU_EXPORT' || (markets && markets.length > 0);

                  return (
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      {isVerified && <SupplierBadge type="verified" />}
                      {isVerified && hasManufacturer && <SupplierBadge type="manufacturer" />}
                      {isVerified && hasExporter && <SupplierBadge type="exporter" />}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Right: CTA Buttons */}
            <div className="flex flex-col gap-2 w-full md:w-auto md:min-w-[180px] shrink-0">
              <button
                onClick={handleRFQ}
                className="flex items-center justify-center gap-2 bg-primary text-white font-normal text-xs px-4 py-2 hover:bg-primary-hover transition-colors"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                <FileText size={14} />
                {t('send_rfq')}
              </button>
              <button
                onClick={handleContact}
                className="flex items-center justify-center gap-2 bg-surface-1 text-ink font-normal text-xs px-4 py-2 border border-hairline hover:bg-surface-2 transition-colors"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                <MessageSquare size={14} />
                {t('send_message')}
              </button>
            </div>
          </div>

          {/* Description */}
          {supplier.description && (
            <p className="mt-6 text-sm text-ink-muted leading-relaxed max-w-[850px]" style={{ letterSpacing: '0.16px' }}>
              {supplier.description}
            </p>
          )}
        </div>
      </div>

      {/* ═══ 2. TWO-COLUMN LAYOUT (70/30) ═══ */}
      <div className="max-w-[1600px] mx-auto px-6 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">

          {/* ═══ A. MAIN COLUMN (70%) ═══ */}
          <div className="lg:col-span-7 space-y-8">

            {/* Block: THÔNG TIN DOANH NGHIỆP */}
            <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
              <h2 className="text-sm font-normal text-ink uppercase mb-4" style={{ letterSpacing: '0.32px' }}>
                {t('thong_tin_doanh_nghiep')}
              </h2>
              <div className="border-t border-hairline mb-4" />
              <div className="divide-y divide-hairline">
                {[
                  { label: t('tax_code'), value: supplier.taxCode || '0312345678' },
                  { label: t('business_type'), value: BusinessTypeMap[supplier.businessType] || 'Chưa có thông tin' }, 
                  { label: t('year_established'), value: supplier.yearEstablished || memberSince },
                  { label: t('employee_scale'), value: supplier.employee_count || supplier.employeeCount || t('employees_default') },
                ].map((row, i) => (
                  <div key={i} className="flex items-center justify-between py-3.5" style={{ letterSpacing: '0.16px' }}>
                    <span className="text-sm text-ink-subtle font-normal">{row.label}</span>
                    <span className="text-sm text-ink font-normal">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Block: SẢN PHẨM TIÊU BIỂU */}
            <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>
                  {t('featured_products')}
                </h2>
                <Link
                  to={`/products?supplierId=${supplier.id}`}
                  className="text-xs font-normal text-primary hover:text-primary-hover flex items-center gap-1"
                  style={{ letterSpacing: '0.16px' }}
                >
                  {t('view_all_products')} <ChevronRight size={14} />
                </Link>
              </div>
              <div className="border-t border-hairline mb-5" />

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
                        className="group bg-canvas border border-hairline overflow-hidden flex flex-col shrink-0 w-[200px]"
                        style={{ borderRadius: 0 }}
                      >
                        <div className="w-full h-[200px] bg-surface-2 border-b border-hairline overflow-hidden">
                          <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-3.5 flex flex-col flex-1">
                          <h3 className="text-xs font-normal text-ink line-clamp-2 leading-snug mb-2 h-[2.5rem]" style={{ letterSpacing: '0.16px' }}>{product.name}</h3>
                          <div className="mt-auto space-y-0.5">
                            <div className="text-xs font-normal text-primary" style={{ letterSpacing: '0.16px' }}>{priceDisplay}</div>
                            <div className="text-[11px] text-ink-subtle font-normal" style={{ letterSpacing: '0.16px' }}>{moq}</div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-ink-subtle text-center py-10" style={{ letterSpacing: '0.16px' }}>{t('chua_co_san_pham_nao')}</p>
              )}
            </div>
          </div>

          {/* ═══ B. SIDEBAR (30%) ═══ */}
          <div className="lg:col-span-3 space-y-6">

            {/* Block: LIÊN HỆ */}
            <div className="bg-canvas border border-hairline p-5" style={{ borderRadius: 0 }}>
              <h3 className="text-xs font-normal text-ink uppercase mb-3" style={{ letterSpacing: '0.32px' }}>{t('contact_sidebar')}</h3>
              <div className="border-t border-hairline mb-4" />
              <div className="space-y-3.5">
                <a
                  href={websiteUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-ink-muted hover:text-primary transition-colors"
                  style={{ letterSpacing: '0.16px' }}
                >
                  <Globe size={16} className="text-ink-subtle shrink-0" />
                  <span className="truncate">{websiteUrl || 'website.com'}</span>
                </a>
                <div className="flex items-center gap-3 text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                  <Mail size={16} className="text-ink-subtle shrink-0" />
                  <span className="truncate">{supplier.contactEmail || supplier.user?.email || 'contact@company.vn'}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>
                  <Phone size={16} className="text-ink-subtle shrink-0" />
                  <span>{supplier.contactPhone || supplier.user?.phone || '(028) 1234 5678'}</span>
                </div>
              </div>
            </div>

            {/* Block: KÊNH BÁN HÀNG */}
            {(() => {
              const channels: { url: string; type: SaleChannels }[] = 
                (supplier.channels?.length > 0) ? supplier.channels
                : [{ type: 'SHOPEE' }, { type: 'FACEBOOK' }, { type: 'TIKTOK_SHOP' }] as any[];
              return (
                <div className="bg-canvas border border-hairline p-5" style={{ borderRadius: 0 }}>
                  <h3 className="text-xs font-normal text-ink uppercase mb-3" style={{ letterSpacing: '0.32px' }}>{t('kenh_ban_hang')}</h3>
                  <div className="border-t border-hairline mb-4" />
                  <div className="flex flex-wrap gap-2">
                    {channels.map((channel) => (
                      <a
                        key={SaleChannelsMap[channel.type]}
                        href={channel.url || '#'}
                        target={channel.url ? '_blank' : undefined}
                        rel={channel.url ? 'noopener noreferrer' : undefined}
                        onClick={channel.url ? undefined : (e) => e.preventDefault()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-normal text-ink-muted border border-hairline bg-surface-1 hover:border-primary hover:text-primary cursor-pointer transition-colors"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      >
                        {SaleChannelsMap[channel.type]}
                        {channel.url && <ExternalLink size={11} />}
                      </a>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* Block: CHỨNG NHẬN & CHỨNG CHỈ */}
            <div className="bg-canvas border border-hairline p-5" style={{ borderRadius: 0 }}>
              <h3 className="text-xs font-normal text-ink uppercase mb-3" style={{ letterSpacing: '0.32px' }}>{t('chung_nhan_chung_chi')}</h3>
              <div className="border-t border-hairline mb-4" />
              <div className="space-y-2.5">
                {displayCerts.length > 0 ?
                  displayCerts.map((cert, i: number) => {
                  const inner = (
                    <div className="flex items-center gap-3 px-4 py-3.5 bg-surface-1 border border-hairline hover:border-primary group/cert cursor-pointer transition-colors" style={{ borderRadius: 0 }}>
                      <Award size={18} className="text-primary shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-normal text-ink group-hover/cert:text-primary transition-colors" style={{ letterSpacing: '0.16px' }}>{cert.name}</div>
                        <div className="text-xs text-ink-subtle mt-0.5" style={{ letterSpacing: '0.16px' }}>{cert.issuedBy || t('org_cert')}</div>
                      </div>
                      <ExternalLink size={13} className="text-hairline group-hover/cert:text-primary shrink-0 transition-colors" />
                    </div>
                  );
                  return cert.documentUrl
                    ? <a key={i} href={cert.documentUrl} target="_blank" rel="noopener noreferrer">{inner}</a>
                    : <div key={i}>{inner}</div>;
                }) : (
                  <p className='text-sm text-ink-subtle mt-0.5 text-center'>{t('supplier_no_certs')}</p>
                ) }
              </div>
            </div>

          </div>
        </div>
      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
