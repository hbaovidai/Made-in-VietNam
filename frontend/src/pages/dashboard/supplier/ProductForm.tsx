import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Tabs } from '../../../components/ui/Tabs';
import { useToast } from '../../../components/ui/Toast';
import { UploadCloud, Image as ImageIcon, X, Loader2 } from 'lucide-react';
import { Product } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';
import { api } from '../../../lib/api';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSave: (product: any) => void;
}

export function ProductForm({ isOpen, onClose, product, onSave }: ProductFormProps) {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Nông sản',
    priceRange: '',
    moq: '',
    description: '',
    rating: 5.0,
    reviews: 0,
    image: '',
  });

  // Reset form when modal opens
  useEffect(() => {
    if (product) {
      setFormData(product as any);
    } else {
      setFormData({
        name: '',
        category: 'Nông sản',
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
          <button className="btn-ghost" onClick={onClose}>
            {t('cancel')}
          </button>
          <button className="btn-primary" onClick={handleSubmit}>
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
                    <label className="input-label">{t('product_name')}</label>
                    <input
                      name="name"
                      type="text"
                      className="input"
                      placeholder={t('product_name_placeholder')}
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label className="input-label">{t('category')}</label>
                    <select
                      name="category"
                      className="input"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="Nông sản">{t('category_agriculture')}</option>
                      <option value="Dệt may & May mặc">{t('category_textile')}</option>
                      <option value="Nội thất & Trang trí">{t('category_furniture')}</option>
                      <option value="Thủ công mỹ nghệ">{t('category_handicraft')}</option>
                      <option value="Điện tử">{t('category_electronics')}</option>
                      <option value="Thực phẩm & Đồ uống">{t('category_food')}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="input-label">{t('price_range_label')}</label>
                  <input
                    name="priceRange"
                    type="text"
                    className="input"
                    placeholder={t('price_range_placeholder')}
                    value={formData.priceRange}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="input-label">{t('moq_label')}</label>
                  <input
                    name="moq"
                    type="text"
                    className="input"
                    placeholder={t('moq_placeholder')}
                    value={formData.moq}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="input-label">{t('product_desc')}</label>
                  <textarea
                    name="description"
                    className="input min-h-[120px] resize-none"
                    placeholder={t('product_desc_placeholder')}
                    value={formData.description}
                    onChange={handleChange}
                  />
                  <p className="input-helper">{t('product_desc_helper')}</p>
                </div>
              </div>
            ),
          },
          {
            id: 'images',
            label: t('images'),
            content: (
              <div className="space-y-6">
                <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer block">
                  {uploading ? (
                    <Loader2 size={32} className="animate-spin text-primary mb-4" />
                  ) : (
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-primary mb-4">
                      <UploadCloud size={32} />
                    </div>
                  )}
                  <h4 className="text-sm font-bold text-slate-900 mb-1">{uploading ? 'Đang tải lên...' : t('click_to_upload')}</h4>
                  <p className="text-xs text-slate-500">{t('upload_format')}</p>
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
                    <label className="input-label">{t('uploaded_image')}</label>
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-slate-200 group">
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
