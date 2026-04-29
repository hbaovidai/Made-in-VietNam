import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, ShieldCheck, Star, ChevronRight, Award, Globe, Loader2 } from 'lucide-react';
import { useTranslation, Trans } from 'react-i18next';
import { categories } from '../data/mockData';
import { SupplierCard } from '../components/SupplierCard';
import { cn } from '../utils/cn';
import { api } from '../lib/api';

export function SupplierList() {
  const { t } = useTranslation();
  const [urlParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(urlParams.get('search') || '');
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);
  
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSuppliers() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedIndustry) {
          queryParams.append('industry', selectedIndustry);
        }
        if (searchTerm) {
          queryParams.append('search', searchTerm);
        }
        const res = await api.get(`/suppliers?${queryParams.toString()}`);
        setSuppliers(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch suppliers', err);
      } finally {
        setLoading(false);
      }
    }
    
    // Simple debounce approach inside useEffect
    const timeoutId = setTimeout(() => {
      fetchSuppliers();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [selectedIndustry, searchTerm]);

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-200 pt-4 pb-12 relative overflow-hidden">
        {/* Soft Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-viet-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-primary font-bold">{t('suppliers')}</span>
          </nav>

          <div className="max-w-4xl space-y-4 flex flex-col items-center text-center mx-auto mt-2">
            <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-primary to-blue-600 leading-tight tracking-tight drop-shadow-sm pb-1">
              <Trans i18nKey="find_verified_manufacturers">
                Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-viet-gold">Verified</span> Vietnamese Manufacturers
              </Trans>
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium mt-2">
              {t('suppliers_desc')}
            </p>
            <div className="relative w-full max-w-2xl group shadow-2xl shadow-primary/5 rounded-2xl mt-4">
              <Search size={22} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('search_suppliers_placeholder')}
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 shadow-sm transition-all text-left"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Filters */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-28 space-y-10">
              <div>
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <div className="w-4 h-[2px] bg-primary" />
                  {t('industries')}
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedIndustry(null)}
                    className={cn(
                      "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                      !selectedIndustry
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                        : "bg-white text-slate-600 border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                    )}
                  >
                    {t('all_industries')}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedIndustry(cat)}
                      className={cn(
                        "w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border",
                        selectedIndustry === cat
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                          : "bg-white text-slate-600 border-slate-100 hover:border-primary/30 hover:bg-slate-50"
                      )}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-viet-gold/20 blur-2xl rounded-full -translate-y-1/2 translate-x-1/2" />
                <h4 className="text-sm font-black uppercase tracking-widest mb-2 relative z-10">{t('verified_status')}</h4>
                <p className="text-xs text-slate-400 font-medium mb-4 relative z-10 leading-relaxed">{t('verified_status_desc')}</p>
                <div className="flex items-center gap-2 text-viet-gold font-black uppercase tracking-widest text-[10px]">
                  <ShieldCheck size={14} />
                  {t('trust_guaranteed')}
                </div>
              </div>
            </div>
          </aside>

          {/* Supplier Grid */}
          <div className="flex-1 space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <Globe size={20} className="text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-500">
                  {t('showing')} <span className="text-slate-900">{suppliers.length}</span> {t('verified_suppliers')}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t('sort_by')}</span>
                <select className="bg-slate-50 border border-slate-100 rounded-lg px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-primary transition-colors">
                  <option>{t('most_relevant')}</option>
                  <option>{t('years_experience')}</option>
                  <option>{t('recently_verified')}</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="animate-spin text-primary" size={48} />
              </div>
            ) : suppliers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {suppliers.map((supplier) => (
                  <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{t('no_suppliers_found')}</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto">{t('no_suppliers_desc')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
