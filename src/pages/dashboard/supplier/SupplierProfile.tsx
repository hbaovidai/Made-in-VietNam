import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Building2, MapPin, Globe, Award, Shield, CheckCircle2, Edit2, Camera, Plus, Trash2 } from 'lucide-react';

export function SupplierProfile() {
  const certifications = [
    { id: 1, name: "ISO 9001:2015", issuer: "TUV SUD", date: "2024-2027" },
    { id: 2, name: "CE Certificate", issuer: "SGS", date: "2023-2026" },
    { id: 3, name: "RoHS Compliance", issuer: "Intertek", date: "2025-2028" },
  ];

  return (
    <DashboardSection 
      title="Company Profile" 
      subtitle="Manage your company information, certifications, and brand identity."
      actions={
        <button className="bg-viet-red text-white px-8 py-2 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 flex items-center gap-2">
          <Edit2 size={14} /> Edit Profile
        </button>
      }
    >
      <div className="p-8 space-y-12">
        {/* Company Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group">
            <div className="w-32 h-32 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl overflow-hidden">
              <img src="https://picsum.photos/seed/company/200/200" alt="Company Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-viet-red text-white p-2 rounded-lg shadow-lg hover:bg-red-700 transition-colors">
              <Camera size={16} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hanoi Textile & Garment Co., Ltd.</h2>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                <Shield size={12} /> Verified Supplier
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Building2 size={14} className="text-viet-red" />
                <span>Manufacturer, Trading Company</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <MapPin size={14} className="text-viet-red" />
                <span>Hanoi, Vietnam</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Globe size={14} className="text-viet-red" />
                <span>www.hanoitextile.com</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Hanoi Textile & Garment Co., Ltd. is a leading manufacturer of high-quality cotton fabrics and apparel in Vietnam. With over 20 years of experience, we serve global brands with sustainable and innovative textile solutions.
            </p>
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Building2 size={20} className="text-viet-red" /> Business Information
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Year Established</div>
                <div className="text-sm font-bold text-slate-800">2005</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Employees</div>
                <div className="text-sm font-bold text-slate-800">501 - 1000 People</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Revenue</div>
                <div className="text-sm font-bold text-slate-800">US $10M - $50M</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Main Markets</div>
                <div className="text-sm font-bold text-slate-800">North America, Europe, SE Asia</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Award size={20} className="text-viet-red" /> Certifications
              </h3>
              <button className="text-viet-red text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                <Plus size={12} /> Add New
              </button>
            </div>
            <div className="space-y-4">
              {certifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-slate-50 border border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={20} className="text-green-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{cert.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Issued by {cert.issuer} • Valid until {cert.date}</div>
                    </div>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-viet-red transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Factory Photos */}
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Camera size={20} className="text-viet-red" /> Factory & Office Photos
            </h3>
            <button className="bg-white text-slate-900 border border-slate-200 px-6 py-2 font-bold hover:bg-slate-50 transition-colors uppercase tracking-widest text-xs">
              Manage Gallery
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-slate-100 border border-slate-200 rounded-xl overflow-hidden group cursor-pointer relative">
                <img src={`https://picsum.photos/seed/factory-${i}/400/300`} alt={`Factory ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Edit2 size={20} className="text-white" />
                </div>
              </div>
            ))}
            <button className="aspect-video border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-viet-red hover:text-viet-red transition-all">
              <Plus size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Add Photo</span>
            </button>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
