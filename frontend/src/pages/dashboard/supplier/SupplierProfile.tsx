import React, { useState, useEffect } from 'react';
import { Building2, MapPin, Globe, Award, Shield, CheckCircle2, Edit2, Camera, Plus, Trash2, X, Loader2, Eye } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { SupplierBadge } from '../../../components/ui/SupplierBadge';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

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

  const [editForm, setEditForm] = useState({ companyName: '', businessType: '', description: '', taxCode: '', companyEmail: '', companyPhone: '', legalRepresentative: '', address: '' });
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
        
        if (user && s.verificationStatus !== user.supplier?.verificationStatus) {
          updateUser({
            ...user,
            supplier: {
              ...user.supplier!,
              verificationStatus: s.verificationStatus,
              isVerified: s.verificationStatus === 'VERIFIED'
            }
          });
        }
        
        setCertifications(s.certifications || []);
        setEditForm({
          companyName: s.companyName || '',
          businessType: s.businessType || '',
          description: s.description || '',
          taxCode: s.taxCode || '',
          companyEmail: s.companyEmail || '',
          companyPhone: s.companyPhone || '',
          legalRepresentative: s.legalRepresentative || '',
          address: s.address || '',
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
        verificationStatus: 'PENDING'
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
      const res = await api.put(`/suppliers/${supplierId}`, editForm);
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
        <h1 className="text-xl font-bold text-slate-900">{t('supplier_profile_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('supplier_profile_subtitle')}</p>
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
            <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 size={40} strokeWidth={1.5} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Khởi tạo Hồ sơ Doanh nghiệp</h1>
            <p className="text-base text-slate-500 max-w-md mx-auto">
              Hồ sơ doanh nghiệp giúp bạn xây dựng uy tín, tiếp cận hàng ngàn người mua tiềm năng trên nền tảng MIVN.
            </p>
          </div>

          <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
            <div className="h-2 w-full bg-gradient-to-r from-primary via-blue-400 to-primary"></div>
            <div className="p-8 sm:p-10">
              <form onSubmit={handleCreateProfile} className="space-y-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Building2 size={14} className="text-primary" /> Tên công ty chính thức *
                  </label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    required 
                    value={createForm.companyName} 
                    onChange={e => setCreateForm({...createForm, companyName: e.target.value})} 
                    placeholder="Ví dụ: Công ty TNHH Sản xuất MIVN" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Globe size={14} className="text-primary" /> Lĩnh vực hoạt động
                    </label>
                    <select 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none" 
                      value={createForm.businessType} 
                      onChange={e => setCreateForm({...createForm, businessType: e.target.value})}
                    >
                      <option value="Manufacturer & Trading">{t('biz_type_manufacturer_trading')}</option>
                      <option value="E-Commerce">{t('biz_type_ecommerce')}</option>
                      <option value="Agriculture">{t('biz_type_agriculture')}</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Shield size={14} className="text-primary" /> Mã số thuế
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      value={createForm.taxCode} 
                      onChange={e => setCreateForm({...createForm, taxCode: e.target.value})} 
                      placeholder="Mã số thuế doanh nghiệp" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Người đại diện
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      value={createForm.legalRepresentative} 
                      onChange={e => setCreateForm({...createForm, legalRepresentative: e.target.value})} 
                      placeholder="Người đại diện pháp luật" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Email công ty
                    </label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      value={createForm.companyEmail} 
                      onChange={e => setCreateForm({...createForm, companyEmail: e.target.value})} 
                      placeholder="Email liên hệ chính thức" 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      Số điện thoại
                    </label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      value={createForm.companyPhone} 
                      onChange={e => setCreateForm({...createForm, companyPhone: e.target.value})} 
                      placeholder="Hotline / SĐT công ty" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Edit2 size={14} className="text-primary" /> Giới thiệu ngắn gọn
                  </label>
                  <textarea 
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-[120px] resize-none" 
                    value={createForm.description} 
                    onChange={e => setCreateForm({...createForm, description: e.target.value})} 
                    placeholder="Giới thiệu về thế mạnh, năng lực sản xuất và tầm nhìn của doanh nghiệp..."
                  ></textarea>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isCreating} 
                    className="w-full relative group overflow-hidden bg-slate-900 text-white rounded-xl font-bold py-4 px-6 transition-all hover:bg-slate-800 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                    <div className="relative flex items-center justify-center gap-3">
                      {isCreating ? (
                        <Loader2 size={20} className="animate-spin text-primary" />
                      ) : (
                        <CheckCircle2 size={20} className="text-primary group-hover:scale-110 transition-transform" />
                      )}
                      <span className="text-base tracking-wide">
                        {isCreating ? 'Đang khởi tạo...' : 'LƯU & BẮT ĐẦU KINH DOANH'}
                      </span>
                    </div>
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-4 font-medium">
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
        <h1 className="text-xl font-bold text-slate-900">{t('supplier_profile_title')}</h1>
        <p className="text-sm text-slate-500 mt-1">{t('supplier_profile_subtitle')}</p>
      </div>
      {/* Company Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-28 sm:h-28 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl overflow-hidden relative">
              {uploading && (
                <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-primary" size={24} />
                </div>
              )}
              {supplier?.logo ? (
                <img src={supplier.logo} alt="Company Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              ) : (
                <span>{supplier?.companyName?.substring(0, 2).toUpperCase() || 'SP'}</span>
              )}
            </div>
            <label className="absolute -bottom-2 -right-2 bg-primary text-white p-2 text-xs rounded-lg shadow-lg hover:bg-primary-dark transition-colors cursor-pointer">
              <Camera size={16} />
              <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} disabled={uploading} />
            </label>
          </div>
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">{supplier?.companyName || 'Công ty của bạn'}</h2>
              {supplier?.isVerified && <SupplierBadge type="verified" />}
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Building2 size={14} className="text-primary" />
                <span>{supplier?.businessType || t('biz_type_manufacturer_trading')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <MapPin size={14} className="text-primary" />
                <span>{supplier?.city ? `${supplier.city}, ${supplier.province}` : t('location_hanoi')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Globe size={14} className="text-primary" />
                <span>{supplier?.website || 'N/A'}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {supplier?.description || 'Chưa có mô tả.'}
            </p>
            <button 
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline mt-1"
            >
              <Edit2 size={12} /> Chỉnh sửa hồ sơ
            </button>
          </div>
        </div>
      </div>

      {/* Business Info + Certifications Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Business Info Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-primary" /> {t('biz_info_title')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('year_established')}</span>
              <span className="text-sm font-semibold text-slate-800">{supplier?.yearEstablished || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mã số thuế</span>
              <span className="text-sm font-semibold text-slate-800">{supplier?.taxCode || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Người đại diện</span>
              <span className="text-sm font-semibold text-slate-800">{supplier?.legalRepresentative || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Email công ty</span>
              <span className="text-sm font-semibold text-slate-800">{supplier?.companyEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Số điện thoại</span>
              <span className="text-sm font-semibold text-slate-800">{supplier?.companyPhone || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('total_employees')}</span>
              <span className="text-sm font-semibold text-slate-800">{supplier?.employeeCount || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('main_markets')}</span>
              <span className="text-sm font-semibold text-slate-800 text-right max-w-[200px]">{supplier?.markets?.map((m: any) => m.market).join(', ') || 'N/A'}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Industries</span>
              <span className="text-sm font-semibold text-slate-800 text-right max-w-[200px]">{supplier?.industries?.map((i: any) => i.industry).join(', ') || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Certifications Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-primary" /> {t('certs_awards_title')}
            </h3>
            <button onClick={() => setIsCertModalOpen(true)} className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
              <Plus size={12} /> {t('add_new_btn')}
            </button>
          </div>
          <div className="space-y-3">
            {certifications.length === 0 && <p className="text-sm text-slate-400 italic py-4">Chưa có chứng nhận nào.</p>}
            {certifications.map((cert) => (
              <div key={cert.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between group hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center shadow-sm border border-slate-100"><CheckCircle2 size={18} className="text-green-500" /></div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{cert.name}</div>
                    {cert.issuedBy && <div className="text-[10px] text-slate-400 font-medium mt-0.5">Cấp bởi: {cert.issuedBy}</div>}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {cert.documentUrl && (
                    <a
                      href={cert.documentUrl.startsWith('http') ? cert.documentUrl : `${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${cert.documentUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-300 hover:text-blue-500 transition-colors"
                      title="Xem chứng nhận"
                    >
                      <Eye size={14} />
                    </a>
                  )}
                  <button onClick={() => handleDeleteCert(cert.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors" title="Xóa chứng nhận"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Products Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
          <Shield size={16} className="text-primary" /> {t('featured_products_profile')}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {supplierProducts.length === 0 && <p className="text-sm text-slate-400 italic col-span-4">Chưa có sản phẩm nào.</p>}
          {supplierProducts.map(product => (
            <div key={product.id} className="rounded-xl overflow-hidden border border-slate-100 group hover:shadow-md transition-shadow">
              <div className="aspect-square relative overflow-hidden bg-slate-100">
                <img src={product.images?.[0] || 'https://via.placeholder.com/200'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-sm text-slate-800 line-clamp-1">{product.name}</h4>
                <div className="text-primary font-bold text-xs mt-1">{(product.minPrice || 0).toLocaleString('vi-VN')} ₫</div>
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
              <label className="input-label">{t('company_name_en_label')}</label>
              <input type="text" className="input" value={editForm.companyName} onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="input-label">{t('biz_type_label')}</label>
              <select className="input" value={editForm.businessType} onChange={(e) => setEditForm({...editForm, businessType: e.target.value})}>
                <option value="Manufacturer & Trading">{t('biz_type_manufacturer_trading')}</option>
                <option value="E-Commerce">{t('biz_type_ecommerce')}</option>
                <option value="Agriculture">{t('biz_type_agriculture')}</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="input-label">Mã số thuế</label>
              <input type="text" className="input" value={editForm.taxCode} onChange={(e) => setEditForm({...editForm, taxCode: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="input-label">Người đại diện</label>
              <input type="text" className="input" value={editForm.legalRepresentative} onChange={(e) => setEditForm({...editForm, legalRepresentative: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="input-label">Email công ty</label>
              <input type="email" className="input" value={editForm.companyEmail} onChange={(e) => setEditForm({...editForm, companyEmail: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="input-label">Số điện thoại</label>
              <input type="text" className="input" value={editForm.companyPhone} onChange={(e) => setEditForm({...editForm, companyPhone: e.target.value})} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="input-label">Địa chỉ trụ sở</label>
              <input type="text" className="input" value={editForm.address} onChange={(e) => setEditForm({...editForm, address: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="input-label">{t('short_desc_label')}</label>
            <textarea className="input min-h-[100px]" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-ghost">{t('cancel_btn')}</button>
            <button type="submit" className="btn-primary">{t('save_changes_btn')}</button>
          </div>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} title={t('add_cert_modal_title')}>
        <form onSubmit={handleAddCert} className="space-y-6">
          <div className="space-y-2">
            <label className="input-label">{t('cert_name_label')}</label>
            <input type="text" className="input" placeholder={t('cert_name_placeholder')} required value={certForm.name} onChange={(e) => setCertForm({...certForm, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="input-label">{t('cert_issuer_label')}</label>
            <input type="text" className="input" placeholder={t('cert_issuer_placeholder')} required value={certForm.issuedBy} onChange={(e) => setCertForm({...certForm, issuedBy: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="input-label">Ảnh/File chứng nhận</label>
            <div className="relative">
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setCertFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl"
              />
            </div>
            {certFile && (
              <p className="text-xs text-emerald-600 font-medium">✓ Đã chọn: {certFile.name}</p>
            )}
            <p className="text-[11px] text-slate-400">Hỗ trợ: Ảnh (JPG, PNG) hoặc PDF. Tối đa 5MB.</p>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsCertModalOpen(false)} className="btn-ghost">{t('cancel_btn')}</button>
            <button type="submit" disabled={uploading} className="btn-primary flex items-center gap-2">
              {uploading && <Loader2 size={14} className="animate-spin" />}
              {uploading ? 'Đang tải lên...' : t('upload_btn')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
