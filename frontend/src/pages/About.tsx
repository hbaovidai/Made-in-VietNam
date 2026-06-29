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
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 transform translate-x-32" />
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
              {lang === 'en' ? data.heroTitleEn : data.heroTitleVi}
            </h1>
            <p className="text-slate-400 text-xl leading-relaxed">
              {lang === 'en' ? data.heroDescEn : data.heroDescVi}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl"
            >
              {t('get_in_touch', 'Liên hệ với chúng tôi')}
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-12 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl flex flex-col items-center text-center space-y-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                {ICON_MAP[stat.icon] || <Globe className="text-primary" />}
              </div>
              <div>
                <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-500 font-medium">
                  {lang === 'en' ? stat.labelEn : stat.labelVi}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold text-slate-900">
              {lang === 'en' ? data.missionTitleEn : data.missionTitleVi}
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed">
              {lang === 'en' ? data.missionDescEn : data.missionDescVi}
            </p>
            <div className="space-y-4">
              {data.missionPoints.map((point, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={24} className="text-primary" />
                  <span className="text-slate-700 font-medium">
                    {lang === 'en' ? point.en : point.vi}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="aspect-square rounded-[3rem] overflow-hidden shadow-2xl">
              <img src={data.missionImage} alt="Vietnamese Factory" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="absolute -bottom-8 -left-8 bg-primary text-white p-8 rounded-3xl shadow-2xl max-w-xs">
              <p className="text-xl font-bold italic">
                {lang === 'en' ? data.missionQuoteEn : data.missionQuoteVi}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
