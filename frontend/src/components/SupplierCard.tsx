import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Award, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SupplierStatus } from '../lib/enums';

interface SupplierCardProps {
  key?: string;
  supplier: any;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const { t } = useTranslation();

  const name = supplier.companyName || supplier.name;
  const location = supplier.location || (supplier.city ? `${supplier.city}, ${supplier.province}` : 'Viet Nam');
  const industries = supplier.industries 
    ? supplier.industries.map((i: any) => i.industry) 
    : (supplier.industry || []);
  const markets = supplier.markets 
    ? (typeof supplier.markets[0] === 'string' ? supplier.markets : supplier.markets.map((m: any) => m.market)) 
    : [];
  const certs = supplier.certifications 
    ? (typeof supplier.certifications[0] === 'string' ? supplier.certifications : supplier.certifications.map((c: any) => c.name))
    : [];

  return (
    <Link
      to={`/suppliers/${supplier.id}`}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-1"
    >
      <div className="relative h-32 bg-slate-100">
        <img
          src={supplier.banner || 'https://via.placeholder.com/800x300'}
          alt={name}
          className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
        <div className="absolute -bottom-8 left-6 w-20 h-20 rounded-2xl bg-white border-2 border-white p-1.5 shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
          <img
            src={supplier.logo || 'https://via.placeholder.com/150'}
            alt={name}
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>
      </div>
      <div className="pt-12 p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors tracking-tight line-clamp-1">
              {name}
            </h3>
            {supplier.status === SupplierStatus.VERIFIED && (
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-tighter border border-emerald-100 shrink-0">
                <ShieldCheck size={12} />
                {t('verified')}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <MapPin size={12} className="text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 h-6 overflow-hidden">
          {industries.map((ind: string) => (
            <span key={ind} className="bg-slate-50 text-slate-500 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-100 whitespace-nowrap">
              {ind}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
          <div className="flex flex-col min-w-0">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{t('main_markets')}</span>
            <span className="font-black text-slate-800 text-xs truncate">{markets.join(', ')}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{t('experience')}</span>
            <span className="font-black text-slate-800 text-xs">{new Date().getFullYear() - (supplier.yearEstablished || 2010)} {t('years')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-xs font-black text-slate-700 uppercase tracking-tighter">
            <Award size={16} className="text-viet-gold shrink-0" />
            <span className="truncate max-w-[150px]">{certs[0] || 'ISO 9001'}</span>
          </div>
          <div className="bg-slate-900 text-white p-2 rounded-lg group-hover:bg-primary transition-colors shrink-0">
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </Link>
  );
}
