import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageHeader } from '../components/PageHeader';
import { Calendar, MapPin, Users, Globe, ChevronRight, Search, Filter, Clock } from 'lucide-react';

export function Events() {
  const { t } = useTranslation();
  const events = [
    { id: 1, title: "Vietnam International Trade Fair (VIETNAM EXPO)", date: "Apr 15-18, 2026", location: "Hanoi International Exhibition Center", type: t('trade_fair'), attendees: "25k+", image: "https://picsum.photos/seed/expo1/800/450" },
    { id: 2, title: "Vietnam Manufacturing Expo 2026", date: "May 20-22, 2026", location: "I.C.E Hanoi, Vietnam", type: t('manufacturing'), attendees: "15k+", image: "https://picsum.photos/seed/expo2/800/450" },
    { id: 3, title: "Saigon Textile & Garment Industry Expo", date: "Jun 10-13, 2026", location: "SECC, Ho Chi Minh City", type: t('textile'), attendees: "20k+", image: "https://picsum.photos/seed/expo3/800/450" },
    { id: 4, title: "Vietnam Electronics & Smart Home Expo", date: "Jul 05-07, 2026", location: "SECC, Ho Chi Minh City", type: t('electronics'), attendees: "12k+", image: "https://picsum.photos/seed/expo4/800/450" },
    { id: 5, title: "Vietnam Furniture & Home Accessories Fair", date: "Aug 15-18, 2026", location: "SECC, Ho Chi Minh City", type: t('furniture'), attendees: "18k+", image: "https://picsum.photos/seed/expo5/800/450" },
    { id: 6, title: "Vietnam Food & Beverage Expo 2026", date: "Sep 10-12, 2026", location: "Hanoi, Vietnam", type: t('food_beverage'), attendees: "30k+", image: "https://picsum.photos/seed/expo6/800/450" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader 
        title={t('meet_suppliers_events')} 
        description={t('meet_suppliers_events_desc')}
        breadcrumbs={[{ label: t('events') }]}
        image="https://picsum.photos/seed/events/400/600"
      />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:w-96">
            <input type="text" placeholder={t('search_events_placeholder')} className="w-full px-4 py-3 bg-white border border-slate-200 outline-none focus:border-viet-red shadow-sm" />
            <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-100 transition-colors">
              <Filter size={18} /> {t('filters')}
            </button>
            <button className="flex-1 md:flex-none bg-slate-900 text-white px-8 py-3 font-bold hover:bg-slate-800 transition-colors uppercase tracking-widest text-xs">
              {t('upcoming_events')}
            </button>
          </div>
        </div>

        {/* Featured Event */}
        <div className="mb-16 group cursor-pointer">
          <div className="relative aspect-[21/9] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src="https://picsum.photos/seed/featured-event/1280/720" 
              alt="Featured Event" 
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex flex-col justify-center p-12 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
              <span className="bg-viet-red text-white px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4 inline-block w-fit">{t('featured_event')}</span>
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 max-w-2xl leading-tight">Vietnam International Trade Fair (VIETNAM EXPO) 2026</h2>
              <div className="flex flex-wrap items-center gap-8 text-slate-300 text-sm font-bold uppercase tracking-widest">
                <span className="flex items-center gap-2"><Calendar size={18} className="text-viet-red" /> Apr 15-18, 2026</span>
                <span className="flex items-center gap-2"><MapPin size={18} className="text-viet-red" /> {t('hanoi_vietnam')}</span>
                <span className="flex items-center gap-2"><Users size={18} className="text-viet-red" /> {t('visitors_count', { count: '25,000+' })}</span>
              </div>
              <div className="pt-8 flex gap-4">
                <button className="bg-viet-red text-white px-10 py-4 font-bold hover:bg-red-700 transition-colors uppercase tracking-widest text-sm shadow-2xl shadow-red-500/40">
                  {t('register_to_visit')}
                </button>
                <button className="bg-white text-slate-900 px-10 py-4 font-bold hover:bg-slate-100 transition-colors uppercase tracking-widest text-sm">
                  {t('exhibitor_list')}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-all group cursor-pointer">
              <div className="relative aspect-video bg-slate-200 overflow-hidden">
                <img 
                  src={event.image} 
                  alt={event.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 text-[10px] font-black text-slate-900 uppercase tracking-widest rounded shadow-sm">
                  {event.type}
                </div>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-viet-red transition-colors line-clamp-2 leading-tight">{event.title}</h3>
                <div className="space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-viet-red" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-viet-red" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-viet-red" />
                    <span>{event.attendees} {t('attendees')}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-viet-red uppercase tracking-widest">{t('view_details')}</span>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-viet-red" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-12 py-4 border-2 border-slate-200 text-slate-900 font-bold hover:bg-slate-100 hover:border-slate-300 transition-all uppercase tracking-widest text-sm">
            {t('browse_all_events')}
          </button>
        </div>
      </div>
    </div>
  );
}
