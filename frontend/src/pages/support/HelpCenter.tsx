import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Rocket, FileSearch, ShieldCheck, Lock, User, Plus, Minus, MessageCircle, Mail } from 'lucide-react';

export function HelpCenter() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [searchTerm, setSearchTerm] = useState('');

  const categories = [
    { icon: <Rocket size={20} className="text-white" />, title: t('cat_getting_started'), desc: t('cat_getting_started_desc'), href: '/help/user-guide' },
    { icon: <FileSearch size={20} className="text-white" />, title: t('cat_sourcing_rfq'), desc: t('cat_sourcing_rfq_desc'), href: '/help/user-guide' },
    { icon: <ShieldCheck size={20} className="text-viet-gold" />, iconBg: 'bg-[#FDF8F0]', title: t('cat_qr_verify'), desc: t('cat_qr_verify_desc'), href: '/verify' },
    { icon: <Search size={20} className="text-white" />, title: t('cat_product_mgmt'), desc: t('cat_product_mgmt_desc'), href: '/help/seller-guide' },
    { icon: <Lock size={20} className="text-white" />, title: t('cat_account_security'), desc: t('cat_account_security_desc'), href: '/help/user-guide' },
    { icon: <User size={20} className="text-white" />, title: t('cat_for_suppliers'), desc: t('cat_for_suppliers_desc'), href: '/help/seller-guide' },
  ];

  const faqs = [
    { q: t('faq_q1'), a: t('faq_a1') },
    { q: t('faq_q2'), a: t('faq_a2') },
    { q: t('faq_q3'), a: t('faq_a3') },
    { q: t('faq_q4'), a: t('faq_a4') },
    { q: t('faq_q5'), a: t('faq_a5') },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-200 pt-4 pb-12 relative overflow-hidden">
        {/* Soft Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-viet-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-primary font-bold">{t('help_center')}</span>
          </nav>

          <div className="max-w-4xl space-y-4 flex flex-col items-center text-center mx-auto mt-2">
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight drop-shadow-sm pb-1">
              {t('help_center_question')}
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium mt-2">
              {t('help_center_subtitle')}
            </p>

            <div className="max-w-2xl w-full mx-auto relative mt-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder={t('help_search_placeholder')} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-full outline-none focus:border-primary transition-all shadow-lg shadow-slate-100/50 text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 uppercase font-bold tracking-widest mt-4">
              <span>{t('keywords')}</span>
              {[t('help_keywords_products'), t('help_keywords_account')].map(kw => (
                <span key={kw} onClick={() => setSearchTerm(kw)} className="hover:text-primary cursor-pointer transition-colors">{kw}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {(() => {
        const q = searchTerm.toLowerCase().trim();
        const filteredCats = q ? categories.filter(c => c.title.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q)) : categories;
        const filteredFaqs = q ? faqs.filter(f => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)) : faqs;
        const noResults = q && filteredCats.length === 0 && filteredFaqs.length === 0;

        return (
      <div className="max-w-[1200px] mx-auto px-6 py-20">
        
        {/* Knowledge Hub Categories */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="text-[10px] font-bold text-viet-gold uppercase tracking-widest mb-2">{t('knowledge_center')}</div>
              <h2 className="text-2xl font-black text-slate-900">{t('by_category')}</h2>
            </div>
            <Link to="#" className="text-sm font-bold text-primary flex items-center hover:underline">
              {t('view_all')} <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCats.map((cat, idx) => {
              const Wrapper = (cat as any).href ? Link : 'div';
              const wrapperProps = (cat as any).href ? { to: (cat as any).href } : {};
              return (
                <Wrapper key={idx} {...wrapperProps as any} className="bg-white p-8 rounded-xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer flex flex-col no-underline">
                  <div className={`w-12 h-12 ${(cat as any).iconBg || 'bg-[#1E3A8A]'} rounded-xl flex items-center justify-center mb-6`}>
                    {cat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">{cat.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-8">{cat.desc}</p>
                  <div className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                    {t('explore')} <ChevronRight size={14} />
                  </div>
                </Wrapper>
              );
            })}
          </div>
          {filteredCats.length === 0 && q && (
            <p className="text-center text-slate-400 text-sm mt-8">{t('no_category_match')} "{searchTerm}"</p>
          )}
        </div>

        {/* FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">{t('faq_title')}<br/>{t('faq_title_2')}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              {t('faq_sidebar_desc')}
            </p>
            
            <div className="bg-[#FDF8F0] border-l-4 border-viet-gold p-6 rounded-r-xl">
              <p className="text-sm font-medium text-slate-900 italic mb-4">
                "{t('faq_testimonial')}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div>
                  <div className="text-xs font-bold text-slate-900">{t('faq_testimonial_role')}</div>
                  <div className="text-[10px] font-bold text-viet-gold uppercase tracking-widest">{t('faq_testimonial_company')}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            {filteredFaqs.map((faq, idx) => {
              const realIdx = faqs.indexOf(faq);
              const isOpen = openFaq === realIdx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setOpenFaq(isOpen ? null : realIdx)}
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
            {filteredFaqs.length === 0 && q && (
              <p className="text-center text-slate-400 text-sm py-8">{t('no_faq_match')} "{searchTerm}"</p>
            )}
          </div>
        </div>

        {noResults && (
          <div className="text-center py-16">
            <p className="text-slate-400 text-lg mb-2">{t('no_results_for')} "{searchTerm}"</p>
            <p className="text-slate-400 text-sm">{t('try_other_keyword')} <Link to="/contact" className="text-primary font-bold hover:underline">{t('contact_support_link')}</Link></p>
          </div>
        )}
      </div>
        );
      })()}

      {/* Support CTA */}
      <div className="bg-[#0F172A] text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto text-center mb-16 relative z-10">
          <h2 className="text-3xl font-black mb-4">{t('still_need_help_title')}</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            {t('still_need_help_desc_v2')}
          </p>
        </div>

        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Link to="/contact" className="bg-[#1E293B] p-8 rounded-xl flex flex-col items-start border border-slate-700/50 hover:bg-[#233146] transition-colors cursor-pointer group no-underline">
            <div className="w-12 h-12 bg-[#334155] rounded-xl flex items-center justify-center mb-6">
              <MessageCircle size={24} className="text-viet-gold" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t('send_support_message')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
              {t('send_support_message_desc')}
            </p>
            <div className="text-viet-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              {t('send_now')} <ChevronRight size={14} />
            </div>
          </Link>

          <a href="mailto:support@vieproduct.vn" className="bg-[#1E293B] p-8 rounded-xl flex flex-col items-start border border-slate-700/50 hover:bg-[#233146] transition-colors cursor-pointer group no-underline">
            <div className="w-12 h-12 bg-[#334155] rounded-xl flex items-center justify-center mb-6">
              <Mail size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-white">{t('direct_email')}</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
              {t('direct_email_desc')}
            </p>
            <div className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              {t('send_email')} <ChevronRight size={14} />
            </div>
          </a>
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
            {t('help_bridging_title')}
          </h2>
          <div className="w-16 h-1 bg-viet-gold mx-auto mb-6" />
          <p className="text-slate-300 text-xs md:text-sm uppercase tracking-widest font-medium">
            {t('help_bridging_desc')}
          </p>
        </div>
      </div>
    </div>
  );
}
