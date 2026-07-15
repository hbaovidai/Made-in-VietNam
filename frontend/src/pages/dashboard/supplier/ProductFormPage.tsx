import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, X, Image as ImageIcon, Loader2, Trash2, Bold, Italic, Heading, List, Table, Eye, FileText, Award, Plus, Link as LinkIcon, Phone, DollarSign } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { api } from '../../../lib/api';
import { parseMarkdownToHtml } from '../../../utils/markdown';
import { CustomSelect } from '../../../components/CustomSelect';

interface CategoryOption {
  id: string;
  name: string;
  children?: { id: string; name: string }[];
}

export function ProductFormPage() {
  const { t } = useTranslation();
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
    certifications: [] as { name: string; url: string }[],
  });

  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');
  const [descUploading, setDescUploading] = useState(false);

  // Pricing mode: 'standard' | 'contact' | 'tiered'
  const [pricingMode, setPricingMode] = useState<'standard' | 'contact' | 'tiered'>('standard');
  const [tieredPrices, setTieredPrices] = useState<{ minQty: string; maxQty: string; price: string }[]>([
    { minQty: '1', maxQty: '99', price: '' },
    { minQty: '100', maxQty: '499', price: '' },
    { minQty: '500', maxQty: '', price: '' },
  ]);

  const insertAtCursor = (before: string, after: string = '') => {
    const textarea = document.getElementById('product-desc-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const replacement = before + (selected || '') + after;

    const newDescription = text.substring(0, start) + replacement + text.substring(end);
    setFormData(prev => ({ ...prev, description: newDescription }));

    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + (selected || '').length);
    }, 50);
  };

  const handleDescImageUpload = async (file: File) => {
    setDescUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = res.data.url;
      insertAtCursor(`\n![Ảnh mô tả](${imageUrl})\n`, '');
      addToast({ type: 'success', title: 'Thành công', message: 'Đã chèn ảnh vào mô tả!' });
    } catch {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải ảnh lên.' });
    } finally {
      setDescUploading(false);
    }
  };

  const categoryOptions = React.useMemo(() => {
    const options: { value: string; label: string }[] = [];
    
    function traverse(node: CategoryOption, path: string) {
      const currentPath = path ? `${path} > ${node.name}` : node.name;
      if (!node.children || node.children.length === 0) {
        options.push({
          value: node.id,
          label: node.name
        });
      } else {
        node.children.forEach(child => {
          traverse(child, currentPath);
        });
      }
    }

    categories.forEach(cat => {
      traverse(cat, '');
    });
    return options;
  }, [categories]);


  const unitOptions = React.useMemo(() => {
    return ['cái', 'kg', 'tấn', 'bộ', 'hộp', 'lít', 'mét', 'cuộn', 'đôi', 'chiếc'].map(u => ({
      value: u,
      label: u
    }));
  }, []);

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
          certifications: p.certifications?.length ? p.certifications : [],
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
      // const fullUrl = `${baseUrl}${res.data.url}`;
      const fullUrl = `${res.data.url}`;
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

    // Build price fields based on pricingMode
    let minPrice = Number(formData.minPrice) || 0;
    let maxPrice = Number(formData.minPrice) || 0;
    let priceTiersPayload: { minQty: number; maxQty?: number | null; price: number }[] | undefined;

    if (pricingMode === 'contact') {
      minPrice = 0;
      maxPrice = 0;
    } else if (pricingMode === 'tiered') {
      const tiers = tieredPrices
        .filter(t => t.price)
        .map(t => ({
          minQty: Number(t.minQty) || 1,
          maxQty: t.maxQty ? Number(t.maxQty) : null,
          price: Number(t.price),
        }));
      minPrice = tiers.length > 0 ? Math.min(...tiers.map(t => t.price)) : 0;
      maxPrice = tiers.length > 0 ? Math.max(...tiers.map(t => t.price)) : 0;
      priceTiersPayload = tiers;
    }

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      pricingMode: pricingMode.toUpperCase(),
      minPrice,
      maxPrice,
      ...(priceTiersPayload ? { priceTiers: priceTiersPayload } : {}),
      unit: formData.unit,
      moq: Number(formData.moq),
      moqUnit: formData.unit,
      categoryId: formData.categoryId,
      images: formData.images.filter(url => url.trim() !== ''),
      rfqMinQuantity: formData.rfqMinQuantity ? Number(formData.rfqMinQuantity) : null,
      certifications: formData.certifications.filter(c => c.name.trim() || c.url.trim()),
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
          <h1 className="text-2xl font-normal text-ink uppercase" style={{ letterSpacing: '0.32px' }}>
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-ink-muted text-sm mt-1" style={{ letterSpacing: '0.16px' }}>
            {isEditing
              ? 'Cập nhật thông tin. Nếu sản phẩm bị từ chối, việc sửa sẽ gửi duyệt lại tự động.'
              : 'Sản phẩm mới sẽ ở trạng thái "Chờ Duyệt" cho đến khi Admin phê duyệt.'}
          </p>
        </div>
        <button onClick={() => navigate('/dashboard/supplier/products')} className="p-2 text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors" style={{ borderRadius: 0 }}>
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-canvas border border-hairline overflow-hidden" style={{ borderRadius: 0 }}>
        <div className="p-6 md:p-8 space-y-8">
          
          {/* Tên & Danh mục */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>Tên sản phẩm <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary font-normal"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                placeholder="Ví dụ: Hạt cà phê Arabica thượng hạng..."
                value={formData.name}
                onChange={e => handleChange('name', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>Danh mục <span className="text-red-500">*</span></label>
              <CustomSelect
                options={categoryOptions}
                value={formData.categoryId}
                onChange={val => handleChange('categoryId', val)}
                placeholder={t('chon_danh_muc')}
              />
            </div>
          </div>

          {/* Chế độ giá */}
          <div className="space-y-4">
            <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Chế độ giá <span className="text-red-500">*</span></label>
            
            {/* Radio options */}
            <div className="flex flex-wrap gap-3">
              {/* Standard price */}
              <button
                type="button"
                onClick={() => setPricingMode('standard')}
                className={`flex items-center gap-2.5 px-4 py-3 border text-sm font-normal transition-all ${
                  pricingMode === 'standard'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-hairline bg-surface-1 text-ink-muted hover:border-ink-subtle hover:text-ink'
                }`}
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                  pricingMode === 'standard' ? 'border-primary' : 'border-ink-subtle'
                }`} style={{ borderRadius: '50%' }}>
                  {pricingMode === 'standard' && <div className="w-2 h-2 bg-primary" style={{ borderRadius: '50%' }} />}
                </div>

                Giá cố định
              </button>

              {/* Contact for price */}
              <button
                type="button"
                onClick={() => setPricingMode('contact')}
                className={`flex items-center gap-2.5 px-4 py-3 border text-sm font-normal transition-all ${
                  pricingMode === 'contact'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-hairline bg-surface-1 text-ink-muted hover:border-ink-subtle hover:text-ink'
                }`}
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                  pricingMode === 'contact' ? 'border-primary' : 'border-ink-subtle'
                }`} style={{ borderRadius: '50%' }}>
                  {pricingMode === 'contact' && <div className="w-2 h-2 bg-primary" style={{ borderRadius: '50%' }} />}
                </div>

                Liên hệ để biết giá
              </button>

              {/* Tiered pricing */}
              <button
                type="button"
                onClick={() => setPricingMode('tiered')}
                className={`flex items-center gap-2.5 px-4 py-3 border text-sm font-normal transition-all ${
                  pricingMode === 'tiered'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-hairline bg-surface-1 text-ink-muted hover:border-ink-subtle hover:text-ink'
                }`}
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                <div className={`w-4 h-4 border-2 flex items-center justify-center shrink-0 ${
                  pricingMode === 'tiered' ? 'border-primary' : 'border-ink-subtle'
                }`} style={{ borderRadius: '50%' }}>
                  {pricingMode === 'tiered' && <div className="w-2 h-2 bg-primary" style={{ borderRadius: '50%' }} />}
                </div>

                Giá theo số lượng
              </button>
            </div>

            {/* Standard: single price input */}
            {pricingMode === 'standard' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('gia_ban_vnd')} <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary font-normal"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    placeholder="Ví dụ: 100000"
                    value={formData.minPrice}
                    onChange={e => handleChange('minPrice', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Contact: info message */}
            {pricingMode === 'contact' && (
              <div className="bg-surface-1 border border-hairline p-4 flex items-start gap-3" style={{ borderRadius: 0 }}>
                <Phone size={18} className="text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-normal text-ink" style={{ letterSpacing: '0.16px' }}>Sản phẩm sẽ hiển thị "Liên hệ để biết giá"</p>
                  <p className="text-xs text-ink-subtle mt-1" style={{ letterSpacing: '0.16px' }}>Người mua sẽ cần gửi yêu cầu báo giá (RFQ) hoặc liên hệ trực tiếp để được báo giá.</p>
                </div>
              </div>
            )}

            {/* Tiered: price table */}
            {pricingMode === 'tiered' && (
              <div className="space-y-3 pt-2">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_1fr_1fr_40px] gap-3 px-1">
                  <span className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Từ (số lượng)</span>
                  <span className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Đến (số lượng)</span>
                  <span className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest" style={{ letterSpacing: '0.32px' }}>Đơn giá (VNĐ)</span>
                  <span></span>
                </div>

                {/* Table rows */}
                {tieredPrices.map((tier, idx) => (
                  <div key={idx} className="grid grid-cols-[1fr_1fr_1fr_40px] gap-3 items-center">
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2.5 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary font-normal"
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      placeholder="1"
                      value={tier.minQty}
                      onChange={e => {
                        const updated = [...tieredPrices];
                        updated[idx] = { ...updated[idx], minQty: e.target.value };
                        setTieredPrices(updated);
                      }}
                    />
                    <input
                      type="number"
                      min="1"
                      className="w-full px-3 py-2.5 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary font-normal"
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      placeholder={idx === tieredPrices.length - 1 ? '∞' : '99'}
                      value={tier.maxQty}
                      onChange={e => {
                        const updated = [...tieredPrices];
                        updated[idx] = { ...updated[idx], maxQty: e.target.value };
                        setTieredPrices(updated);
                      }}
                    />
                    <input
                      type="number"
                      min="0"
                      className="w-full px-3 py-2.5 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary font-normal"
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      placeholder="Đơn giá"
                      value={tier.price}
                      onChange={e => {
                        const updated = [...tieredPrices];
                        updated[idx] = { ...updated[idx], price: e.target.value };
                        setTieredPrices(updated);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (tieredPrices.length > 1) {
                          setTieredPrices(prev => prev.filter((_, i) => i !== idx));
                        }
                      }}
                      disabled={tieredPrices.length <= 1}
                      className="p-2 text-ink-subtle hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Add row button */}
                <button
                  type="button"
                  onClick={() => {
                    const last = tieredPrices[tieredPrices.length - 1];
                    const nextMin = last?.maxQty ? String(Number(last.maxQty) + 1) : '';
                    setTieredPrices(prev => [...prev, { minQty: nextMin, maxQty: '', price: '' }]);
                  }}
                  className="text-xs font-normal text-primary hover:bg-primary/5 px-3 py-2 transition-all flex items-center gap-1.5 border border-dashed border-primary/30 w-full justify-center"
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                >
                  <Plus size={13} /> Thêm mức giá
                </button>
                <p className="text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>Nhập giá theo từng khoảng số lượng. Để trống cột "Đến" ở hàng cuối nếu không giới hạn.</p>
              </div>
            )}
          </div>

          {/* Đơn vị & MOQ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('don_vi_tinh')} <span className="text-red-500">*</span></label>
              <CustomSelect
                options={unitOptions}
                value={formData.unit}
                onChange={val => handleChange('unit', val)}
                placeholder="Chọn đơn vị tính"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('so_luong_dat_toi_thieu_moq')} <span className="text-red-500">*</span></label>
              <input 
                type="number" 
                required
                min="1"
                className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary font-normal"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                placeholder="Ví dụ: 1"
                value={formData.moq}
                onChange={e => handleChange('moq', e.target.value)}
              />
            </div>
          </div>


          {/* Mô tả sản phẩm - Markdown Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-hairline pb-2">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>Mô tả sản phẩm</label>
              
              <div className="flex bg-surface-2 p-0.5 text-xs" style={{ borderRadius: 0 }}>
                <button
                  type="button"
                  onClick={() => setEditorTab('write')}
                  className={`px-3 py-1.5 font-normal transition-all flex items-center gap-1 ${
                    editorTab === 'write' ? 'bg-canvas text-ink border border-hairline font-normal shadow-none' : 'text-ink-muted hover:text-ink'
                  }`}
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                >
                  <span>Soạn thảo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorTab('preview')}
                  className={`px-3 py-1.5 font-normal transition-all flex items-center gap-1 ${
                    editorTab === 'preview' ? 'bg-canvas text-ink border border-hairline font-normal shadow-none' : 'text-ink-muted hover:text-ink'
                  }`}
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                >
                  <span>Xem trước</span>
                </button>
              </div>
            </div>

            {editorTab === 'write' ? (
              <div className="border border-hairline overflow-hidden bg-surface-1 focus-within:border-primary transition-all" style={{ borderRadius: 0 }}>
                {/* Toolbar */}
                <div className="flex flex-wrap gap-1.5 p-2 bg-surface-2 border-b border-hairline text-ink-muted">
                  <button
                    type="button"
                    onClick={() => insertAtCursor('**', '**')}
                    className="p-1.5 hover:bg-surface-3 text-ink transition-colors"
                    style={{ borderRadius: 0 }}
                    title="Chữ đậm"
                  >
                    <Bold size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('*', '*')}
                    className="p-1.5 hover:bg-surface-3 text-ink transition-colors"
                    style={{ borderRadius: 0 }}
                    title="Chữ nghiêng"
                  >
                    <Italic size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('## ', '')}
                    className="p-1.5 hover:bg-surface-3 text-ink transition-colors"
                    style={{ borderRadius: 0 }}
                    title="Tiêu đề chính (H2)"
                  >
                    <Heading size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('- ', '')}
                    className="p-1.5 hover:bg-surface-3 text-ink transition-colors"
                    style={{ borderRadius: 0 }}
                    title="Danh sách gạch đầu dòng"
                  >
                    <List size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertAtCursor('\n| Cột 1 | Cột 2 |\n|---|---|\n| Nội dung | Nội dung |\n')}
                    className="p-1.5 hover:bg-surface-3 text-ink transition-colors"
                    style={{ borderRadius: 0 }}
                    title="Chèn bảng"
                  >
                    <Table size={14} />
                  </button>

                  <div className="w-[1px] bg-hairline my-1 self-stretch" />

                  {/* Upload Image shortcut */}
                  <label className="p-1.5 hover:bg-surface-3 text-ink transition-colors cursor-pointer flex items-center gap-1.5" style={{ borderRadius: 0 }}>
                    {descUploading ? (
                      <Loader2 size={14} className="animate-spin text-primary" />
                    ) : (
                      <ImageIcon size={14} />
                    )}
                    <span className="text-[10px] font-normal uppercase" style={{ letterSpacing: '0.16px' }}>Chèn ảnh</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      disabled={descUploading}
                      onChange={e => {
                        const file = e.target.files?.[0];
                        if (file) handleDescImageUpload(file);
                        e.target.value = '';
                      }}
                    />
                  </label>
                </div>

                <textarea
                  id="product-desc-textarea"
                  rows={8}
                  className="w-full px-4 py-3 bg-surface-1 outline-none text-sm font-normal resize-y min-h-[160px] leading-relaxed text-ink"
                  style={{ letterSpacing: '0.16px' }}
                  placeholder="Nhập mô tả chi tiết về sản phẩm. Dùng thanh công cụ để bôi đậm, tạo tiêu đề, danh sách, chèn bảng hoặc chèn ảnh minh họa..."
                  value={formData.description}
                  onChange={e => handleChange('description', e.target.value)}
                />
              </div>
            ) : (
              <div 
                className="p-4 bg-surface-1 border border-hairline min-h-[220px] overflow-y-auto rich-text-preview"
                style={{ borderRadius: 0 }}
                dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(formData.description) }}
              />
            )}
            <p className="text-[11px] text-ink-subtle" style={{ letterSpacing: '0.16px' }}>
              Hỗ trợ định dạng Markdown. Bạn có thể chèn nhiều hình ảnh mô tả khác nhau trực tiếp vào bài viết.
            </p>
          </div>

          {/* Hình ảnh sản phẩm */}
          <div className="space-y-4">
            <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('hinh_anh_san_pham')}</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {formData.images.map((url, idx) => (
                url.trim() ? (
                  <div key={idx} className="relative group aspect-square overflow-hidden border border-hairline bg-surface-1" style={{ borderRadius: 0 }}>
                    <img src={url} alt={`Ảnh ${idx + 1}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button type="button" onClick={() => removeImageField(idx)} className="p-2 bg-surface-2 text-red-500 hover:bg-surface-3 transition-colors" style={{ borderRadius: 0 }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    {idx === 0 && (
                      <span className="absolute top-2 left-2 bg-primary text-white text-[10px] font-normal px-2 py-0.5 uppercase" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>{t('anh_chinh')}</span>
                    )}
                  </div>
                ) : (
                  <label key={idx} className="aspect-square border border-dashed border-hairline bg-surface-1 hover:border-primary hover:bg-surface-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2" style={{ borderRadius: 0 }}>
                    {uploading === idx ? (
                      <Loader2 size={24} className="animate-spin text-primary" />
                    ) : (
                      <>
                        <div className="w-10 h-10 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>
                          <ImageIcon size={20} className="text-primary" />
                        </div>
                        <span className="text-xs font-normal text-ink uppercase" style={{ letterSpacing: '0.16px' }}>Tải ảnh lên</span>
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
                  className="aspect-square border border-dashed border-hairline bg-surface-1 hover:border-primary hover:bg-surface-2 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                  style={{ borderRadius: 0 }}
                >
                  <div className="w-10 h-10 bg-surface-2 border border-hairline flex items-center justify-center" style={{ borderRadius: 0 }}>
                    <span className="text-xl font-normal text-ink-subtle">+</span>
                  </div>
                  <span className="text-xs font-normal text-ink-subtle uppercase" style={{ letterSpacing: '0.16px' }}>{t('them_anh')}</span>
                </button>
              )}
            </div>
            <p className="text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('chon_anh_tu_may_tinh_toi_da_5_anh_moi_an')}</p>
          </div>

          {/* Chứng chỉ sản phẩm */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block" style={{ letterSpacing: '0.32px' }}>
                Chứng chỉ sản phẩm
              </label>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, certifications: [...prev.certifications, { name: '', url: '' }] }))}
                className="text-xs font-normal text-primary hover:bg-primary-hover/10 px-2 py-1 transition-all flex items-center gap-1"
                style={{ borderRadius: 0, letterSpacing: '0.16px' }}
              >
                <Plus size={12} /> Thêm chứng chỉ
              </button>
            </div>
            {formData.certifications.length === 0 && (
              <div className="text-center py-8 bg-surface-1 border border-dashed border-hairline" style={{ borderRadius: 0 }}>
                <Award size={28} className="mx-auto text-ink-subtle mb-2" />
                <p className="text-sm text-ink-muted" style={{ letterSpacing: '0.16px' }}>Chưa có chứng chỉ nào</p>
                <p className="text-xs text-ink-subtle mt-1" style={{ letterSpacing: '0.16px' }}>Thêm chứng chỉ như FDA, ISO, HACCP, Organic... để tăng uy tín sản phẩm.</p>
              </div>
            )}
            {formData.certifications.map((cert, idx) => (
              <div key={idx} className="p-4 bg-surface-1 border border-hairline space-y-3" style={{ borderRadius: 0 }}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-normal text-ink-muted uppercase tracking-wider" style={{ letterSpacing: '0.32px' }}>Chứng chỉ #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, certifications: prev.certifications.filter((_, i) => i !== idx) }))}
                    className="p-1 text-ink-subtle hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 bg-canvas border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-sm font-normal"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    placeholder="Tên chứng chỉ (VD: ISO 9001, HACCP...)"
                    value={cert.name}
                    onChange={e => {
                      const updated = [...formData.certifications];
                      updated[idx] = { ...updated[idx], name: e.target.value };
                      setFormData(prev => ({ ...prev, certifications: updated }));
                    }}
                  />
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
                      <input
                        type="text"
                        className="w-full pl-9 pr-4 py-2.5 bg-canvas border border-hairline outline-none focus:border-b-2 focus:border-b-primary transition-all text-sm font-normal"
                        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                        placeholder="Link hoặc URL ảnh chứng chỉ"
                        value={cert.url}
                        onChange={e => {
                          const updated = [...formData.certifications];
                          updated[idx] = { ...updated[idx], url: e.target.value };
                          setFormData(prev => ({ ...prev, certifications: updated }));
                        }}
                      />
                    </div>
                    <label className="px-3 py-2.5 bg-canvas border border-hairline hover:bg-surface-2 transition-all cursor-pointer flex items-center gap-1.5 text-xs font-normal text-ink shrink-0" style={{ borderRadius: 0, letterSpacing: '0.16px' }}>
                      <ImageIcon size={14} className="text-primary" />
                      Tải ảnh
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/pdf"
                        className="hidden"
                        onChange={async e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          try {
                            const fd = new FormData();
                            fd.append('file', file);
                            const res = await api.post('/uploads', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
                            const updated = [...formData.certifications];
                            updated[idx] = { ...updated[idx], url: res.data.url };
                            setFormData(prev => ({ ...prev, certifications: updated }));
                          } catch {
                            addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải ảnh chứng chỉ' });
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
                {cert.url && cert.url.match(/\.(jpg|jpeg|png|webp|gif)$/i) && (
                  <div className="mt-2">
                    <img src={cert.url} alt={cert.name || 'Chứng chỉ'} className="h-20 border border-hairline object-cover" style={{ borderRadius: 0 }} />
                  </div>
                )}
              </div>
            ))}
            <p className="text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>Thêm các chứng chỉ chất lượng, an toàn thực phẩm, xuất xứ... để tăng độ tin cậy cho sản phẩm.</p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 md:px-8 py-5 bg-surface-2 border-t border-hairline flex items-center justify-between" style={{ borderRadius: 0 }}>
          <p className="text-xs text-ink-subtle hidden sm:block" style={{ letterSpacing: '0.16px' }}>
            {isEditing ? 'Sản phẩm bị từ chối sẽ tự động gửi duyệt lại khi bạn lưu.' : 'Sản phẩm mới sẽ cần Admin duyệt trước khi hiển thị công khai.'}
          </p>
          <div className="flex gap-3">
            <button 
              type="button" 
              onClick={() => navigate('/dashboard/supplier/products')}
              className="px-6 py-2.5 text-sm font-normal text-ink-muted hover:bg-surface-3 transition-colors"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            >
              Hủy bỏ
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 bg-primary text-white text-sm font-normal hover:bg-primary-hover transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 0, letterSpacing: '0.16px' }}
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
