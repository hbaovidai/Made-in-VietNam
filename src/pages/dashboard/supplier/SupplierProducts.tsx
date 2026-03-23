import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Package, ChevronRight, Search, Filter, Plus, MoreVertical, Edit2, Trash2, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { products } from '../../../data/mockData';

export function SupplierProducts() {
  const supplierProducts = products.slice(0, 8);

  return (
    <DashboardSection 
      title="Product Management" 
      subtitle="Manage your product catalog, update pricing, and add new items."
      actions={
        <button className="bg-viet-red text-white px-8 py-2 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 flex items-center gap-2">
          <Plus size={14} /> Add New Product
        </button>
      }
    >
      <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-80">
          <input type="text" placeholder="Search products..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 text-xs outline-none focus:border-viet-red" />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={14} /> Filters
          </button>
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Bulk Actions
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price (USD)</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</th>
              <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {supplierProducts.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-900 truncate group-hover:text-viet-red transition-colors">{product.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">ID: PRD-{product.id}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-600">Industrial Supplies</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-900">$1.50 - $5.00</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-600 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-green-100">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                    <Eye size={12} /> 1.2k
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-500 transition-colors">
                      <Edit2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-viet-red transition-colors">
                      <Trash2 size={16} />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-6 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">Showing 8 of 48 products</div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-400 cursor-not-allowed">Previous</button>
          <button className="px-4 py-2 border border-slate-200 text-xs font-bold text-slate-900 hover:bg-slate-50">Next</button>
        </div>
      </div>
    </DashboardSection>
  );
}
