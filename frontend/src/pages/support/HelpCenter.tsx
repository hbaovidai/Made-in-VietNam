import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Rocket, FileSearch, ShieldCheck, Ship, Lock, User, Plus, Minus, MessageCircle, Mail } from 'lucide-react';

export function HelpCenter() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    { icon: <Rocket size={20} className="text-white" />, title: 'Getting Started', desc: 'New to VIEProduct? Learn how to navigate the platform and connect with premium suppliers.' },
    { icon: <FileSearch size={20} className="text-white" />, title: 'Sourcing & RFQ', desc: 'Master the Request for Quote process to get the best pricing and high-quality lead times.' },
    { icon: <ShieldCheck size={20} className="text-[#A2875E]" />, iconBg: 'bg-[#FDF8F0]', title: 'Verified Program', desc: 'Understand our 12-point inspection process for premium Vietnamese industrial manufacturers.' },
    { icon: <Ship size={20} className="text-white" />, title: 'Export Logistics', desc: 'Guidance on freight forwarding, customs clearance, and global port operations in Vietnam.' },
    { icon: <Lock size={20} className="text-white" />, title: 'Payments & Security', desc: 'Secure escrow services and international wire transfer protocols for global trade.' },
    { icon: <User size={20} className="text-white" />, title: 'Account Management', desc: 'Managing your company profile, multi-user team access, and notification settings.' }
  ];

  const faqs = [
    { q: "How do I verify a manufacturer's credentials?", a: "Look for the 'Verified' gold badge on manufacturer profiles. This indicates they have passed our on-site inspection, ISO certificates checks, and trade volume verification. You can download the full Verification Report directly from their profile page for internal audit purposes." },
    { q: "What is a Request for Quote (RFQ) and how is it used?", a: "An RFQ allows you to post your exact purchasing requirements so relevant suppliers can submit customized competitive bids." },
    { q: "How to track my export shipment through VIEProduct?", a: "Go to your Dashboard > Orders > Shipping to view real-time tracking from our integrated freight partners." },
    { q: "Are there any membership fees for global buyers?", a: "No, VIEProduct is completely free for global buyers to join, source products, and connect with manufacturers." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-white pt-24 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#F0F4F8] to-white pointer-events-none" />
        <div className="max-w-[1200px] mx-auto px-6 relative z-10 text-center text-slate-800">
          <h1 className="text-4xl md:text-5xl font-black mb-10 tracking-tight">
            How can we <span className="text-[#A2875E] italic">help you?</span>
          </h1>
          
          <div className="max-w-2xl mx-auto relative mb-6">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search sourcing guides, RFQ processes, or logistics..." 
              className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-full outline-none focus:border-[#1E3A8A] transition-all shadow-lg shadow-slate-100/50 text-sm"
            />
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-slate-500 uppercase font-bold tracking-widest">
            <span>POPULAR:</span>
            <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">Verified Program</span>
            <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">Shipping Rates</span>
            <span className="hover:text-[#1E3A8A] cursor-pointer transition-colors">RFQ Templates</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-20">
        
        {/* Knowledge Hub Categories */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="text-[10px] font-bold text-[#A2875E] uppercase tracking-widest mb-2">KNOWLEDGE HUB</div>
              <h2 className="text-2xl font-black text-[#1E293B]">Browse by category</h2>
            </div>
            <Link to="#" className="text-sm font-bold text-[#1E3A8A] flex items-center hover:underline">
              View all guides <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer flex flex-col">
                <div className={`w-12 h-12 ${cat.iconBg || 'bg-[#1E3A8A]'} rounded-xl flex items-center justify-center mb-6`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-[#1E293B] mb-3">{cat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-8">{cat.desc}</p>
                <div className="flex items-center gap-1 text-[#1E3A8A] font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                  Explore <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-black text-[#1E293B] mb-4 leading-tight">Frequently Asked<br/>Questions</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Can't find what you're looking for? Our quick-access guide covers the most common inquiries from global buyers entering the Vietnamese market.
            </p>
            
            <div className="bg-[#FDF8F0] border-l-4 border-[#A2875E] p-6 rounded-r-xl">
              <p className="text-sm font-medium text-[#1E293B] italic mb-4">
                "VIEProduct has simplified our industrial sourcing from Southeast Asia by over 40% in the first quarter alone."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">Logistics Director</div>
                  <div className="text-[10px] font-bold text-[#A2875E] uppercase tracking-widest">EUROTECH MFG.</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div className="px-6 py-5 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1E293B]">{faq.q}</h4>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-[#1E293B]'}`}>
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-[#0F172A] text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto text-center mb-16 relative z-10">
          <h2 className="text-3xl font-black mb-4">Still need help?</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Our multilingual support team is available 24/7 to assist with your industrial sourcing, quality control, or logistics needs.
          </p>
        </div>

        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-[#1E293B] p-8 rounded-xl flex flex-col items-start border border-slate-700/50 hover:bg-[#233146] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#334155] rounded-xl flex items-center justify-center mb-6">
              <MessageCircle size={24} className="text-[#FBBF24]" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
              Get immediate assistance for urgent procurement inquiries or technical platform issues.
            </p>
            <div className="text-[#FBBF24] font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              START CONVERSATION <ChevronRight size={14} />
            </div>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-xl flex flex-col items-start border border-slate-700/50 hover:bg-[#233146] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#334155] rounded-xl flex items-center justify-center mb-6">
              <Mail size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Email Support</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
              Detailed inquiries regarding bulk logistics, international billing, or manufacturer verification.
            </p>
            <div className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              SEND TICKET <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Bridging Vietnam to the World */}
      <div className="relative h-[350px] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1565610222536-ce12792dafb2?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Factory" 
        />
        <div className="relative z-20 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white italic mb-6">
            Bridging Vietnam to the World
          </h2>
          <div className="w-16 h-1 bg-[#A2875E] mx-auto mb-6" />
          <p className="text-slate-300 text-xs md:text-sm uppercase tracking-widest font-medium">
            The premier digital gateway for high-standard manufacturing partnerships.
          </p>
        </div>
      </div>
    </div>
  );
}
