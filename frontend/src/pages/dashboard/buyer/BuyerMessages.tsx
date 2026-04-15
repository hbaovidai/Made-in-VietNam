import React from 'react';
import { MessageSquare, Mail, Phone, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export function BuyerMessages() {
  const { t } = useTranslation();

  const contactMethods = [
    {
      icon: <MessageSquare size={32} className="text-[#0068FF]" />,
      title: 'Zalo',
      description: 'Liên hệ nhanh với nhà cung cấp qua Zalo. Truy cập trang nhà cung cấp để lấy số điện thoại Zalo.',
      action: 'Tìm nhà cung cấp',
      href: '/suppliers',
      color: 'bg-[#0068FF]/10 border-[#0068FF]/20',
      btnColor: 'bg-[#0068FF] hover:bg-[#0055DD] text-white',
    },
    {
      icon: <Mail size={32} className="text-orange-500" />,
      title: 'Email',
      description: 'Gửi email trực tiếp đến nhà cung cấp. Thông tin email hiển thị trên hồ sơ nhà cung cấp.',
      action: 'Tìm nhà cung cấp',
      href: '/suppliers',
      color: 'bg-orange-50 border-orange-100',
      btnColor: 'bg-orange-500 hover:bg-orange-600 text-white',
    },
    {
      icon: <Phone size={32} className="text-green-500" />,
      title: 'Điện thoại',
      description: 'Gọi điện trực tiếp tới đường dây nóng của nhà cung cấp để trao đổi nhanh.',
      action: 'Tìm nhà cung cấp',
      href: '/suppliers',
      color: 'bg-green-50 border-green-100',
      btnColor: 'bg-green-500 hover:bg-green-600 text-white',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Liên hệ nhà cung cấp</h1>
        <p className="text-sm text-slate-500 mt-1">Liên hệ trực tiếp với nhà cung cấp qua Zalo, Email hoặc Điện thoại</p>
      </div>
      <div className="p-6 sm:p-8">
        {/* Info Banner */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-primary/20 pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-xl font-black uppercase tracking-tight mb-3">Kết nối trực tiếp với nhà cung cấp</h2>
            <p className="text-slate-300 text-sm leading-relaxed max-w-2xl">
              Thay vì chat trên hệ thống, bạn có thể liên hệ trực tiếp qua Zalo, Email hoặc Điện thoại để trao đổi nhanh hơn. 
              Truy cập trang hồ sơ nhà cung cấp để lấy thông tin liên hệ.
            </p>
          </div>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {contactMethods.map((method, idx) => (
            <div key={idx} className={`border rounded-2xl p-6 sm:p-8 space-y-6 ${method.color} hover:shadow-lg transition-all`}>
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                {method.icon}
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{method.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{method.description}</p>
              </div>
              <a 
                href={method.href} 
                className={`block text-center py-3 px-6 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${method.btnColor}`}
              >
                {method.action} <ExternalLink size={12} className="inline ml-1" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
