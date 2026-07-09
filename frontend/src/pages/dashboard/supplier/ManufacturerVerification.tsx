import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Building2, Shield, Loader2, Upload, FileText, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';
import { SupplierStatus } from '@/src/lib/enums';

// Enum options for selectors
const PRODUCTION_FORMS = [
  { value: 'OWNED', label: 'Sở hữu nhà xưởng' },
  { value: 'RENTED', label: 'Thuê nhà xưởng/gia công' },
  { value: 'COOPERATION', label: 'Hợp tác với xưởng sản xuất' },
];

const FACTORY_SCALES = [
  { value: 'UNDER_500', label: 'Dưới 500m²' },
  { value: '500_2000', label: '500–2.000m²' },
  { value: '2000_10000', label: '2.000–10.000m²' },
  { value: 'OVER_10000', label: 'Trên 10.000m²' },
];

const WORKER_COUNTS = [
  { value: '1_10', label: '1–10' },
  { value: '11_50', label: '11–50' },
  { value: '51_200', label: '51–200' },
  { value: 'OVER_200', label: 'Trên 200' },
];

const VIETNAM_PROVINCES = [
  'Hà Nội', 'TP. Hồ Chí Minh', 'Bình Dương', 'Đồng Nai', 'Long An', 'Bắc Ninh',
  'Hải Phòng', 'Đà Nẵng', 'Hải Dương', 'Hưng Yên', 'Quảng Ninh', 'Thanh Hóa',
  'Nghệ An', 'Thừa Thiên Huế', 'Cần Thơ', 'Vĩnh Long', 'Bến Tre', 'Tây Ninh'
];

const INDUSTRIES_LIST = [
  'Electronics & Electrical',
  'Machinery & Industrial Equipment',
  'Textiles & Garments',
  'Food & Beverage',
  'Chemicals & Plastics',
  'Construction Materials',
  'Furniture & Home Decor',
  'Packaging & Printing',
  'Auto Parts & Accessories',
  'Agriculture & Farming',
  'Health & Medical',
  'Metals & Mining'
];

interface FormState {
  companyName: string;
  taxCode: string;
  businessType: string;
  companyAddress: string;
  productionForm: string;
  province: string;
  district: string;
  ward: string;
  streetAddress: string;
  factoryScale: string;
  workerCount: string;
  monthlyCapacity: string;
  mainCategories: string[];
  mainProducts: string;
  driveLink: string;
  adminNotes: string;
}

