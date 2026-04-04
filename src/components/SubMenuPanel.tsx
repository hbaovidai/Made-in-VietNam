import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Category } from '../data/mockData';

interface SubMenuPanelProps {
  category: Category;
}

export function SubMenuPanel({ category }: SubMenuPanelProps) {
  return (
    <div className="absolute top-0 left-full w-[600px] h-full bg-white border border-slate-200 shadow-xl z-50 p-6 animate-in fade-in slide-in-from-left-2 duration-200">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-900">{category.name}</h3>
        <Link to={`/products?category=${category.name}`} className="text-sm text-primary font-bold hover:underline flex items-center gap-1">
          View All <ChevronRight size={14} />
        </Link>
      </div>
      
      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
        <div>
          <h4 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-100">Popular Subcategories</h4>
          <ul className="space-y-2">
            {category.children.map((child) => (
              <li key={child}>
                <Link to={`/products?subcategory=${child}`} className="text-sm text-slate-600 hover:text-primary transition-colors">
                  {child}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3 pb-1 border-b border-slate-100">Recommended for You</h4>
            <div className="grid grid-cols-2 gap-3">
              {[1, 2].map((i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="aspect-square bg-slate-50 border border-slate-100 mb-2 overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${category.name}${i}/200/200`} 
                      alt="Product" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-1 group-hover:text-primary">Trending {category.name} Item</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-slate-50 p-4 border border-slate-100">
            <h5 className="text-xs font-bold text-slate-800 mb-1">Source from Verified Factories</h5>
            <p className="text-[10px] text-slate-500 mb-3">Connect with 500+ top-rated manufacturers in this industry.</p>
            <Link to="/suppliers" className="text-[10px] font-bold text-primary hover:underline">Browse Suppliers →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
