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
      <div className="bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-200 py-10 relative overflow-hidden">
        {/* Soft Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-viet-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl space-y-4 flex flex-col items-center">
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-primary to-blue-600 leading-tight tracking-tight drop-shadow-sm pb-1">
              {t('rfq_title')}
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium mt-2">
              {t('rfq_desc')}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <div>
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-primary/5 overflow-hidden">
            <div className="p-8 md:p-12 space-y-10">
                {/* A. Basic Info */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">A</div>
                    <h2 className="text-xl font-bold text-slate-900">Thông tin sản phẩm</h2>
                  </div>
                  {errorMsg && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm font-bold border border-red-100 flex items-center justify-center">
                      <AlertCircle size={16} className="mr-2" /> {errorMsg}
                    </div>
                  )}
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Tên sản phẩm *</label>
                      <input 
                        type="text"
                        required
                        list="product-suggestions"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="VD: Áo thun cotton nam... (Hoặc chọn từ danh sách)"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                      <datalist id="product-suggestions">
                         {products
                           .filter(p => !formData.category || formData.category === 'General' || p.category?.name === formData.category)
                           .map(p => (
                             <option key={p.id} value={p.name} />
                         ))}
                      </datalist>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Danh mục</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                          <option value="General">-- Chọn danh mục --</option>
                          {Array.from(new Set(products.map(p => p.category?.name).filter(Boolean))).map((catName: any) => (
                             <option key={catName} value={catName}>{catName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Số lượng & Đơn vị *</label>
                        <div className="flex gap-2">
                          <input
                            required
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            type="number"
                            min="1"
                            placeholder="Nhập số lượng..."
                            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          />
                          <select 
                            name="quantityUnit"
                            value={formData.quantityUnit}
                            onChange={handleChange}
                            className="w-32 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                          >
                            <option value="pieces">Cái / Chiếc</option>
                            <option value="kg">Kg</option>
                            <option value="tons">Tấn</option>
                            <option value="meters">Mét</option>
                            <option value="sets">Bộ</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* B. Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">B</div>
                    <h2 className="text-xl font-bold text-slate-900">Yêu cầu kỹ thuật</h2>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Mô tả chi tiết *</label>
                    <textarea
                      required
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={6}
                      placeholder="Ghi rõ các yêu cầu về Chất liệu, Kích thước, Màu sắc, Tiêu chuẩn chất lượng, hoặc Quy cách đóng gói bạn mong muốn..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none leading-relaxed"
                    />
                  </div>
                </section>

                {/* C. Commercial Requirements */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">C</div>
                    <h2 className="text-xl font-bold text-slate-900">Yêu cầu thương mại</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Khoảng giá mục tiêu / Ngân sách</label>
                      <input
                        type="text"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        placeholder="VD: 50.000 - 80.000 VNĐ/cái"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Địa điểm giao hàng *</label>
                      <input
                        required
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        placeholder="VD: Cảng Cát Lái, HCM"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                  </div>
                </section>

                {/* D. Contact Details */}
                <section className="space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center font-bold">D</div>
                    <h2 className="text-xl font-bold text-slate-900">Thông tin liên hệ</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Tên người liên hệ</label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        placeholder="Họ và tên..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                      <input
                        type="text"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleChange}
                        placeholder="VD: 0987..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-bold text-slate-700">Email nhận báo giá *</label>
                      <input
                        required
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        placeholder="VD: buyer@example.com"
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

        {/* Bottom Tips Hub */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tips for RFQ */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-xl font-bold text-slate-900 mb-8">{t('tips_for_rfq')}</h3>
            <div className="space-y-6">
              {[
                {
                  icon: <Zap size={20} className="text-viet-gold drop-shadow-sm" />,
                  title: t('be_specific'),
                  desc: t('be_specific_desc')
                },
                {
                  icon: <ShieldCheck size={20} className="text-viet-gold drop-shadow-sm" />,
                  title: t('mention_standards'),
                  desc: t('mention_standards_desc')
                },
                {
                  icon: <Clock size={20} className="text-viet-gold drop-shadow-sm" />,
                  title: t('set_deadline'),
                  desc: t('set_deadline_desc')
                },
                {
                  icon: <MessageSquare size={20} className="text-viet-gold drop-shadow-sm" />,
                  title: t('communication'),
                  desc: t('communication_desc')
                }
              ].map((tip, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="shrink-0 mt-1">{tip.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{tip.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/10">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Info size={20} className="text-primary-light" />
              </div>
              <h3 className="font-bold text-xl">{t('how_it_works')}</h3>
            </div>
            <div className="space-y-6">
              {[
                t('rfq_step_1'),
                t('rfq_step_2'),
                t('rfq_step_3'),
                t('rfq_step_4')
              ].map((step, idx) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-white/10 text-white/60 flex items-center justify-center text-xs font-bold mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="text-sm text-slate-300 font-medium leading-relaxed">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
