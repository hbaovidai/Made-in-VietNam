import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Award, Shield, CheckCircle2, Edit2, Camera, Plus, Trash2, X, Loader2, Eye } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { SupplierBadge } from '../../../components/ui/SupplierBadge';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';
import { SupplierStatus } from '@/src/lib/enums';

export function SupplierProfile() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { user, loginUser, updateUser, token } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [supplier, setSupplier] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // const [editForm, setEditForm] = useState({ companyName: '', businessType: '', description: '', taxCode: '', companyEmail: '', companyPhone: '', legalRepresentative: '', address: '' });
  const [editForm, setEditForm] = useState({ companyName: '', businessType: '', description: '', companyEmail: '', companyPhone: '', legalRepName: '', industries: [] as string[], markets: [] as string[] });
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
        setEditForm({
          companyName: s.companyName || '',
          businessType: s.businessType || '',
          description: s.description || '',
          companyEmail: s.companyEmail || '',
          companyPhone: s.companyPhone || '',
          legalRepName: s.legalRepName || '',
          industries: s.industries ? s.industries.map((i: any) => i.industry) : [],
          markets: s.markets ? s.markets.map((m: any) => m.market) : [],
        });
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

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Filter out empty string fields to avoid DTO validation errors
      const payload: Record<string, any> = {};
      for (const [key, value] of Object.entries(editForm)) {
        if (Array.isArray(value)) {
          payload[key] = value; // always send arrays (industries, markets)
        } else if (value !== '') {
          payload[key] = value;
        }
      }
      const res = await api.put(`/suppliers/${supplierId}`, payload);
      setSupplier(res.data);
      setIsEditModalOpen(false);
      addToast({ type: 'success', title: t('update_profile_success_title'), message: t('update_profile_success_desc') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật hồ sơ' });
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
      <div>
        <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('supplier_profile_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('supplier_profile_subtitle')}</p>
      </div>
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
                    <select 
                      className="w-full px-4 py-3.5 bg-surface-1 border border-hairline text-ink font-normal focus:outline-none focus:border-b-2 focus:border-b-primary transition-all appearance-none" 
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      value={createForm.businessType} 
                      onChange={e => setCreateForm({...createForm, businessType: e.target.value})}
                    >
                      <option value="Manufacturer & Trading">{t('biz_type_manufacturer_trading')}</option>
                      <option value="E-Commerce">{t('biz_type_ecommerce')}</option>
                      <option value="Agriculture">{t('biz_type_agriculture')}</option>
                    </select>
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
      <div>
        <h1 className="text-xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>{t('supplier_profile_title')}</h1>
        <p className="text-sm text-ink-muted mt-1" style={{ letterSpacing: '0.16px' }}>{t('supplier_profile_subtitle')}</p>
      </div>
      {/* Company Header Card */}
      <div className="bg-canvas border border-hairline p-6 sm:p-8" style={{ borderRadius: 0 }}>
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center gap-3">
            <div className="relative group">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-surface-1 border border-hairline flex items-center justify-center text-ink-subtle font-light text-2xl overflow-hidden relative p-2" style={{ borderRadius: 0 }}>
                {uploading && (
                  <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                    <Loader2 className="animate-spin text-primary" size={24} />
                  </div>
                )}
                {supplier?.logo ? (
                  <img src={supplier.logo} alt="Company Logo" className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                ) : (
                  <span>{supplier?.companyName?.substring(0, 2).toUpperCase() || 'SP'}</span>
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2 text-xs hover:bg-primary-hover transition-colors cursor-pointer" style={{ borderRadius: 0 }}>
                <Camera size={16} />
                <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
              </label>
            </div>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-normal text-primary hover:text-primary-hover transition-colors"
              style={{ letterSpacing: '0.16px' }}
            >
              <Edit2 size={12} /> Chỉnh sửa hồ sơ
            </button>
          </div>
          <div className="space-y-3 flex-1">
            <h2 className="text-lg sm:text-2xl font-normal text-ink uppercase tracking-tight" style={{ letterSpacing: '0.32px' }}>{supplier?.companyName || 'Công ty của bạn'}</h2>
            <div className="flex flex-wrap gap-2">
              {supplier?.status === SupplierStatus.VERIFIED && <SupplierBadge type="verified" />}
            </div>
            <div className="flex items-center gap-2 text-xs font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>
              <MapPin size={14} className="text-primary" />
              <span>{supplier?.address || supplier?.city ? `${supplier?.address || ''}${supplier?.address && supplier?.city ? ', ' : ''}${supplier?.city || ''}${supplier?.province ? `, ${supplier.province}` : ''}` : 'Chưa cập nhật địa chỉ'}</span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed max-w-3xl" style={{ letterSpacing: '0.16px' }}>
              {supplier?.description || 'Chưa có mô tả.'}
            </p>
          </div>
        </div>
      </div>

      {/* Business Info + Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Business Info Card */}
        <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
          <h3 className="text-sm font-normal text-ink uppercase tracking-wider flex items-center gap-2 mb-5" style={{ letterSpacing: '0.32px' }}>
            <Building2 size={16} className="text-primary" /> {t('biz_info_title')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('year_established')}</span>
              <span className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{supplier?.yearEstablished || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>Mã số thuế</span>
              <span className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{supplier?.taxCode || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('nguoi_dai_dien')}</span>
              <span className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{supplier?.legalRepresentative || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>Email công ty</span>
              <span className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{supplier?.companyEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>Số điện thoại</span>
              <span className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{supplier?.companyPhone || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('total_employees')}</span>
              <span className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{supplier?.employeeCount || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-hairline">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>{t('main_markets')}</span>
              <span className="text-sm font-normal text-ink text-right max-w-[200px]" style={{ letterSpacing: '0.16px' }}>{supplier?.markets?.map((m: any) => m.market).join(', ') || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-normal text-ink-subtle uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>Industries</span>
              <span className="text-sm font-normal text-ink text-right max-w-[200px]" style={{ letterSpacing: '0.16px' }}>{supplier?.industries?.map((i: any) => i.industry).join(', ') || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-normal text-ink uppercase tracking-wider flex items-center gap-2" style={{ letterSpacing: '0.32px' }}>
              <Award size={16} className="text-primary" /> {t('certs_awards_title')}
            </h3>
            <button 
              onClick={() => setIsCertModalOpen(true)} 
              className="text-xs font-normal text-primary hover:text-primary-hover flex items-center gap-1"
              style={{ letterSpacing: '0.16px' }}
            >
              <Plus size={12} /> {t('add_new_btn')}
            </button>
          </div>
          <div className="space-y-3">
            {certifications.length === 0 && <p className="text-sm text-ink-muted italic py-4" style={{ letterSpacing: '0.16px' }}>{t('chua_co_chung_nhan_nao')}</p>}
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 bg-surface-1 border border-hairline flex items-center justify-between group transition-colors" style={{ borderRadius: 0 }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-canvas border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}><CheckCircle2 size={18} className="text-green-500" /></div>
                  <div>
                    <div className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>{cert.name}</div>
                    {cert.issuedBy && <div className="text-[10px] text-ink-subtle font-normal mt-0.5" style={{ letterSpacing: '0.16px' }}>Cấp bởi: {cert.issuedBy}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cert.documentUrl && (
                    <a
                      href={cert.documentUrl.startsWith('http') ? cert.documentUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${cert.documentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-ink-subtle hover:text-primary transition-colors"
                      title="Xem chứng nhận"
                    >
                      <Eye size={14} />
                    </a>
                  )}
                  <button onClick={() => handleDeleteCert(cert.id)} className="p-1.5 text-ink-subtle hover:text-red-500 transition-colors" title="Xóa chứng nhận"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Card */}
      <div className="bg-canvas border border-hairline p-6" style={{ borderRadius: 0 }}>
        <h3 className="text-sm font-normal text-ink uppercase tracking-wider flex items-center gap-2 mb-5" style={{ letterSpacing: '0.32px' }}>
          <Shield size={16} className="text-primary" /> {t('featured_products_profile')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {supplierProducts.length === 0 && <p className="text-sm text-ink-muted italic col-span-4" style={{ letterSpacing: '0.16px' }}>{t('chua_co_san_pham_nao')}</p>}
          {supplierProducts.map(product => (
            <div key={product.id} className="border border-hairline group hover:bg-surface-1 transition-all" style={{ borderRadius: 0 }}>
              <div className="aspect-square relative overflow-hidden bg-surface-1">
                <img src={product.images?.[0] || 'https://via.placeholder.com/200'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="p-3">
                <h4 className="font-normal text-sm text-ink line-clamp-1" style={{ letterSpacing: '0.16px' }}>{product.name}</h4>
                <div className="text-primary font-normal text-xs mt-1" style={{ letterSpacing: '0.16px' }}>{(product.minPrice || 0).toLocaleString('vi-VN')} ₫</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('edit_profile_modal_title')}>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('company_name_en_label')}</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                value={editForm.companyName} 
                onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('biz_type_label')}</label>
              <select 
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                value={editForm.businessType} 
                onChange={(e) => setEditForm({...editForm, businessType: e.target.value})}
              >
                <option value="">-- Chọn loại hình --</option>
                <option value="PRIVATE">Tư nhân</option>
                <option value="LIMITED_LIABILITY">TNHH</option>
                <option value="JOINT_STOCK">Cổ phần</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('nguoi_dai_dien')}</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                value={editForm.legalRepName} 
                onChange={(e) => setEditForm({...editForm, legalRepName: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Email công ty</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                value={editForm.companyEmail} 
                onChange={(e) => setEditForm({...editForm, companyEmail: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Số điện thoại</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary" 
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                value={editForm.companyPhone} 
                onChange={(e) => setEditForm({...editForm, companyPhone: e.target.value})} 
              />
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Ngành hàng</label>
              <div className="flex flex-wrap gap-2 p-3 bg-surface-1 border border-hairline min-h-[44px]" style={{ borderRadius: 0 }}>
                {['Nông sản', 'Thực phẩm & Đồ uống', 'Cà phê & Trà', 'Thủy hải sản', 'Dệt may & May mặc', 'Nội thất & Trang trí', 'Thủ công mỹ nghệ', 'Vật tư công nghiệp', 'Mỹ phẩm & Chăm sóc cá nhân', 'Điện tử', 'Sữa & Sản phẩm từ sữa', 'Gỗ & Lâm sản', 'Da giày', 'Cơ khí & Kim loại'].map((ind) => {
                  const isSelected = editForm.industries.includes(ind);
                  return (
                    <button
                      type="button"
                      key={ind}
                      onClick={() => {
                        const next = isSelected
                          ? editForm.industries.filter((i) => i !== ind)
                          : [...editForm.industries, ind];
                        setEditForm({ ...editForm, industries: next });
                      }}
                      className={`px-3 py-1.5 text-xs font-normal border transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-1 text-ink border-hairline hover:bg-surface-2'
                      }`}
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    >
                      {ind}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Thị trường xuất khẩu</label>
              <div className="flex flex-wrap gap-2 p-3 bg-surface-1 border border-hairline min-h-[44px]" style={{ borderRadius: 0 }}>
                {['Việt Nam', 'Hoa Kỳ', 'Châu Âu', 'Nhật Bản', 'Hàn Quốc', 'Trung Quốc', 'Đông Nam Á', 'Úc & New Zealand', 'Trung Đông', 'Châu Phi'].map((mkt) => {
                  const isSelected = editForm.markets.includes(mkt);
                  return (
                    <button
                      type="button"
                      key={mkt}
                      onClick={() => {
                        const next = isSelected
                          ? editForm.markets.filter((m) => m !== mkt)
                          : [...editForm.markets, mkt];
                        setEditForm({ ...editForm, markets: next });
                      }}
                      className={`px-3 py-1.5 text-xs font-normal border transition-all ${
                        isSelected
                          ? 'bg-primary text-white border-primary'
                          : 'bg-surface-1 text-ink border-hairline hover:bg-surface-2'
                      }`}
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    >
                      {mkt}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>{t('short_desc_label')}</label>
            <textarea 
              className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary min-h-[100px]" 
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              value={editForm.description} 
              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
            />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-hairline">
            <button 
              type="button" 
              onClick={() => setIsEditModalOpen(false)} 
              className="bg-surface-2 hover:bg-surface-3 text-ink text-xs font-normal px-4 py-2"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              {t('cancel_btn')}
            </button>
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-4 py-2"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              {t('save_changes_btn')}
            </button>
          </div>
        </form>
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
