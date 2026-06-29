import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { useToast } from '../components/ui/Toast';
import { SEOHead } from '../components/SEOHead';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { useAppearance } from '../contexts/AppearanceContext';

export function Contact() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [form, setForm] = useState({ fullName: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const { settings: ctx } = useAppearance();

  const siteSettings = {
    contact_email: ctx.contact_email || 'contact@vieproduct.com',
    contact_phone: ctx.contact_phone || '+84 899 123 456',
    contact_address: ctx.contact_address || '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.email || !form.subject || !form.message) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Vui lòng điền đầy đủ thông tin' });
      return;
    }
    setSending(true);
    try {
      await api.post('/contact', form);
      addToast({ type: 'success', title: 'Thành công', message: 'Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất.' });
      setForm({ fullName: '', email: '', subject: '', message: '' });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể gửi tin nhắn. Vui lòng thử lại.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEOHead
        title="Liên hệ - VIEProduct"
        description="Liên hệ với VIEProduct - Hỗ trợ tư vấn, hợp tác kinh doanh và giải đáp thắc mắc."
        keywords="liên hệ VIEProduct, hỗ trợ, tư vấn, B2B Việt Nam"
        canonical="/contact"
      />

      <BreadcrumbBar items={[{ label: t('contact_page') }]} />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 transform translate-x-32" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              {t('get_in_touch', 'Liên hệ với chúng tôi')}
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              {t('contact_intro', 'Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy gửi tin nhắn và chúng tôi sẽ phản hồi trong thời gian sớm nhất.')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12 relative z-20">
        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left: Contact Info */}
          <div className="lg:w-1/3 bg-slate-900 p-12 text-white space-y-12">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">{t('contact_info', 'Thông tin liên hệ')}</h2>
              <p className="text-slate-400">{t('contact_intro', 'Chúng tôi luôn sẵn sàng hỗ trợ bạn.')}</p>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-primary shrink-0"><Phone size={24} /></div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('call_us')}</div>
                  <div className="text-lg font-bold">{siteSettings.contact_phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-viet-gold shrink-0"><Mail size={24} /></div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('email_us')}</div>
                  <div className="text-lg font-bold">{siteSettings.contact_email}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-blue-400 shrink-0"><MapPin size={24} /></div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('visit_us')}</div>
                  <div className="text-lg font-bold">{siteSettings.contact_address}</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400 shrink-0"><Clock size={24} /></div>
                <div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">{t('working_hours', 'Giờ làm việc')}</div>
                  <div className="text-lg font-bold">{t('working_hours_value', 'T2 - T6: 8:00 - 17:30')}</div>
                </div>
              </div>
            </div>

            {/* CTA to About */}
            <div className="pt-4 border-t border-white/10">
              <Link to="/about" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
                {t('learn_about_us', 'Tìm hiểu thêm về chúng tôi')}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:w-2/3 p-12 md:p-16">
            <div className="flex items-center gap-3 mb-8">
              <MessageSquare size={24} className="text-primary" />
              <h3 className="text-2xl font-bold text-slate-900">{t('send_message', 'Gửi tin nhắn')}</h3>
            </div>
            <form className="grid md:grid-cols-2 gap-8" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('full_name_label')}</label>
                <input type="text" placeholder={t('full_name_placeholder')} value={form.fullName} onChange={(e) => setForm({...form, fullName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t('email_address_label')}</label>
                <input type="email" placeholder={t('email_address_placeholder')} value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">{t('subject_label')}</label>
                <input type="text" placeholder={t('subject_placeholder')} value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-slate-700">{t('message_label')}</label>
                <textarea rows={5} placeholder={t('message_placeholder')} value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none" />
              </div>
              <div className="md:col-span-2">
                <button type="submit" disabled={sending} className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl hover:shadow-primary-dark/20 flex items-center justify-center gap-3 disabled:opacity-50">
                  {sending ? 'Đang gửi...' : t('send_message')}
                  <Send size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
