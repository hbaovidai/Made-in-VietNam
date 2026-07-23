import { useTranslation } from 'react-i18next';
import { ShieldCheck, Factory, Globe } from 'lucide-react';

interface SupplierBadgeProps {
  type: 'verified' | 'audited' | 'manufacturer' | 'exporter';
  className?: string;
  showText?: boolean;
}

export function SupplierBadge({ type, className = '', showText = true }: SupplierBadgeProps) {
  const { t } = useTranslation();

  if (type === 'verified') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-primary/5 border border-primary/20 text-primary ${className}`} style={{ borderRadius: '3px', letterSpacing: '0.16px' }}>
        <ShieldCheck size={12} />
        {showText && <span className="text-[10px] font-semibold uppercase tracking-wider">{t('verified_supplier', 'VERIFIED SUPPLIER')}</span>}
      </div>
    );
  }

  if (type === 'manufacturer') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 border border-amber-200 text-amber-700 ${className}`} style={{ borderRadius: '3px', letterSpacing: '0.16px' }}>
        <Factory size={12} className="text-amber-600" />
        {showText && <span className="text-[10px] font-semibold uppercase tracking-wider">{t('verified_manufacturer', 'VERIFIED MANUFACTURER')}</span>}
      </div>
    );
  }

  if (type === 'exporter') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-700 ${className}`} style={{ borderRadius: '3px', letterSpacing: '0.16px' }}>
        <Globe size={12} className="text-emerald-600" />
        {showText && <span className="text-[10px] font-semibold uppercase tracking-wider">{t('verified_exporter', 'VERIFIED EXPORTER')}</span>}
      </div>
    );
  }

  if (type === 'audited') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 border border-slate-300 text-slate-700 ${className}`} style={{ borderRadius: '3px', letterSpacing: '0.16px' }}>
        <Factory size={12} className="text-slate-500" />
        {showText && <span className="text-[10px] font-semibold uppercase tracking-wider">{t('audited_factory', 'AUDITED FACTORY')}</span>}
      </div>
    );
  }

  return null;
}
