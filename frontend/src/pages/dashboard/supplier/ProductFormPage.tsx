import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Image as ImageIcon, Loader2, Trash2 } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';

interface CategoryOption {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  
  const isEditing = Boolean(id);

  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    minPrice: '',
    maxPrice: '',
    unit: 'cái',
    moq: '1',
    moqUnit: 'cái',
    categoryId: '',
    images: [''] as string[],
    rfqMinQuantity: '',
  });

  // Load danh mục từ DB
  useEffect(() => {
    api.get('/categories').then(res => {
      setCategories(res.data || []);
    }).catch(() => {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh mục' });
    });
  }, []);

  // Nếu edit: load dữ liệu sản phẩm hiện tại
  useEffect(() => {
    if (isEditing && id) {
      setLoadingProduct(true);
      api.get(`/products/${id}`).then(res => {
        const p = res.data;
        setFormData({
          name: p.name || '',
          description: p.description || '',
          minPrice: String(p.minPrice || ''),
          maxPrice: String(p.maxPrice || ''),
          unit: p.unit || 'cái',
          moq: String(p.moq || 1),
          moqUnit: p.moqUnit || 'cái',
          categoryId: p.categoryId || '',
          images: p.images?.length ? p.images : [''],
          rfqMinQuantity: p.rfqMinQuantity ? String(p.rfqMinQuantity) : '',
        });
      }).catch(() => {
        addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải thông tin sản phẩm' });
      }).finally(() => setLoadingProduct(false));
    }
  }, [id, isEditing]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageChange = (index: number, value: string) => {
    setFormData(prev => {
      const imgs = [...prev.images];
      imgs[index] = value;
      return { ...prev, images: imgs };
    });
  };

  const addImageField = () => {
    if (formData.images.length < 5) {
      setFormData(prev => ({ ...prev, images: [...prev.images, ''] }));
    }
  };

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const [uploading, setUploading] = useState<number | null>(null);

  const handleFileUpload = async (index: number, file: File) => {
    setUploading(index);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      // Build full URL from backend
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace('api/v1', '');
      const fullUrl = `${baseUrl}${res.data.url}`;
      handleImageChange(index, fullUrl);
    } catch {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải ảnh lên. Vui lòng thử lại.' });
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      minPrice: Number(formData.minPrice),
      maxPrice: Number(formData.minPrice),
      unit: formData.unit,
      moq: Number(formData.moq),
      moqUnit: formData.unit, // Use same unit
      categoryId: formData.categoryId,
      images: formData.images.filter(url => url.trim() !== ''),
      rfqMinQuantity: formData.rfqMinQuantity ? Number(formData.rfqMinQuantity) : null,
    };

    try {
      if (isEditing) {
        await api.put(`/products/${id}`, payload);
        addToast({ type: 'success', title: 'Thành công', message: 'Đã cập nhật sản phẩm!' });
      } else {
        await api.post('/products', payload);
        addToast({ type: 'success', title: 'Thành công', message: 'Đã tạo sản phẩm! Admin sẽ duyệt trong thời gian sớm nhất.' });
      }
      setTimeout(() => navigate('/dashboard/supplier/products'), 800);
    } catch (error: any) {
      const msg = error?.message || 'Có lỗi xảy ra khi lưu sản phẩm';
      addToast({ type: 'error', title: 'Thất bại', message: Array.isArray(msg) ? msg.join(', ') : msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProduct) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isEditing
              ? 'Cập nhật thông tin. Nếu sản phẩm bị từ chối, việc sửa sẽ gửi duyệt lại tự động.'
              : 'Sản phẩm mới sẽ ở trạng thái "Chờ Duyệt" cho đến khi Admin phê duyệt.'}
          </p>
        </div>
        <button onClick={() => navigate('/dashboard/supplier/products')} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Tên & Danh mục */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Tên sản phẩm <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                placeholder="Ví dụ: Hạt cà phê Arabica thượng hạng..."
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Danh mục <span className="text-red-500">*</span></label>
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                value={formData.categoryId}
                onChange={e => handleChange('categoryId', e.target.value)}
              >
                <option value="">Chọn danh mục...</option>
                {categories.map(parent => (
                  <optgroup key={parent.id} label={parent.name}>
                    {parent.children?.map(child => (
                      <option key={child.id} value={child.id}>{child.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {/* Giá bán */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Giá bán (VNĐ) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                placeholder="Ví dụ: 100000"
                value={formData.minPrice}
                onChange={e => handleChange('minPrice', e.target.value)}
              />
            </div>
          </div>

          {/* Đơn vị & MOQ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Đơn vị tính <span className="text-red-500">*</span></label>
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                value={formData.unit}
                onChange={e => handleChange('unit', e.target.value)}
              >
                {['cái', 'kg', 'tấn', 'bộ', 'hộp', 'lít', 'mét', 'cuộn', 'đôi', 'chiếc'].map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Số lượng đặt tối thiểu (MOQ) <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                placeholder="Ví dụ: 1"
                value={formData.moq}
                onChange={e => handleChange('moq', e.target.value)}
              />
            </div>
          </div>

          {/* Ngưỡng báo giá */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Ngưỡng báo giá (đơn hàng lớn)</label>
              <input 
                type="number" 
                min="1"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                placeholder="Ví dụ: 100 (để trống nếu không cần)"
                value={formData.rfqMinQuantity}
                onChange={e => handleChange('rfqMinQuantity', e.target.value)}
              />
              <p className="text-xs text-slate-400">Khi người mua đặt số lượng ≥ ngưỡng này, hệ thống sẽ yêu cầu gửi báo giá thay vì mua trực tiếp. Để trống nếu không áp dụng.</p>
            </div>
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mô tả sản phẩm</label>
            <textarea 
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"
              placeholder="Nhập mô tả chi tiết về sản phẩm, chất liệu, xuất xứ, hướng dẫn sử dụng..."
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
            />
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700">Hình ảnh sản phẩm</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {formData.images.map((url, idx) => (
                url.trim() ? (
                  <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-white">
                    <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImageField(idx)} className="p-2 bg-white/90 rounded-full text-red-500 hover:bg-white transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Ảnh chính</span>
                    )}
                  </div>
                ) : (
                  <label key={idx} className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                    {uploading === idx ? (
                      <Loader2 size={24} className="animate-spin text-primary" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <ImageIcon size={20} className="text-primary" />
                        </div>
                        <span className="text-xs font-bold text-slate-500">Tải ảnh lên</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(idx, file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                )
              ))}
              {formData.images.filter(u => u.trim()).length === formData.images.length && formData.images.length < 5 && (
                <button
                  type="button"
                  onClick={addImageField}
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-primary hover:bg-blue-50/50 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold text-slate-400">+</span>
                  </div>
                  <span className="text-xs font-bold text-slate-400">Thêm ảnh</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400">Chọn ảnh từ máy tính (tối đa 5 ảnh, mỗi ảnh ≤ 5MB). Hỗ trợ JPG, PNG, WEBP. Ảnh đầu tiên sẽ làm ảnh chính.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs text-slate-400 hidden sm:block">
            {isEditing ? '⚡ Sản phẩm bị từ chối sẽ tự động gửi duyệt lại khi bạn lưu.' : '⏳ Sản phẩm mới sẽ cần Admin duyệt trước khi hiển thị công khai.'}
          </p>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard/supplier/products')}
              className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {isEditing ? 'Lưu thay đổi' : 'Đăng sản phẩm'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
