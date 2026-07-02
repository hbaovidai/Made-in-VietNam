import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';
import { SupplierApplicationRequest } from './SupplierApplicationDetails';
import { api } from '../../../lib/api'
import { BusinessType, SupplierStatus, SupplierType } from '@/src/lib/enums';
import { SupplierApplicationDetail } from './SupplierApplicationDetails';
import { busType } from './SupplierApplicationDetails';
import { Modal } from '@/src/components/ui/Modal';

const APPLICATIONS_PER_PAGE: number = 20;

interface RowData {
  companyName: string,
  businessType: BusinessType,
  accountHolderEmail: string,
  dateCreated: Date,
  status: SupplierStatus,
};

// ─── Status helpers ──────────────────────────────────────────
const statusLabels: Record<string, string> = {
  [SupplierStatus.APPLICATION_PENDING]: 'Chờ duyệt',
  [SupplierStatus.APPLICATION_REJECTED]: 'Đã từ chối ứng tuyển',
  [SupplierStatus.VERIFIED]: 'Đã duyệt',
};
const statusBadgeClass: Record<string, string> = {
  [SupplierStatus.APPLICATION_PENDING]: 'wp-badge-pending',
  [SupplierStatus.VERIFIED]: 'wp-badge-approved',
  [SupplierStatus.APPLICATION_REJECTED]: 'wp-badge-rejected',
};
const statusColor: Record<string, string> = {
  [SupplierStatus.APPLICATION_PENDING]: '#dba617', 
  [SupplierStatus.VERIFIED]: '#00a32a',
  [SupplierStatus.APPLICATION_REJECTED]: '#d63638',
};

