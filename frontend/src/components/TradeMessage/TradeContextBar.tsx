import React from 'react';
import { FileSearch } from 'lucide-react';

interface TradeContextBarProps {
  productName: string;
  productImage: string;
  category: string;
  inquiryId: string;
  quantity: string;
  targetPrice: string;
  onViewInquiryDetails?: () => void;
}

export function TradeContextBar({
  productName,
  productImage,
  category,
  inquiryId,
  quantity,
  targetPrice,
  onViewInquiryDetails
}: TradeContextBarProps) {
  return (
    <div className="bg-slate-50 border-b border-slate-200 px-4 py-2.5 flex items-center justify-between gap-4 shrink-0 shadow-sm">
      {/* Product & Category */}
      <div className="flex items-center gap-3 min-w-0">
        <img
          src={productImage}
          alt={productName}
          className="w-10 h-10 object-cover rounded border border-slate-200 bg-white shrink-0 shadow-sm"
        />
        <div className="min-w-0">
          <h4 className="text-[11px] font-bold text-slate-800 truncate leading-snug" title={productName}>
            {productName}
          </h4>
          <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
            Category: {category}
          </p>
        </div>
      </div>

      {/* Inquiry details */}
      <div className="flex items-center gap-4 shrink-0 text-slate-700">
        <div className="hidden lg:block text-right">
          <div className="text-[10px] text-slate-400 font-medium">Inquiry ID</div>
          <div className="text-[11px] font-bold text-slate-700">{inquiryId}</div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-medium">Quantity</div>
          <div className="text-[11px] font-bold text-slate-700">{quantity}</div>
        </div>

        <div className="text-right">
          <div className="text-[10px] text-slate-400 font-medium">Target Price</div>
          <div className="text-[11px] font-bold text-slate-700">{targetPrice}</div>
        </div>

        <button
          onClick={onViewInquiryDetails}
          className="py-1.5 px-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold text-slate-700 hover:text-blue-600 hover:border-blue-400 transition-all shadow-sm flex items-center gap-1 shrink-0"
        >
          <FileSearch size={12} />
          <span>Details</span>
        </button>
      </div>
    </div>
  );
}
