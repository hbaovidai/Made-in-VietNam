import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface ProductCardProps {
  key?: string;
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();

  const imageUrl = product.images?.[0] || product.image || 'https://via.placeholder.com/300';
  const categoryName = product.category?.name || product.category || 'Danh mục';
  
  const formatVND = (n: number) => n.toLocaleString('vi-VN') + ' ₫';
  const priceDisplay = (() => {
    const price = product.minPrice ?? product.price;
    if (price != null) return `${formatVND(price)} / ${product.unit || 'cái'}`;
    return product.priceRange || 'Liên hệ';
  })();
  
  const moqDisplay = product.moq ? `${product.moq.toLocaleString('vi-VN')} ${product.unit || ''}` : '100 pieces';

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:border-viet-gold/50 shadow-viet-gold/5 hover:shadow-viet-gold/10">
      <Link to={`/products/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur text-viet-gold px-3 py-1 rounded drop-shadow-sm border border-viet-gold/20 flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase">
          <ShieldCheck size={12} className="fill-viet-gold text-white" />
          VERIFIED
        </div>
      </Link>
      
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product.id}`} className="flex flex-col flex-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
            {categoryName}
          </span>
          <h3 className="text-base font-black text-[#1E293B] mb-1 line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-1">
            {product.supplier?.companyName || 'Công ty TNHH MIVN'}
          </p>

          <div className="grid grid-cols-2 gap-4 mb-6 mt-auto">
            <div>
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Min. Order</span>
              <span className="block text-sm font-bold text-[#1E293B]">{moqDisplay}</span>
            </div>
            <div className="text-right">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Price</span>
              <span className="block text-sm font-bold text-[#1E293B]">{priceDisplay}</span>
            </div>
          </div>
        </Link>
        <Link
          to={`/rfq?product=${product.id}`}
          className="w-full py-3 px-4 bg-white border-2 border-[#1E293B] text-[#1E293B] font-bold text-sm text-center rounded hover:bg-[#1E293B] hover:text-white transition-colors duration-300 flex items-center justify-center gap-2 group/btn"
        >
          Request Quote
          <svg className="w-4 h-4 fill-current group-hover/btn:translate-x-1 transition-transform" viewBox="0 0 24 24">
             <path d="M8 5v14l11-7z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
