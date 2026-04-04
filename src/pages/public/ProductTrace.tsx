import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShieldAlert, BadgeInfo, Building, Calendar, Package, ArrowLeft } from 'lucide-react';
import { qrCodes } from '../../data/qrMockData';
import { products } from '../../data/mockData';
import { batches } from '../../data/batchMockData';

export function ProductTrace() {
  const { code } = useParams<{ code: string }>();
  
  // Fake "loading" state
  const [loading, setLoading] = useState(true);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [code]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800 animate-pulse">Đang định danh QR...</h2>
        <p className="text-slate-500 text-sm mt-2 font-mono">{code}</p>
      </div>
    );
  }

  const qr = qrCodes.find(q => q.code === code);
  
  if (!qr) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-slate-900 mb-2">QR Code Không Hợp Lệ</h1>
        <p className="text-slate-500 mb-8 max-w-md text-center">
          Mã vạch này không tồn tại trên hệ thống dữ liệu quốc gia MIVN. Hãy cẩn thận, đây có thể là tem giả.
        </p>
        <Link to="/" className="btn-primary">Về Trang Chủ</Link>
      </div>
    );
  }

  const batch = batches.find(b => b.id === qr.batchId);
  const product = products.find(p => p.id === batch?.productId);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className={`pt-12 pb-24 px-4 text-center ${qr.status === 'compromised' ? 'bg-red-600' : 'bg-green-600'} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, white 0%, transparent 60%)' }} />
        
        <div className="relative z-10 max-w-md mx-auto">
          {qr.status === 'compromised' ? (
            <ShieldAlert size={64} className="mx-auto mb-4 animate-bounce" />
          ) : (
            <CheckCircle size={64} className="mx-auto mb-4 animate-bounce" />
          )}
          
          <h1 className="text-3xl font-black mb-2">
            {qr.status === 'compromised' ? 'CẢNH BÁO HÀNG GIẢ' : 'SẢN PHẨM CHÍNH HÃNG'}
          </h1>
          <p className="text-sm font-medium opacity-90">
            {qr.status === 'compromised' 
              ? 'Mã QR này có dấu hiệu bị sao chép nhiều lần. Đề nghị từ chối nhận hàng.'
              : 'Mã định danh đã được MIVN chứng nhận xuất xứ rõ ràng.'}
          </p>
        </div>
      </div>

      <div className="max-w-md mx-auto -mt-16 px-4 pb-20 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden mb-6 border border-slate-100">
          <img src={product?.image || 'https://via.placeholder.com/600x400'} alt={product?.name} className="w-full h-48 object-cover" />
          
          <div className="p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">{product?.name || 'Sản phẩm lỗi'}</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nguồn gốc sản xuất</div>
                  <div className="text-sm font-medium text-slate-800">Công ty TNHH MIVN Producer (Mock)</div>
                  <div className="text-xs text-slate-500 mt-0.5">KCN Sóng Thần 2, Bình Dương, Việt Nam</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã lô sản xuất</div>
                  <div className="text-sm font-bold font-mono text-slate-800">{batch?.batchNumber}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thời hạn</div>
                  <div className="text-sm font-medium text-slate-800">Sản xuất: {batch?.manufactureDate}</div>
                  <div className="text-sm font-medium text-slate-800">Hết hạn: {batch?.expiryDate}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BadgeInfo className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ghi chú lịch sử quét</div>
                  <div className="text-sm font-medium text-slate-800">Bạn là người thứ <span className="font-bold text-primary">{qr.scans + 1}</span> quét mã này.</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Link to="/" className="btn-secondary w-full justify-center flex items-center gap-2">
          <ArrowLeft size={16} /> Quay về Trang chủ
        </Link>
      </div>
    </div>
  );
}
