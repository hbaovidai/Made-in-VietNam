import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { Play, Clock, Eye, ChevronRight, Search } from 'lucide-react';

export function VideoChannel() {
  const { t } = useTranslation();
  const videos = [
    { id: 1, title: "Inside Vietnam's High-Tech Textile Factories", thumbnail: "https://picsum.photos/seed/video1/800/450", duration: "12:45", views: "12.5k", date: "2 " + t('days_ago') },
    { id: 2, title: "Sourcing Electronics: A Guide for International Buyers", thumbnail: "https://picsum.photos/seed/video2/800/450", duration: "08:20", views: "8.2k", date: "1 " + t('week_ago') },
    { id: 3, title: "Sustainable Manufacturing in Vietnam 2026", thumbnail: "https://picsum.photos/seed/video3/800/450", duration: "15:10", views: "5.1k", date: "2 " + t('weeks_ago') },
    { id: 4, title: "Top 10 Furniture Manufacturers in Binh Duong", thumbnail: "https://picsum.photos/seed/video4/800/450", duration: "10:30", views: "15.8k", date: "3 " + t('weeks_ago') },
    { id: 5, title: "How to Verify Your Vietnamese Supplier", thumbnail: "https://picsum.photos/seed/video5/800/450", duration: "06:45", views: "22.1k", date: "1 " + t('month_ago') },
    { id: 6, title: "Vietnam Logistics: From Factory to Port", thumbnail: "https://picsum.photos/seed/video6/800/450", duration: "14:20", views: "7.4k", date: "1 " + t('month_ago') },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('video_channel_title')} 
        description={t('video_channel_desc')}
        breadcrumbs={[{ label: t('video') }]}
        image="https://picsum.photos/seed/video/400/600"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Categories */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto">
            {[t('all_videos'), t('factory_tours'), t('product_reviews'), t('sourcing_guides'), t('market_trends')].map((cat, idx) => (
              <button key={idx} className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${idx === 0 ? "bg-viet-red text-white" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-80">
            <input type="text" placeholder={t('search_videos_placeholder')} className="w-full px-4 py-2 bg-white border border-slate-200 outline-none focus:border-viet-red" />
            <Search size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        {/* Featured Video */}
        <div className="mb-16 group cursor-pointer">
          <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/featured/1280/720" 
              alt="Featured Video" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-viet-red text-white rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                <Play size={40} fill="currentColor" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <span className="bg-viet-red text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block">{t('featured')}</span>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">The Future of Vietnamese Manufacturing: Industry 4.0</h2>
              <div className="flex items-center gap-6 text-slate-300 text-sm">
                <span className="flex items-center gap-1"><Clock size={14} /> 18:30</span>
                <span className="flex items-center gap-1"><Eye size={14} /> 45.2k {t('views').toLowerCase()}</span>
                <span>{t('published_time', { time: '1 ' + t('day_ago') })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div key={video.id} className="group cursor-pointer">
              <div className="relative aspect-video bg-slate-200 rounded-xl overflow-hidden mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                <img 
                  src={video.thumbnail} 
                  alt={video.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="w-12 h-12 bg-viet-red text-white rounded-full flex items-center justify-center">
                    <Play size={20} fill="currentColor" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <h3 className="text-slate-900 font-bold group-hover:text-viet-red transition-colors line-clamp-2 mb-2">{video.title}</h3>
              <div className="flex items-center gap-4 text-slate-500 text-xs">
                <span className="flex items-center gap-1"><Eye size={12} /> {video.views}</span>
                <span>{video.date}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-12 py-4 border-2 border-slate-200 text-slate-900 font-bold hover:bg-slate-100 hover:border-slate-300 transition-all uppercase tracking-widest text-sm">
            {t('load_more_videos')}
          </button>
        </div>
      </div>
    </div>
  );
}
