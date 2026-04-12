import React from 'react';
import { ShieldCheck, Factory } from 'lucide-react';

interface SupplierBadgeProps {
  type: 'verified' | 'audited';
  className?: string;
  showText?: boolean;
}

export function SupplierBadge({ type, className = '', showText = true }: SupplierBadgeProps) {
  if (type === 'verified') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FDF8F0] border border-[#A2875E]/30 rounded-md text-[#A2875E] ${className}`}>
        <ShieldCheck size={14} className="fill-[#FDF8F0]" />
        {showText && <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Verified Supplier</span>}
      </div>
    );
  }

  if (type === 'audited') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 border border-slate-300 rounded-md text-slate-700 ${className}`}>
        <Factory size={14} className="text-slate-500" />
        {showText && <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Audited Factory</span>}
      </div>
    );
  }

  return null;
}
