import React from 'react';
import { ShoppingCart, MessageSquare, FileText, Clock, ChevronRight, Star, ArrowUpRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export function BuyerOverview() {
  const stats = [
    { label: "Active RFQs", value: "12", icon: <FileText className="text-blue-500" /> },
    { label: "New Messages", value: "5", icon: <MessageSquare className="text-orange-500" /> },
    { label: "Saved Products", value: "24", icon: <Star className="text-yellow-500" /> },
    { label: "Inquiry Basket", value: "8", icon: <ShoppingCart className="text-green-500" /> },
  ];

  const recentActivities = [
    { id: 1, type: "Message", title: "New message from Hanoi Textile Co.", time: "2 hours ago" },
    { id: 2, type: "RFQ", title: "Your RFQ for 'Cotton T-shirts' received 3 new quotes", time: "5 hours ago" },
    { id: 3, type: "Order", title: "Order #ORD-2026-001 has been shipped", time: "1 day ago" },
    { id: 4, type: "System", title: "Your account verification is complete", time: "2 days ago" },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Buyer Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back, Huynh Le Hoai Bao. Here's what's happening with your sourcing.</p>
        </div>
        <Link to="/rfq" className="bg-viet-red text-white px-6 py-2 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-500/20">
          Post New RFQ
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center">
                {stat.icon}
              </div>
              <ArrowUpRight size={16} className="text-slate-300" />
            </div>
            <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Recent Activity</h2>
              <button className="text-xs font-bold text-viet-red hover:underline">View All</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${activity.type === 'Message' ? 'bg-blue-500' : activity.type === 'RFQ' ? 'bg-orange-500' : 'bg-green-500'}`} />
                    <div>
                      <div className="text-sm font-medium text-slate-800 group-hover:text-viet-red transition-colors">{activity.title}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{activity.time}</div>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-viet-red" />
                </div>
              ))}
            </div>
          </div>

          {/* Recommended for You */}
          <div className="bg-white border border-slate-200 shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-900 uppercase tracking-widest text-sm">Recommended Suppliers</h2>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="w-20 h-20 bg-slate-100 rounded-lg overflow-hidden shrink-0 border border-slate-100">
                    <img src={`https://picsum.photos/seed/supplier${i}/200/200`} alt="Supplier" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-bold text-slate-800 group-hover:text-viet-red transition-colors">Vietnam Global Trade Co.</h3>
                    <p className="text-xs text-slate-500 mt-1">Verified Manufacturer</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Star size={12} className="text-yellow-500 fill-current" />
                      <span className="text-[10px] font-bold text-slate-700">4.9 (120 reviews)</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <div className="bg-slate-900 text-white p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-black uppercase tracking-tight">Sourcing Tools</h3>
            <div className="space-y-4">
              <Link to="/rfq" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Post RFQ</span>
                <ArrowUpRight size={16} className="text-viet-red" />
              </Link>
              <Link to="/categories" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Browse Directory</span>
                <ArrowUpRight size={16} className="text-viet-red" />
              </Link>
              <Link to="/help" className="flex items-center justify-between group">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">Help Center</span>
                <ArrowUpRight size={16} className="text-viet-red" />
              </Link>
            </div>
          </div>

          {/* Trade Assurance Widget */}
          <div className="bg-white border border-slate-200 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Shield size={32} className="text-viet-red" />
              <h3 className="font-black text-slate-900 uppercase tracking-tight">Trade Assurance</h3>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Protect your orders from payment to delivery. Get your money back if the supplier fails to ship on time or product quality is not as agreed.
            </p>
            <Link to="/services/trade-assurance" className="block text-center py-3 border border-viet-red text-viet-red text-xs font-bold uppercase tracking-widest hover:bg-red-50 transition-colors">
              Learn More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