// ═════════════════════════════════════════════════════════════
export function AdminSupplierApplications() {
  const fetchApps = async (
    page: number = 1,
    limit: number = APPLICATIONS_PER_PAGE
  ) => {
    const { data } = await api.post(
      'supp_apps/supp_apps_all',
      {limit, page},
      { headers: {
        Authorization: `${localStorage.getItem('token')}`
      }, }
    );

    return {
      applicationsData: data.data,
      applicationsMeta: data.meta,
    }
  }

  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'list';
  const detailId: string = params.get('id');

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  const [applications, setApplications] = useState<SupplierApplicationRequest[]>([]);
  const [applicationsMeta, setApplicationsMeta] = useState<any>({total_apps_count: 0});
  useEffect(() => {
    const loadApps = async () => {
      const data = await fetchApps(page, APPLICATIONS_PER_PAGE);
      setApplications(data.applicationsData);
      setApplicationsMeta(data.applicationsMeta);
    };
    loadApps();
  }, [page]);


  // ─── Counts ────────────────────────────────────────────────
  const statusCounts = useMemo(() => ({
    ALL: applications.length,
    [SupplierStatus.APPLICATION_PENDING]: applications.filter(a => a.status === SupplierStatus.APPLICATION_PENDING).length,
    [SupplierStatus.VERIFIED]: applications.filter(a => a.status === SupplierStatus.VERIFIED).length,
    [SupplierStatus.APPLICATION_REJECTED]: applications.filter(a => a.status === SupplierStatus.APPLICATION_REJECTED).length,
  }), [applications]);

  const statusFilterLabels: Record<string, string> = {
    ALL: 'Tất cả',
    [SupplierStatus.APPLICATION_PENDING]: 'Chờ duyệt',
    [SupplierStatus.VERIFIED]: 'Đã duyệt',
    [SupplierStatus.APPLICATION_REJECTED]: 'Đã từ chối',
  };

  const toggleAll = () => {
    if (selectedIds.length === applications.length) setSelectedIds([]);
    else setSelectedIds(applications.map(a => a.id));
  };
  const toggleOne = (id: string) => {
    setSelectedIds(
      prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (id: string, newStatus: SupplierStatus) => {
    try {
      const result = await api.patch(
        `/supp_apps/${id}/${newStatus}`,
        { headers: {Authorization: `${localStorage.getItem('token')}`} }
      );

      if (result.data?.success === true) {
        setApplications(prev => prev.map(a => {
          if (a.id !== id) return a;
          const updates: Partial<SupplierApplicationRequest> = { status: newStatus };
          return { ...a, ...updates };
        }));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await api.delete(
        `/supp_apps/${id}`,
        { headers: {Authorization: `${localStorage.getItem('token')}`} }
      );
      if (result.data?.success === true) {
        setApplications(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const filtered = applications.filter(app => {
    var matchStatus = true
    if (filterStatus !== "ALL") matchStatus = app.status == filterStatus;

    var matchSearch = true;
    if (search) {
      const term = search.toLowerCase()
      const fullName: string = app.accountHolderFullName;

      const matchName = fullName.toLowerCase().includes(term);
      const matchEmail = app.accountHolderEmail.toLowerCase().includes(term);
      const matchPhone = app.accountHolderPhone.toLowerCase().includes(term);
      matchSearch = matchName || matchEmail || matchPhone;
    }

    if (matchSearch && matchStatus) return app;
  });

  // ═══════════════════════════════════════════════════════════
  // TAB: Detail
  // ═══════════════════════════════════════════════════════════
  if (tab === 'detail' && detailId) {
    // const filtered = applications.filter(app => {
    //   if (app.id === detailId) return app;
    // });
    const id: string = detailId;

    if (filtered.length === 0) return <div style={{ padding: 40, textAlign: 'center', color: '#646970' }}>Không tìm thấy hồ sơ.</div>;
    return (
      <SupplierApplicationDetail
        id={id}
        onApprove={(id) => { handleStatusChange(id, SupplierStatus.VERIFIED); navigate('/dashboard/admin/supplier_applications'); }}
        onReject={(id) => { handleStatusChange(id, SupplierStatus.APPLICATION_PENDING); navigate('/dashboard/admin/supplier_applications'); }}
        onDelete={(id) => { handleDelete(id); navigate('/dashboard/admin/supplier_applications'); }}
        onBack={() => navigate('/dashboard/admin/supplier_applications')}
      />
    );
  }

  // ═══════════════════════════════════════════════════════════
  // TAB: List
  // ═══════════════════════════════════════════════════════════
  if (tab === 'list' || tab === null) {
    return (
      <div>
        <div className="wp-breadcrumb">
          <Link to="/dashboard/admin">Dashboard</Link><span className="wp-breadcrumb-sep">›</span>
          <span>Nhà cung cấp</span><span className="wp-breadcrumb-sep">›</span>
          <span className="wp-breadcrumb-current">Tất cả ứng viên</span>
        </div>
        <div className="wp-page-header"><h1 className="wp-page-title">Tất cả ứng viên</h1></div>

        <div className="wp-filter-tabs">
          {Object.entries(statusCounts).map(([key, count], idx) => (
            <React.Fragment key={key}>
              {idx > 0 && <span className="wp-filter-sep">|</span>}
              <button className={`wp-filter-tab ${filterStatus === key ? 'active' : ''}`} onClick={() => { setFilterStatus(key); setPage(page); }}>
                {statusFilterLabels[key]} <span className="count">({count})</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="wp-table-top">
          <div className="wp-bulk-actions">
            <select className="wp-bulk-select"><option>Thao tác hàng loạt</option><option>Phê duyệt</option><option>Từ chối</option><option>Xóa</option></select>
            <button className="wp-btn">Áp dụng</button>
          </div>
          <div className="wp-table-search">
            <input type="text" placeholder="Tìm ứng viên" value={search} onChange={e => { setSearch(e.target.value); setPage(page); }} />
            <button className="wp-btn"><Search size={14} /> Tìm kiếm</button>
          </div>
        </div>

        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" checked={selectedIds.length === applications.length && applications.length > 0} onChange={toggleAll} /></th>
                <th>Tên doanh nghiệp</th><th>Loại DN</th><th>Email</th><th>Ngày nộp</th><th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>Không tìm thấy ứng viên nào.</td></tr>
              ) : filtered.map(app => (
                <tr key={app.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(app.id)} onChange={() => toggleOne(app.id)} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                      <div>
                        <span className="wp-row-title"
                          onClick={() => navigate(`/dashboard/admin/supplier_applications?tab=detail&id=${app.id}`)}
                        >
                          {app.companyName}
                        </span>
                        <div className="wp-row-actions">
                          {app.status in [SupplierStatus.APPLICATION_PENDING, SupplierStatus.APPLICATION_REJECTED] && (
                            <>
                            <button style={{ color: '#00a32a' }} onClick={() => handleStatusChange(app.id, SupplierStatus.VERIFIED)}>
                            Phê duyệt
                            </button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => handleStatusChange(app.id, SupplierStatus.APPLICATION_REJECTED)}>
                            Từ chối
                            </button>
                            </>
                          )}

                          {app.status === SupplierStatus.VERIFIED && (
                            <>
                            <button className="delete" onClick={() => handleStatusChange(app.id, SupplierStatus.APPLICATION_PENDING)}>
                            Thu hồi phê duyệt
                            </button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => handleDelete(app.id)}>
                            Xóa
                            </button>
                            </>
                          )}

                          {app.status === SupplierStatus.APPLICATION_REJECTED && (
                            <>
                            <button style={{ color: '#00a32a' }} onClick={() => handleStatusChange(app.id, SupplierStatus.VERIFIED)}>
                            Phê duyệt
                            </button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => handleDelete(app.id)}>Xóa</button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{busType[app.businessType]}</td>
                 <td><a href={`mailto:${app.accountHolderEmail}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{app.accountHolderEmail}</a></td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{app.createdAt.toLocaleString()}</td>
                  <td><span className={`wp-badge ${statusBadgeClass[app.status]}`}>{statusLabels[app.status]}</span></td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <WPPagination 
          page={page}
          perPage={APPLICATIONS_PER_PAGE}
          total={applicationsMeta.total_apps_count}
          onPageChange={setPage}
          />

      </div>
    );
  }
}
