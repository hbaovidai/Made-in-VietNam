import { CheckCircle2, Globe, ShieldCheck, Users, Award, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SEOHead } from '../components/SEOHead';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { aboutDb } from '../utils/aboutDb';
import { useMemo } from 'react';

const ICON_MAP: Record<string, React.ReactNode> = {
  shield: <ShieldCheck className="text-primary" />,
  globe: <Globe className="text-blue-400" />,
  users: <Users className="text-emerald-400" />,
  award: <Award className="text-viet-gold" />,
};

export function About() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';
  const data = useMemo(() => aboutDb.getData(), []);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <SEOHead
        title="Giới thiệu - VIEProduct"
        description="VIEProduct - Nền tảng B2B hàng đầu Việt Nam kết nối nhà cung cấp với người mua toàn cầu."
        keywords="giới thiệu VIEProduct, B2B Việt Nam, nền tảng thương mại"
        canonical="/about"
      />

      <BreadcrumbBar items={[{ label: t('about_us') }]} />

      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 transform translate-x-32" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-3xl space-y-3">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {lang === 'en' ? data.heroTitleEn : data.heroTitleVi}
              </h1>
              <p className="text-slate-400 text-base md:text-lg leading-relaxed">
                {lang === 'en' ? data.heroDescEn : data.heroDescVi}
              </p>
            </div>
            <div className="shrink-0 flex items-center justify-center">
              <Link
                to="/suppliers"
                className="inline-flex items-center gap-2 bg-viet-gold text-primary-dark hover:brightness-105 px-6 py-3.5 rounded-xl font-bold text-base transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap"
              >
                {lang === 'en' ? 'Find Suppliers' : 'Tìm nhà cung cấp ngay'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4 hover:shadow-2xl transition-all duration-300">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                {ICON_MAP[stat.icon] || <Globe className="text-primary" />}
              </div>
              <div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs sm:text-sm text-slate-500 font-bold mt-1">
                  {lang === 'en' ? stat.labelEn : stat.labelVi}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-24 pt-8">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">
                {lang === 'en' ? data.missionTitleEn : data.missionTitleVi}
              </h2>
              <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
                {lang === 'en' ? data.missionDescEn : data.missionDescVi}
              </p>
            </div>

            {/* Advantages 2x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {data.missionPoints.map((point, idx) => {
                const text = lang === 'en' ? point.en : point.vi;
                const hasPipe = text.includes('|');
                const title = hasPipe ? text.split('|')[0].trim() : text;
                const desc = hasPipe ? text.split('|')[1].trim() : '';

                return (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all space-y-3 flex flex-col justify-start">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={22} className="text-primary shrink-0" />
                      <h4 className="text-base font-extrabold text-slate-900 leading-tight">{title}</h4>
                    </div>
                    {desc && <p className="text-sm text-slate-500 leading-relaxed font-normal">{desc}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-5 relative mt-8 lg:mt-0">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={data.missionImage} alt="Vietnamese Factory" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary text-white p-6 sm:p-8 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-lg sm:text-xl font-bold italic leading-relaxed">
                {lang === 'en' ? data.missionQuoteEn : data.missionQuoteVi}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
