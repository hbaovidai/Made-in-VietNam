import React, { useState } from 'react';
import { useToast } from '../components/ui/Toast';
import { Modal, ConfirmDialog } from '../components/ui/Modal';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { ArchiveX, Check, AlertTriangle, Star } from 'lucide-react';

export function UITest() {
  const { addToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 p-8 space-y-12 pb-32">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-3xl font-black text-slate-900 border-b border-slate-200 pb-4">
          UI Components Playground (Đợt 1)
        </h1>

        {/* 1. Buttons */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">1. Nút bấm (Buttons & Hover states)</h2>
          <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-slate-200">
            <button className="btn-primary">Primary Button</button>
            <button className="btn-secondary">Secondary Button</button>
            <button className="btn-danger">Danger Button</button>
            <button className="btn-gold">Gold Premium</button>
            <button className="btn-ghost">Ghost Button</button>
            <button className="btn-primary" disabled>Disabled</button>
          </div>
          <p className="text-sm text-slate-500">Thử click và hover để xem hiệu ứng mượt mà (scale, shadow).</p>
        </section>

        {/* 2. Toasts */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">2. Thông báo (Toast Notifications)</h2>
          <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-slate-200">
            <button 
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-bold hover:bg-emerald-200 transition-colors"
              onClick={() => addToast({ type: 'success', title: 'Thành công!', message: 'Đã lưu sản phẩm thành công.' })}
            >
              Hiện Toast Thành Công
            </button>
            <button 
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-bold hover:bg-red-200 transition-colors"
              onClick={() => addToast({ type: 'error', title: 'Lỗi hệ thống', message: 'Không thể xóa lô hàng này vì đã có dữ liệu quét QR.' })}
            >
              Hiện Toast Lỗi
            </button>
            <button 
              className="px-4 py-2 bg-amber-100 text-amber-700 rounded-lg font-bold hover:bg-amber-200 transition-colors"
              onClick={() => addToast({ type: 'warning', title: 'Cảnh báo', message: 'Mã QR này sắp hết hạn.' })}
            >
              Hiện Toast Cảnh Báo
            </button>
            <button 
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-bold hover:bg-blue-200 transition-colors"
              onClick={() => addToast({ type: 'info', title: 'Thông tin', message: 'Có 3 thông báo mới chưa đọc.' })}
            >
              Hiện Toast Thông Tin
            </button>
          </div>
        </section>

        {/* 3. Modals */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">3. Cửa sổ bật lên (Modals & Dialogs)</h2>
          <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-slate-200">
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              Mở Modal Form (Tạo mới)
            </button>
            <button className="btn-danger" onClick={() => setIsConfirmOpen(true)}>
              Mở Dialog Xác Nhận Xóa
            </button>

            {/* Form Modal */}
            <Modal 
              isOpen={isModalOpen} 
              onClose={() => setIsModalOpen(false)}
              title="Tạo sản phẩm mới"
              description="Điền thông tin bên dưới để thêm sản phẩm vào danh mục."
              footer={
                <>
                  <button className="btn-ghost" onClick={() => setIsModalOpen(false)}>Hủy</button>
                  <button className="btn-primary" onClick={() => { setIsModalOpen(false); addToast({type: 'success', title: 'Đã lưu!'}); }}>Lưu sản phẩm</button>
                </>
              }
            >
              <div className="space-y-4">
                <div>
                  <label className="input-label">Tên sản phẩm</label>
                  <input type="text" className="input" placeholder="Nhập tên..." />
                </div>
                <div>
                  <label className="input-label">Giá bán</label>
                  <input type="text" className="input-error" placeholder="VD: 100.000đ" />
                  <span className="input-error-text">Giá bán không được để trống</span>
                </div>
              </div>
            </Modal>

            {/* Confirm Dialog */}
            <ConfirmDialog 
              isOpen={isConfirmOpen}
              onClose={() => setIsConfirmOpen(false)}
              onConfirm={() => addToast({ type: 'info', title: 'Đã xóa thành công' })}
              title="Xác nhận xóa sản phẩm?"
              message="Hành động này không thể hoàn tác. Toàn bộ dữ liệu QR Code liên quan cũng sẽ bị vô hiệu hóa. Bạn có chắc chắn không?"
              confirmText="Xóa vĩnh viễn"
            />
          </div>
        </section>

        {/* 4. Badges */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">4. Thẻ trạng thái (Badges)</h2>
          <div className="flex flex-wrap gap-4 p-6 bg-white rounded-xl border border-slate-200 items-center">
            <Badge variant="success" icon={<Check size={12}/>}>Hoạt động</Badge>
            <Badge variant="warning" icon={<AlertTriangle size={12}/>}>Sắp hết hạn</Badge>
            <Badge variant="danger">Khóa</Badge>
            <Badge variant="info">Đang chờ</Badge>
            <Badge variant="primary" icon={<Star size={12}/>}>Premium</Badge>
            <Badge variant="default">Nháp (Draft)</Badge>
          </div>
        </section>

        {/* 5. Skeleton */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">5. Hiệu ứng tải (Skeleton Loading)</h2>
          <div className="p-6 bg-white rounded-xl border border-slate-200">
            <button 
              className="mb-6 btn-secondary text-sm" 
              onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 2000); }}
            >
              {isLoading ? 'Đang tải (Đợi 2s)...' : 'Bấm để giả lập tải lại'}
            </button>
            
            {isLoading ? (
              <div className="flex gap-4 items-center">
                <Skeleton variant="circular" width={64} height={64} />
                <div className="space-y-2 flex-1 max-w-sm">
                  <Skeleton variant="text" width="80%" />
                  <Skeleton variant="text" width="60%" />
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-center animate-fade-in">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl">👤</div>
                <div>
                  <div className="font-bold text-slate-900">Huỳnh Lê Hoài Bảo</div>
                  <div className="text-sm text-slate-500">Giám đốc sản xuất</div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Tabs & Empty State */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800">6. Tabs & Empty State</h2>
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <Tabs 
              tabs={[
                {
                  id: 'tab1',
                  label: 'Sản phẩm đang bán',
                  content: <div className="p-6 text-slate-600">Nội dung sản phẩm đang bán sẽ nằm ở đây...</div>
                },
                {
                  id: 'tab2',
                  label: 'Sản phẩm hết hàng (Empty State)',
                  content: (
                    <EmptyState 
                      icon={<ArchiveX size={40} className="text-slate-300" />}
                      title="Không có sản phẩm nào"
                      description="Bạn chưa có sản phẩm nào trong danh mục bị hết hàng. Hãy kiểm tra lại kho hoặc tạo lô hàng mới."
                      action={<button className="btn-primary">Tạo lô hàng mới</button>}
                    />
                  )
                }
              ]} 
            />
          </div>
        </section>

      </div>
    </div>
  );
}
