import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
import {
  Search, ShieldCheck, MessageSquare, LayoutGrid, Award, CheckCircle2,
  ChevronRight, ShoppingCart, UserPlus, Package, FileText, QrCode,
  Settings, BarChart3, Bell, Globe, Eye, Trash2, Edit2, Plus,
  ChevronDown, ChevronUp, BookOpen, Users, Store, Layers
} from 'lucide-react';

interface GuideStep {
  icon: React.ReactNode;
  title: string;
  desc: string;
  details: string[];
  path?: string;
}

interface GuideSection {
  id: string;
  icon: React.ReactNode;
  color: string;
  title: string;
  subtitle: string;
  steps: GuideStep[];
}

export function UserGuide() {
  const { t } = useTranslation();
  const [activeSection, setActiveSection] = useState('getting-started');
  const [expandedStep, setExpandedStep] = useState<string | null>('getting-started-0');

  const sections: GuideSection[] = [
    {
      id: 'getting-started',
      icon: <BookOpen size={20} />,
      color: 'text-blue-500 bg-blue-50',
      title: t('guide_section_start'),
      subtitle: t('guide_section_start_sub'),
      steps: [
        {
          icon: <UserPlus size={20} className="text-blue-500" />,
          title: t('guide_start_s1_title'),
          desc: t('guide_start_s1_desc'),
          details: [
            t('guide_start_s1_d1'),
            t('guide_start_s1_d2'),
            t('guide_start_s1_d3'),
            t('guide_start_s1_d4'),
            t('guide_start_s1_d5'),
          ],
          path: '/register',
        },
        {
          icon: <Settings size={20} className="text-slate-500" />,
          title: t('guide_start_s2_title'),
          desc: t('guide_start_s2_desc'),
          details: [
            t('guide_start_s2_d1'),
            t('guide_start_s2_d2'),
            t('guide_start_s2_d3'),
            t('guide_start_s2_d4'),
          ],
        },
        {
          icon: <Globe size={20} className="text-purple-500" />,
          title: t('guide_start_s3_title'),
          desc: t('guide_start_s3_desc'),
          details: [
            t('guide_start_s3_d1'),
            t('guide_start_s3_d2'),
            t('guide_start_s3_d3'),
            t('guide_start_s3_d4'),
          ],
          path: '/products',
        },
      ],
    },
    {
      id: 'buyer-guide',
      icon: <ShoppingCart size={20} />,
      color: 'text-emerald-500 bg-emerald-50',
      title: t('guide_section_buyer'),
      subtitle: t('guide_section_buyer_sub'),
      steps: [
        {
          icon: <Search size={20} className="text-blue-500" />,
          title: t('guide_buyer_s1_title'),
          desc: t('guide_buyer_s1_desc'),
          details: [
            t('guide_buyer_s1_d1'),
            t('guide_buyer_s1_d2'),
            t('guide_buyer_s1_d3'),
            t('guide_buyer_s1_d4'),
          ],
          path: '/products',
        },
        {
          icon: <ShoppingCart size={20} className="text-orange-500" />,
          title: t('guide_buyer_s2_title_inquiry', 'Giỏ yêu cầu & Hỏi giá'),
          desc: t('guide_buyer_s2_desc_inquiry', 'Thêm sản phẩm vào Giỏ yêu cầu, điều chỉnh số lượng và tiến hành gửi hỏi giá hàng loạt.'),
          details: [
            t('guide_buyer_s2_d1_inquiry', 'Trên trang chi tiết sản phẩm, nhấn "Giỏ yêu cầu"'),
            t('guide_buyer_s2_d2_inquiry', 'Biểu tượng giỏ yêu cầu trên Header hiện số lượng sản phẩm đang chờ hỏi giá'),
            t('guide_buyer_s2_d3_inquiry', 'Truy cập vào trang Giỏ yêu cầu để xem danh sách và điều chỉnh số lượng'),
            t('guide_buyer_s2_d4_inquiry', 'Nhấn "Gửi yêu cầu báo giá hàng loạt" để gửi đồng thời cho các nhà cung cấp'),
          ],
          path: '/cart',
        },
        {
          icon: <FileText size={20} className="text-green-500" />,
          title: t('guide_buyer_s3_title'),
          desc: t('guide_buyer_s3_desc'),
          details: [
            t('guide_buyer_s3_d1'),
            t('guide_buyer_s3_d2'),
            t('guide_buyer_s3_d3'),
            t('guide_buyer_s3_d4'),
          ],
          path: '/rfq',
        },
        {
          icon: <ShieldCheck size={20} className="text-red-500" />,
          title: t('guide_buyer_s4_title'),
          desc: t('guide_buyer_s4_desc'),
          details: [
            t('guide_buyer_s4_d1'),
            t('guide_buyer_s4_d2'),
            t('guide_buyer_s4_d3'),
            t('guide_buyer_s4_d4'),
          ],
          path: '/verify',
        },
      ],
    },
    {
      id: 'supplier-guide',
      icon: <Store size={20} />,
      color: 'text-amber-500 bg-amber-50',
      title: t('guide_section_supplier'),
      subtitle: t('guide_section_supplier_sub'),
      steps: [
        {
          icon: <Package size={20} className="text-blue-500" />,
          title: t('guide_sup_s1_title'),
          desc: t('guide_sup_s1_desc'),
          details: [
            t('guide_sup_s1_d1'),
            t('guide_sup_s1_d2'),
            t('guide_sup_s1_d3'),
            t('guide_sup_s1_d4'),
            t('guide_sup_s1_d5'),
          ],
          path: '/dashboard/supplier/products/add',
        },
        {
          icon: <Edit2 size={20} className="text-orange-500" />,
          title: t('guide_sup_s2_title'),
          desc: t('guide_sup_s2_desc'),
          details: [
            t('guide_sup_s2_d1'),
            t('guide_sup_s2_d2'),
            t('guide_sup_s2_d3'),
            t('guide_sup_s2_d4'),
            t('guide_sup_s2_d5'),
          ],
          path: '/dashboard/supplier/products',
        },
        {
          icon: <Layers size={20} className="text-emerald-500" />,
          title: t('guide_sup_s3_title'),
          desc: t('guide_sup_s3_desc'),
          details: [
            t('guide_sup_s3_d1'),
            t('guide_sup_s3_d2'),
            t('guide_sup_s3_d3'),
            t('guide_sup_s3_d4'),
            t('guide_sup_s3_d5'),
          ],
          path: '/dashboard/supplier/batches',
        },
        {
          icon: <Award size={20} className="text-amber-500" />,
          title: t('guide_sup_s4_title'),
          desc: t('guide_sup_s4_desc'),
          details: [
            t('guide_sup_s4_d1'),
            t('guide_sup_s4_d2'),
            t('guide_sup_s4_d3'),
            t('guide_sup_s4_d4'),
            t('guide_sup_s4_d5'),
          ],
          path: '/dashboard/supplier/profile',
        },
        {
          icon: <BarChart3 size={20} className="text-purple-500" />,
          title: t('guide_sup_s5_title'),
          desc: t('guide_sup_s5_desc'),
          details: [
            t('guide_sup_s5_d1'),
            t('guide_sup_s5_d2'),
            t('guide_sup_s5_d3'),
            t('guide_sup_s5_d4'),
          ],
          path: '/dashboard/supplier/analytics',
        },
      ],
    },
  ];

  const activeData = sections.find(s => s.id === activeSection)!;

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title={t('guide_title')}
        description={t('guide_user_guide_desc')}
        breadcrumbs={[{ label: t('help'), href: '/help' }, { label: t('guide_title') }]}
      />

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Sidebar Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sticky top-28 space-y-2">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-3">{t('guide_index')}</div>
              {sections.map(section => (
                <button
                  key={section.id}
                  onClick={() => { setActiveSection(section.id); setExpandedStep(section.id + '-0'); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-bold transition-all ${
                    activeSection === section.id
                      ? 'bg-primary/5 text-primary border border-primary/20'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    activeSection === section.id ? 'bg-primary text-white' : section.color
                  }`}>
                    {section.icon}
                  </div>
                  <div>
                    <div className="text-sm">{section.title}</div>
                    <div className="text-[10px] text-slate-400 font-medium mt-0.5">{section.steps.length} {t('guide_steps_suffix')}</div>
                  </div>
                </button>
              ))}

              {/* Quick links */}
              <div className="border-t border-slate-100 pt-4 mt-4 space-y-2">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">{t('guide_quick_links')}</div>
                <Link to="/help" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-primary transition-colors">
                  <ChevronRight size={14} /> {t('help_center')}
                </Link>
                <Link to="/help/seller-guide" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-primary transition-colors">
                  <ChevronRight size={14} /> {t('guide_seller_guide_link')}
                </Link>
                <Link to="/contact" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-500 hover:text-primary transition-colors">
                  <ChevronRight size={14} /> {t('guide_contact_support')}
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {/* Section Header */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8">
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${activeData.color}`}>
                  {activeData.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">{activeData.title}</h2>
                  <p className="text-sm text-slate-500 mt-0.5">{activeData.subtitle}</p>
                </div>
              </div>
            </div>

            {/* Steps */}
            {activeData.steps.map((step, idx) => {
              const stepKey = `${activeSection}-${idx}`;
              const isExpanded = expandedStep === stepKey;
              return (
                <div
                  key={stepKey}
                  className={`bg-white rounded-2xl border transition-all ${
                    isExpanded ? 'border-primary/30 shadow-lg shadow-primary/5' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => setExpandedStep(isExpanded ? null : stepKey)}
                    className="w-full flex items-center gap-4 p-6 text-left"
                  >
                    <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-black text-sm shrink-0">
                      {idx + 1}
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center shrink-0">
                      {step.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{step.desc}</p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isExpanded ? 'bg-primary text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 border-t border-slate-100">
                      <div className="pt-5 space-y-3">
                        {step.details.map((detail, dIdx) => (
                          <div key={dIdx} className="flex items-start gap-3">
                            <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                            <span className="text-sm text-slate-600 leading-relaxed">{detail}</span>
                          </div>
                        ))}
                      </div>
                      {step.path && (
                        <div className="mt-5 pt-4 border-t border-slate-50">
                          <Link
                            to={step.path}
                            className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
                          >
                            {t('guide_go_to_page')} <ChevronRight size={14} />
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Bottom CTA */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h3 className="text-xl font-black mb-2">{t('guide_still_need_help')}</h3>
                <p className="text-slate-400 text-sm">{t('guide_still_need_help_desc')}</p>
              </div>
              <div className="flex gap-3 shrink-0">
                <Link to="/contact" className="bg-primary text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors">
                  {t('guide_contact_support')}
                </Link>
                <Link to="/help" className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/20 transition-colors border border-white/10">
                  {t('guide_faq')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
