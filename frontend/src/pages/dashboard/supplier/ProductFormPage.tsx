import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Save, X, Image as ImageIcon, Plus } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';

export function ProductFormPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { addToast } = useToast();
  
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    images: [] as string[],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Giả lập lưu nhanh (Hiển thị form tĩnh theo yêu cầu)
    addToast({
      type: 'success',
      title: 'Thành công',
      message: isEditing ? 'Đã cập nhật sản phẩm thành công!' : 'Đã tạo sản phẩm mới thành công!'
    });
    
    // Đợi 1 giây rồi quay về trang danh sách
    setTimeout(() => {
      navigate('/dashboard/supplier/products');
    }, 1000);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1000px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">
            {isEditing ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">Cung cấp thông tin chi tiết về sản phẩm để tiếp cận người mua dễ dàng hơn.</p>
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
                placeholder="Ví dụ: Áo thun nam Cotton..."
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Danh mục <span className="text-red-500">*</span></label>
              <select 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="">Chọn danh mục...</option>
                <option value="electronics">Điện tử - Điện lạnh</option>
                <option value="apparel">May mặc - Thời trang</option>
                <option value="furniture">Nội thất - Gỗ</option>
                <option value="agriculture">Nông sản - Thực phẩm</option>
              </select>
            </div>
          </div>

          {/* Giá */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Giá sản phẩm (VNĐ) <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium"
              placeholder="Nhập giá hoặc khoảng giá (VD: 100.000 - 500.000)"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>

          {/* Mô tả */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Mô tả sản phẩm</label>
            <textarea 
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm font-medium resize-none"
              placeholder="Nhập mô tả chi tiết về sản phẩm, chất liệu, hướng dẫn sử dụng..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {/* Upload Ảnh */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Hình ảnh sản phẩm</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 hover:bg-slate-50 hover:border-primary transition-colors cursor-pointer flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4 text-primary">
                <ImageIcon size={28} />
              </div>
              <p className="text-sm font-bold text-slate-700 mb-1">Kéo thả ảnh vào đây, hoặc click để tải lên</p>
              <p className="text-xs font-medium text-slate-400">Hỗ trợ JPG, PNG, WEBP (Tối đa 5MB)</p>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 md:px-8 py-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button 
            type="button" 
            onClick={() => navigate('/dashboard/supplier/products')}
            className="px-6 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
          >
            Hủy bỏ
          </button>
          <button 
            type="submit"
            className="px-8 py-2.5 bg-primary text-white text-sm font-bold rounded-lg hover:bg-primary-dark shadow-lg shadow-primary/30 transition-all flex items-center gap-2"
          >
            <Save size={16} /> {isEditing ? 'Lưu thay đổi' : 'Tạo sản phẩm'}
          </button>
        </div>
      </form>
    </div>
  );
}
