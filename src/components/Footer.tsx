import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-viet-red rounded-lg flex items-center justify-center text-viet-gold">
                <Globe size={24} />
              </div>
              <div className="flex flex-col">
              <span className="text-xl font-bold text-white leading-none tracking-tight">Made in</span>
              <span className="text-xl font-bold text-viet-red leading-none tracking-tight">VietNam</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              {t('footer_description')}
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-viet-red hover:text-white transition-all">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-viet-red hover:text-white transition-all">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-viet-red hover:text-white transition-all">
                <Linkedin size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-viet-red hover:text-white transition-all">
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('marketplace')}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/products" className="hover:text-viet-red transition-colors">{t('browse_products')}</Link></li>
              <li><Link to="/suppliers" className="hover:text-viet-red transition-colors">{t('verified_suppliers')}</Link></li>
              <li><Link to="/rfq" className="hover:text-viet-red transition-colors">{t('request_for_quotation')}</Link></li>
              <li><Link to="/categories" className="hover:text-viet-red transition-colors">{t('all_categories_footer')}</Link></li>
              <li><Link to="/premium" className="hover:text-viet-red transition-colors">{t('premium_membership')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('support_info')}</h3>
            <ul className="space-y-4 text-sm">
              <li><Link to="/about" className="hover:text-viet-red transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/contact" className="hover:text-viet-red transition-colors">{t('contact_support')}</Link></li>
              <li><Link to="/help" className="hover:text-viet-red transition-colors">{t('help_center')}</Link></li>
              <li><Link to="/terms" className="hover:text-viet-red transition-colors">{t('terms_of_service')}</Link></li>
              <li><Link to="/privacy" className="hover:text-viet-red transition-colors">{t('privacy_policy')}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('contact_us')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-viet-red shrink-0" />
                <span>{t('footer_address')}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-viet-red shrink-0" />
                <span>+84 (28) 1234 5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-viet-red shrink-0" />
                <span>contact@madeinvietnam.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
        <p>© {currentYear} Made in VietNam Marketplace. {t('all_rights_reserved_text')}</p>
          <div className="flex items-center gap-6">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/320px-Flag_of_Vietnam.svg.png" alt="Vietnam Flag" className="h-4 rounded-sm" />
            <span>{t('proudly_vietnamese')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
