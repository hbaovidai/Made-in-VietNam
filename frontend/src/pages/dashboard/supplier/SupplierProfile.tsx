import React, { useState, useEffect } from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Building2, MapPin, Globe, Award, Shield, CheckCircle2, Edit2, Camera, Plus, Trash2, X, Loader2 } from 'lucide-react';
import { useToast } from '../../../components/ui/Toast';
import { Modal } from '../../../components/ui/Modal';
import { SupplierBadge } from '../../../components/ui/SupplierBadge';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../contexts/AuthContext';
import { api } from '../../../lib/api';

export function SupplierProfile() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [supplier, setSupplier] = useState<any>(null);
  const [supplierProducts, setSupplierProducts] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editForm, setEditForm] = useState({ companyName: '', businessType: '', description: '' });
  const [certForm, setCertForm] = useState({ name: '', issuedBy: '' });

  const supplierId = user?.supplier?.id;

  useEffect(() => {
    if (!supplierId) return;
    async function loadData() {
      setLoading(true);
      try {
        const [suppRes, prodRes] = await Promise.all([
          api.get(`/suppliers/${supplierId}`),
          api.get(`/products?supplierId=${supplierId}&limit=4`),
        ]);
        const s = suppRes.data;
        setSupplier(s);
        setCertifications(s.certifications || []);
        setEditForm({
          companyName: s.companyName || '',
          businessType: s.businessType || '',
          description: s.description || '',
        });
        setSupplierProducts(prodRes.data.data || []);
      } catch (err) {
        console.error('Failed to load supplier profile', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [supplierId]);

  const handleLogoUpload = () => {
    addToast({ type: 'info', title: t('upload_logo_title'), message: t('upload_logo_success') });
  };

  const handleDeleteCert = async (certId: string) => {
    try {
      await api.delete(`/suppliers/${supplierId}/certifications/${certId}`);
      setCertifications(certifications.filter(c => c.id !== certId));
      addToast({ type: 'success', title: t('delete_cert_title'), message: t('delete_cert_success') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể xóa chứng nhận' });
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(`/suppliers/${supplierId}/certifications`, certForm);
      setCertifications([...certifications, res.data]);
      setIsCertModalOpen(false);
      setCertForm({ name: '', issuedBy: '' });
      addToast({ type: 'success', title: t('add_cert_title'), message: t('add_cert_success') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể thêm chứng nhận' });
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.put(`/suppliers/${supplierId}`, editForm);
      setSupplier(res.data);
      setIsEditModalOpen(false);
      addToast({ type: 'success', title: t('update_profile_success_title'), message: t('update_profile_success_desc') });
    } catch (e) {
      addToast({ type: 'error', title: 'Lỗi', message: 'Không thể cập nhật hồ sơ' });
    }
  };

  if (loading) {
    return (
      <DashboardSection title={t('supplier_profile_title')} subtitle={t('supplier_profile_subtitle')}>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={40} />
        </div>
      </DashboardSection>
    );
  }

  return (
    <DashboardSection 
      title={t('supplier_profile_title')} 
      subtitle={t('supplier_profile_subtitle')}
      actions={
        <button 
          onClick={() => setIsEditModalOpen(true)}
          className="bg-primary text-white px-8 py-2 font-bold hover:bg-primary-dark transition-colors uppercase tracking-widest text-xs shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Edit2 size={14} /> {t('edit_profile_btn')}
        </button>
      }
    >
      <div className="p-4 sm:p-8 space-y-8 sm:space-y-12">
        {/* Company Header */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="relative group">
            <div className="w-20 h-20 sm:w-32 sm:h-32 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-slate-400 font-black text-2xl overflow-hidden">
              {supplier?.logo ? (
                <img src={supplier.logo} alt="Company Logo" className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              ) : (
                <span>{supplier?.companyName?.substring(0, 2).toUpperCase() || 'SP'}</span>
              )}
            </div>
            <button 
              onClick={handleLogoUpload}
              className="absolute -bottom-2 -right-2 bg-primary text-white p-2 text-xs rounded-lg shadow-lg hover:bg-primary-dark transition-colors"
            >
              <Camera size={16} />
            </button>
          </div>
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-tight">{supplier?.companyName || 'Công ty của bạn'}</h2>
              {supplier?.isVerified && <SupplierBadge type="verified" />}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Building2 size={14} className="text-primary" />
                <span>{supplier?.businessType || t('biz_type_manufacturer_trading')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <MapPin size={14} className="text-primary" />
                <span>{supplier?.city ? `${supplier.city}, ${supplier.province}` : t('location_hanoi')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
                <Globe size={14} className="text-primary" />
                <span>{supplier?.website || 'N/A'}</span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              {supplier?.description || 'Chưa có mô tả.'}
            </p>
          </div>
        </div>

        {/* Company Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 pt-8 sm:pt-12 border-t border-slate-100">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Building2 size={20} className="text-primary" /> {t('biz_info_title')}
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('year_established')}</div>
                <div className="text-sm font-bold text-slate-800">{supplier?.yearEstablished || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('total_employees')}</div>
                <div className="text-sm font-bold text-slate-800">{supplier?.employeeCount || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('main_markets')}</div>
                <div className="text-sm font-bold text-slate-800">{supplier?.markets?.map((m: any) => m.market).join(', ') || 'N/A'}</div>
              </div>
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Industries</div>
                <div className="text-sm font-bold text-slate-800">{supplier?.industries?.map((i: any) => i.industry).join(', ') || 'N/A'}</div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Award size={20} className="text-primary" /> {t('certs_awards_title')}
              </h3>
              <button onClick={() => setIsCertModalOpen(true)} className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline flex items-center gap-1">
                <Plus size={12} /> {t('add_new_btn')}
              </button>
            </div>
            <div className="space-y-4">
              {certifications.length === 0 && <p className="text-sm text-slate-400 italic">Chưa có chứng nhận nào.</p>}
              {certifications.map((cert) => (
                <div key={cert.id} className="p-4 bg-slate-50 border border-slate-100 flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm"><CheckCircle2 size={20} className="text-green-500" /></div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">{cert.name}</div>
                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{cert.issuedBy ? `Cấp bởi: ${cert.issuedBy}` : ''}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteCert(cert.id)} className="p-2 text-slate-300 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"><Trash2 size={16} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Linked Products Preview */}
        <div className="pt-12 border-t border-slate-100 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 uppercase tracking-tight flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> {t('featured_products_profile')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {supplierProducts.length === 0 && <p className="text-sm text-slate-400 italic col-span-4">Chưa có sản phẩm nào.</p>}
            {supplierProducts.map(product => (
              <div key={product.id} className="card overflow-hidden group">
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img src={product.images?.[0] || 'https://via.placeholder.com/200'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                </div>
                <div className="p-3">
                  <h4 className="font-bold text-sm text-slate-800 line-clamp-1">{product.name}</h4>
                  <div className="text-primary font-bold text-xs mt-1">${product.minPrice} - ${product.maxPrice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title={t('edit_profile_modal_title')}>
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="input-label">{t('company_name_en_label')}</label>
              <input type="text" className="input" value={editForm.companyName} onChange={(e) => setEditForm({...editForm, companyName: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="input-label">{t('biz_type_label')}</label>
              <select className="input" value={editForm.businessType} onChange={(e) => setEditForm({...editForm, businessType: e.target.value})}>
                <option value="Manufacturer & Trading">{t('biz_type_manufacturer_trading')}</option>
                <option value="E-Commerce">{t('biz_type_ecommerce')}</option>
                <option value="Agriculture">{t('biz_type_agriculture')}</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="input-label">{t('short_desc_label')}</label>
            <textarea className="input min-h-[100px]" value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-ghost">{t('cancel_btn')}</button>
            <button type="submit" className="btn-primary">{t('save_changes_btn')}</button>
          </div>
        </form>
      </Modal>

      {/* Add Certification Modal */}
      <Modal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} title={t('add_cert_modal_title')}>
        <form onSubmit={handleAddCert} className="space-y-6">
          <div className="space-y-2">
            <label className="input-label">{t('cert_name_label')}</label>
            <input type="text" className="input" placeholder={t('cert_name_placeholder')} required value={certForm.name} onChange={(e) => setCertForm({...certForm, name: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="input-label">{t('cert_issuer_label')}</label>
            <input type="text" className="input" placeholder={t('cert_issuer_placeholder')} required value={certForm.issuedBy} onChange={(e) => setCertForm({...certForm, issuedBy: e.target.value})} />
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
