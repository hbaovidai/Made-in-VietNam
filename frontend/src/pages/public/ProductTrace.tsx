import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, ShieldAlert, BadgeInfo, Building, Calendar, Package, ArrowLeft } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../lib/api';
import { SupplierStatus } from '@/src/lib/enums';

export function ProductTrace() {
  const { code } = useParams<{ code: string }>();
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('t');
  
  // Real loading state
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (!code) return;
    
    api.post('/batches/qr/verify', { code, token })
      .then(res => {
        setResult(res.data);
      })
      .catch(err => {
        setErrorMsg(err.response?.data?.message || 'Mã vạch không tồn tại trên hệ thống dữ liệu quốc gia MIVN.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [code, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-primary rounded-full animate-spin mb-4" />
        <h2 className="text-xl font-bold text-slate-800 animate-pulse">Đang định danh QR...</h2>
        <p className="text-slate-500 text-sm mt-2 font-mono">{code}</p>
      </div>
    );
  }

  if (!result || errorMsg) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <ShieldAlert size={64} className="text-red-500 mb-6" />
        <h1 className="text-3xl font-black text-slate-900 mb-2">QR Code Không Hợp Lệ</h1>
        <p className="text-slate-500 mb-8 max-w-md text-center">
          {errorMsg || 'Mã vạch này không tồn tại trên hệ thống dữ liệu quốc gia MIVN. Hãy cẩn thận, đây có thể là tem giả.'}
        </p>
        <Link to="/" className="btn-primary">Về Trang Chủ</Link>
      </div>
    );
  }

  const isWarning = result.valid === false;
  const product = result.data?.product || result.data || {};
  const supplier = result.data?.supplier || {};
  const batch = result.data?.batch || {};
  const scanInfo = result.data?.scanInfo || { scantCount: 1 };

  return (
    <div className="min-h-screen bg-white">
      {/* Header Banner */}
      <div className={`pt-12 pb-24 px-4 text-center ${isWarning ? 'bg-red-600' : 'bg-green-600'} text-white relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 50% 120%, white 0%, transparent 60%)' }} />
        
        <div className="relative z-10 max-w-md mx-auto">
          {isWarning ? (
            <ShieldAlert size={64} className="mx-auto mb-4 animate-bounce" />
          ) : (
            <CheckCircle size={64} className="mx-auto mb-4 animate-bounce" />
          )}
          
          <h1 className="text-3xl font-black mb-2">
            {isWarning ? 'CẢNH BÁO HÀNG GIẢ' : 'SẢN PHẨM CHÍNH HÃNG'}
          </h1>
          <p className="text-sm font-medium opacity-90">
            {isWarning 
              ? (result.warning || 'Mã định danh thất bại.')
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
                  <div className="text-sm font-medium text-slate-800">{supplier.companyName || 'Công ty TNHH chưa cập nhật'} {supplier.status == SupplierStatus.VERIFIED && <span className="text-green-600 font-bold ml-1">✓ Đã xác minh</span>}</div>
                  <div className="text-xs text-slate-500 mt-0.5">Việt Nam</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Mã lô sản xuất</div>
                  <div className="text-sm font-bold font-mono text-slate-800">{batch?.batchNumber || 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Thời hạn</div>
                  <div className="text-sm font-medium text-slate-800">Sản xuất: {batch.mfgDate ? new Date(batch.mfgDate).toLocaleDateString() : 'N/A'}</div>
                  <div className="text-sm font-medium text-slate-800">Hết hạn: {batch.expDate ? new Date(batch.expDate).toLocaleDateString() : 'N/A'}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BadgeInfo className="text-slate-400 shrink-0 mt-0.5" size={18} />
                <div>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ghi chú lịch sử quét</div>
                  <div className="text-sm font-medium text-slate-800">Mã này đã được quét <span className="font-bold text-primary">{scanInfo.scantCount}</span> lần.</div>
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
