import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Award, ChevronRight, Globe, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SaleChannelsMap, SupplierStatus } from '../lib/enums';
import { api } from '../lib/api';

interface SupplierCardProps {
  key?: string;
  supplier: any;
}

interface SuppliercategoryRelation {
  supplierSlug: string;
  categorySlug: string;
  categoryLevel: number;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const { t } = useTranslation();

  const [categoriesNames, setCategoriesNames] = useState<string[]>([]);

  const navigate = useNavigate();
  const name = supplier.companyName || supplier.name;

  const isVerified = supplier.status === SupplierStatus.VERIFIED;

  let location = supplier.location || (supplier.city ? `${supplier.city}, ${supplier.province}` : (supplier.province || 'Việt Nam'));
  if (supplier.streetAddress) {
    location = supplier.streetAddress;
  }
  if (name.includes('Lộc Trời') || name.includes('Loc Troi')) {
    location = '23 Hà Hoàng Hổ, Phường Mỹ Xuyên, TP. Long Xuyên, An Giang';
  } else if (name.includes('Mẫu') || name.includes('Nông sản Việt') || name.includes('Nong San Viet')) {
    location = 'KCN Tân Tạo, Quận Bình Tân, TP. Hồ Chí Minh';
  }

  const fetchCategoryName = useCallback(async (slug: string) => {
    try {
      const res = await api.get(`/categories/name/${slug}`);
      return { 
        name: res.data?.name || '', 
        nameEn: res.data?.nameEN || '' 
      };
    } catch (error) {
      console.error(error);
      return { name: '', nameEn: '' };
    }
  }, []);

  useEffect(() => {
    const loadCategoryNames = async () => {
      const categorySlugs = supplier.categories?.map((scr: SuppliercategoryRelation) => scr.categorySlug) || [];

      const namePromises = categorySlugs.map(async (slug) => {
        const names = await fetchCategoryName(slug);
        return names.name;
      });
      const names = await Promise.all(namePromises);

      setCategoriesNames(names);
    };

    loadCategoryNames();
  }, [supplier.categories, fetchCategoryName]);

  return (
    <div
      onClick={() => navigate(`/suppliers/${supplier.id}`)}
      className="group bg-white rounded-xl border border-slate-200 p-5 md:p-6 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-stretch">
        
        {/* LEFT — Square Logo Container */}
        <div className="w-full md:w-[180px] h-[180px] shrink-0 border border-slate-200 rounded-lg p-4 flex items-center justify-center bg-white mx-auto md:mx-0">
          <img
            src={supplier.logo || 'https://via.placeholder.com/150'}
            alt={name}
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        </div>

        {/* RIGHT — Content Column */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          
          {/* Top Info Row */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <span className="text-lg md:text-xl font-bold text-[#1a3a6b] group-hover:text-primary transition-colors tracking-tight line-clamp-1 block">
                {name}
              </span>
              
              {isVerified && (
                <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold border bg-[#d1f5e0] text-[#0d6b3e] border-[#8edcb3] shrink-0">
                  {t('home_verified_supplier_badge')}
                </div>
              )}
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-1.5 text-xs md:text-sm text-slate-500 font-medium mb-4">
              <MapPin size={15} className="text-slate-400 shrink-0" />
              <span>{location}</span>
            </div>

            {/* Main Products / Tags Row */}
            {categoriesNames.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <span className="block text-xs font-bold text-slate-700">{t('supplier_main_products_label')}</span>
                <div className="flex flex-wrap gap-2">
                  {categoriesNames.map((name: string) => (
                    <span 
                      key={name} 
                      className="bg-[#dbeafe] text-[#1e40af] border border-[#93c5fd] px-2.5 py-1 rounded text-xs font-bold whitespace-nowrap"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Divider + Social/Marketplace Buttons */}
          <div className="mt-auto">
            {/* Thin Divider */}
            <div className="border-t border-slate-100 my-4" />

            <div className="flex flex-wrap items-center gap-2">
              {name.includes('Lộc Trời') || name.includes('Loc Troi') ? (
                <>
                  <a
                    href={supplier.website || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] text-slate-800 text-xs font-extrabold rounded border border-slate-300 hover:bg-slate-200 hover:border-slate-400 transition-colors"
                  >
                    <Globe size={14} className="text-slate-500" />
                    Website
                  </a>
                  <a
                    href="https://alibaba.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] text-slate-800 text-xs font-extrabold rounded border border-slate-300 hover:bg-slate-200 hover:border-slate-400 transition-colors"
                  >
                    <ExternalLink size={14} className="text-slate-500" />
                    Alibaba
                  </a>
                </>
              ) : (
                <>
                  {supplier.channels?.map(channel => {
                    return (
                      <a href={channel.url} target='_blank rel'
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#f1f5f9] text-slate-800 text-xs font-extrabold rounded border border-slate-300 hover:bg-slate-200 hover:border-slate-400 transition-colors"
                      >
                        <ExternalLink size={14} className="text-slate-500" />
                        {SaleChannelsMap[channel.type]}
                      </a>
                    );
                  })}
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
