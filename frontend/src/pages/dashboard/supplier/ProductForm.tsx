import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../components/ui/Toast';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any | null;
  onSave: (product: any) => void;
}

export function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    priceRange: '',
    moq: '',
    description: '',
    rating: 5.0,
    reviews: 0,
    image: '',
  });

  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get('/categories');
        setCategoryOptions(res.data.filter((c: any) => !c.parentId));
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    }
    fetchCategories();
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (product) {
      setFormData(product as any);
    } else {
      setFormData({
        name: '',
        category: '',
        priceRange: '',
        moq: '',
        description: '',
        rating: 5.0,
        reviews: 0,
        image: '',
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.name) {
      addToast({ type: 'error', title: t('error'), message: t('enter_product_name') });
      return;
    }
    if (!formData.priceRange) {
      addToast({ type: 'error', title: t('error'), message: t('enter_price_range') });
      return;
    }
    onSave(formData);
  };

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await api.post('/uploads', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1').replace('/api/v1', '');
      const fullUrl = `${baseUrl}${res.data.url}`;
      setFormData((prev) => ({ ...prev, image: fullUrl }));
      addToast({ type: 'success', title: t('complete'), message: t('upload_image_success') });
    } catch {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải ảnh lên' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? t('edit_product') : t('create_product')}
      size="lg"
      footer={
        <>
          <button 
            className="bg-surface-2 hover:bg-surface-3 text-ink text-xs font-normal px-4 py-2" 
            style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            onClick={onClose}
          >
            {t('cancel')}
          </button>
          <button 
            className="bg-primary hover:bg-primary-hover text-white text-xs font-normal px-4 py-2" 
            style={{ borderRadius: 0, letterSpacing: '0.16px' }}
            onClick={handleSubmit}
          >
            {product ? t('save_changes') : t('create_product')}
          </button>
        </>
      }
    >
      <Tabs
        tabs={[
          {
            id: 'general',
            label: t('general_info'),
            content: (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('product_name')}</label>
                    <input
                      name="name"
                      type="text"
                      className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary"
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      placeholder={t('product_name_placeholder')}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('category')}</label>
                    <select
                      name="category"
                      className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary"
                      style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">{t('select_category', 'Chọn danh mục')}</option>
                      {categoryOptions.map((cat) => (
                        <option key={cat.id} value={cat.name}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('price_range_label')}</label>
                  <input
                    name="priceRange"
                    type="text"
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    placeholder={t('price_range_placeholder')}
                    value={formData.priceRange}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('moq_label')}</label>
                  <input
                    name="moq"
                    type="text"
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    placeholder={t('moq_placeholder')}
                    value={formData.moq}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('product_desc')}</label>
                  <textarea
                    name="description"
                    className="w-full px-4 py-3 bg-surface-1 border border-hairline text-sm outline-none focus:border-b-2 focus:border-b-primary min-h-[120px] resize-none"
                    style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    placeholder={t('product_desc_placeholder')}
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <p className="text-[11px] text-ink-subtle mt-1" style={{ letterSpacing: '0.16px' }}>{t('product_desc_helper')}</p>
                </div>
              </div>
            ),
          },
          {
            id: 'images',
            label: t('images'),
            content: (
              <div className="space-y-6">
                <label className="border border-dashed border-hairline p-8 flex flex-col items-center justify-center text-center bg-surface-1 hover:bg-surface-2 transition-colors cursor-pointer block" style={{ borderRadius: 0 }}>
                  {uploading ? (
                    <Loader2 size={32} className="animate-spin text-primary mb-4" />
                  ) : (
                    <div className="w-16 h-16 bg-canvas border border-hairline flex items-center justify-center text-primary mb-4" style={{ borderRadius: 0 }}>
                      <UploadCloud size={32} />
                    </div>
                  )}
                  <h4 className="text-sm font-normal text-ink uppercase mb-1" style={{ letterSpacing: '0.32px' }}>{uploading ? 'Đang tải lên...' : t('click_to_upload')}</h4>
                  <p className="text-xs text-ink-subtle" style={{ letterSpacing: '0.16px' }}>{t('upload_format')}</p>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file);
                      e.target.value = '';
                    }}
                  />
                </label>

                {formData.image && (
                  <div>
                    <label className="text-[10px] font-normal text-ink-subtle uppercase tracking-widest block mb-2" style={{ letterSpacing: '0.32px' }}>{t('uploaded_image')}</label>
                    <div className="relative w-32 h-32 overflow-hidden border border-hairline group" style={{ borderRadius: 0 }}>
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <button className="btn-icon text-white hover:text-red-400" onClick={() => setFormData((p) => ({...p, image: ''}))}>
                          <X size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
}
