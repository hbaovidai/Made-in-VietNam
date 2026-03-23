import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { TrendingUp, TrendingDown, Eye, Users, MessageSquare, Package, ChevronRight, Calendar, ArrowUpRight } from 'lucide-react';

export function SupplierAnalytics() {
  const stats = [
    { label: "Profile Views", value: "1,240", change: "+12%", trend: "up", icon: <Eye className="text-blue-500" /> },
    { label: "Product Clicks", value: "850", change: "+5%", trend: "up", icon: <Package className="text-orange-500" /> },
    { label: "Inquiries", value: "15", change: "-2%", trend: "down", icon: <MessageSquare className="text-red-500" /> },
    { label: "New Leads", value: "8", change: "+15%", trend: "up", icon: <Users className="text-green-500" /> },
  ];

  const topProducts = [
    { id: 1, name: "Industrial Grade PVC Pipes", views: "450", clicks: "120", conversion: "26%" },
    { id: 2, name: "Cotton T-shirts Summer Edition", views: "380", clicks: "95", conversion: "25%" },
    { id: 3, name: "Eco-friendly Bamboo Packaging", views: "210", clicks: "45", conversion: "21%" },
    { id: 4, name: "LED Smart Home Lighting", views: "180", clicks: "38", conversion: "21%" },
  ];

  return (
    <DashboardSection 
      title="Business Analytics" 
      subtitle="Track your performance, visitor trends, and product engagement."
      actions={
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={14} /> Last 30 Days
          </button>
          <button className="bg-slate-900 text-white px-6 py-2 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
            Export Data
          </button>
        </div>
      }
    >
      <div className="p-8 space-y-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50 p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {stat.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Visitor Trend */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Eye size={20} className="text-viet-red" /> Visitor Trend
            </h3>
            <div className="h-64 flex items-end gap-2">
              {[30, 50, 40, 70, 60, 90, 80, 100, 85, 95, 75, 110].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 relative group cursor-pointer">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-viet-red/20 group-hover:bg-viet-red transition-all" 
                    style={{ height: `${h}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>

          {/* Inquiry Trend */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MessageSquare size={20} className="text-viet-red" /> Inquiry Trend
            </h3>
            <div className="h-64 flex items-end gap-2">
              {[20, 40, 30, 50, 45, 60, 55, 70, 65, 80, 75, 90].map((h, i) => (
                <div key={i} className="flex-1 bg-slate-100 relative group cursor-pointer">
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-blue-500/20 group-hover:bg-blue-500 transition-all" 
                    style={{ height: `${h}%` }} 
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>Week 1</span>
              <span>Week 2</span>
              <span>Week 3</span>
              <span>Week 4</span>
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <TrendingUp size={20} className="text-viet-red" /> Top Performing Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Views</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clicks</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Conversion</th>
                  <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {topProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-slate-900 group-hover:text-viet-red transition-colors">{product.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{product.views}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-600">{product.clicks}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-slate-900">{product.conversion}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <ArrowUpRight size={16} className="text-green-500 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
