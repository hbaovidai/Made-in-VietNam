import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Globe, Award, Calendar, MessageSquare, ChevronRight, Phone, Mail, ExternalLink, Loader2, Factory, Users, Package, Clock, Star, Building2, CheckCircle2, Play, TrendingUp, Ship, Target } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ProductCard } from '../components/ProductCard';
import { cn } from '../utils/cn';
import { api } from '../lib/api';
import { SEOHead } from '../components/SEOHead';
import { AuthRequireModal } from '../components/ui/AuthRequireModal';
import { useAuth } from '../contexts/AuthContext';

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
  const [activeGallery, setActiveGallery] = useState(0);

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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary" size={48} /></div>;
  if (!supplier) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy doanh nghiệp</h2>
        <Link to="/suppliers" className="text-primary font-bold underline">Quay lại danh sách</Link>
      </div>
    </div>
  );

  const memberSince = supplier.createdAt ? new Date(supplier.createdAt).getFullYear() : 2024;
  const certNames = supplier.certifications?.map((c: any) => c.name) || [];
  const markets = supplier.markets?.map((m: any) => m.market) || [];

  // Factory gallery images (use banner or placeholders)
  const galleryImages = [
    { src: supplier.banner || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800', label: 'Nhà máy' },
    { src: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800', label: 'Kho hàng' },
    { src: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=800', label: 'Dây chuyền SX' },
    { src: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800', label: 'Nhân sự' },
    { src: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800', label: 'Kiểm định CL' },
  ];

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      <SEOHead title={supplier.companyName} description={supplier.description?.substring(0, 160)} canonical={`/suppliers/${supplier.slug || supplier.id}`} />

      {/* ═══ 1. HERO BANNER ═══ */}
      <div className="relative h-[280px] md:h-[340px] overflow-hidden">
        <img src={supplier.banner || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1400'} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0">
          <div className="max-w-[1400px] mx-auto px-4 pb-6 flex items-end gap-5">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden shrink-0">
              {supplier.logo ? <img src={supplier.logo} alt="" className="w-full h-full object-cover" /> : <Building2 size={36} className="text-slate-300" />}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl font-black text-white">{supplier.companyName}</h1>
                {supplier.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300 bg-emerald-500/20 backdrop-blur-sm px-2.5 py-1 rounded-full border border-emerald-400/30">
                    <ShieldCheck size={12} /> Đã xác minh
                  </span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-white/70 flex-wrap">
                <span className="flex items-center gap-1"><Calendar size={13} /> Thành lập {supplier.yearEstablished || memberSince}</span>
                <span className="flex items-center gap-1"><MapPin size={13} /> {supplier.city || supplier.province || 'Việt Nam'}</span>
                <span className="flex items-center gap-1"><Users size={13} /> {supplier.employeeCount || '—'} nhân viên</span>
              </div>
            </div>
            <div className="hidden md:flex gap-2 shrink-0">
              <button onClick={handleContact} className="bg-primary text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 shadow-lg">
                <MessageSquare size={15} /> Nhắn tin
              </button>
              <button onClick={() => { if (!user) { setAuthModalMessage('Vui lòng đăng nhập.'); setIsAuthModalOpen(true); return; } navigate(`/rfq?supplierName=${encodeURIComponent(supplier.companyName)}`); }} className="bg-white/10 backdrop-blur-sm text-white font-bold text-sm px-5 py-2.5 rounded-lg hover:bg-white/20 transition-colors border border-white/20">
                Yêu cầu báo giá
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile CTAs */}
      <div className="md:hidden flex gap-2 px-4 py-3 bg-white border-b border-slate-200">
        <button onClick={handleContact} className="flex-1 bg-primary text-white font-bold text-sm py-2.5 rounded-lg flex items-center justify-center gap-2"><MessageSquare size={14} /> Nhắn tin</button>
        <button onClick={() => navigate(`/rfq?supplierName=${encodeURIComponent(supplier.companyName)}`)} className="flex-1 border border-primary text-primary font-bold text-sm py-2.5 rounded-lg">Báo giá</button>
      </div>

      {/* ═══ 2. KPI CARDS ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 -mt-4 md:-mt-0 md:mt-6 relative z-10">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {[
            { icon: Calendar, label: 'Năm thành lập', value: supplier.yearEstablished || memberSince, color: 'text-blue-600 bg-blue-50' },
            { icon: Factory, label: 'Diện tích nhà xưởng', value: supplier.factoryArea || '2,000 m²', color: 'text-emerald-600 bg-emerald-50' },
            { icon: TrendingUp, label: 'Công suất SX', value: supplier.productionCapacity || '10,000/tháng', color: 'text-orange-600 bg-orange-50' },
            { icon: Package, label: 'Sản phẩm', value: `${supplier._count?.products || supplierProducts.length}`, color: 'text-violet-600 bg-violet-50' },
            { icon: Globe, label: 'Quốc gia XK', value: `${markets.length || 4}+`, color: 'text-cyan-600 bg-cyan-50' },
            { icon: Star, label: 'Tỷ lệ phản hồi', value: `${supplier.responseRate || 95}%`, color: 'text-amber-600 bg-amber-50' },
          ].map((kpi, i) => (
            <div key={i} className="bg-white rounded-xl p-4 border border-slate-200 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className={cn("w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center", kpi.color)}>
                <kpi.icon size={18} />
              </div>
              <div className="text-lg md:text-xl font-black text-slate-900">{kpi.value}</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 3. ABOUT + GALLERY ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* About */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Building2 size={16} className="text-primary" /> Giới thiệu doanh nghiệp</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{supplier.description || 'Chưa có thông tin giới thiệu.'}</p>
            <div className="mt-4 space-y-2.5 text-sm">
              {supplier.address && <div className="flex items-start gap-2 text-slate-600"><MapPin size={14} className="text-slate-400 mt-0.5 shrink-0" />{supplier.address}, {supplier.city}</div>}
              {supplier.companyPhone && <div className="flex items-center gap-2 text-slate-600"><Phone size={14} className="text-slate-400 shrink-0" />{supplier.companyPhone}</div>}
              {supplier.companyEmail && <div className="flex items-center gap-2 text-slate-600"><Mail size={14} className="text-slate-400 shrink-0" />{supplier.companyEmail}</div>}
              {supplier.website && <div className="flex items-center gap-2"><Globe size={14} className="text-slate-400 shrink-0" /><a href={supplier.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">{supplier.website}</a></div>}
            </div>
          </div>

          {/* Factory Gallery */}
          <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2"><Factory size={16} className="text-primary" /> Hình ảnh nhà xưởng</h2>
            <div className="aspect-[16/9] rounded-lg overflow-hidden mb-3 bg-slate-100">
              <img src={galleryImages[activeGallery].src} alt={galleryImages[activeGallery].label} className="w-full h-full object-cover" />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {galleryImages.map((img, i) => (
                <button key={i} onClick={() => setActiveGallery(i)} className={cn("shrink-0 rounded-lg overflow-hidden border-2 transition-all", i === activeGallery ? "border-primary" : "border-transparent opacity-70 hover:opacity-100")}>
                  <img src={img.src} alt={img.label} className="w-20 h-14 object-cover" />
                  <div className="text-[9px] font-bold text-slate-500 text-center py-0.5 bg-slate-50">{img.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ 4. NĂNG LỰC SẢN XUẤT ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><Target size={16} className="text-primary" /> Năng lực sản xuất & cung ứng</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'MOQ trung bình', value: '50 - 500 units', icon: Package },
              { label: 'Công suất / tháng', value: supplier.productionCapacity || '10,000 units', icon: TrendingUp },
              { label: 'Lead Time', value: supplier.leadTime || '15 - 30 ngày', icon: Clock },
              { label: 'Cảng xuất hàng', value: supplier.port || 'Cảng Cát Lái, HCM', icon: Ship },
              { label: 'Thị trường XK', value: markets.length > 0 ? markets.join(', ') : 'Toàn cầu', icon: Globe },
            ].map((item, i) => (
              <div key={i} className="border border-slate-100 rounded-lg p-4 hover:border-primary/30 hover:bg-primary/[0.02] transition-all">
                <item.icon size={18} className="text-primary mb-2" />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-sm font-semibold text-slate-800">{item.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 5. CHỨNG NHẬN ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2"><Award size={16} className="text-primary" /> Chứng nhận & Giấy phép</h2>
          {supplier.certifications?.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {supplier.certifications.map((cert: any, i: number) => (
                <div key={i} className="border border-slate-100 rounded-lg p-4 flex items-start gap-3 hover:border-emerald-200 hover:bg-emerald-50/30 transition-all">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{cert.name}</div>
                    {cert.issuedBy && <div className="text-xs text-slate-500 mt-0.5">{cert.issuedBy}</div>}
                    {cert.issuedDate && <div className="text-[10px] text-slate-400 mt-0.5">{new Date(cert.issuedDate).toLocaleDateString('vi-VN')}</div>}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-6">Chưa có thông tin chứng nhận.</p>
          )}
        </div>
      </div>

      {/* ═══ 6. TIMELINE ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2"><Clock size={16} className="text-primary" /> Lịch sử phát triển</h2>
          <div className="relative pl-8 space-y-6 border-l-2 border-primary/20 ml-3">
            {[
              { year: supplier.yearEstablished || memberSince, title: 'Thành lập công ty', desc: `${supplier.companyName} chính thức được thành lập tại ${supplier.city || 'Việt Nam'}.` },
              { year: (supplier.yearEstablished || memberSince) + 3, title: 'Mở rộng sản xuất', desc: 'Đầu tư dây chuyền sản xuất hiện đại, nâng công suất gấp 3 lần.' },
              { year: (supplier.yearEstablished || memberSince) + 5, title: 'Đạt chứng nhận quốc tế', desc: `Đạt ${certNames[0] || 'ISO 9001'} và bắt đầu xuất khẩu sang ${markets[0] || 'thị trường quốc tế'}.` },
              { year: memberSince, title: 'Tham gia VIEProduct', desc: 'Trở thành nhà cung cấp đã xác minh trên nền tảng B2B VIEProduct.' },
            ].map((event, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[41px] w-5 h-5 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <div className="text-xs font-black text-primary mb-1">{event.year}</div>
                <div className="text-sm font-bold text-slate-900">{event.title}</div>
                <div className="text-xs text-slate-500 mt-0.5">{event.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ 8. SẢN PHẨM NỔI BẬT ═══ */}
      {supplierProducts.length > 0 && (
        <div className="max-w-[1400px] mx-auto px-4 mt-6">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2"><Package size={16} className="text-primary" /> Sản phẩm nổi bật</h2>
              <Link to={`/products?supplierId=${supplier.id}`} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                Xem tất cả <ChevronRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {supplierProducts.slice(0, 5).map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </div>
      )}

      {/* ═══ 9. THÔNG TIN LIÊN HỆ ═══ */}
      <div className="max-w-[1400px] mx-auto px-4 mt-6 mb-10">
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-6 md:p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <h2 className="text-xl font-black mb-2">Liên hệ {supplier.companyName}</h2>
              <p className="text-sm text-slate-300 mb-4">Gửi yêu cầu báo giá hoặc nhắn tin trực tiếp để nhận phản hồi nhanh nhất.</p>
              <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                {supplier.address && <span className="flex items-center gap-1.5"><MapPin size={13} /> {supplier.address}, {supplier.city}</span>}
                {supplier.companyPhone && <span className="flex items-center gap-1.5"><Phone size={13} /> {supplier.companyPhone}</span>}
                {supplier.companyEmail && <span className="flex items-center gap-1.5"><Mail size={13} /> {supplier.companyEmail}</span>}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={handleContact} className="bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors text-sm flex items-center justify-center gap-2">
                <MessageSquare size={16} /> Nhắn tin cho doanh nghiệp
              </button>
              <button onClick={() => navigate(`/rfq?supplierName=${encodeURIComponent(supplier.companyName)}`)} className="bg-white/10 text-white font-bold py-3 rounded-lg hover:bg-white/20 transition-colors text-sm border border-white/20">
                Gửi yêu cầu báo giá
              </button>
            </div>
          </div>
        </div>
      </div>

      <AuthRequireModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} message={authModalMessage} />
    </div>
  );
}
