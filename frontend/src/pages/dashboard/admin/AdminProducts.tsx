import React, { useEffect, useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, Trash2, CheckCircle2, X, AlertCircle } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';

export function AdminProducts() {
  const { addToast } = useToast();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'ACTIVE' | 'REJECTED'>('PENDING');
  
  const [confirmDelete, setConfirmDelete] = useState<{isOpen: boolean, product: any}>({
    isOpen: false, product: null
  });
  
  const [confirmVerify, setConfirmVerify] = useState<{isOpen: boolean, product: any, newStatus: 'ACTIVE'|'REJECTED'|null}>({
    isOpen: false, product: null, newStatus: null
  });

  useEffect(() => {
    loadProducts();
  }, [activeTab]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products/admin?limit=100&status=${activeTab}`);
      setProducts(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách Sản phẩm' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const { product } = confirmDelete;
    if (!product) return;
    
    try {
      await api.delete(`/products/${product.id}`);
      addToast({ type: 'success', title: 'Thành công', message: 'Đã xóa sản phẩm khỏi nền tảng!' });
      setConfirmDelete({ isOpen: false, product: null });
      loadProducts();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa sản phẩm' });
    }
  };

  const handleVerify = async () => {
    const { product, newStatus } = confirmVerify;
    if (!product || !newStatus) return;
    
    try {
      await api.put(`/products/${product.id}/verify`, { status: newStatus });
      addToast({ type: 'success', title: 'Thành công', message: newStatus === 'ACTIVE' ? 'Đã duyệt sản phẩm!' : 'Đã từ chối sản phẩm!' });
      setConfirmVerify({ isOpen: false, product: null, newStatus: null });
      loadProducts();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Thao tác thất bại' });
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col items-stretch">
      <DashboardSection 
        title="Quản lý Sản phẩm ảo" 
        subtitle="Theo dõi nội dung các Doanh nghiệp đăng tải và xóa/duyệt khi vi phạm quy tắc MIVN5."
      >
        <div className="flex border-b border-slate-200 mt-2">
          <button 
            onClick={() => setActiveTab('PENDING')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PENDING' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Sản phẩm Chờ Duyệt
          </button>
          <button 
            onClick={() => setActiveTab('ACTIVE')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ACTIVE' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Đã Duyệt (Live)
          </button>
          <button 
            onClick={() => setActiveTab('REJECTED')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'REJECTED' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
          >
            Từ Chối / Vi Phạm
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-bl-3xl rounded-br-3xl overflow-hidden mt-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-wider font-bold text-slate-500">
                    <th className="p-4 pl-6 w-1/2">Sản phẩm</th>
                    <th className="p-4">Doanh nghiệp</th>
                    <th className="p-4">Trạng thái</th>
                    <th className="p-4 pr-6 text-right">Thao tác Admin</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {products.map(p => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.[0] || 'https://via.placeholder.com/40'} alt="product" className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200" />
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{p.name || 'Sản phẩm không tên'}</span>
                            <span className="text-xs text-slate-500 line-clamp-1">{p.category?.name}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-medium text-slate-600">{p.supplier?.companyName}</span>
                      </td>
                      <td className="p-4">
                        {p.status === 'PENDING' && <Badge variant="warning">Chờ Duyệt</Badge>}
                        {p.status === 'ACTIVE' && <Badge variant="success">Đã Duyệt</Badge>}
                        {p.status === 'REJECTED' && <Badge variant="danger">Vi Phạm</Badge>}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {p.status === 'PENDING' && (
                            <>
                              <button 
                                onClick={() => setConfirmVerify({ isOpen: true, product: p, newStatus: 'ACTIVE' })}
                                className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors inline-flex items-center gap-1"
                              >
                                <CheckCircle2 size={14} /> Duyệt
                              </button>
                              <button 
                                onClick={() => setConfirmVerify({ isOpen: true, product: p, newStatus: 'REJECTED' })}
                                className="bg-amber-50 text-amber-600 border border-amber-200 text-xs font-bold px-3 py-2 rounded-lg hover:bg-amber-100 transition-colors inline-flex items-center gap-1"
                              >
                                <AlertCircle size={14} /> Từ chối
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => setConfirmDelete({ isOpen: true, product: p })}
                            className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-2 rounded-lg hover:bg-red-100 transition-colors inline-flex items-center gap-1"
                          >
                            <Trash2 size={14} /> Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-medium">Chưa có sản phẩm nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardSection>

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, product: null })}
        onConfirm={handleDelete}
        title="Cảnh báo: Xóa Sản Phẩm?"
        message={`Là Admin, bạn có quyền cưỡng chế xóa sản phẩm "${confirmDelete.product?.name}". Sản phẩm này sẽ bị gỡ vĩnh viễn khỏi toàn bộ hệ thống ngay lập tức.`}
        confirmText="Xác nhận Xóa"
        variant="danger"
      />

      <ConfirmDialog
        isOpen={confirmVerify.isOpen}
        onClose={() => setConfirmVerify({ isOpen: false, product: null, newStatus: null })}
        onConfirm={handleVerify}
        title={confirmVerify.newStatus === 'ACTIVE' ? "Duyệt Sản Phẩm Xuất Hiện Trên Hệ Thống?" : "Nghi Ngờ Vi Phạm - Từ Chối Sản Phẩm?"}
        message={confirmVerify.newStatus === 'ACTIVE' 
          ? `Bạn đang cấp phép cho "${confirmVerify.product?.name}" xuất hiện công khai trên Marketplace.` 
          : `Từ chối cấp phép xuất hiện cho "${confirmVerify.product?.name}". Doanh nghiệp sẽ nhận được cảnh báo sửa lại nội dung.`}
        confirmText={confirmVerify.newStatus === 'ACTIVE' ? "Duyệt Công Khai" : "Ban Hành Dấu X"}
        variant={confirmVerify.newStatus === 'ACTIVE' ? "info" : "warning"}
      />
    </div>
  );
}
