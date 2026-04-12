import React from 'react';
import { DashboardSection } from '../../../components/DashboardSection';
import { Users, Package, ShieldCheck, Activity } from 'lucide-react';

export function AdminOverview() {
  const stats = [
    { title: 'Tổng người dùng', value: '1,248', desc: '+12% trong tháng', icon: <Users size={24} className="text-blue-500" /> },
    { title: 'Doanh nghiệp chờ duyệt', value: '14', desc: 'Cần sự chú ý', icon: <ShieldCheck size={24} className="text-viet-gold" /> },
    { title: 'Tổng sản phẩm', value: '5,023', desc: '+402 SP mới tuần này', icon: <Package size={24} className="text-emerald-500" /> },
    { title: 'Giao dịch hôm nay', value: '142', desc: 'Trending: Nông sản', icon: <Activity size={24} className="text-purple-500" /> },
  ];

  return (
    <div className="space-y-6">
      <DashboardSection 
        title="Trung tâm Quản trị (Admin Panel)" 
        subtitle="Chào mừng bạn quay lại. Hệ thống đang hoạt động ổn định và sẵn sàng xử lý yêu cầu."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 bg-slate-50 flex items-center justify-center rounded-xl shrink-0">
                {stat.icon}
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-500">{stat.title}</h3>
                <div className="text-2xl font-black text-slate-900 mt-1">{stat.value}</div>
                <div className="text-xs text-slate-400 mt-1 font-medium">{stat.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
           <h2 className="text-2xl font-bold mb-2">Hành động cần thiết</h2>
           <p className="text-slate-400 max-w-xl">
             Bạn hiện đang có quyền lực tối cao trên toàn hệ thống MIVN5. Vui lòng duyệt các Doanh nghiệp mới để họ có thể tham gia vào marketplace sớm nhất.
           </p>
        </div>
      </DashboardSection>
    </div>
  );
}
