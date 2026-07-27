import React, { useState, useEffect, ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Globe, Award, Shield, CheckCircle2, Edit2, Camera, Plus, Trash2, X, Loader2, Eye, ExternalLink, Package } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { SupplierBadge } from '../../../components/ui/SupplierBadge';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { SaleChannels, SupplierStatus } from '@/src/lib/enums';
import { CustomSelect } from '../../../components/CustomSelect';
import { BusinessTypeMap } from '@/src/lib/enums';

const boxStyle = 'bg-canvas border border-hairline p-6 rounded-xl shadow-sm';
const infoBoxTitleStyle = 'text-sm font-bold text-ink uppercase tracking-wider pb-3 border-b border-hairline'

const activeTabOptionTextStyle = 'py-2.5 text-xs tracking-wide border-b-2 transition-all whitespace-nowrap';
const activeTabOptionSelected = 'border-primary text-primary font-semibold';
const activeTabOptionNotSelected = 'border-transparent text-ink-subtle hover:text-ink font-medium';

const businessTypeOptions = [
  { value: 'PRIVATE', label: 'Tư nhân' },
  { value: 'LIMITED_LIABILITY', label: 'TNHH' },
  { value: 'JOINT_STOCK', label: 'Cổ phần' },
];

// we don't use these anymore btw. but it's refactor time so yeah, fix later
interface InfoFieldProps { label: string; val: string | number; isLast?: boolean; }
function InfoField(props: InfoFieldProps) {
  const { isLast = false } = props;
  return (
    <div className={
      `flex justify-between py-2 ${isLast ? '' : 'border-b border-hairline/60'}`
    }>
    <span className="text-ink-subtle">{props.label}</span>
    <span className="font-semibold text-ink">{props.val || 'N/A'}</span>
    </div>
  )
}

