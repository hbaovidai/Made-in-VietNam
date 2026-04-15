import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, Rocket, FileSearch, ShieldCheck, Ship, Lock, User, Plus, Minus, MessageCircle, Mail } from 'lucide-react';

export function HelpCenter() {
  const { t } = useTranslation();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const categories = [
    { icon: <Rocket size={20} className="text-white" />, title: 'Bắt đầu sử dụng', desc: 'Lần đầu đến với VIEProduct? Tìm hiểu cách sử dụng nền tảng và kết nối với các nhà cung cấp uy tín.' },
    { icon: <FileSearch size={20} className="text-white" />, title: 'Tìm nguồn hàng & RFQ', desc: 'Nắm bắt quy trình Yêu cầu Báo giá để có được mức giá tốt nhất và thời gian giao hàng chất lượng.' },
    { icon: <ShieldCheck size={20} className="text-viet-gold" />, iconBg: 'bg-[#FDF8F0]', title: 'Chương trình Xác minh', desc: 'Tìm hiểu quy trình kiểm định 12 điểm của chúng tôi dành cho các nhà sản xuất công nghiệp hàng đầu Việt Nam.' },
    { icon: <Ship size={20} className="text-white" />, title: 'Logistics Xuất khẩu', desc: 'Hướng dẫn về vận chuyển hàng hóa, thông quan, và vận hành cảng thương mại tại Việt Nam.' },
    { icon: <Lock size={20} className="text-white" />, title: 'Thanh toán & Bảo mật', desc: 'Dịch vụ thanh toán bảo đảm và giao thức chuyển khoản an toàn cho thương mại toàn cầu.' },
    { icon: <User size={20} className="text-white" />, title: 'Quản lý Tài khoản', desc: 'Quản lý hồ sơ doanh nghiệp, phân quyền số lượng người dùng cho nhóm, thiết lập thông báo.' }
  ];

  const faqs = [
    { q: "Làm cách nào để xác minh uy tín của một nhà sản xuất?", a: "Hãy tìm huy hiệu Vàng 'Đã Xác thực' (Verified) trên hồ sơ nhà sản xuất. Điều này chứng tỏ họ đã vượt qua quy trình kiểm tra thực địa, chứng nhận chất lượng kinh doanh và xác minh khối lượng giao dịch. Bạn hoàn toàn có thể tải Báo cáo Xác thực trực tiếp từ hồ sơ nhà cung cấp." },
    { q: "Yêu cầu Báo giá (RFQ) là gì và làm thế nào để sử dụng?", a: "RFQ (Request for Quotation) cho phép bạn đăng tải yêu cầu mua hàng một cách chính xác để các nhà sản xuất chuyên nghiệp báo giá cạnh tranh nhất và tiết kiệm thời gian nhất." },
    { q: "Làm sao để tôi theo dõi lô hàng xuất khẩu của mình qua VIEProduct?", a: "Truy cập Bảng điều khiển > Quản lý Đơn hàng > Vận chuyển để xem trạng thái theo dõi trực tiếp từ quy trình liên kết vận tải của chúng tôi." },
    { q: "Có phí thu phí thành viên hay đăng ký tài khoản cho người mua không?", a: "Không, VIEProduct hoàn toàn miễn phí cho người mua (Buyer) trên toàn cầu tham gia, tìm nguồn hàng và kết nối với mạng lưới nhà cung cấp." }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Premium Header */}
      <div className="bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-200 pt-4 pb-12 relative overflow-hidden">
        {/* Soft Glows */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-viet-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-6">
            <Link to="/" className="hover:text-primary transition-colors">{t('home')}</Link>
            <ChevronRight size={12} className="text-slate-400" />
            <span className="text-primary font-bold">Trung tâm Trợ giúp</span>
          </nav>

          <div className="max-w-4xl space-y-4 flex flex-col items-center text-center mx-auto mt-2">
            <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-primary to-blue-600 leading-tight tracking-tight drop-shadow-sm pb-1">
              Chúng tôi có thể hỗ trợ bạn điều gì?
            </h1>
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium mt-2">
              Tìm kiếm câu trả lời, hướng dẫn sử dụng, và hỗ trợ kỹ thuật cho nền tảng VIEProduct.
            </p>

            <div className="max-w-2xl w-full mx-auto relative mt-6">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Tìm kiếm hướng dẫn, quy trình RFQ, hoặc quy trình vận tải..." 
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-200 rounded-full outline-none focus:border-primary transition-all shadow-lg shadow-slate-100/50 text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 uppercase font-bold tracking-widest mt-4">
              <span>TỪ KHÓA:</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Chương trình Xác minh</span>
              <span className="hover:text-primary cursor-pointer transition-colors">Cước Vận chuyển</span>
              <span className="hover:text-primary cursor-pointer transition-colors">RFQ Nhanh</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-20">
        
        {/* Knowledge Hub Categories */}
        <div className="mb-24">
          <div className="flex justify-between items-end mb-10">
            <div>
              <div className="text-[10px] font-bold text-viet-gold uppercase tracking-widest mb-2">TRUNG TÂM KIẾN THỨC</div>
              <h2 className="text-2xl font-black text-slate-900">Chia theo danh mục</h2>
            </div>
            <Link to="#" className="text-sm font-bold text-primary flex items-center hover:underline">
              Xem toàn bộ <ChevronRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div key={idx} className="bg-white p-8 rounded-xl border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all group cursor-pointer flex flex-col">
                <div className={`w-12 h-12 ${cat.iconBg || 'bg-[#1E3A8A]'} rounded-xl flex items-center justify-center mb-6`}>
                  {cat.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{cat.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1 mb-8">{cat.desc}</p>
                <div className="flex items-center gap-1 text-primary font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                  Khám phá <ChevronRight size={14} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24 items-start">
          <div className="lg:col-span-4">
            <h2 className="text-2xl font-black text-slate-900 mb-4 leading-tight">Câu Hỏi<br/>Thường Gặp</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              Không tìm thấy câu hỏi của bạn? Hướng dẫn truy cập nhanh của chúng tôi bao quát hầu hết các tình huống gặp phải từ người mua toàn cầu khi tiến vào thị trường Việt Nam.
            </p>
            
            <div className="bg-[#FDF8F0] border-l-4 border-viet-gold p-6 rounded-r-xl">
              <p className="text-sm font-medium text-slate-900 italic mb-4">
                "VIEProduct đã tối ưu hóa nguồn lực sản xuất công nghiệp tại Đông Nam Á của chúng tôi lên tới trên 40% chỉ trong Quý đầu tiên."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Giám đốc Tuyến vận tải</div>
                  <div className="text-[10px] font-bold text-viet-gold uppercase tracking-widest">TẬP ĐOÀN EUROTECH</div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white rounded-xl border border-slate-100 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                >
                  <div className="px-6 py-5 flex items-center justify-between">
                    <h4 className="text-sm font-bold text-[#1E293B]">{faq.q}</h4>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${isOpen ? 'bg-[#1E3A8A] text-white' : 'bg-slate-100 text-[#1E293B]'}`}>
                      {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-500 leading-relaxed border-t border-slate-50 pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-[#0F172A] text-white py-24 px-6 relative overflow-hidden">
        <div className="max-w-[1000px] mx-auto text-center mb-16 relative z-10">
          <h2 className="text-3xl font-black mb-4">Vẫn cần sự trợ giúp?</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto leading-relaxed">
            Đội ngũ hỗ trợ đa ngôn ngữ của chúng tôi luôn trực 24/7 để hoàn thành các yêu cầu tìm kiếm chuỗi công nghiệp, kiểm soát chất lượng, hay nhu cầu vận tải.
          </p>
        </div>

        <div className="max-w-[900px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div className="bg-[#1E293B] p-8 rounded-xl flex flex-col items-start border border-slate-700/50 hover:bg-[#233146] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#334155] rounded-xl flex items-center justify-center mb-6">
              <MessageCircle size={24} className="text-viet-gold" />
            </div>
            <h3 className="text-xl font-bold mb-3">Live Chat</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
              Nhận phản hồi ngay lập tức cho các câu hỏi mua sắm thiết yếu hay các trục trặc về kỹ thuật nền tảng.
            </p>
            <div className="text-viet-gold font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              BẮT ĐẦU TRÒ CHUYỆN <ChevronRight size={14} />
            </div>
          </div>

          <div className="bg-[#1E293B] p-8 rounded-xl flex flex-col items-start border border-slate-700/50 hover:bg-[#233146] transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-[#334155] rounded-xl flex items-center justify-center mb-6">
              <Mail size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3">Hỗ trợ qua Email</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 flex-1">
              Các thắc mắc chuyên sâu hơn về hệ thống vận tải lớn, quy chế hóa đơn quốc tế, hay các thủ tục giấy tờ pháp lý.
            </p>
            <div className="text-white font-bold text-xs uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
              GỬI YÊU CẦU <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </div>

      {/* Bridging Vietnam to the World */}
      <div className="relative h-[350px] flex items-center justify-center bg-[#0F172A] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A] z-10" />
        <img 
          src="https://images.unsplash.com/photo-1565610222536-ce12792dafb2?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
          alt="Factory" 
        />
        <div className="relative z-20 text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white italic mb-6">
            Kết nối Việt Nam tới Thế Giới
          </h2>
          <div className="w-16 h-1 bg-viet-gold mx-auto mb-6" />
          <p className="text-slate-300 text-xs md:text-sm uppercase tracking-widest font-medium">
            Cửa ngõ điện tử hàng đầu cho các quan hệ đối tác sản xuất chuẩn mực.
          </p>
        </div>
      </div>
    </div>
  );
}
