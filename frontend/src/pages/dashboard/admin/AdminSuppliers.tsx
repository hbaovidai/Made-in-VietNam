import React, { useEffect, useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { api } from '../../../lib/api';
import { useToast } from '../../../components/ui/Toast';
import { Loader2, ShieldCheck, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { ConfirmDialog } from '../../../components/ui/Modal';

export function AdminSuppliers() {
  const { addToast } = useToast();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [confirmVerify, setConfirmVerify] = useState<{isOpen: boolean, supplier: any, intent: boolean}>({
    isOpen: false, supplier: null, intent: true
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      const res = await api.get('/suppliers?limit=100');
      setSuppliers(res.data.data || []);
    } catch (err) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể tải danh sách Supplier' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyToggle = async () => {
    const { supplier, intent } = confirmVerify;
    if (!supplier) return;
    
    try {
      await api.put(`/suppliers/${supplier.id}/verify`, { isVerified: intent });
      addToast({ type: 'success', title: 'Thành công', message: intent ? 'Cấp Tick xanh thành công!' : 'Đã thu hồi Tick xanh!' });
      setConfirmVerify({ ...confirmVerify, isOpen: false });
      loadSuppliers();
    } catch (error) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Thao tác thất bại' });
    }
  };

  return (
    <div className="space-y-6 flex-1 flex flex-col items-stretch">
      <DashboardSection 
        title="Duyệt Doanh Nghiệp" 
        subtitle="Gấp đôi sự tin tưởng. Hãy kiểm tra và cấp huy hiệu xác minh (Tick xanh) cho các đối tác uy tín."
      >
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary" size={32} /></div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden mt-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 uppercase text-[10px] tracking-wider font-bold text-slate-500">
                    <th className="p-4 pl-6 w-1/3">Công ty</th>
                    <th className="p-4 hidden sm:table-cell">Ngành/Thị trường</th>
                    <th className="p-4 text-center">Xác minh (Tick Xanh)</th>
                    <th className="p-4 pr-6 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {suppliers.map(s => (
                    <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 line-clamp-1">{s.companyName}</span>
                          <span className="text-xs text-slate-500">{s.city ? `${s.city}, ${s.province}` : 'Việt Nam'}</span>
                        </div>
                      </td>
                      <td className="p-4 hidden sm:table-cell">
                        <div className="flex flex-wrap gap-1">
                          {s.industries?.slice(0, 2).map((ind: any, i: number) => (
                            <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                              {ind.industry}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {s.isVerified ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-600 mx-auto">
                            <ShieldCheck size={14} /> Đã Duyệt
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-500 mx-auto">
                            <ShieldAlert size={14} /> Chờ duyệt
                          </span>
                        )}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        {!s.isVerified ? (
                          <button 
                            onClick={() => setConfirmVerify({ isOpen: true, supplier: s, intent: true })}
                            className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors inline-flex items-center gap-1 shadow-sm shadow-primary/20"
                          >
                            <CheckCircle2 size={14} />
                            Duyệt
                          </button>
                        ) : (
                          <button 
                            onClick={() => setConfirmVerify({ isOpen: true, supplier: s, intent: false })}
                            className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-4 py-2 rounded-lg hover:bg-red-100 transition-colors inline-flex items-center gap-1"
                          >
                            <X size={14} />
                            Hủy duyệt
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {suppliers.length === 0 && (
                    <tr><td colSpan={4} className="p-12 text-center text-slate-400 font-medium">Chưa có doanh nghiệp nào</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </DashboardSection>

      <ConfirmDialog
        isOpen={confirmVerify.isOpen}
        onClose={() => setConfirmVerify({ ...confirmVerify, isOpen: false })}
        onConfirm={handleVerifyToggle}
        title={confirmVerify.intent ? 'Cấp huy hiệu xác minh?' : 'Thu hồi huy hiệu xác minh?'}
        message={
          confirmVerify.intent 
          ? `Bạn có chắc chắn muốn cấp Xác minh cho ${confirmVerify.supplier?.companyName}? Họ sẽ được hiển thị kèm Tick xanh uy tín trên các trang Public.` 
          : `Thu hồi Tick xanh của ${confirmVerify.supplier?.companyName}?`
        }
        confirmText={confirmVerify.intent ? 'Xác nhận Duyệt' : 'Tiến hành Thu hồi'}
        variant={confirmVerify.intent ? 'info' : 'danger'}
      />
    </div>
  );
}
