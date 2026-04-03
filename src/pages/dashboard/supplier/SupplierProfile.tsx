import React, { useState } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Building2, MapPin, Globe, Award, Shield, CheckCircle2, Edit2, Camera, Plus, Trash2, X } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { products } from '../../../data/mockData';
import { useTranslation } from 'react-i18next';

export function SupplierProfile() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certifications, setCertifications] = useState([
    { id: 1, name: "ISO 9001:2015", issuer: "TUV SUD", date: "2024-2027" },
    { id: 2, name: "CE Certificate", issuer: "SGS", date: "2023-2026" },
    { id: 3, name: "RoHS Compliance", issuer: "Intertek", date: "2025-2028" },
  ]);

  const supplierProducts = products.filter(p => p.supplierId === 's1');

  const handleLogoUpload = () => {
    addToast({ type: 'info', title: t('upload_logo_title'), message: t('upload_logo_success') });
  };

  const handleDeleteCert = (id: number) => {
    setCertifications(certifications.filter(c => c.id !== id));
    addToast({ type: 'success', title: t('delete_cert_title'), message: t('delete_cert_success') });
  };

  const handleAddCert = (e: React.FormEvent) => {
    e.preventDefault();
    setCertifications([...certifications, { id: Date.now(), name: "FDA Approval", issuer: "FDA", date: "2026-2029" }]);
    setIsCertModalOpen(false);
    addToast({ type: 'success', title: t('add_cert_title'), message: t('add_cert_success') });
  };

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditModalOpen(false);
    addToast({ type: 'success', title: t('update_profile_success_title'), message: t('update_profile_success_desc') });
  };

  return (
    <DashboardSection 
      title={t('supplier_profile_title')} 
      subtitle={t('supplier_profile_subtitle')}
      actions={
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-viet-red text-white px-8 py-2 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-xs shadow-lg shadow-red-500/20 flex items-center gap-2"
        >
          <Edit2 size={14} /> {t('edit_profile_btn')}
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
            <button 
              onClick={handleLogoUpload}
              className="absolute -bottom-2 -right-2 bg-viet-red text-white p-2 text-xs rounded-lg shadow-lg hover:bg-red-700 transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hanoi Textile & Garment Co., Ltd.</h2>
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-blue-100">
                <Shield size={12} /> {t('verified_badge_profile')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Building2 size={14} className="text-viet-red" />
                <span>{t('biz_type_manufacturer_trading')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <MapPin size={14} className="text-viet-red" />
                <span>{t('location_hanoi')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Globe size={14} className="text-viet-red" />
                <span>www.hanoitextile.com</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Hanoi Textile & Garment Co., Ltd. là nhà sản xuất hàng đầu các loại vải cotton chất lượng cao và may mặc tại Việt Nam. Với hơn 20 năm kinh nghiệm, chúng tôi phục vụ các thương hiệu toàn cầu với các giải pháp dệt may bền vững và sáng tạo.
            </p>
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-12 border-t border-slate-100">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Building2 size={20} className="text-viet-red" /> {t('biz_info_title')}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('year_established')}</div>
                <div className="text-sm font-bold text-slate-800">2005</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('total_employees')}</div>
                <div className="text-sm font-bold text-slate-800">501 - 1000 Người</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('annual_revenue')}</div>
                <div className="text-sm font-bold text-slate-800">{t('revenue_range_10_50')}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('main_markets')}</div>
                <div className="text-sm font-bold text-slate-800">{t('markets_na_eu_sea')}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Award size={20} className="text-viet-red" /> {t('certs_awards_title')}
              </h3>
              <button 
                onClick={() => setIsCertModalOpen(true)}
                className="text-viet-red text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> {t('add_new_btn')}
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
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                        {t('issued_by', { issuer: cert.issuer, date: cert.date })}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeleteCert(cert.id)}
                    className="p-2 text-slate-300 hover:text-viet-red transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Linked Products Preview */}
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MapPin size={20} className="text-viet-red" /> {t('featured_products_profile')}
            </h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supplierProducts.slice(0, 4).map(product => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{product.name}</h4>
                  <div className="text-viet-red font-bold text-xs mt-1">{product.priceRange}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit Profile Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title={t('edit_profile_modal_title')}
      >
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="input-label">{t('company_name_en_label')}</label>
              <input type="text" className="input" defaultValue="Hanoi Textile & Garment Co., Ltd." />
            </div>
            <div className="space-y-2">
              <label className="input-label">{t('biz_type_label')}</label>
              <select className="input">
                <option>{t('biz_type_manufacturer_trading')}</option>
                <option>{t('biz_type_ecommerce')}</option>
                <option>{t('biz_type_agriculture')}</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="input-label">{t('short_desc_label')}</label>
            <textarea className="input min-h-[100px]" defaultValue="Hanoi Textile & Garment Co., Ltd. là nhà sản xuất hàng đầu các loại vải cotton chất lượng cao..."></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-ghost">{t('cancel_btn')}</button>
            <button type="submit" className="btn-primary">{t('save_changes_btn')}</button>
          </div>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal 
        isOpen={isCertModalOpen} 
        onClose={() => setIsCertModalOpen(false)} 
        title={t('add_cert_modal_title')}
      >
        <form onSubmit={handleAddCert} className="space-y-6">
          <div className="space-y-2">
            <label className="input-label">{t('cert_name_label')}</label>
            <input type="text" className="input" placeholder={t('cert_name_placeholder')} required />
          </div>
          <div className="space-y-2">
            <label className="input-label">{t('cert_issuer_label')}</label>
            <input type="text" className="input" placeholder={t('cert_issuer_placeholder')} required />
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsCertModalOpen(false)} className="btn-ghost">{t('cancel_btn')}</button>
            <button type="submit" className="btn-primary">{t('upload_btn')}</button>
          </div>
        </form>
      </Modal>
    </DashboardSection>
  );
}
