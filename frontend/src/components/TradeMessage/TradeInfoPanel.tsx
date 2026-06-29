import React, { useState } from 'react';
import { Conversation } from './types';
import { ShieldCheck, Calendar, DollarSign, Package, ExternalLink, Globe, Award, Sparkles } from 'lucide-react';

interface TradeInfoPanelProps {
  conversation: Conversation;
}

export function TradeInfoPanel({ conversation }: TradeInfoPanelProps) {
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showSupplierModal, setShowSupplierModal] = useState(false);

  const handleInquiryAction = () => {
    setShowInquiryModal(true);
    setTimeout(() => setShowInquiryModal(false), 2000);
  };

  const handleProductAction = () => {
    setShowProductModal(true);
    setTimeout(() => setShowProductModal(false), 2000);
  };

  const handleSupplierAction = () => {
    setShowSupplierModal(true);
    setTimeout(() => setShowSupplierModal(false), 2000);
  };

  return (
    <div className="h-full bg-slate-50 border-l border-slate-200 overflow-y-auto p-4 flex flex-col gap-4">
      {/* Toast simulated notifications */}
      {showInquiryModal && (
        <div className="fixed top-10 right-10 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-xl z-50 font-semibold animate-bounce flex items-center gap-2">
          <span>📄 Opening inquiry document {conversation.inquiryId}...</span>
        </div>
      )}
      {showProductModal && (
        <div className="fixed top-10 right-10 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-xl z-50 font-semibold animate-bounce flex items-center gap-2">
          <span>🛍️ Redirecting to Product Catalog Page...</span>
        </div>
      )}
      {showSupplierModal && (
        <div className="fixed top-10 right-10 bg-slate-900 text-white text-xs px-3.5 py-2 rounded-lg shadow-xl z-50 font-semibold animate-bounce flex items-center gap-2">
          <span>🏢 Loading Supplier Showroom Profile...</span>
        </div>
      )}

      {/* Card 1: Inquiry Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
          <Calendar size={14} className="text-blue-600" />
          <span>Inquiry Info</span>
        </h3>
        <div className="space-y-2.5 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Inquiry ID:</span>
            <span className="font-semibold text-slate-800">{conversation.inquiryId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Created Date:</span>
            <span className="font-semibold text-slate-800">June 20, 2026</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400 font-medium">Status:</span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
              In Negotiation
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Inquiry Qty:</span>
            <span className="font-bold text-slate-800 flex items-center gap-0.5">
              <Package size={12} className="text-slate-400" />
              <span>{conversation.quantity}</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Target Price:</span>
            <span className="font-bold text-slate-800 flex items-center gap-0.5">
              <DollarSign size={12} className="text-slate-400 animate-pulse" />
              <span className="text-blue-600">{conversation.targetPrice}</span>
            </span>
          </div>
        </div>
        <button
          onClick={handleInquiryAction}
          className="w-full mt-4 py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Inquiry Details</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Card 2: Product Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
          <Award size={14} className="text-blue-600" />
          <span>Product Details</span>
        </h3>
        <div className="flex gap-3 mb-3">
          <img
            src={conversation.productImage}
            alt={conversation.productName}
            className="w-14 h-14 object-cover rounded-lg border border-slate-100 shadow-inner"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-slate-800 leading-snug line-clamp-2" title={conversation.productName}>
              {conversation.productName}
            </h4>
            <p className="text-[10px] text-slate-400 font-medium truncate mt-1">
              Category: {conversation.category.split('/')[0]}
            </p>
          </div>
        </div>
        <button
          onClick={handleProductAction}
          className="w-full py-2 px-3 bg-slate-50 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition-all flex items-center justify-center gap-1.5"
        >
          <span>View Product Page</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Card 3: Supplier Information */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-1.5 border-b border-slate-100 flex items-center gap-1.5">
          <Globe size={14} className="text-blue-600" />
          <span>Supplier Profile</span>
        </h3>
        <div className="flex items-center gap-3 mb-4">
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
            <p className="text-[10px] text-slate-400 font-semibold">{conversation.country}</p>
          </div>
        </div>

        <div className="space-y-2 text-xs border-t border-slate-50 pt-3">
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Platform Tenure:</span>
            <span className="font-semibold text-slate-800 flex items-center gap-1">
              <Sparkles size={11} className="text-amber-500 fill-amber-100" />
              <span>{conversation.yearsOnPlatform} Years</span>
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Response Rate:</span>
            <span className="font-semibold text-slate-800">{conversation.responseRate}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400 font-medium">Response Speed:</span>
            <span className="font-semibold text-slate-800">{conversation.responseTime}</span>
          </div>
        </div>

        <button
          onClick={handleSupplierAction}
          className="w-full mt-4 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <span>View Showroom</span>
          <ExternalLink size={12} />
        </button>
      </div>
    </div>
  );
}