export function SupplierProfile() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { user, loginUser, updateUser, token } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'certs'>('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [supplier, setSupplier] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [certForm, setCertForm] = useState({ name: '', issuedBy: '' });
  const [certFile, setCertFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const [createForm, setCreateForm] = useState({ companyName: '', businessType: 'Manufacturer & Trading', description: '', taxCode: '', companyEmail: '', companyPhone: '', legalRepresentative: '' });
  const [isCreating, setIsCreating] = useState(false);

  const [bizLicenseFile, setBizLicenseFile] = useState<File | null>(null);
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [isSubmittingVerification, setIsSubmittingVerification] = useState(false);

  const supplierId = user?.supplier?.id;

  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      return;
    }
    async function loadData() {
      setLoading(true);
      try {
        const [suppRes, prodRes] = await Promise.all([
          api.get(`/suppliers/${supplierId}`),
          api.get(`/products?supplierId=${supplierId}&limit=4`),
        ]);
        const s = suppRes.data;
        setSupplier(s);
        
        if (user && s.status !== user.supplier?.status) {
          updateUser({
            ...user,
            supplier: {
              ...user.supplier!,
              status: s.status,
            }
          });
        }
        
        setCertifications(s.certifications || []);
        setSupplierProducts(prodRes.data.data || []);
      } catch (err) {
        console.error('Failed to load supplier profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supplierId]);

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const res = await api.post('/suppliers/me', createForm);
      if (token && user) {
        loginUser({ ...user, supplier: res.data }, token);
      }
      addToast({ type: 'success', title: 'Thành công', message: 'Đã tạo hồ sơ công ty' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Lỗi', message: err.message || 'Không thể tạo hồ sơ' });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSubmitVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bizLicenseFile && !supplier?.businessLicenseUrl) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng tải lên Giấy ĐKKD' });
      return;
    }
    if (!idCardFile && !supplier?.identityCardUrl) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng tải lên CCCD' });
      return;
    }

    setIsSubmittingVerification(true);
    try {
      let bizLicenseUrl = supplier?.businessLicenseUrl;
      let idCardUrl = supplier?.identityCardUrl;

      if (bizLicenseFile) {
        const formData = new FormData();
        formData.append('file', bizLicenseFile);
        const res = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        bizLicenseUrl = res.data.url || res.data.path;
      }

      if (idCardFile) {
        const formData = new FormData();
        formData.append('file', idCardFile);
        const res = await api.post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        idCardUrl = res.data.url || res.data.path;
      }

      const res = await api.put(`/suppliers/${supplierId}`, {
        businessLicenseUrl: bizLicenseUrl,
        identityCardUrl: idCardUrl,
        status: SupplierStatus.APPLICATION_PENDING
      });

      setSupplier(res.data);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã nộp hồ sơ xác thực. Vui lòng chờ Admin duyệt.' });
      setBizLicenseFile(null);
      setIdCardFile(null);
    } catch (err: any) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể nộp hồ sơ xác thực' });
    } finally {
      setIsSubmittingVerification(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Upload ảnh
      const formData = new FormData();
      formData.append('file', file);
      const uploadRes = await api.post('/uploads', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const logoUrl = uploadRes.data.url;

      // 2. Cập nhật hồ sơ
      const res = await api.put(`/suppliers/${supplierId}`, { logo: logoUrl });
      setSupplier(res.data);
      
      addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật logo doanh nghiệp' });
    } catch (err: any) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật logo' });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCert = async (certId: string) => {
    try {
      await api.delete(`/suppliers/${supplierId}/certifications/${certId}`);
      setCertifications(certifications.filter((c: any) => c.id !== certId));
      addToast({ type: 'success', title: t('delete_cert_title'), message: t('delete_cert_success') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa chứng nhận' });
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    try {
      let documentUrl = '';

      // Upload file trước (nếu có)
      if (certFile) {
        const formData = new FormData();
        formData.append('file', certFile);
        const uploadRes = await api.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        documentUrl = uploadRes.data.url || uploadRes.data.path || '';
      }

      const res = await api.post(`/suppliers/${supplierId}/certifications`, {
        ...certForm,
        documentUrl,
      });
      setCertifications([...certifications, res.data]);
      setIsCertModalOpen(false);
      setCertForm({ name: '', issuedBy: '' });
      setCertFile(null);
      addToast({ type: 'success', title: t('add_cert_title'), message: t('add_cert_success') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể thêm chứng nhận' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </div>
    );
  }

  if (!supplierId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-10 px-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-surface-1 border border-hairline text-primary flex items-center justify-center mx-auto mb-6" style={{ borderRadius: 0 }}>
              <Building2 size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-normal text-ink uppercase mb-3" style={{ letterSpacing: '0.32px' }}>{t('khoi_tao_ho_so_doanh_nghiep')}</h1>
            <p className="text-sm text-ink-muted max-w-md mx-auto" style={{ letterSpacing: '0.16px' }}>
              Hồ sơ doanh nghiệp giúp bạn xây dựng uy tín, tiếp cận hàng ngàn người mua tiềm năng trên nền tảng MIVN.
            </p>
          </div>

          <div className="bg-canvas border border-hairline overflow-hidden" style={{ borderRadius: 0 }}>
            <div className="h-1 w-full bg-primary"></div>
            <div className="p-8 sm:p-10">
              <form onSubmit={handleCreateProfile} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                    <Building2 size={14} className="text-primary" /> Tên công ty chính thức *
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal placeholder:text-ink-subtle focus:outline-none focus:border-b-2 focus:border-b-primary transition-all" 
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    required 
                    value={createForm.companyName} 
                    onChange={e => setCreateForm({...createForm, companyName: e.target.value})} 
                    placeholder="Ví dụ: Công ty TNHH Sản xuất MIVN" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                      <Globe size={14} className="text-primary" /> Lĩnh vực hoạt động
                    </label>
                    <CustomSelect 
                      options={businessTypeOptions}
                      value={createForm.businessType} 
                      onChange={val => setCreateForm({...createForm, businessType: val})}
                      searchable={false}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                      <Shield size={14} className="text-primary" /> Mã số thuế
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal placeholder:text-ink-subtle focus:outline-none focus:border-b-2 focus:border-b-primary transition-all" 
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      value={createForm.taxCode} 
                      onChange={e => setCreateForm({...createForm, taxCode: e.target.value})} 
                      placeholder="Mã số thuế doanh nghiệp" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                      {t('nguoi_dai_dien')}
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal placeholder:text-ink-subtle focus:outline-none focus:border-b-2 focus:border-b-primary transition-all" 
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      value={createForm.legalRepresentative} 
                      onChange={e => setCreateForm({...createForm, legalRepresentative: e.target.value})} 
                      placeholder="Người đại diện pháp luật" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                      Email công ty
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal placeholder:text-ink-subtle focus:outline-none focus:border-b-2 focus:border-b-primary transition-all" 
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      value={createForm.companyEmail} 
                      onChange={e => setCreateForm({...createForm, companyEmail: e.target.value})} 
                      placeholder="Email liên hệ chính thức" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                      Số điện thoại
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal placeholder:text-ink-subtle focus:outline-none focus:border-b-2 focus:border-b-primary transition-all" 
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      value={createForm.companyPhone} 
                      onChange={e => setCreateForm({...createForm, companyPhone: e.target.value})} 
                      placeholder="Hotline / SĐT công ty" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-normal text-ink-subtle uppercase tracking-widest flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
                    <Edit2 size={14} className="text-primary" /> Giới thiệu ngắn gọn
                  </label>
                  <textarea 
                    className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal placeholder:text-ink-subtle focus:outline-none focus:border-b-2 focus:border-b-primary transition-all min-h-[120px] resize-none" 
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    value={createForm.description} 
                    onChange={e => setCreateForm({...createForm, description: e.target.value})} 
                    placeholder="Giới thiệu về thế mạnh, năng lực sản xuất và tầm nhìn của doanh nghiệp..."
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isCreating} 
                    className="w-full bg-primary hover:bg-primary-hover text-white py-4 px-6 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  >
                    <div className="flex items-center justify-center gap-3">
                      {isCreating ? (
                        <Loader2 size={20} className="animate-spin text-white" />
                      ) : (
                        <CheckCircle2 size={20} className="text-white" />
                      )}
                      <span className="text-sm font-normal uppercase tracking-wider">
                        {isCreating ? 'Đang khởi tạo...' : 'LƯU & BẮT ĐẦU KINH DOANH'}
                      </span>
                    </div>
                  </button>
                  <p className="text-center text-[11px] text-ink-subtle mt-4 font-normal" style={{ letterSpacing: '0.16px' }}>
                    Bằng việc tạo hồ sơ, bạn đồng ý với Điều khoản Dịch vụ của MIVN.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Header Card */}
      <div className="bg-canvas border border-hairline p-6 sm:p-8 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {/* Logo (To hơn) */}
          <div className="relative group shrink-0">
            <div className="w-32 h-32 sm:w-36 sm:h-36 bg-surface-1 border border-hairline rounded-xl flex items-center justify-center text-ink-subtle font-medium text-3xl overflow-hidden relative p-3 shadow-inner">
              {uploading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-primary" size={28} />
                </div>
              )}
              {supplier?.logo ? (
                <img src={supplier.logo} alt="Company Logo" className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              ) : (
                <span>{supplier?.companyName?.substring(0, 2).toUpperCase() || 'SP'}</span>
              )}
            </div>
            <label className="absolute -bottom-1.5 -right-1.5 bg-primary text-white p-2 rounded-full hover:bg-primary-hover transition-all shadow-md cursor-pointer" title="Tải ảnh logo">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>

          {/* Info & Horizontal Action Buttons */}
          <div className="space-y-3 flex-1 min-w-0">
            <h2 className="text-base sm:text-lg font-bold text-ink uppercase tracking-tight line-clamp-1">{supplier?.companyName || 'Công ty của bạn'}</h2>

            <div className="flex flex-wrap items-center gap-2">
              {(() => {
                const isVerified = supplier?.status === SupplierStatus.VERIFIED;
                const hasManufacturer = !!supplier?.manufacturerProfile || supplier?.supplierType === 'MANUFACTURER' || supplier?.supplierType === 'MANU_EXPORT' || supplier?.businessType?.toLowerCase().includes('manufacturer');
                const hasExporter = !!supplier?.exporterProfile || supplier?.supplierType === 'EXPORTER' || supplier?.supplierType === 'MANU_EXPORT' || (supplier?.markets && supplier.markets.length > 0);

                return (
                  <>
                    {isVerified && <SupplierBadge type="verified" />}
                    {isVerified && hasManufacturer && <SupplierBadge type="manufacturer" />}
                    {isVerified && hasExporter && <SupplierBadge type="exporter" />}
                  </>
                );
              })()}
            </div>

            <div className="flex items-center gap-1.5 text-xs text-ink-subtle">
              <MapPin size={14} className="text-primary shrink-0" />
              <span className="truncate">{supplier?.address || supplier?.city ? `${supplier?.address || ''}${supplier?.address && supplier?.city ? ', ' : ''}${supplier?.city || ''}${supplier?.province ? `, ${supplier.province}` : ''}` : 'Chưa cập nhật địa chỉ'}</span>
            </div>

            {/* 2 nút nằm ngang nhau ở dưới địa chỉ */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                to={`/suppliers/${supplierId}`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 h-9 px-4 border border-hairline bg-surface-1 hover:bg-surface-2 text-ink text-xs font-normal rounded-lg transition-all shadow-xs leading-none"
              >
                <ExternalLink size={14} /> Xem trang công khai
              </Link>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 h-9 px-4 bg-primary hover:bg-primary-hover text-white text-xs font-normal rounded-lg transition-all shadow-xs leading-none"
              >
                <Edit2 size={14} /> Chỉnh sửa hồ sơ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-hairline bg-canvas rounded-xl shadow-xs overflow-x-auto">
        <div className="flex items-center gap-6 px-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${activeTabOptionTextStyle} ${
              activeTab === 'overview'
                ? activeTabOptionSelected
                : activeTabOptionNotSelected
            }`}
          >
            Thông tin chung
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`${activeTabOptionTextStyle} ${
              activeTab === 'products'
                ? activeTabOptionSelected
                : activeTabOptionNotSelected
            }`}
          >
            Sản phẩm tiêu biểu ({supplierProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`${activeTabOptionTextStyle} ${
              activeTab === 'certs'
                ? activeTabOptionSelected
                : activeTabOptionNotSelected
            }`}
          >
            Chứng nhận & Giải thưởng ({certifications.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Thông tin chung */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Khối Mô tả công ty */}
          <div className={`${boxStyle} pace-y-3`}>
            <h3 className={infoBoxTitleStyle}>
              Giới thiệu công ty
            </h3>
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {supplier?.description || 'Chưa có thông tin giới thiệu chi tiết về công ty.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Thông tin kinh doanh */}
          <div className={`${boxStyle} space-y-5`}>
            <h3 className={infoBoxTitleStyle}>
              Thông tin kinh doanh
            </h3>
            <div className="space-y-3.5 text-xs sm:text-sm">
              <InfoField label='Mã số thuế' val={supplier?.taxCode}/>
              <InfoField label='Người đại diện pháp luật' val={supplier?.legalRepresentative}/>
              <InfoField label='Email công ty' val={supplier?.companyEmail}/>
              <InfoField label='Số điện thoại' val={supplier?.companyPhone}/>
              <InfoField label='Năm thành lập' val={supplier?.yearEstablished}/>
              <InfoField label='Quy mô nhân sự' val={supplier?.employeeCount || supplier?.employee_count}/>
              <InfoField label='Loại hình doanh nghiệp' val={BusinessTypeMap[supplier?.businessType]}
              isLast={true}/>
            </div>
          </div>

          {/* Quy mô & Năng lực */}
          <div className={`${boxStyle} space-y-5`}>
            <h3 className={infoBoxTitleStyle}>
              Quy mô & Năng lực
            </h3>
            <div className="space-y-4 text-xs sm:text-sm">
              <div>
                <span className="text-ink-subtle block mb-2 font-medium">Ngành hàng chính</span>
                <div className="flex flex-wrap gap-1.5">
                  {supplier?.industries && supplier.industries.length > 0 ? (
                    supplier.industries.map((ind: any, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-surface-1 border border-hairline text-ink text-xs rounded-md">
                        {ind.industry || ind}
                      </span>
                    ))
                  ) : (
                    <span className="text-ink-muted italic">Chưa cập nhật</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-hairline/60">
                <span className="text-ink-subtle block mb-2 font-medium">Thị trường xuất khẩu</span>
                <div className="flex flex-wrap gap-1.5">
                  {supplier?.markets && supplier.markets.length > 0 ? (
                    supplier.markets.map((mkt: any, idx: number) => (
                      <span key={idx} className="px-2.5 py-1 bg-primary/5 text-primary border border-primary/20 text-xs rounded-md font-medium">
                        {mkt.market || mkt}
                      </span>
                    ))
                  ) : (
                    <span className="text-ink-muted italic">Chưa cập nhật</span>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-hairline/60">
                <span className="text-ink-subtle block mb-1 font-medium">Địa chỉ trụ sở / Nhà máy</span>
                <p className="text-ink leading-relaxed">
                  {supplier?.address || supplier?.city ? `${supplier?.address || ''}${supplier?.address && supplier?.city ? ', ' : ''}${supplier?.city || ''}${supplier?.province ? `, ${supplier.province}` : ''}` : 'Chưa cập nhật'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Tab 2: Sản phẩm tiêu biểu */}
      {activeTab === 'products' && (
        <div className={`${boxStyle} space-y-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Sản phẩm tiêu biểu ({supplierProducts.length})
            </h3>
            <Link
              to="/dashboard/supplier/products"
              className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-medium"
            >
              <Plus size={14} /> Quản lý sản phẩm
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {supplierProducts.length === 0 && (
              <div className="col-span-4 text-center py-10 bg-surface-1 rounded-xl border border-dashed border-hairline">
                <Package size={32} className="mx-auto text-ink-subtle mb-2" />
                <p className="text-sm text-ink-muted italic mb-4">Chưa có sản phẩm nào được tải lên.</p>
                <Link
                  to="/dashboard/supplier/products"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Plus size={14} /> Thêm sản phẩm đầu tiên
                </Link>
              </div>
            )}
            {supplierProducts.map((product) => (
              <div key={product.id} className="border border-hairline rounded-xl overflow-hidden group hover:shadow-md transition-all bg-canvas flex flex-col">
                <div className="aspect-square relative overflow-hidden bg-surface-1">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/200'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <h4 className="font-semibold text-sm text-ink line-clamp-2 leading-snug group-hover:text-primary transition-colors">{product.name}</h4>
                  <div className="mt-3 pt-2 border-t border-hairline/60 flex items-center justify-between">
                    <div className="text-primary font-bold text-sm">{(product.minPrice || 0).toLocaleString('vi-VN')} ₫</div>
                    {product.minOrderQuantity && (
                      <span className="text-[11px] text-ink-subtle">MOQ: {product.minOrderQuantity}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Chứng nhận & Giải thưởng */}
      {activeTab === 'certs' && (
        <div className={`${boxStyle} space-y-6`}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">
              Chứng nhận & Giải thưởng ({certifications.length})
            </h3>
            <button
              onClick={() => setIsCertModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-medium rounded-lg transition-colors shadow-xs"
            >
              <Plus size={14} /> Thêm mới
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certifications.length === 0 && (
              <div className="col-span-2 text-center py-10 bg-surface-1 rounded-xl border border-dashed border-hairline">
                <Award size={32} className="mx-auto text-ink-subtle mb-2" />
                <p className="text-sm text-ink-muted italic mb-4">Chưa có chứng nhận hoặc giải thưởng nào.</p>
                <button
                  onClick={() => setIsCertModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-white text-xs font-medium rounded-lg hover:bg-primary-hover transition-colors"
                >
                  <Plus size={14} /> Tải lên chứng nhận ngay
                </button>
              </div>
            )}
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 bg-surface-1 border border-hairline rounded-xl flex items-center justify-between group hover:border-primary/40 transition-all">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">{cert.name}</div>
                    {cert.issuedBy && <div className="text-xs text-ink-subtle mt-0.5 truncate">Cấp bởi: {cert.issuedBy}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {cert.documentUrl && (
                    <a
                      href={cert.documentUrl.startsWith('http') ? cert.documentUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${cert.documentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-ink-subtle hover:text-primary transition-colors rounded-lg hover:bg-canvas"
                      title="Xem chứng nhận"
                    >
                      <Eye size={16} />
                    </a>
                  )}
                  <button onClick={() => handleDeleteCert(cert.id)} className="p-2 text-ink-subtle hover:text-red-500 transition-colors rounded-lg hover:bg-canvas" title="Xóa chứng nhận">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('edit_profile_modal_title')} size="xl">
        currently unavailable
      </Modal>

      {/* Add Certification Modal */}
      <Modal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} title={t('add_cert_modal_title')}>
        <form onSubmit={handleAddCert} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('cert_name_label')}</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              placeholder={t('cert_name_placeholder')} 
              required 
              value={certForm.name} 
              onChange={(e) => setCertForm({...certForm, name: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('cert_issuer_label')}</label>
            <input 
              type="text" 
              className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              placeholder={t('cert_issuer_placeholder')} 
              required 
              value={certForm.issuedBy} 
              onChange={(e) => setCertForm({...certForm, issuedBy: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('anhfile_chung_nhan')}</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-ink-muted file:mr-4 file:py-2.5 file:px-4 file:border-0 file:text-sm file:font-normal file:bg-surface-2 file:text-ink hover:file:bg-surface-3 file:cursor-pointer cursor-pointer border border-hairline"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              />
            </div>
            {certFile && (
              <p className="text-xs text-emerald-600 font-normal" style={{ letterSpacing: '0.16px' }}>✓ Đã chọn: {certFile.name}</p>
            )}
            <p className="text-[11px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('ho_tro_anh_jpg_png_hoac_pdf_toi_da_5mb')}</p>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-hairline">
            <button 
              type="button" 
              onClick={() => setIsCertModalOpen(false)} 
              className="bg-surface-2 hover:bg-surface-3 text-ink text-xs font-normal px-4 py-2"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              {t('cancel_btn')}
            </button>
            <button 
              type="submit" 
              disabled={uploading} 
              className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-4 py-2 flex items-center gap-2"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              {uploading && <Loader2 size={14} className="animate-spin" />}
              {uploading ? 'Đang tải lên...' : t('upload_btn')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
