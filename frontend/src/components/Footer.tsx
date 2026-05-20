import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  const [settings, setSettings] = useState<Record<string, string>>({
    contact_email: 'contact@vieproduct.com',
    contact_phone: '+84 899 123 456',
    contact_address: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam',
    facebook_url: '',
    twitter_url: '',
    linkedin_url: '',
    instagram_url: '',
  });

  useEffect(() => {
    api.get('/settings')
      .then(res => setSettings(prev => ({ ...prev, ...res.data })))
      .catch(() => {/* use defaults */});
  }, []);

  return (
    <footer className="bg-[#043365] text-slate-300 pt-16 pb-8 border-t border-[#03254A]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-1">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                 <img src="/logoVIE.png" alt="Logo" className="h-8 w-auto object-contain" />
              </div>
              <div className="flex flex-row items-baseline ml-2">
                <span className="text-2xl font-bold text-white leading-none tracking-tight">VIE</span>
                <span className="text-2xl font-normal text-slate-300 leading-none tracking-tight">product</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {t('footer_description')}
            </p>
            <div className="flex items-center gap-4">
              {settings.facebook_url && (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                  <Facebook size={18} />
                </a>
              )}
              {settings.twitter_url && (
                <a href={settings.twitter_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                  <Twitter size={18} />
                </a>
              )}
              {settings.linkedin_url && (
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                  <Linkedin size={18} />
                </a>
              )}
              {settings.instagram_url && (
                <a href={settings.instagram_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                  <Instagram size={18} />
                </a>
              )}
              {/* Show placeholders if no social links set */}
              {!settings.facebook_url && !settings.twitter_url && !settings.linkedin_url && !settings.instagram_url && (
                <>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white"><Facebook size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white"><Twitter size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white"><Linkedin size={18} /></a>
                  <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white"><Instagram size={18} /></a>
                </>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('marketplace')}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/products" className="hover:text-viet-gold transition-colors">{t('browse_products')}</Link></li>
              <li><Link to="/suppliers" className="hover:text-viet-gold transition-colors">{t('verified_suppliers')}</Link></li>
              <li><Link to="/rfq" className="hover:text-viet-gold transition-colors">{t('request_for_quotation')}</Link></li>
              <li><Link to="/products" className="hover:text-viet-gold transition-colors">{t('all_categories_footer')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('support_info')}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-viet-gold transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/contact" className="hover:text-viet-gold transition-colors">{t('contact_support')}</Link></li>
              <li><Link to="/help" className="hover:text-viet-gold transition-colors">{t('help_center')}</Link></li>
              <li><Link to="/terms" className="hover:text-viet-gold transition-colors">{t('terms_of_service')}</Link></li>
              <li><Link to="/privacy" className="hover:text-viet-gold transition-colors">{t('privacy_policy')}</Link></li>
            </ul>
          </div>

          {/* Contact Info — dynamic from admin settings */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('contact_us')}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-viet-gold shrink-0" />
                <span>{settings.contact_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-viet-gold shrink-0" />
                <span>{settings.contact_phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-viet-gold shrink-0" />
                <span>{settings.contact_email}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {currentYear} VIEproduct {t('all_rights_reserved_text')}</p>
          <div className="flex items-center gap-6">
            <img src="https://flagcdn.com/w40/vn.png" srcSet="https://flagcdn.com/w80/vn.png 2x" alt="Vietnam Flag" className="h-4 rounded-sm" />
            <span className="text-slate-400 font-medium">{t('proudly_vietnamese')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