export function ManufacturerVerification() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [supplier, setSupplier] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasPendingRequest, setHasPendingRequest] = useState(false);

  // Form State
  const [form, setForm] = useState<FormState>({
    companyName: '',
    taxCode: '',
    businessType: '',
    companyAddress: '',
    productionForm: '',
    province: '',
    district: '',
    ward: '',
    streetAddress: '',
    factoryScale: '',
    workerCount: '',
    monthlyCapacity: '',
    mainCategories: [],
    mainProducts: '',
    driveLink: '',
    adminNotes: '',
  });

  // Files state
  const [factoryImages, setFactoryImages] = useState<File[]>([]);
  const [safetyCert, setSafetyCert] = useState<File | null>(null);
  const [productionCert, setProductionCert] = useState<File | null>(null);

  // Uploaded URLs
  const [factoryImageUrls, setFactoryImageUrls] = useState<string[]>([]);
  const [safetyCertUrl, setSafetyCertUrl] = useState<string>('');
  const [productionCertUrl, setProductionCertUrl] = useState<string>('');

  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'files', string>>>({});

  const supplierId = user?.supplier?.id;

  // Load supplier details
  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      return;
    }

    async function loadSupplierData() {
      try {
        const [suppRes, reqRes] = await Promise.all([
          api.get(`/suppliers/${supplierId}`),
          api.get(`/manufacturer-verification-requests/my-request`).catch(() => ({ data: null }))
        ]);

        const s = suppRes.data;
        setSupplier(s);

        // Pre-fill company fields from API data
        setForm(prev => ({
          ...prev,
          companyName: s.companyName || '',
          taxCode: s.taxCode || '',
          businessType: s.businessType || '',
          companyAddress: s.address || '',
        }));

        // Check if there is an existing pending request
        const requestExists = s?.status === SupplierStatus.APPLICATION_PENDING ||
          reqRes?.data?.status === SupplierStatus.APPLICATION_PENDING;
        if (requestExists) setHasPendingRequest(true);

      } catch (err) {
        console.error('Failed to load supplier/verification data', err);
      } finally {
        setLoading(false);
      }
    }

    loadSupplierData();
  }, [supplierId]);

  const validateUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'images' | 'safety' | 'production'
  ) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'];
    const maxSizeBytes = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        addToast({ type: 'error', title: 'Lỗi định dạng', message: `File ${file.name} không đúng định dạng (chỉ nhận PNG, JPG, PDF)` });
        return;
      }
      if (file.size > maxSizeBytes) {
        addToast({ type: 'error', title: 'Lỗi dung lượng', message: `File ${file.name} vượt quá giới hạn 10MB` });
        return;
      }
    }

    if (type === 'images') {
      setFactoryImages(prev => [...prev, ...files].slice(0, 10)); // Max 10 photos
    } else if (type === 'safety') {
      setSafetyCert(files[0] || null);
    } else if (type === 'production') {
      setProductionCert(files[0] || null);
    }
  };

  const removeFactoryImage = (index: number) => {
    setFactoryImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadSingleFile = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.url || res.data.path || '';
  };

  const handleCategoryToggle = (category: string) => {
    setForm(prev => {
      const list = prev.mainCategories.includes(category)
        ? prev.mainCategories.filter(c => c !== category)
        : [...prev.mainCategories, category];
      return { ...prev, mainCategories: list };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasPendingRequest || !supplier) return;

    // Validate inputs
    const newErrors: any = {};
    if (!form.productionForm) newErrors.productionForm = 'Vui lòng chọn hình thức sản xuất';
    if (!form.province) newErrors.province = 'Vui lòng chọn Tỉnh/Thành phố';
    if (!form.district.trim()) newErrors.district = 'Vui lòng nhập Quận/Huyện';
    if (!form.ward.trim()) newErrors.ward = 'Vui lòng nhập Phường/Xã';
    if (!form.streetAddress.trim()) newErrors.streetAddress = 'Vui lòng nhập số nhà, tên đường';
    if (!form.factoryScale) newErrors.factoryScale = 'Vui lòng chọn quy mô nhà xưởng';
    if (!form.workerCount) newErrors.workerCount = 'Vui lòng chọn số lượng nhân sự';
    if (!form.monthlyCapacity.trim()) newErrors.monthlyCapacity = 'Vui lòng nhập năng lực sản xuất mỗi tháng';
    if (form.mainCategories.length === 0) newErrors.mainCategories = 'Vui lòng chọn ít nhất 1 ngành sản xuất';
    if (!form.mainProducts.trim()) newErrors.mainProducts = 'Vui lòng nhập sản phẩm chính';
    if (!form.driveLink.trim()) {
      newErrors.driveLink = 'Vui lòng nhập link Google Drive';
    } else if (!validateUrl(form.driveLink)) {
      newErrors.driveLink = 'Link Google Drive không đúng định dạng URL';
    }

    if (factoryImages.length === 0) {
      newErrors.files = 'Vui lòng tải lên ít nhất 1 ảnh nhà xưởng / máy móc / dây chuyền';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addToast({ type: 'error', title: 'Lỗi xác thực', message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload files
      addToast({ type: 'info', title: 'Đang tải lên tài liệu', message: 'Hệ thống đang tải lên các tệp tin của bạn...' });
      
      const uploadedImages = await Promise.all(factoryImages.map(file => uploadSingleFile(file)));
      let uploadedSafetyCert = '';
      let uploadedProductionCert = '';

      if (safetyCert) {
        uploadedSafetyCert = await uploadSingleFile(safetyCert);
      }
      if (productionCert) {
        uploadedProductionCert = await uploadSingleFile(productionCert);
      }

      // 2. Submit data to endpoint
      const payload = {
        supplierId,
        productionForm: form.productionForm,
        factoryAddress: `${form.streetAddress}, ${form.ward}, ${form.district}, ${form.province}`,
        factoryScale: form.factoryScale,
        workerCount: form.workerCount,
        monthlyCapacity: form.monthlyCapacity,
        mainCategories: form.mainCategories,
        mainProducts: form.mainProducts,
        driveLink: form.driveLink,
        adminNotes: form.adminNotes,
        factoryImages: uploadedImages,
        safetyCertUrl: uploadedSafetyCert,
        productionCertUrl: uploadedProductionCert,
        status: 'PENDING',
      };

      await api.post('/manufacturer-verification-requests', payload);

      setHasPendingRequest(true);
      addToast({
        type: 'success',
        title: 'Gửi yêu cầu thành công',
        message: 'Your manufacturer verification request has been submitted and is waiting for admin review.',
      });
    } catch (err: any) {
      console.error('Failed to submit verification request', err);
      addToast({
        type: 'error',
        title: 'Lỗi hệ thống',
        message: err.message || 'Không thể gửi yêu cầu xác minh. Vui lòng thử lại sau.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 min-h-[50vh]">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-slate-500 text-sm mt-3 font-medium">{t('dang_tai_du_lieu_doanh_nghiep')}</p>
      </div>
    );
  }

  if (!supplierId || !supplier) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-100">
          <AlertCircle size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{t('chua_tim_thay_ho_so_nha_cung_cap')}</h2>
        <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
          Bạn chưa khởi tạo hồ sơ doanh nghiệp. Vui lòng hoàn tất đăng ký thông tin nhà cung cấp trước khi yêu cầu xác minh Nhà sản xuất.
        </p>
        <button
          onClick={() => navigate('/dashboard/supplier/profile')}
          className="btn-primary"
        >
          Tạo Hồ sơ Doanh nghiệp
        </button>
      </div>
    );
  }

  // Calculate dynamic steps
  const isStep1Done = !!supplier;
  const isStep2Done = !!form.productionForm && !!form.province && !!form.district && !!form.ward && !!form.streetAddress && !!form.factoryScale && !!form.workerCount && !!form.monthlyCapacity && form.mainCategories.length > 0 && !!form.mainProducts;
  const isStep3Done = !!form.driveLink && factoryImages.length > 0;

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Back button & Title */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard/supplier/profile')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-dark transition-colors mb-3 uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Company Profile
        </button>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <Shield className="text-primary fill-primary/10" size={24} /> Apply for Verified Manufacturer
        </h1>
        <p className="text-sm text-slate-500 mt-1">{t('cung_cap_nang_luc_san_xuat_cua_doanh_ngh')}</p>
      </div>


      {/* Pending status warning */}
      {hasPendingRequest && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8 flex items-start gap-3">
          <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={20} />
          <div>
            <h4 className="text-sm font-bold text-amber-800">{t('yeu_cau_dang_cho_phe_duyet')}</h4>
            <p className="text-xs text-amber-700 mt-1 leading-relaxed">
              Yêu cầu Verified Manufacturer của bạn đang chờ admin duyệt. Vui lòng chờ kết quả từ bộ phận kiểm duyệt.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* CARD 1: Company Info */}
        <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm ${hasPendingRequest ? 'opacity-70 pointer-events-none' : ''}`}>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-5">
            <Building2 size={16} className="text-primary" /> Thông tin doanh nghiệp hiện tại
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('ten_doanh_nghiep_1')}</label>
              <input
                type="text"
                placeholder="Tên doanh nghiệp"
                value={form.companyName}
                onChange={e => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Mã số thuế</label>
              <input
                type="text"
                placeholder="Mã số thuế"
                value={form.taxCode}
                onChange={e => setForm(prev => ({ ...prev, taxCode: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('loai_hinh_to_chuc')}</label>
              <input
                type="text"
                placeholder="Ví dụ: Công ty TNHH, Cổ phần..."
                value={form.businessType}
                onChange={e => setForm(prev => ({ ...prev, businessType: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Trạng thái hiện tại</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                {supplier.isVerified ? 'Verified Supplier' : 'Unverified Supplier'}
              </span>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">Địa chỉ trụ sở</label>
              <input
                type="text"
                placeholder="Địa chỉ trụ sở chính"
                value={form.companyAddress}
                onChange={e => setForm(prev => ({ ...prev, companyAddress: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* CARD 2: Manufacturing Capability */}
        <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 ${hasPendingRequest ? 'opacity-70 pointer-events-none' : ''}`}>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Shield size={16} className="text-primary" /> Thông tin năng lực sản xuất
          </h3>

          {/* Production Form */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('hinh_thuc_san_xuat')}</label>
            <input
              type="text"
              placeholder="Ví dụ: Sở hữu nhà xưởng, Thuê nhà xưởng, Hợp tác sản xuất..."
              value={form.productionForm}
              onChange={e => setForm(prev => ({ ...prev, productionForm: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.productionForm && <p className="text-xs text-red-500 mt-1">{errors.productionForm}</p>}
          </div>

          {/* Factory Address */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('dia_chi_nha_xuong')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <select
                value={form.province}
                onChange={e => setForm(prev => ({ ...prev, province: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="">{t('chon_tinhthanh_pho')}</option>
                {VIETNAM_PROVINCES.map(p => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              
              <input
                type="text"
                placeholder="Quận/Huyện"
                value={form.district}
                onChange={e => setForm(prev => ({ ...prev, district: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />

              <input
                type="text"
                placeholder="Phường/Xã"
                value={form.ward}
                onChange={e => setForm(prev => ({ ...prev, ward: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <input
              type="text"
              placeholder="Số nhà, tên đường"
              value={form.streetAddress}
              onChange={e => setForm(prev => ({ ...prev, streetAddress: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary mt-2"
            />
            {(errors.province || errors.district || errors.ward || errors.streetAddress) && (
              <p className="text-xs text-red-500 mt-1">{t('vui_long_hoan_thanh_day_du_thong_tin_dia')}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Scale */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('quy_mo_nha_xuong')}</label>
              <select
                value={form.factoryScale}
                onChange={e => setForm(prev => ({ ...prev, factoryScale: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t('chon_quy_mo')}</option>
                {FACTORY_SCALES.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
              {errors.factoryScale && <p className="text-xs text-red-500 mt-1">{errors.factoryScale}</p>}
            </div>

            {/* Workers count */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('so_luong_nhan_su_san_xuat')}</label>
              <select
                value={form.workerCount}
                onChange={e => setForm(prev => ({ ...prev, workerCount: e.target.value }))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t('chon_so_luong')}</option>
                {WORKER_COUNTS.map(w => (
                  <option key={w.value} value={w.value}>{w.label}</option>
                ))}
              </select>
              {errors.workerCount && <p className="text-xs text-red-500 mt-1">{errors.workerCount}</p>}
            </div>
          </div>

          {/* Monthly Capacity */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('nang_luc_san_xuat_moi_thang')}</label>
            <input
              type="text"
              placeholder="Ví dụ: 100.000 sản phẩm / tháng"
              value={form.monthlyCapacity}
              onChange={e => setForm(prev => ({ ...prev, monthlyCapacity: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.monthlyCapacity && <p className="text-xs text-red-500 mt-1">{errors.monthlyCapacity}</p>}
          </div>

          {/* Main Industries Multi-select */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('nganh_san_xuat_chinh')}</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl max-h-48 overflow-y-auto">
              {INDUSTRIES_LIST.map(ind => (
                <label key={ind} className="flex items-center gap-2 cursor-pointer text-xs text-slate-700 py-1 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={form.mainCategories.includes(ind)}
                    onChange={() => handleCategoryToggle(ind)}
                    className="accent-primary rounded"
                  />
                  {ind}
                </label>
              ))}
            </div>
            {errors.mainCategories && <p className="text-xs text-red-500 mt-1">{errors.mainCategories}</p>}
          </div>

          {/* Main Products */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('san_pham_chinh_dang_san_xuat')}</label>
            <textarea
              placeholder="Liệt kê các dòng sản phẩm chính của nhà xưởng..."
              rows={3}
              value={form.mainProducts}
              onChange={e => setForm(prev => ({ ...prev, mainProducts: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.mainProducts && <p className="text-xs text-red-500 mt-1">{errors.mainProducts}</p>}
          </div>
        </div>

        {/* CARD 3: Supporting Documents */}
        <div className={`bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 ${hasPendingRequest ? 'opacity-70 pointer-events-none' : ''}`}>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <FileText size={16} className="text-primary" /> Tài liệu chứng minh sản xuất
          </h3>

          {/* Google Drive Link */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('link_google_drive_chua_ho_so_san_xuat')}</label>
            <input
              type="text"
              placeholder="https://drive.google.com/..."
              value={form.driveLink}
              onChange={e => setForm(prev => ({ ...prev, driveLink: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
            {errors.driveLink && <p className="text-xs text-red-500 mt-1">{errors.driveLink}</p>}
          </div>

          {/* Multiple factory images */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('anh_nha_xuong_may_moc_day_chuyen_toi_thi')}</label>
            <div className="flex items-center gap-3">
              <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 hover:border-primary transition-all">
                <Upload size={20} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 mt-1 font-bold">Tải ảnh lên</span>
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  className="hidden"
                  onChange={e => handleFileChange(e, 'images')}
                />
              </label>

              <div className="flex flex-wrap gap-2">
                {factoryImages.map((file, idx) => (
                  <div key={idx} className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-slate-100 flex items-center justify-center p-1">
                    {file.type.includes('pdf') ? (
                      <div className="text-center">
                        <FileText size={24} className="mx-auto text-primary" />
                        <span className="text-[8px] text-slate-500 block truncate max-w-full px-1">{file.name}</span>
                      </div>
                    ) : (
                      <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover" />
                    )}
                    <button
                      type="button"
                      onClick={() => removeFactoryImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            {errors.files && <p className="text-xs text-red-500">{errors.files}</p>}
            <p className="text-[10px] text-slate-400">{t('dinh_dang_ho_tro_png_jpg_pdf_toi_da_10mb')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Safety Certificate */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('giay_chung_nhan_nha_xuong_an_toan_moi_tr')}</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  onChange={e => handleFileChange(e, 'safety')}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl"
                />
              </div>
              {safetyCert && <p className="text-xs text-emerald-600 mt-1">✓ Đã chọn: {safetyCert.name}</p>}
            </div>

            {/* ISO Certificate */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('chung_chi_san_xuat_iso_haccp_gmp_fda_coc')}</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, application/pdf"
                  onChange={e => handleFileChange(e, 'production')}
                  className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer cursor-pointer border border-slate-200 rounded-xl"
                />
              </div>
              {productionCert && <p className="text-xs text-emerald-600 mt-1">✓ Đã chọn: {productionCert.name}</p>}
            </div>
          </div>

          {/* Admin notes */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block">{t('ghi_chu_cho_admin_khong_bat_buoc')}</label>
            <textarea
              placeholder="Thêm tin nhắn hoặc thông tin gửi tới Admin duyệt hồ sơ..."
              rows={3}
              value={form.adminNotes}
              onChange={e => setForm(prev => ({ ...prev, adminNotes: e.target.value }))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate('/dashboard/supplier/profile')}
            className="btn-ghost"
            disabled={submitting}
          >
            Back to Company Profile
          </button>
          
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 shadow-lg"
            disabled={submitting || hasPendingRequest}
          >
            {submitting && <Loader2 size={16} className="animate-spin" />}
            {submitting ? 'Đang gửi thông tin...' : 'Submit Manufacturer Verification'}
          </button>
        </div>
      </form>
    </div>
  );
}
