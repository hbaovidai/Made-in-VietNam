import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Package, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Check, 
  X, 
  Plus, 
  Send, 
  Download, 
  Clock,
  Building2,
  Inbox,
  AlertCircle
} from 'lucide-react';
import { api } from '../../../lib/api';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

interface PendingSupplier {
  id: string;
  companyName: string;
  taxCode: string;
  createdAt: string;
  status: string;
}

interface AuditLogItem {
  id: string;
  action: string;
  targetType: string;
  targetName: string;
  createdAt: string;
  user?: {
    fullName: string;
  };
}

export function AdminOverview() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    suppliers: 0,
    products: 0,
    pendingProducts: 0,
    rfqs: 0,
    inquiries: 0
  });
  
  const [pendingApprovals, setPendingApprovals] = useState<PendingSupplier[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('mivn5_token');
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      const [suppliersRes, productsRes, pendingProductsRes, rfqsRes, inquiriesRes, pendingAppsRes, auditLogsRes] = await Promise.allSettled([
        api.get('/suppliers', { ...authHeaders, params: { limit: 1 } }),
        api.get('/products/admin', { ...authHeaders, params: { limit: 1 } }),
        api.get('/products/admin', { ...authHeaders, params: { status: 'PENDING', limit: 1 } }),
        api.get('/rfqs/open', authHeaders),
        api.get('/messages/admin/all', authHeaders),
        api.post('/supp_apps/supp_apps_all', { page: 1, limit: 5 }, authHeaders),
        api.get('/audit-logs', { ...authHeaders, params: { limit: 5 } })
      ]);

      const suppliersCount = suppliersRes.status === 'fulfilled'
        ? (suppliersRes.value.data?.meta?.total ?? suppliersRes.value.data?.data?.length ?? 0)
        : 0;

      const productsCount = productsRes.status === 'fulfilled'
        ? (productsRes.value.data?.meta?.total ?? productsRes.value.data?.data?.length ?? 0)
        : 0;

      const pendingProductsCount = pendingProductsRes.status === 'fulfilled'
        ? (pendingProductsRes.value.data?.meta?.total ?? pendingProductsRes.value.data?.data?.length ?? 0)
        : 0;

      const rfqsCount = rfqsRes.status === 'fulfilled'
        ? (Array.isArray(rfqsRes.value.data) ? rfqsRes.value.data.length : rfqsRes.value.data?.data?.length ?? 0)
        : 0;

      const inquiriesCount = inquiriesRes.status === 'fulfilled'
        ? (Array.isArray(inquiriesRes.value.data) ? inquiriesRes.value.data.length : inquiriesRes.value.data?.data?.length ?? 0)
        : 0;

      setStats({
        suppliers: suppliersCount,
        products: productsCount,
        pendingProducts: pendingProductsCount,
        rfqs: rfqsCount,
        inquiries: inquiriesCount
      });

      // Set Pending Approvals
      if (pendingAppsRes.status === 'fulfilled') {
        setPendingApprovals(pendingAppsRes.value.data?.data || []);
      }

      // Set Activities
      if (auditLogsRes.status === 'fulfilled' && auditLogsRes.value.data?.data) {
        const logs = auditLogsRes.value.data.data;
        const formattedLogs = logs.map((log: AuditLogItem) => {
          let text = '';
          let color = '#3b82f6'; // blue
          
          const userName = log.user?.fullName || 'Hệ thống';
          switch (log.action) {
            case 'LOCK_USER':
              text = `${userName} đã khóa tài khoản của ${log.targetName || 'thành viên'}`;
              color = '#ef4444'; // red
              break;
            case 'UNLOCK_USER':
              text = `${userName} đã mở khóa tài khoản của ${log.targetName || 'thành viên'}`;
              color = '#10b981'; // green
              break;
            case 'VERIFY_SUPPLIER':
              text = `${userName} đã phê duyệt nhà cung cấp "${log.targetName}"`;
              color = '#10b981'; // green
              break;
            case 'UNVERIFY_SUPPLIER':
              text = `${userName} đã hủy xác minh nhà cung cấp "${log.targetName}"`;
              color = '#f59e0b'; // amber
              break;
            case 'DELETE_USER':
              text = `${userName} đã xóa tài khoản ${log.targetName}`;
              color = '#ef4444'; // red
              break;
            case 'UPDATE_USER_ROLE':
              text = `${userName} cập nhật vai trò ${log.targetName}`;
              color = '#6366f1'; // indigo
              break;
            default:
              text = `${userName} thực hiện hành động ${log.action} trên ${log.targetType}`;
              color = '#6b7280'; // gray
          }

          return {
            text,
            time: formatTimeAgo(log.createdAt),
            color
          };
        });
        
        setActivities(formattedLogs);
      } else {
        // Fallback mock activities if no DB audit logs
        setActivities([
          { text: 'Người dùng mới đăng ký tài khoản mua hàng', time: '2 phút trước', color: '#3b82f6' },
          { text: 'Sản phẩm "Cà phê Robusta" đã được duyệt tự động', time: '15 phút trước', color: '#10b981' },
          { text: 'Nhận được yêu cầu báo giá mới từ đối tác toàn cầu', time: '1 giờ trước', color: '#f59e0b' },
          { text: 'Hệ thống tự động sao lưu định kỳ thành công', time: '3 giờ trước', color: '#6b7280' },
          { text: 'Admin đã thay đổi vai trò tài khoản sang Supplier', time: '5 giờ trước', color: '#3b82f6' },
        ]);
      }

    } catch (error) {
      console.error('Failed to load dashboard statistics', error);
      showToast('Có lỗi xảy ra khi tải số liệu thống kê!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Vừa xong';
      if (diffMins < 60) return `${diffMins} phút trước`;
      if (diffHours < 24) return `${diffHours} giờ trước`;
      return `${diffDays} ngày trước`;
    } catch {
      return 'Gần đây';
    }
  };

  const handleApproveSupplier = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem('mivn5_token');
      await api.put(`/suppliers/${id}/verify`, { isVerified: true }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Đã phê duyệt doanh nghiệp ${name} thành công!`, 'success');
      // Update local lists
      setPendingApprovals(prev => prev.filter(item => item.id !== id));
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      showToast('Phê duyệt thất bại. Vui lòng thử lại!', 'error');
    }
  };

  const handleRejectSupplier = async (id: string, name: string) => {
    try {
      const token = localStorage.getItem('mivn5_token');
      await api.put(`/suppliers/${id}/verify`, { isVerified: false }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast(`Đã từ chối doanh nghiệp ${name}.`, 'info');
      // Update local lists
      setPendingApprovals(prev => prev.filter(item => item.id !== id));
      fetchDashboardData();
    } catch (error) {
      console.error(error);
      showToast('Từ chối hồ sơ thất bại. Vui lòng thử lại!', 'error');
    }
  };

  const triggerExport = async () => {
    showToast('Đang thu thập dữ liệu hệ thống...', 'info');
    try {
      const token = localStorage.getItem('mivn5_token');
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

      // Fetch actual list of suppliers and products
      const [suppliersRes, productsRes] = await Promise.allSettled([
        api.get('/suppliers', { ...authHeaders, params: { limit: 100 } }),
        api.get('/products/admin', { ...authHeaders, params: { limit: 100 } })
      ]);

      const suppliersList = suppliersRes.status === 'fulfilled' ? (suppliersRes.value.data?.data || []) : [];
      const productsList = productsRes.status === 'fulfilled' ? (productsRes.value.data?.data || []) : [];

      // Build CSV content
      let csvContent = '\uFEFF'; // Add BOM for Vietnamese UTF-8 encoding in Excel
      csvContent += 'BÁO CÁO THỐNG KÊ HỆ THỐNG VIEPRODUCT\n';
      csvContent += `Thời gian xuất: ${new Date().toLocaleString('vi-VN')}\n`;
      csvContent += `Tổng số nhà cung cấp: ${stats.suppliers}\n`;
      csvContent += `Tổng số sản phẩm: ${stats.products} (${stats.pendingProducts} chờ duyệt)\n`;
      csvContent += `Tổng số RFQs mở: ${stats.rfqs}\n`;
      csvContent += `Tổng số lượt hỏi hàng (Inquiries): ${stats.inquiries}\n\n`;

      csvContent += 'DANH SÁCH NHÀ CUNG CẤP (TỐI ĐA 100)\n';
      csvContent += 'ID,Tên doanh nghiệp,Mã số thuế,Điện thoại,Trạng thái\n';
      suppliersList.forEach((s: any) => {
        csvContent += `"${s.id || ''}","${s.companyName || ''}","${s.taxCode || ''}","${s.contactPhone || ''}","${s.status || ''}"\n`;
      });

      csvContent += '\nDANH SÁCH SẢN PHẨM (TỐI ĐA 100)\n';
      csvContent += 'ID,Tên sản phẩm,Giá tối thiểu,Đơn vị,Trạng thái\n';
      productsList.forEach((p: any) => {
        csvContent += `"${p.id || ''}","${p.name || ''}","${p.minPrice || ''}","${p.unit || ''}","${p.status || ''}"\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Bao_cao_he_thong_VIEproduct_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast('Báo cáo hệ thống đã được tải xuống máy tính thành công dưới dạng CSV!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Xuất báo cáo thất bại!', 'error');
    }
  };

  const triggerSendNotification = async () => {
    const msg = prompt('Nhập thông báo gửi đến toàn bộ thành viên hệ thống:');
    if (!msg || !msg.trim()) return;

    showToast('Đang gửi thông báo...', 'info');
    try {
      const token = localStorage.getItem('mivn5_token');
      await api.post('/notifications/broadcast', {
        title: 'Thông báo từ Ban Quản Trị',
        message: msg.trim(),
        type: 'info'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Đã phát thông báo toàn hệ thống thành công!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gửi thông báo thất bại. Vui lòng thử lại!', 'error');
    }
  };

  // Recharts Data Setup
  const chartData = [
    { name: 'T1', 'RFQs': 45, 'Inquiries': 78 },
    { name: 'T2', 'RFQs': 52, 'Inquiries': 89 },
    { name: 'T3', 'RFQs': 68, 'Inquiries': 110 },
    { name: 'T4', 'RFQs': 85, 'Inquiries': 145 },
    { name: 'T5', 'RFQs': 110, 'Inquiries': 190 },
    { name: 'T6', 'RFQs': 140, 'Inquiries': 230 },
    { name: 'T7', 'RFQs': stats.rfqs || 180, 'Inquiries': stats.inquiries || 310 },
  ];

  return (
    <div className="-m-5 lg:-m-[20px] p-6 lg:p-8 bg-gray-50 min-h-[calc(100vh-32px)] space-y-6">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-lg shadow-xl animate-fade-in border border-slate-800">
          <div className={`w-2.5 h-2.5 rounded-full ${
            toast.type === 'success' ? 'bg-emerald-500' : toast.type === 'error' ? 'bg-rose-500' : 'bg-amber-500'
          }`} />
          <span className="text-sm font-medium">{toast.message}</span>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Hệ thống quản lý sàn giao dịch thương mại điện tử B2B VIEproduct.</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3.5 py-1.5 rounded-lg border border-emerald-100 text-xs font-semibold self-start md:self-auto">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Hệ thống hoạt động ổn định
        </div>
      </div>

      {/* 4 Cards Top indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Suppliers */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-500 font-medium">Tổng số nhà cung cấp</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-950">{loading ? '—' : stats.suppliers}</span>
              <span className="text-emerald-600 text-xs font-semibold flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> +12.5%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
            <Building2 size={24} />
          </div>
        </div>

        {/* Card 2: Products */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-500 font-medium">Tổng số sản phẩm</span>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-950">{loading ? '—' : stats.products}</span>
                <span className="text-emerald-600 text-xs font-semibold flex items-center">
                  <TrendingUp size={12} className="mr-0.5" /> +5.4%
                </span>
              </div>
              {stats.pendingProducts > 0 && (
                <span className="text-[11px] text-amber-600 font-semibold mt-0.5">
                  ({stats.pendingProducts} chờ duyệt)
                </span>
              )}
            </div>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
            <Package size={24} />
          </div>
        </div>

        {/* Card 3: RFQs */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-500 font-medium">Yêu cầu báo giá mới (RFQs)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-950">{loading ? '—' : stats.rfqs}</span>
              <span className="text-emerald-600 text-xs font-semibold flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> +8.2%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center">
            <FileText size={24} />
          </div>
        </div>

        {/* Card 4: Inquiries */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex items-center justify-between">
          <div className="space-y-2">
            <span className="text-sm text-slate-500 font-medium">Lượt hỏi hàng (Inquiries)</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-950">{loading ? '—' : stats.inquiries}</span>
              <span className="text-emerald-600 text-xs font-semibold flex items-center">
                <TrendingUp size={12} className="mr-0.5" /> +4.1%
              </span>
            </div>
          </div>
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
            <Inbox size={24} />
          </div>
        </div>

      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Block 1: Line Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Biểu đồ tăng trưởng giao dịch</h3>
                <p className="text-xs text-slate-500 mt-0.5">So sánh lượt hỏi hàng (Inquiries) và yêu cầu báo giá mới (RFQs) theo tháng.</p>
              </div>
            </div>
            
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#0f172a', 
                      borderRadius: '8px', 
                      color: '#fff', 
                      border: 'none', 
                      fontSize: '12px',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                    }} 
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
                  <Line 
                    type="monotone" 
                    dataKey="RFQs" 
                    name="Yêu cầu báo giá (RFQs)" 
                    stroke="#3b82f6" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, strokeWidth: 0, fill: '#3b82f6' }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Inquiries" 
                    name="Hỏi hàng (Inquiries)" 
                    stroke="#eab308" 
                    strokeWidth={2.5} 
                    dot={{ r: 4, strokeWidth: 0, fill: '#eab308' }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Block 2: Pending Approvals Table */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">Danh sách chờ phê duyệt</h3>
                <p className="text-xs text-slate-500 mt-0.5">Yêu cầu đăng ký nhà cung cấp mới cần Admin xác minh hồ sơ.</p>
              </div>
              <button 
                onClick={() => navigate('/dashboard/admin/suppliers/pending-profiles')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center"
              >
                Xem tất cả hồ sơ
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase">
                    <th className="pb-3 font-medium">Tên doanh nghiệp</th>
                    <th className="pb-3 font-medium">Ngày gửi</th>
                    <th className="pb-3 font-medium text-right">Thao tác nhanh</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {loading ? (
                    <tr>
                      <td colSpan={3} className="py-6 text-center text-slate-400">Đang tải danh sách hồ sơ...</td>
                    </tr>
                  ) : pendingApprovals.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="py-8 text-center text-slate-400">
                        <div className="flex flex-col items-center gap-2">
                          <AlertCircle size={24} className="text-slate-300" />
                          <span>Không có hồ sơ nào chờ phê duyệt.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    pendingApprovals.map((app) => (
                      <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="font-semibold text-slate-800">{app.companyName}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">MST: {app.taxCode || 'N/A'}</div>
                        </td>
                        <td className="py-4 text-slate-500 text-xs">
                          {new Date(app.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="py-4 text-right">
                          <div className="inline-flex gap-1.5">
                            <button
                              onClick={() => handleApproveSupplier(app.id, app.companyName)}
                              className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              <Check size={12} /> Duyệt
                            </button>
                            <button
                              onClick={() => handleRejectSupplier(app.id, app.companyName)}
                              className="inline-flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                            >
                              <X size={12} /> Từ chối
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Block 1: Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <h3 className="text-base font-bold text-slate-900 mb-6">Hoạt động gần đây</h3>
            
            <div className="relative border-l border-slate-100 pl-4 ml-2.5 space-y-6">
              {activities.map((act, idx) => (
                <div key={idx} className="relative">
                  {/* Timeline Dot */}
                  <span 
                    className="absolute -left-[21.5px] top-1.5 w-3 h-3 rounded-full border-2 border-white ring-4 ring-slate-50"
                    style={{ backgroundColor: act.color }}
                  />
                  <div>
                    <p className="text-sm font-medium text-slate-700 leading-snug">{act.text}</p>
                    <span className="text-[10px] text-slate-400 font-semibold flex items-center mt-1">
                      <Clock size={10} className="mr-1" /> {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Block 2: Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-4">Lối tắt nhanh</h3>
              <div className="grid grid-cols-1 gap-2.5">
                
                <button 
                  onClick={() => navigate('/dashboard/admin/suppliers/add-fake-profiles')}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200/60 p-3 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                      <Plus size={16} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Thêm nhà cung cấp</span>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-all font-semibold">&rarr;</span>
                </button>

                <button 
                  onClick={triggerSendNotification}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200/60 p-3 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                      <Send size={14} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Gửi thông báo</span>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-all font-semibold">&rarr;</span>
                </button>

                <button 
                  onClick={triggerExport}
                  className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 border border-slate-200/60 p-3 rounded-xl transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center">
                      <Download size={14} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">Xuất báo cáo</span>
                  </div>
                  <span className="text-slate-400 group-hover:text-slate-600 transition-all font-semibold">&rarr;</span>
                </button>

              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
