import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Facebook, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.51a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.37a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.8z" />
  </svg>
);
import { useTranslation } from 'react-i18next';
import { useAppearance } from '../contexts/AppearanceContext';

export function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const { settings: ctx } = useAppearance();

  const settings = {
    contact_email: ctx.contact_email || 'contact@vieproduct.com',
    contact_phone: ctx.contact_phone || '+84 899 123 456',
    contact_address: ctx.contact_address || '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam',
    facebook_url: ctx.facebook_url || '',
    linkedin_url: ctx.linkedin_url || '',
  };

  return (
    <footer className="pt-16 pb-8 border-t" style={{
      backgroundColor: 'var(--color-footer-bg, #043365)',
      color: 'var(--color-footer-text, #CBD5E1)',
      borderColor: 'var(--color-footer-bg, #03254A)',
      ...(ctx.footer_banner_image ? {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${ctx.footer_banner_image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      } : {}),
    }}>
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
              {settings.facebook_url ? (
                <a href={settings.facebook_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                  <Facebook size={18} />
                </a>
              ) : (
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white"><Facebook size={18} /></a>
              )}
              {settings.linkedin_url ? (
                <a href={settings.linkedin_url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                  <Linkedin size={18} />
                </a>
              ) : (
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white"><Linkedin size={18} /></a>
              )}
              <a href={ctx.tiktok_url || '#'} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-viet-gold hover:text-[#043365] transition-all text-white">
                <TikTokIcon size={18} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('tro_thanh_doi_tac')}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/register" className="hover:text-viet-gold transition-colors">{t('dang_ky_tham_gia')}</Link></li>
              <li><Link to="/help/seller-guide" className="hover:text-viet-gold transition-colors">{t('huong_dan_quy_trinh')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">{t('ve_vieproduct')}</h3>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link to="/about" className="hover:text-viet-gold transition-colors">{t('about_us')}</Link></li>
              <li><Link to="/contact" className="hover:text-viet-gold transition-colors">{t('contact_support')}</Link></li>
              <li><Link to="/help" className="hover:text-viet-gold transition-colors">{t('help_center')}</Link></li>
              <li><Link to="/terms" className="hover:text-viet-gold transition-colors">{t('terms_of_service')}</Link></li>
              <li><Link to="/privacy" className="hover:text-viet-gold transition-colors">{t('privacy_policy')}</Link></li>
              <li><Link to="/blog" className="hover:text-viet-gold transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-viet-gold transition-colors">Tuyển dụng</Link></li>
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
