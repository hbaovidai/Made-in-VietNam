import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, Search, Download, Eye, Check, X, Copy, Mail, Trash2, 
  RefreshCw, Share2, Award, ArrowRight, ExternalLink, Calendar, 
  FileText, Briefcase, User, Info, FileSpreadsheet, CheckCircle2,
  Clock, AlertTriangle, AlertCircle, Ban, Shield
} from 'lucide-react';
import { cn } from '../../../utils/cn';

// Types definition
export type VerificationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Invited' | 'Registered';

export interface BusinessVerificationApplication {
  id: string;
  companyName: string;
  contactName: string;
  phoneNumber: string;
  email: string;
  taxCode: string;
  industry: string;
  submittedDate: string;
  status: VerificationStatus;
  representative: string;
  cccd: string;
  address: string;
  googleDriveUrl: string;
  notes: string;
  source: string;
  ipAddress: string;
  inviteToken?: string;
  tokenExpiresAt?: string;
}

export interface InviteToken {
  id: string;
  companyName: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  status: 'Active' | 'Used' | 'Expired';
}

const mockApplications: BusinessVerificationApplication[] = [
  {
    id: 'app-1',
    companyName: 'Công ty Cổ phần Gốm sứ Minh Long',
    contactName: 'Lê Minh Tuấn',
    phoneNumber: '0987654321',
    email: 'minhtuan@minhlong.com',
    taxCode: '0312456789',
    industry: 'Gốm sứ & Thủ công mỹ nghệ',
    submittedDate: '2026-06-01',
    status: 'Pending',
    representative: 'Lê Minh Tuấn',
    cccd: '038095001234',
    address: 'Bình Dương, Việt Nam',
    googleDriveUrl: 'https://drive.google.com/drive/folders/1a2b3c4d5e6f_minhlong',
    notes: 'Doanh nghiệp lớn, cần ưu tiên kiểm duyệt hồ sơ nhanh.',
    source: 'Form đăng ký trực tuyến',
    ipAddress: '14.161.12.34',
  },
  {
    id: 'app-2',
    companyName: 'Công ty TNHH Nông sản Việt Phát',
    contactName: 'Nguyễn Thị Lan',
    phoneNumber: '0912345678',
    email: 'lannguyen@vietphatagro.com',
    taxCode: '0109876543',
    industry: 'Nông sản & Thực phẩm',
    submittedDate: '2026-05-28',
    status: 'Invited',
    representative: 'Nguyễn Việt Phát',
    cccd: '012095009876',
    address: 'Hà Nội, Việt Nam',
    googleDriveUrl: 'https://drive.google.com/drive/folders/2b3c4d5e6f7g_vietphat',
    notes: 'Đã gọi điện xác nhận ngành nghề xuất khẩu nông sản sạch.',
    source: 'Form đăng ký trực tuyến',
    ipAddress: '113.190.23.45',
    inviteToken: 'v5-tkn-8e9f2a7c4b1d',
    tokenExpiresAt: '2026-06-10',
  },
  {
    id: 'app-3',
    companyName: 'Hợp tác xã Tre Việt',
    contactName: 'Hoàng Văn Nam',
    phoneNumber: '0909876543',
    email: 'contact@trevietcraft.com',
    taxCode: '3701234567',
    industry: 'Gỗ & Thủ công mỹ nghệ',
    submittedDate: '2026-05-25',
    status: 'Registered',
    representative: 'Hoàng Văn Nam',
    cccd: '036095007788',
    address: 'Thanh Hóa, Việt Nam',
    googleDriveUrl: 'https://drive.google.com/drive/folders/3c4d5e6f7g8h_treviet',
    notes: 'Đã hoàn tất đăng ký tài khoản qua link mời.',
    source: 'Form đăng ký trực tuyến',
    ipAddress: '171.244.56.78',
    inviteToken: 'v5-tkn-3d4e5f6a7b8c',
    tokenExpiresAt: '2026-06-01',
  },
  {
    id: 'app-4',
    companyName: 'Công ty Dệt may Saigon Garment',
    contactName: 'Trần Thanh Sơn',
    phoneNumber: '0933445566',
    email: 'sontran@saigongarment.com',
    taxCode: '0304567890',
    industry: 'Dệt may & Da giày',
    submittedDate: '2026-05-20',
    status: 'Approved',
    representative: 'Trần Thanh Sơn',
    cccd: '079095001122',
    address: 'TP. Hồ Chí Minh, Việt Nam',
    googleDriveUrl: 'https://drive.google.com/drive/folders/4d5e6f7g8h9i_saigongarment',
    notes: 'Đã cấp huy hiệu xác minh sau khi kiểm tra xưởng sản xuất thực tế.',
    source: 'Đăng ký trực tiếp',
    ipAddress: '14.161.88.99',
  },
  {
    id: 'app-5',
    companyName: 'Thủy sản Minh Hải',
    contactName: 'Phan Văn Hải',
    phoneNumber: '0977889900',
    email: 'haiphan@minhhaiseafood.com',
    taxCode: '1800123456',
    industry: 'Thủy hải sản',
    submittedDate: '2026-05-15',
    status: 'Rejected',
    representative: 'Phan Văn Hải',
    cccd: '080095004455',
    address: 'Cà Mau, Việt Nam',
    googleDriveUrl: 'https://drive.google.com/drive/folders/5e6f7g8h9i0j_minhhai',
    notes: 'Không cung cấp đủ giấy phép xuất khẩu thủy sản sang thị trường EU.',
    source: 'Form đăng ký trực tuyến',
    ipAddress: '115.79.102.34',
  }
];

