import React, { useState } from 'react';
import { Conversation } from './types';
import { ShieldCheck, Calendar, DollarSign, Package, ExternalLink, Globe, Award, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface TradeInfoPanelProps {
  conversation: Conversation;
}

export function TradeInfoPanel({ conversation }: TradeInfoPanelProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const handleInquiryAction = () => {
    if (user?.role === 'SUPPLIER') {
      navigate('/dashboard/supplier/inquiries');
    } else {
      navigate('/dashboard/buyer/rfqs');
    }
  };

  const handleSupplierAction = () => {
    if (conversation.supplierId) {
      navigate(`/suppliers/${conversation.supplierId}`);
    } else {
      setShowSupplierModal(true);
      setTimeout(() => setShowSupplierModal(false), 2000);
    }
  };

  return (
    <div className="h-full bg-white border-l border-slate-200 overflow-y-auto p-5 flex flex-col gap-6">
      {/* Toast simulated notifications */}
      {showInquiryModal && (
        <div className="fixed top-10 right-10 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-xl z-50 font-semibold animate-bounce flex items-center gap-2">
          <span>📄 Đang mở tài liệu yêu cầu {conversation.inquiryId}...</span>
        </div>
      )}
      {showSupplierModal && (
        <div className="fixed top-10 right-10 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-xl z-50 font-semibold animate-bounce flex items-center gap-2">
          <span>🏢 Đang tải hồ sơ nhà cung cấp...</span>
        </div>
      )}

      {/* Section 1: Inquiry Information */}
      {conversation.hasRfq && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
            <Calendar size={14} className="text-blue-600" />
            <span>Thông tin yêu cầu báo giá</span>
          </h3>
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Mã yêu cầu:</span>
              <span className="font-semibold text-slate-800">{conversation.inquiryId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Ngày tạo:</span>
              <span className="font-semibold text-slate-800">{conversation.createdDate || '20/06/2026'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 font-medium">Trạng thái:</span>
              <span className="text-amber-600 font-semibold">
                Đang thương lượng
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Số lượng:</span>
              <span className="font-bold text-slate-800 flex items-center gap-0.5">
                <Package size={12} className="text-slate-400" />
                <span>{conversation.quantity}</span>
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Giá mục tiêu:</span>
              <span className="font-bold text-slate-800 flex items-center gap-0.5">
                <DollarSign size={12} className="text-slate-400" />
                <span className="text-blue-600">{conversation.targetPrice}</span>
              </span>
            </div>
          </div>
          <button
            onClick={handleInquiryAction}
            className="w-full mt-3 py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5"
          >
            <span>Xem chi tiết yêu cầu</span>
            <ExternalLink size={12} />
          </button>
          
          <hr className="border-slate-100 mt-4" />
        </div>
      )}

      {/* Section 2: Supplier / Buyer Information */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Globe size={14} className="text-blue-600" />
          <span>{conversation.verified ? 'Hồ sơ nhà cung cấp' : 'Thông tin người mua'}</span>
        </h3>
        <div className="flex items-center gap-3 mb-2">
          <div className={`w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-white font-bold text-xs ${conversation.avatarBg}`}>
            {conversation.avatarText}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <h4 className="text-xs font-bold text-slate-800 truncate" title={conversation.supplierName}>
                {conversation.supplierName}
              </h4>
              {conversation.verified && (
                <ShieldCheck size={13} className="text-emerald-500 fill-emerald-50 shrink-0" />
              )}
            </div>
            <p className="text-[10px] text-slate-400 font-semibold">
              {conversation.verified ? conversation.country : 'Thành viên mua hàng'}
            </p>
          </div>
        </div>

        {conversation.verified ? (
          <>
            <div className="space-y-2 text-xs border-t border-slate-50 pt-3">
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Thời gian hoạt động:</span>
                <span className="font-semibold text-slate-800 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-500 fill-amber-100" />
                  <span>{conversation.yearsOnPlatform} Năm</span>
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Tỷ lệ phản hồi:</span>
                <span className="font-semibold text-slate-800">{conversation.responseRate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-medium">Tốc độ phản hồi:</span>
                <span className="font-semibold text-slate-800">{conversation.responseTime}</span>
              </div>
            </div>

            <button
              onClick={handleSupplierAction}
              className="w-full mt-3 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              <span>Xem gian hàng</span>
              <ExternalLink size={12} />
            </button>
          </>
        ) : (
          <div className="space-y-2 text-xs border-t border-slate-50 pt-3">
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Quốc gia:</span>
              <span className="font-semibold text-slate-800">Việt Nam</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400 font-medium">Trạng thái tài khoản:</span>
              <span className="text-emerald-600 font-semibold">
                Hoạt động
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
