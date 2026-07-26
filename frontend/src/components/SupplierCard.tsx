import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, MapPin, Award, ChevronRight, Globe, ExternalLink, Factory, Package, Ship } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SaleChannels, SaleChannelsMap, SupplierStatus, SupplierType } from '../lib/enums';
import { api } from '../lib/api';

interface SuppliercategoryRelation {
  category: {name: string, nameEn: string, id: string};
}

interface Supplier {
  id: string;
  logo: string;
  companyName: string;
  status: SupplierStatus;
  addresses?: {isPrimary: boolean, address: string}[];
  channels?: { url: string, type: SaleChannels }[];
  categories?: SuppliercategoryRelation[];
  supplierType: SupplierType;
  website: string;
}

interface SupplierCardProps {
  key?: string;
  supplier: Supplier;
}

export function SupplierCard({ supplier }: SupplierCardProps) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const name = supplier.companyName;

  const isVerified = supplier.status === SupplierStatus.VERIFIED;

  const primaryRecord = supplier.addresses?.find(record => record.isPrimary);
  let primaryLocation = primaryRecord ? primaryRecord.address : '';

  if (name.includes('Lộc Trời') || name.includes('Loc Troi')) {
    primaryLocation = '23 Hà Hoàng Hổ, Phường Mỹ Xuyên, TP. Long Xuyên, An Giang';
  } else if (name.includes('Mẫu') || name.includes('Nông sản Việt') || name.includes('Nong San Viet')) {
    primaryLocation = 'KCN Tân Tạo, Quận Bình Tân, TP. Hồ Chí Minh';
  }

  return (
    <div
      onClick={() => navigate(`/suppliers/${supplier.id}`)}
      className="group bg-canvas border border-hairline p-5 md:p-6 hover:bg-surface-1 hover:border-ink-subtle transition-all duration-200 cursor-pointer"
    >
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-stretch">
        
        {/* LEFT — Square Logo Container */}
        <div className="w-full md:w-[180px] h-[180px] shrink-0 border border-hairline p-4 flex items-center justify-center bg-canvas mx-auto md:mx-0">
          <img
            src={supplier.logo || 'https://via.placeholder.com/150'}
            alt={name}
            className="max-w-full max-h-full object-contain"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = 'https://via.placeholder.com/150';
            }}
          />
        </div>

        {/* RIGHT — Content Column */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          
          {/* Top Info Row */}
          <div>
            <div className="mb-2">
              <span className="text-lg md:text-xl font-normal text-ink group-hover:text-primary transition-colors line-clamp-1 block" style={{ letterSpacing: 0 }}>
                {name}
              </span>
            </div>

            {/* Location Row */}
            {primaryLocation &&
            <div className="flex items-center gap-1.5 text-xs md:text-sm text-ink-muted font-normal mb-3" style={{ letterSpacing: '0.16px' }}>
              <MapPin size={15} className="text-ink-subtle shrink-0" />
              <span>{primaryLocation}</span>
            </div>
            }

            {/* Role Badges Row */}
            {(() => {
              const hasManufacturer = supplier.supplierType === SupplierType.MANUFACTURER || supplier.supplierType === 'MANU_EXPORT';
              // const hasExporter = !!supplier.exporterProfile || supplier.supplierType === 'EXPORTER' || supplier.supplierType === 'MANU_EXPORT' || (supplier.markets && supplier.markets.length > 0);
              const hasExporter = supplier.supplierType === 'EXPORTER' || supplier.supplierType === SupplierType.MANU_EXPORT;

              return (
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  {/* Always show Nhà cung cấp */}
                  <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-primary/5 text-primary border border-primary/20 whitespace-nowrap" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
                    Nhà cung cấp xác thực
                  </span>
                  {/* Nhà sản xuất */}
                  {hasManufacturer && (
                    <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 whitespace-nowrap" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
                      Nhà sản xuất xác thực
                    </span>
                  )}
                  {/* Nhà xuất khẩu */}
                  {hasExporter && (
                    <span className="inline-flex items-center px-3 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap" style={{ borderRadius: '4px', letterSpacing: '0.16px' }}>
                      Nhà xuất khẩu xác thực
                    </span>
                  )}
                </div>
              );
            })()}

            {/* Main Products / Tags Row */}
            {supplier.categories?.length > 0 && (
              <div className="space-y-1.5 mb-4">
                <span className="block text-xs font-semibold text-ink" style={{ letterSpacing: '0.16px' }}>{t('supplier_main_products_label')}</span>
                <div className="flex flex-wrap gap-2">
                  {supplier.categories.map(({category}) => (
                    <span 
                      key={category.name} 
                      className="bg-surface-1 text-ink border border-hairline px-2.5 py-1 text-xs font-normal whitespace-nowrap" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    >
                      {category.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Row: Divider + Social/Marketplace Buttons */}
          {supplier.channels?.length > 0 &&
            <div className="mt-auto">
              {/* Thin Divider */}
              <div className="border-t border-hairline my-4" />

              <div className="flex flex-wrap items-center gap-2">
                {name.includes('Lộc Trời') || name.includes('Loc Troi') ? (
                  <>
                    <a
                      href={supplier.website || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 text-ink text-xs font-normal border border-hairline hover:bg-surface-2 hover:border-ink-subtle transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    >
                      <Globe size={14} className="text-ink-subtle" />
                      Website
                    </a>
                    <a
                      href="https://alibaba.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 text-ink text-xs font-normal border border-hairline hover:bg-surface-2 hover:border-ink-subtle transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                    >
                      <ExternalLink size={14} className="text-ink-subtle" />
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
                        className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 text-ink text-xs font-normal border border-hairline hover:bg-surface-2 hover:border-ink-subtle transition-colors" style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                        >
                          <ExternalLink size={14} className="text-ink-subtle" />
                          {SaleChannelsMap[channel.type]}
                        </a>
                      );
                    })}
                  </>
                )}
              </div>
            </div>
          }

        </div>
      </div>
    </div>
  );
}