export function AdminVerifications() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'list' | 'detail' | 'tokens'>('list');
  const [applications, setApplications] = useState<BusinessVerificationApplication[]>(mockApplications);
  const [selectedAppId, setSelectedAppId] = useState<string>('app-1');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  // Stats calculate
  const totalApps = applications.length;
  const pendingApps = applications.filter(a => a.status === 'Pending').length;
  const invitedApps = applications.filter(a => a.status === 'Invited').length;
  const registeredApps = applications.filter(a => a.status === 'Registered').length;

  const currentApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleRowSelect = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) ? prev.filter(rId => rId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(applications.map(a => a.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleStatusChange = (id: string, newStatus: VerificationStatus, noteText?: string) => {
    setApplications(prev => prev.map(a => {
      if (a.id === id) {
        let updates: Partial<BusinessVerificationApplication> = { status: newStatus };
        if (newStatus === 'Invited') {
          updates.inviteToken = `v5-tkn-${Math.random().toString(36).substring(2, 14)}`;
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          updates.tokenExpiresAt = expires.toISOString().split('T')[0];
        }
        if (noteText !== undefined) {
          updates.notes = noteText;
        }
        return { ...a, ...updates };
      }
      return a;
    }));
  };

  const handleCopyLink = (token: string) => {
    const link = `${window.location.origin}/register?token=${token}`;
    navigator.clipboard.writeText(link);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleSaveNotes = (id: string, text: string) => {
    setApplications(prev => prev.map(a => a.id === id ? { ...a, notes: text } : a));
  };

  // Filter application list
  const filteredApps = applications.filter(a => {
    const matchesSearch = a.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.contactName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          a.taxCode.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status: VerificationStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Approved':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Invited':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Registered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusText = (status: VerificationStatus) => {
    switch (status) {
      case 'Pending': return 'Chờ duyệt';
      case 'Approved': return 'Đã xác minh';
      case 'Rejected': return 'Đã từ chối';
      case 'Invited': return 'Đã gửi link mời';
      case 'Registered': return 'Đã đăng ký';
      default: return status;
    }
  };

  return (
    <div className="wrap wp-admin-container p-6 bg-slate-50 min-h-screen">
      <h1 className="wp-heading-inline text-2xl font-bold text-slate-900 mb-1 flex items-center gap-2">
        <Shield className="text-primary" size={24} /> Quản lý xác minh doanh nghiệp
      </h1>
      <p className="text-slate-500 text-sm mb-6">
        Xử lý yêu cầu xác minh doanh nghiệp, tạo link mời và cấp huy hiệu xác minh (tick xanh) cho nhà cung cấp B2B.
      </p>

      {/* ═══ Stats Cards ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Tổng số hồ sơ</div>
            <div className="text-2xl font-black text-slate-800 mt-1">{totalApps}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
            <FileText size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đang chờ duyệt</div>
            <div className="text-2xl font-black text-amber-600 mt-1">{pendingApps}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Clock size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã gửi link mời</div>
            <div className="text-2xl font-black text-blue-600 mt-1">{invitedApps}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <Share2 size={20} />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Đã tạo tài khoản</div>
            <div className="text-2xl font-black text-purple-600 mt-1">{registeredApps}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <User size={20} />
          </div>
        </div>
      </div>

      {/* ═══ Navigation Tabs ═══ */}
      <nav className="nav-tab-wrapper flex border-b border-slate-200 mb-6 bg-white rounded-t-lg px-2 pt-2 gap-1">
        <button 
          onClick={() => setActiveTab('list')}
          className={cn(
            "px-4 py-2 text-sm font-semibold rounded-t-md border-t border-x transition-all -mb-px",
            activeTab === 'list' 
              ? "bg-slate-50 border-slate-200 text-primary border-b-slate-50" 
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          Danh sách hồ sơ đăng ký
        </button>
        <button 
          onClick={() => setActiveTab('detail')}
          className={cn(
            "px-4 py-2 text-sm font-semibold rounded-t-md border-t border-x transition-all -mb-px",
            activeTab === 'detail' 
              ? "bg-slate-50 border-slate-200 text-primary border-b-slate-50" 
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          Chi tiết hồ sơ: {currentApp?.companyName || 'Chọn một hồ sơ'}
        </button>
        <button 
          onClick={() => setActiveTab('tokens')}
          className={cn(
            "px-4 py-2 text-sm font-semibold rounded-t-md border-t border-x transition-all -mb-px",
            activeTab === 'tokens' 
              ? "bg-slate-50 border-slate-200 text-primary border-b-slate-50" 
              : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50"
          )}
        >
          Quản lý Link Mời
        </button>
      </nav>

      {/* ═══ TAB 1: Danh sách hồ sơ đăng ký ═══ */}
      {activeTab === 'list' && (
        <div className="bg-white border border-slate-200 rounded-b-lg p-5 shadow-sm">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-primary"
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Pending">Chờ duyệt (Pending)</option>
                <option value="Invited">Đã gửi link (Invited)</option>
                <option value="Registered">Đã đăng ký (Registered)</option>
                <option value="Approved">Đã xác minh (Approved)</option>
                <option value="Rejected">Đã từ chối (Rejected)</option>
              </select>

              <div className="relative w-64">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm công ty, MST, người LH..."
                  className="pl-9 pr-4 py-1.5 w-full bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>
            </div>

            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100/70 text-emerald-700 text-xs font-bold rounded-lg transition-colors ml-auto">
              <FileSpreadsheet size={14} /> Export Excel
            </button>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 w-10">
                    <input 
                      type="checkbox" 
                      onChange={handleSelectAll}
                      checked={selectedRows.length === applications.length}
                      className="rounded border-slate-300"
                    />
                  </th>
                  <th className="py-3 px-4">Tên Công Ty / Người Liên Hệ</th>
                  <th className="py-3 px-4">Mã số thuế (MST)</th>
                  <th className="py-3 px-4">Ngành nghề</th>
                  <th className="py-3 px-4">Ngày nộp</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.length > 0 ? (
                  filteredApps.map(app => (
                    <tr 
                      key={app.id} 
                      className={cn(
                        "hover:bg-slate-50/50 transition-colors group cursor-pointer",
                        selectedAppId === app.id ? "bg-slate-50" : ""
                      )}
                      onClick={() => { setSelectedAppId(app.id); }}
                    >
                      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                        <input 
                          type="checkbox"
                          checked={selectedRows.includes(app.id)}
                          onChange={() => handleRowSelect(app.id)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="py-3.5 px-4">
                        <div>
                          <div className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{app.companyName}</div>
                          <div className="text-slate-400 mt-0.5">{app.contactName} • <span className="text-slate-500">{app.phoneNumber}</span></div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-600">{app.taxCode}</td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">{app.industry}</td>
                      <td className="py-3.5 px-4 text-slate-500">{app.submittedDate}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold border", getStatusBadgeClass(app.status))}>
                          {getStatusText(app.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setSelectedAppId(app.id); setActiveTab('detail'); }}
                            title="Xem chi tiết"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-all"
                          >
                            <Eye size={14} />
                          </button>

                          {app.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleStatusChange(app.id, 'Invited')}
                                title="Phê duyệt và tạo link mời"
                                className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-all"
                              >
                                <Check size={14} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app.id, 'Rejected')}
                                title="Từ chối hồ sơ"
                                className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-all"
                              >
                                <X size={14} />
                              </button>
                            </>
                          )}

                          {app.status === 'Invited' && (
                            <>
                              <button 
                                onClick={() => app.inviteToken && handleCopyLink(app.inviteToken)}
                                title={copiedToken === app.inviteToken ? "Đã sao chép!" : "Sao chép link mời"}
                                className={cn(
                                  "p-1.5 rounded transition-all",
                                  copiedToken === app.inviteToken ? "text-emerald-600 bg-emerald-50" : "text-blue-600 hover:bg-blue-50"
                                )}
                              >
                                <Copy size={14} />
                              </button>
                              <button 
                                onClick={() => handleStatusChange(app.id, 'Pending', 'Đã thu hồi link đăng ký.')}
                                title="Thu hồi link mời"
                                className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded transition-all"
                              >
                                <RefreshCw size={14} />
                              </button>
                            </>
                          )}

                          {app.status === 'Registered' && (
                            <button 
                              onClick={() => handleStatusChange(app.id, 'Approved')}
                              title="Cấp huy hiệu xác minh"
                              className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded transition-all"
                            >
                              <Award size={14} />
                            </button>
                          )}

                          {app.status === 'Rejected' && (
                            <button 
                              onClick={() => setApplications(prev => prev.filter(x => x.id !== app.id))}
                              title="Xóa hồ sơ"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-400">
                      Không tìm thấy hồ sơ nào khớp với điều kiện lọc.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ═══ TAB 2: Chi tiết hồ sơ ═══ */}
      {activeTab === 'detail' && (
        <div className="space-y-6">
          {/* Progress Timeline Tracker */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Quy trình xử lý xác minh</div>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-2">
              {[
                { step: 'Gửi hồ sơ', active: true, done: true },
                { step: 'Kiểm duyệt', active: currentApp.status === 'Pending', done: currentApp.status !== 'Pending' },
                { step: 'Tạo link mời', active: currentApp.status === 'Invited', done: ['Invited', 'Registered', 'Approved'].includes(currentApp.status) },
                { step: 'Tạo tài khoản', active: currentApp.status === 'Registered', done: ['Registered', 'Approved'].includes(currentApp.status) },
                { step: 'Xác minh (Tick xanh)', active: currentApp.status === 'Approved', done: currentApp.status === 'Approved' }
              ].map((item, index, arr) => (
                <React.Fragment key={index}>
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                      item.active ? "bg-primary border-primary text-white ring-4 ring-primary/10" : 
                      item.done ? "bg-emerald-100 border-emerald-200 text-emerald-700" :
                      "bg-slate-50 border-slate-200 text-slate-400"
                    )}>
                      {item.done && !item.active ? <Check size={12} /> : index + 1}
                    </div>
                    <span className={cn(
                      "text-xs font-bold",
                      item.active ? "text-primary" : item.done ? "text-slate-800" : "text-slate-400"
                    )}>{item.step}</span>
                  </div>
                  {index < arr.length - 1 && (
                    <div className={cn(
                      "hidden md:block h-0.5 flex-1 mx-2",
                      item.done ? "bg-emerald-200" : "bg-slate-100"
                    )} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Detail layout columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Main column */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Business details card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Briefcase size={16} className="text-slate-400" /> Thông tin doanh nghiệp đăng ký
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="text-slate-400 block mb-1">Tên công ty</label>
                    <div className="font-bold text-slate-800 text-sm">{currentApp.companyName}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Mã số thuế (MST)</label>
                    <div className="font-mono font-bold text-slate-800">{currentApp.taxCode}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Người đại diện pháp luật</label>
                    <div className="font-semibold text-slate-800">{currentApp.representative}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Số CCCD</label>
                    <div className="font-semibold text-slate-800">{currentApp.cccd}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Email liên hệ</label>
                    <div className="font-semibold text-slate-800">{currentApp.email}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Số điện thoại</label>
                    <div className="font-semibold text-slate-800">{currentApp.phoneNumber}</div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-400 block mb-1">Địa chỉ đăng ký kinh doanh</label>
                    <div className="font-medium text-slate-700">{currentApp.address}</div>
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Lĩnh vực hoạt động</label>
                    <span className="inline-block bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-slate-600 font-medium">{currentApp.industry}</span>
                  </div>
                </div>
              </div>

              {/* Attachments Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-slate-400" /> Hồ sơ đính kèm (Giấy phép, CCCD, Chứng nhận...)
                </h2>
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-center">
                  <p className="text-xs text-slate-500 mb-3 max-w-md mx-auto">
                    Toàn bộ tài liệu xác minh (Giấy phép DKKD, CCCD người đại diện, catalog sản phẩm, chứng nhận ISO...) được ứng viên tải lên thư mục Google Drive.
                  </p>
                  <a 
                    href={currentApp.googleDriveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    Xem thư mục hồ sơ trên Google Drive <ExternalLink size={13} />
                  </a>
                </div>
              </div>

              {/* Notes Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Info size={16} className="text-slate-400" /> Ghi chú nội bộ của Ban quản trị
                </h2>
                <div className="space-y-3">
                  <textarea 
                    value={currentApp.notes}
                    onChange={(e) => handleSaveNotes(currentApp.id, e.target.value)}
                    placeholder="Nhập ghi chú kiểm duyệt, thông tin thêm..."
                    rows={3}
                    className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:border-primary outline-none resize-none"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Ghi chú này chỉ hiển thị với Admin hệ thống.</span>
                    <button 
                      onClick={() => handleSaveNotes(currentApp.id, currentApp.notes)}
                      className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded hover:bg-slate-700 transition-colors"
                    >
                      Lưu ghi chú
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Sidebar column */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Decision Panel */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">Hành động kiểm duyệt</h2>
                <div className="space-y-3">
                  
                  {currentApp.status === 'Pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(currentApp.id, 'Invited')}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        <Check size={14} /> Phê duyệt & Tạo Link Mời
                      </button>
                      <button 
                        onClick={() => handleStatusChange(currentApp.id, 'Rejected')}
                        className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-lg border border-red-200 transition-colors"
                      >
                        <X size={14} /> Từ chối hồ sơ
                      </button>
                    </>
                  )}

                  {currentApp.status === 'Invited' && (
                    <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700 space-y-2">
                      <div className="font-bold flex items-center gap-1"><Info size={12} /> Đã gửi link mời</div>
                      <p className="text-[11px] text-blue-600 leading-relaxed">
                        Chờ doanh nghiệp đăng ký tài khoản qua đường link mời. Token đang hoạt động.
                      </p>
                      <button 
                        onClick={() => handleStatusChange(currentApp.id, 'Pending', 'Đã thu hồi link.')}
                        className="w-full py-1.5 border border-blue-200 text-blue-700 hover:bg-blue-100/50 font-bold rounded text-[11px] transition-colors"
                      >
                        Thu hồi link mời
                      </button>
                    </div>
                  )}

                  {currentApp.status === 'Registered' && (
                    <button 
                      onClick={() => handleStatusChange(currentApp.id, 'Approved')}
                      className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-purple-600 text-white hover:bg-purple-700 text-xs font-bold rounded-lg transition-colors shadow-sm"
                    >
                      <Award size={14} /> Cấp huy hiệu xác minh (Tick xanh)
                    </button>
                  )}

                  {currentApp.status === 'Approved' && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
                      <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
                      <div>
                        <div className="font-bold">Đã xác minh doanh nghiệp</div>
                        <div className="text-[10px] text-emerald-600 mt-0.5">Huy hiệu xanh đã kích hoạt.</div>
                      </div>
                    </div>
                  )}

                  {currentApp.status === 'Rejected' && (
                    <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-xs text-red-800 flex items-center gap-2">
                      <Ban size={20} className="text-red-500 shrink-0" />
                      <div>
                        <div className="font-bold">Hồ sơ đã bị từ chối</div>
                        <button 
                          onClick={() => handleStatusChange(currentApp.id, 'Pending')}
                          className="text-[10px] font-bold text-red-700 hover:underline mt-1 block"
                        >
                          Khôi phục trạng thái chờ duyệt
                        </button>
                      </div>
                    </div>
                  )}

                  <button 
                    onClick={() => {
                      if(confirm('Bạn có chắc chắn muốn xóa hồ sơ này?')) {
                        setApplications(prev => prev.filter(x => x.id !== currentApp.id));
                        setActiveTab('list');
                      }
                    }}
                    className="w-full text-center text-[10px] text-slate-400 hover:text-red-500 mt-2 block font-medium"
                  >
                    Xóa hồ sơ vĩnh viễn
                  </button>
                </div>
              </div>

              {/* Submitted Info Card */}
              <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-xs text-slate-500 space-y-2.5">
                <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-3">Thông tin nộp</h2>
                <div className="flex justify-between"><span>Ngày nộp:</span><span className="font-medium text-slate-800">{currentApp.submittedDate}</span></div>
                <div className="flex justify-between"><span>Nguồn:</span><span className="font-medium text-slate-800">{currentApp.source}</span></div>
                <div className="flex justify-between"><span>Địa chỉ IP:</span><span className="font-medium text-slate-800 font-mono">{currentApp.ipAddress}</span></div>
              </div>

              {/* Invitation link (if generated) */}
              {currentApp.inviteToken && (
                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm text-xs space-y-3">
                  <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center gap-1.5"><Share2 size={14} className="text-primary" /> Link mời đăng ký</h2>
                  <div className="font-mono bg-slate-50 p-2.5 rounded border border-slate-200 break-all text-[10px] select-all">
                    {window.location.origin}/register?token={currentApp.inviteToken}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyLink(currentApp.inviteToken!)}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded flex items-center justify-center gap-1 text-[11px] transition-colors"
                    >
                      <Copy size={12} /> {copiedToken === currentApp.inviteToken ? 'Đã copy' : 'Sao chép'}
                    </button>
                    <button className="flex-1 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded flex items-center justify-center gap-1 text-[11px] transition-colors">
                      <Mail size={12} /> Gửi Mail
                    </button>
                  </div>
                  <div className="text-[10px] text-slate-400 text-center">
                    Hết hạn lúc: <span className="font-semibold">{currentApp.tokenExpiresAt}</span> (Còn 7 ngày)
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ═══ TAB 3: Quản lý Link Mời ═══ */}
      {activeTab === 'tokens' && (
        <div className="bg-white border border-slate-200 rounded-b-lg p-5 shadow-sm">
          <div className="text-xs font-medium text-slate-500 mb-4">
            Danh sách tất cả đường dẫn mời đăng ký một lần đang hoạt động trong hệ thống.
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Doanh nghiệp</th>
                  <th className="py-3 px-4">Token mời</th>
                  <th className="py-3 px-4">Ngày cấp</th>
                  <th className="py-3 px-4">Hạn dùng</th>
                  <th className="py-3 px-4 text-center">Trạng thái</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.filter(a => a.inviteToken).map(app => (
                  <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-800">{app.companyName}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-primary">{app.inviteToken}</td>
                    <td className="py-3.5 px-4 text-slate-500">{app.submittedDate}</td>
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-700">{app.tokenExpiresAt}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">Còn lại 7 ngày</div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className={cn(
                        "px-2.5 py-1 rounded-full text-[10px] font-bold border",
                        app.status === 'Registered' ? "bg-purple-100 text-purple-800 border-purple-200" : "bg-blue-100 text-blue-800 border-blue-200"
                      )}>
                        {app.status === 'Registered' ? 'Đã sử dụng' : 'Hoạt động'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button 
                          onClick={() => app.inviteToken && handleCopyLink(app.inviteToken)}
                          className="px-2 py-1 bg-slate-100 text-slate-700 font-bold rounded hover:bg-slate-200 transition-colors text-[10px]"
                        >
                          Sao chép Link
                        </button>
                        {app.status === 'Registered' && (
                          <button 
                            onClick={() => handleStatusChange(app.id, 'Approved')}
                            className="px-2 py-1 bg-purple-600 text-white font-bold rounded hover:bg-purple-700 transition-colors text-[10px]"
                          >
                            Cấp tick xanh
                          </button>
                        )}
                        <button 
                          onClick={() => handleStatusChange(app.id, 'Pending', 'Đã thu hồi token.')}
                          className="px-2 py-1 bg-red-50 text-red-600 font-bold rounded hover:bg-red-100 transition-colors text-[10px]"
                        >
                          Thu hồi
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {applications.filter(a => a.inviteToken).length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Chưa có link mời nào được phát hành.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
