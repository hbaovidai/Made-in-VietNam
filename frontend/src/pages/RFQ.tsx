import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, Info, CheckCircle2, ShieldCheck, Zap, Clock, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';

export function RFQ() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    productName: '',
    category: 'General', // Default, hidden from UI
    quantity: '',
    quantityUnit: 'pieces',
    description: '',
    destination: '',
    contactEmail: '',
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'BUYER') {
      setErrorMsg('Bạn phải đăng nhập tài khoản Buyer mới có thể đăng RFQ.');
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
      setErrorMsg(err.response?.data?.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-6 shadow-xl">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{t('rfq_submitted')}</h2>
          <p className="text-slate-500">
            {t('rfq_submitted_desc')}
          </p>
          <div className="pt-6 flex flex-col gap-3">
            <Link to="/dashboard/buyer" className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary-dark transition-all">
              {t('go_to_dashboard')}
            </Link>
            <Link to="/" className="w-full text-slate-600 font-bold py-3 hover:text-primary transition-colors">
              {t('back_to_home')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header */}
      <div className="bg-slate-900 text-white py-16">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t('rfq_title')}</h1>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t('rfq_desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="p-8 md:p-12 space-y-10">
                {/* Basic Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">1</div>
                    <h2 className="text-xl font-bold text-slate-900">{t('product_information')}</h2>
                  </div>
                  {errorMsg && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center justify-center">
                      <AlertCircle size={16} className="mr-2" /> {errorMsg}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700">{t('product_name_label')}</label>
                      <select
                        required
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="">-- Chọn sản phẩm từ hệ thống --</option>
                        {products.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">{t('quantity_label')}</label>
                      <div className="flex gap-2">
                        <input
                          required
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleChange}
                          type="number"
                          min="1"
                          placeholder={t('quantity_placeholder')}
                          className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        <select 
                          name="quantityUnit"
                          value={formData.quantityUnit}
                          onChange={handleChange}
                          className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                          <option value="kg">kg</option>
                          <option value="pieces">pieces</option>
                          <option value="tons">tons</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">2</div>
                    <h2 className="text-xl font-bold text-slate-900">{t('detailed_requirements')}</h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">{t('description_label')}</label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={5}
                      placeholder={t('description_placeholder')}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">{t('destination_country_label')}</label>
                      <input
                        required
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder={t('country_placeholder')}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email liên hệ</label>
                      <input
                        required
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="buyer@example.com"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* Submit */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-bold text-xl hover:bg-primary-dark transition-all shadow-xl hover:shadow-primary-dark/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? <Loader2 size={24} className="animate-spin" /> : (
                      <>
                        {t('submit_request')}
                        <Send size={24} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-slate-400 text-sm mt-6">
                    {t('rfq_terms')}
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar Tips */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200 p-8 space-y-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">{t('tips_for_rfq')}</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: <Zap size={20} className="text-viet-gold" />,
                    title: t('be_specific'),
                    desc: t('be_specific_desc')
                  },
                  {
                    icon: <ShieldCheck size={20} className="text-emerald-500" />,
                    title: t('mention_standards'),
                    desc: t('mention_standards_desc')
                  },
                  {
                    icon: <Clock size={20} className="text-blue-500" />,
                    title: t('set_deadline'),
                    desc: t('set_deadline_desc')
                  },
                  {
                    icon: <MessageSquare size={20} className="text-primary" />,
                    title: t('communication'),
                    desc: t('communication_desc')
                  }
                ].map((tip, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="shrink-0">{tip.icon}</div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-3xl p-8 text-white space-y-6">
              <div className="flex items-center gap-3">
                <Info size={24} className="text-viet-gold" />
                <h3 className="font-bold">{t('how_it_works')}</h3>
              </div>
              <div className="space-y-4">
                {[
                  t('rfq_step_1'),
                  t('rfq_step_2'),
                  t('rfq_step_3'),
                  t('rfq_step_4')
                ].map((step) => (
                  <div key={step} className="text-sm text-slate-400 font-medium">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
