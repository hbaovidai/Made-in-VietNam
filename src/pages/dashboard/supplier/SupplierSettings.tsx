import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { User, Mail, Phone, Globe, Shield, Bell, CreditCard, ChevronRight, Save, Building2, Lock } from 'lucide-react';

export function SupplierSettings() {
  const settingsSections = [
    { icon: <Building2 size={20} className="text-blue-500" />, title: "Company Information", desc: "Update your company name, logo, and business details." },
    { icon: <Mail size={20} className="text-orange-500" />, title: "Email & Notifications", desc: "Manage your email preferences and notification settings." },
    { icon: <Lock size={20} className="text-red-500" />, title: "Security & Password", desc: "Change your password and enable two-factor authentication." },
    { icon: <CreditCard size={20} className="text-green-500" />, title: "Payment Methods", desc: "Add or remove payment methods for your orders." },
    { icon: <Globe size={20} className="text-purple-500" />, title: "Language & Region", desc: "Set your preferred language and currency." },
  ];

  return (
    <DashboardSection 
      title="Account Settings" 
      subtitle="Manage your personal information, security, and preferences."
      actions={
        <button className="bg-viet-red text-white px-8 py-2 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 flex items-center gap-2">
          <Save size={14} /> Save Changes
        </button>
      }
    >
      <div className="p-8 space-y-12">
        {/* Profile Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <User size={20} className="text-viet-red" /> Contact Person Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">First Name</label>
                <input type="text" defaultValue="Huynh Le" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Name</label>
                <input type="text" defaultValue="Hoai Bao" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
              <input type="email" defaultValue="huynhlehoaibao23@gmail.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Phone Number</label>
              <input type="tel" defaultValue="+84 123 456 789" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red" />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Globe size={20} className="text-viet-red" /> Location & Preferences
            </h3>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country/Region</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red">
                <option>Vietnam</option>
                <option>United States</option>
                <option>China</option>
                <option>Germany</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Preferred Language</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red">
                <option>English</option>
                <option>Vietnamese</option>
                <option>Chinese</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Currency</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 text-sm outline-none focus:border-viet-red">
                <option>USD ($)</option>
                <option>VND (₫)</option>
                <option>EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Other Settings List */}
        <div className="pt-12 border-t border-slate-100 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight mb-6">Other Settings</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {settingsSections.map((section, idx) => (
              <div key={idx} className="p-6 border border-slate-100 hover:border-viet-red transition-all flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                    {section.icon}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800 group-hover:text-viet-red transition-colors">{section.title}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{section.desc}</div>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300 group-hover:text-viet-red" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
