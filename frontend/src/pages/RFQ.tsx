import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Info, CheckCircle2, ShieldCheck, Zap, Clock, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { CustomSelect } from '../components/CustomSelect';

export function RFQ() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    productName: '',
    category: 'General', 
    quantity: '',
    quantityUnit: 'pieces',
    description: '',
    budget: '',
    destination: '',
    contactName: user?.fullName || '',
    contactEmail: user?.email || '',
    contactPhone: user?.phone || '',
  });

  React.useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: prev.contactName || user?.fullName || '',
        contactEmail: prev.contactEmail || user?.email || '',
        contactPhone: prev.contactPhone || user?.phone || ''
      }));
    }
  }, [user]);

  React.useEffect(() => {
    api.get('/products?limit=100')
      .then(res => setProducts(res.data.data || []))
      .catch(err => console.error('Failed to load products', err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Auto-fill category based on selected product
    if (name === 'productName') {
      const selected = products.find(p => p.name === value);
      setFormData({
        ...formData,
        productName: value,
        category: selected?.category?.name || 'General'
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'BUYER') {
      setErrorMsg(t('rfq_buyer_only'));
      return;
    }
    
    setLoading(true);
    setErrorMsg('');
    try {
      // Set expiresAt to 30 days from now 
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      
      await api.post('/rfqs', {
        ...formData,
        quantity: parseInt(formData.quantity, 10),
        expiresAt: expiresAt.toISOString()
      });
      setSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || t('rfq_generic_error'));
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = [
    { value: 'General', label: t('rfq_placeholder_category') },
    ...Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))).map((catName: any) => ({
      value: catName,
      label: catName
    }))
  ];

  const unitOptions = [
    { value: 'pieces', label: 'Piece(s) (Cái/Chiếc)' },
    { value: 'kg', label: 'Kilogram(s) (Kg)' },
    { value: 'tons', label: 'Ton(s) (Tấn)' },
    { value: 'meters', label: 'Meter(s) (Mét)' },
    { value: 'sets', label: 'Set(s) (Bộ)' },
    { value: 'bags', label: 'Bag(s) (Bao/Túi)' },
    { value: 'boxes', label: 'Box(es) (Hộp/Thùng)' },
    { value: 'pairs', label: 'Pair(s) (Cặp/Đôi)' },
    { value: '20_container', label: "20' Container" },
    { value: '40_container', label: "40' Container" },
    { value: '40_hq_container', label: "40' HQ Container" }
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/80 p-12 text-center space-y-6 shadow-sm">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-2xl font-medium tracking-wide text-slate-900">{t('rfq_submitted')}</h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {t('rfq_submitted_desc')}
          </p>
          <div className="pt-6 flex flex-col gap-3">
            <Link to="/dashboard/buyer" className="w-full bg-[#003366] hover:bg-[#002244] text-white py-3.5 rounded-lg text-sm font-medium transition-colors">
              {t('go_to_dashboard')}
            </Link>
            <Link to="/" className="w-full text-slate-500 text-sm font-medium py-3 hover:text-[#003366] transition-colors">
              {t('back_to_home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#F9FAFB] min-h-screen pb-24">
      <BreadcrumbBar items={[{ label: t('rfq_title') }]} />

      {/* Header */}
      <div className="pt-16 pb-8">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-4xl font-medium tracking-wide text-slate-900">
            {t('rfq_title')}
          </h1>
          <p className="text-slate-500 text-sm md:text-base max-w-xl mt-3 font-normal leading-relaxed">
            {t('rfq_desc')}
          </p>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-6 pb-24 space-y-12">
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-8 md:p-12 space-y-12">
              
              {/* SECTION 1: Product Info */}
              <section className="space-y-6">
                <div className="border-l-[3px] border-[#003366] pl-3">
                  <h2 className="text-base font-semibold tracking-wide text-slate-900">{t('rfq_section_product_info')}</h2>
                </div>
                
                {errorMsg && (
                  <div className="p-4 bg-red-50/60 text-red-600 rounded-lg text-sm border border-red-100/80 flex items-center justify-center">
                    <AlertCircle size={16} className="mr-2 shrink-0" /> {errorMsg}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Product Name (Full width) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_product_name')}</label>
                    <input 
                      type="text"
                      required
                      list="product-suggestions"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      placeholder={t('rfq_placeholder_product_name')}
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                    />
                    <datalist id="product-suggestions">
                       {products
                         .filter(p => !formData.category || formData.category === 'General' || p.category?.name === formData.category)
                         .map(p => (
                           <option key={p.id} value={p.name} />
                       ))}
                    </datalist>
                  </div>
                  
                  {/* Category Selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_category')}</label>
                    <CustomSelect
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(val) => handleSelectChange('category', val)}
                      placeholder={t('rfq_placeholder_category')}
                    />
                  </div>

                  {/* Quantity & Unit (Grid 2 columns) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('quantity_label')}</label>
                      <input
                        required
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        type="number"
                        min="1"
                        placeholder={t('rfq_placeholder_quantity')}
                        className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_quantity_unit')}</label>
                      <CustomSelect
                        options={unitOptions}
                        value={formData.quantityUnit}
                        onChange={(val) => handleSelectChange('quantityUnit', val)}
                        placeholder="Select Unit"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Tech Requirements */}
              <section className="space-y-6">
                <div className="border-l-[3px] border-[#003366] pl-3">
                  <h2 className="text-base font-semibold tracking-wide text-slate-900">{t('rfq_section_tech_requirements')}</h2>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_description')}</label>
                  <textarea
                    required
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={6}
                    placeholder={t('rfq_placeholder_description')}
                    className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm resize-none leading-relaxed placeholder:text-slate-450"
                  />
                </div>
              </section>

              {/* SECTION 3: Commercial Requirements */}
              <section className="space-y-6">
                <div className="border-l-[3px] border-[#003366] pl-3">
                  <h2 className="text-base font-semibold tracking-wide text-slate-900">{t('rfq_section_commercial')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_budget')}</label>
                    <input
                      type="text"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder={t('rfq_placeholder_budget')}
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_destination')}</label>
                    <input
                      required
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder={t('rfq_placeholder_destination')}
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 4: Contact Details */}
              <section className="space-y-6">
                <div className="border-l-[3px] border-[#003366] pl-3">
                  <h2 className="text-base font-semibold tracking-wide text-slate-900">{t('rfq_section_contact')}</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_contact_name')}</label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      placeholder={t('rfq_placeholder_contact_name')}
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_phone')}</label>
                    <input
                      type="text"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      placeholder={t('rfq_placeholder_phone')}
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t('rfq_label_email')}</label>
                    <input
                      required
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      placeholder={t('rfq_placeholder_email')}
                      className="w-full px-4 py-3.5 bg-white border border-slate-200 rounded-lg focus:border-[#003366] focus:ring-1 focus:ring-[#003366] outline-none transition-all text-sm placeholder:text-slate-450"
                    />
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="pt-6 space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#003366] hover:bg-[#002244] text-white py-4 rounded-lg font-medium text-base transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : (
                    <>
                      {t('submit_request')}
                      <Send size={16} />
                    </>
                  )}
                </button>
                <p className="text-center text-slate-400 text-xs leading-relaxed">
                  {t('rfq_terms')}
                </p>
              </div>

            </div>
          </form>
        </div>

        {/* Bottom Tips & Info Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Tips for RFQ */}
          <div className="bg-[#F9FAFB] rounded-2xl border border-slate-200/60 p-8">
            <h3 className="text-base font-semibold tracking-wide text-slate-900 mb-8 border-l-[3px] border-[#003366] pl-3">
              {t('tips_for_rfq')}
            </h3>
            <div className="space-y-6">
              {[
                {
                  icon: <Zap size={18} className="text-[#003366] mt-0.5 shrink-0" />,
                  title: t('be_specific'),
                  desc: t('be_specific_desc')
                },
                {
                  icon: <ShieldCheck size={18} className="text-[#003366] mt-0.5 shrink-0" />,
                  title: t('mention_standards'),
                  desc: t('mention_standards_desc')
                },
                {
                  icon: <Clock size={18} className="text-[#003366] mt-0.5 shrink-0" />,
                  title: t('set_deadline'),
                  desc: t('set_deadline_desc')
                },
                {
                  icon: <MessageSquare size={18} className="text-[#003366] mt-0.5 shrink-0" />,
                  title: t('communication'),
                  desc: t('communication_desc')
                }
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-3">
                  {tip.icon}
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{tip.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: How it works */}
          <div className="bg-[#F9FAFB] rounded-2xl border border-slate-200/60 p-8">
            <h3 className="text-base font-semibold tracking-wide text-slate-900 mb-8 border-l-[3px] border-[#003366] pl-3">
              {t('how_it_works')}
            </h3>
            
            {/* Timeline Wrapper */}
            <div className="relative pl-8 space-y-8">
              {/* Thin timeline connection line */}
              <div className="absolute left-[11px] top-2.5 bottom-2.5 w-[1px] bg-slate-200" />
              
              {[
                t('rfq_step_1'),
                t('rfq_step_2'),
                t('rfq_step_3'),
                t('rfq_step_4')
              ].map((step, idx) => {
                // Strip leading "1. ", "2. ", etc.
                const cleanStepText = step.replace(/^\d+\.\s*/, '');
                
                return (
                  <div key={idx} className="relative flex items-start">
                    {/* Circle step number indicator */}
                    <div className="absolute left-[-29px] w-6 h-6 rounded-full border border-slate-300 bg-white flex items-center justify-center text-[10px] text-slate-500 font-light z-10">
                      {idx + 1}
                    </div>
                    <div className="text-xs md:text-sm text-slate-650 font-normal leading-relaxed">
                      {cleanStepText}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
