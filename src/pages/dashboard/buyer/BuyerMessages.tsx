import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { MessageSquare, ChevronRight, Search, Filter, MoreVertical, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BuyerMessages() {
  const { t } = useTranslation();

  const messages = [
    { id: 1, sender: "Hanoi Textile Co.", lastMessage: "Yes, we can provide samples for your review. When would you like us to ship them?", time: "2 hours ago", unread: true, avatar: "HT" },
    { id: 2, sender: "Vietnam Global Trade", lastMessage: "The quote for your RFQ #RFQ-002 has been updated. Please check the new pricing.", time: "5 hours ago", unread: false, avatar: "VG" },
    { id: 3, sender: "Saigon Electronics", lastMessage: "We have received your inquiry. Our sales team will get back to you shortly.", time: "1 day ago", unread: false, avatar: "SE" },
    { id: 4, sender: "Da Nang Furniture", lastMessage: "Thank you for your interest in our products. We are currently out of stock for that item.", time: "2 days ago", unread: false, avatar: "DF" },
  ];

  return (
    <DashboardSection 
      title={t('messages_title')} 
      subtitle={t('messages_subtitle')}
      actions={
        <div className="flex gap-2">
          <div className="relative">
            <input type="text" placeholder={t('search_messages')} className="pl-8 pr-4 py-2 bg-white border border-slate-200 text-xs outline-none focus:border-viet-red" />
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
          </div>
          <button className="p-2 bg-white border border-slate-200 text-slate-400 hover:text-viet-red transition-colors">
            <Filter size={18} />
          </button>
        </div>
      }
    >
      <div className="flex flex-col lg:flex-row h-[600px]">
        {/* Message List */}
        <div className="w-full lg:w-80 border-r border-slate-100 overflow-y-auto divide-y divide-slate-50">
          {messages.map((msg) => (
            <div key={msg.id} className={`p-4 hover:bg-slate-50 transition-colors cursor-pointer group relative ${msg.unread ? "bg-red-50/30" : ""}`}>
              {msg.unread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-viet-red" />}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
                  {msg.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className={`text-xs font-bold truncate ${msg.unread ? "text-slate-900" : "text-slate-700"}`}>{msg.sender}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest shrink-0">{msg.time}</div>
                  </div>
                  <div className={`text-[11px] line-clamp-2 leading-relaxed ${msg.unread ? "text-slate-800 font-medium" : "text-slate-500"}`}>
                    {msg.lastMessage}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Content Placeholder */}
        <div className="flex-1 flex flex-col bg-slate-50/50">
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                HT
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Hanoi Textile Co.</div>
                <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest">{t('online_now')}</div>
              </div>
            </div>
            <button className="p-2 text-slate-400 hover:text-viet-red">
              <MoreVertical size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            <div className="flex justify-center">
              <span className="bg-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{t('today_label')}</span>
            </div>
            
            <div className="flex items-start gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-[10px] shrink-0">
                HT
              </div>
              <div className="bg-white p-4 border border-slate-200 shadow-sm rounded-2xl rounded-tl-none">
                <p className="text-sm text-slate-700 leading-relaxed">
                  Yes, we can provide samples for your review. When would you like us to ship them?
                </p>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">10:45 AM</div>
              </div>
            </div>

            <div className="flex items-start gap-3 max-w-[80%] ml-auto flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-viet-red text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                HB
              </div>
              <div className="bg-viet-red p-4 shadow-lg shadow-red-500/10 rounded-2xl rounded-tr-none text-white">
                <p className="text-sm leading-relaxed">
                  That sounds great. Please ship them to our office in California. I'll provide the address shortly.
                </p>
                <div className="text-[10px] text-white/60 font-bold uppercase tracking-widest mt-2">11:02 AM</div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative">
              <input type="text" placeholder={t('type_message')} className="w-full pl-6 pr-16 py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-viet-red transition-colors" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-viet-red text-white p-3 rounded-lg hover:bg-red-700 transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardSection>
  );
}
