import React, { useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { WPPagination } from '../../../components/admin/WPPagination';
import { SupplierDetail, SupplierProfile, SupplierVerificationStatus } from './SupplierDetail';
import { SupplierApplicationRequest } from './SupplierApplicationDetails';
import { api } from '../../../lib/api'
import { SupplierApplicationDetail, SupplierApplicationStatus } from './SupplierApplicationDetails';

const PROFILES_PER_PAGE: number = 20;

// ─── Types ───────────────────────────────────────────────────
export type SupplierStatus = 'VERIFIED' | 'UNVERIFIED';

const fetchSuppliers = async (
  page: number = 1,
  limit: number = PROFILES_PER_PAGE
) => {
  const { data } = await api.get(
    '/suppliers',
    { 
      headers: {
        Authorization: `${localStorage.getItem('token')}`
      }, 
      params: {limit, page},
    }
  );

  return {
    suppliersData: data.data,
    suppliersMeta: data.meta,
  }
}

var {
  suppliersData,
  suppliersMeta
} = await fetchSuppliers();

// ─── Status helpers ──────────────────────────────────────────
const statusLabels: Record<SupplierStatus, string> = {
  VERIFIED: 'Đã xác minh', UNVERIFIED: 'Chưa xác minh', 
};
const statusBadgeClass: Record<SupplierStatus, string> = {
  VERIFIED: 'wp-badge-approved', UNVERIFIED: 'wp-badge-rejected',
};
const statusColor: Record<SupplierStatus, string> = {
  VERIFIED: '#00a32a', UNVERIFIED: '#d63638',
};

// ═════════════════════════════════════════════════════════════
export function AdminSuppliers() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tab = params.get('tab') || 'list';
  const detailId: string = params.get('id');

  const [suppliers, setSuppliers] = useState<SupplierProfile[]>(suppliersData);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // ─── Counts ────────────────────────────────────────────────
  const statusCounts = useMemo(() => ({
    ALL: suppliers.length,
    VERIFIED: suppliers.filter(a => a.verificationStatus === 'VERIFIED').length,
    UNVERIFIED: suppliers.filter(a => a.verificationStatus === 'UNVERIFIED').length,
  }), [suppliers]);
  const statusFilterLabels: Record<string, string> = {
    ALL: 'Tất cả', VERIFIED: 'Đã xác minh', UNVERIFIED: 'Chưa xác minh',
  };

  const toggleAll = () => {
    if (selectedIds.length === suppliers.length) setSelectedIds([]);
    else setSelectedIds(suppliers.map(a => a.id));
  };
  const toggleOne = (id: string) => {
    setSelectedIds(
      prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (id: string, newStatus: SupplierVerificationStatus) => {
    try {
      return;
      const result = await api.patch(
        `/suppliers/${id}`,
        { headers: {Authorization: `${localStorage.getItem('token')}`} }
      );

      if (result.data?.success === true) {
        setSuppliers(prev => prev.map(a => {
          if (a.id !== id) return a;
          const updates: Partial<SupplierProfile> = { verificationStatus: newStatus };
          return { ...a, ...updates };
        }));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      return;
      const result = await api.delete(
        `/supp_apps/${id}`,
        { headers: {Authorization: `${localStorage.getItem('token')}`} }
      );
      if (result.data?.success === true) {
        setSuppliers(prev => prev.filter(a => a.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  }

  const handlePageChange = async (page: number) => {
    setPage(page);
    const data = await fetchSuppliers(page, PROFILES_PER_PAGE);
    suppliersData = data.suppliersData;
    suppliersMeta = data.suppliersMeta;
    setSuppliers(suppliersData);
  }

  const filtered = suppliers.filter(supp => {
    var matchStatus: boolean = true
    if (filterStatus !== "ALL") matchStatus = supp.verificationStatus == filterStatus;

    var matchSearch: boolean = true;
    if (search) {
      const term = search.toLowerCase()
      const matchRepName = supp.companyName.toLowerCase().includes(term);
      const matchCompanyName = supp.companyName.toLowerCase().includes(term);
      const matchEmail = supp.companyEmail.toLowerCase().includes(term);
      const matchPhone = supp.companyPhone.toLowerCase().includes(term);
      matchSearch = matchCompanyName || matchEmail || matchPhone ||
        matchRepName;
    }

    if (matchSearch && matchStatus) return supp;
  });

  // ═══════════════════════════════════════════════════════════
  // TAB: Detail
  // ═══════════════════════════════════════════════════════════
  if (tab === 'detail' && detailId) {
    const filtered = suppliers.filter(app => {
      if (app.id === detailId) return app;
    });

    // TODO: thay link
    if (!filtered) return <div style={{ padding: 40, textAlign: 'center', color: '#646970' }}>Không tìm thấy hồ sơ.</div>;
    return (
      <SupplierDetail
        request={filtered[0]}
        onApprove={(id) => { handleStatusChange(id, 'VERIFIED'); navigate('/dashboard/admin/verifications'); }}
        onReject={(id) => { handleStatusChange(id, 'UNVERIFIED'); navigate('/dashboard/admin/verifications'); }}
        onDelete={(id) => { handleDelete(id); navigate('/dashboard/admin/verifications'); }}
        onBack={() => navigate('/dashboard/admin/suppliers')}
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
          <span className="wp-breadcrumb-current">Tất cả nhà cung cấp</span>
        </div>
        <div className="wp-page-header"><h1 className="wp-page-title">Tất cả nhà cung cấp</h1></div>

        <div className="wp-filter-tabs">
          {Object.entries(statusCounts).map(([key, count], idx) => (
            <React.Fragment key={key}>
              {idx > 0 && <span className="wp-filter-sep">|</span>}
              <button className={`wp-filter-tab ${filterStatus === key ? 'active' : ''}`} onClick={() => { setFilterStatus(key); handlePageChange(page); }}>
                {statusFilterLabels[key]} <span className="count">({count})</span>
              </button>
            </React.Fragment>
          ))}
        </div>

        <div className="wp-table-top">
          <div className="wp-bulk-actions">
            <select className="wp-bulk-select"><option>Thao tác hàng loạt</option><option>Xác minh</option><option>Huỷ xác minh</option><option>Xóa</option></select>
            <button className="wp-btn">Áp dụng</button>
          </div>
          <div className="wp-table-search">
            <input type="text" placeholder="Tìm kiếm nhà cung cấp" value={search} onChange={e => { setSearch(e.target.value); handlePageChange(page); }} />
            <button className="wp-btn"><Search size={14} /> Tìm kiếm</button>
          </div>
        </div>

        <div className="wp-table-wrap">
          <table className="wp-table">
            <thead>
              <tr>
                <th style={{ width: 30 }}><input type="checkbox" checked={selectedIds.length === suppliers.length && suppliers.length > 0} onChange={toggleAll} /></th>
                <th>Tên doanh nghiệp</th><th>Sđt</th><th>Email</th><th>Mã số thuế</th><th>Trạng thái</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>Không tìm thấy ứng viên nào.</td></tr>
              ) : filtered.map(supp => (
                <tr key={supp.id}>
                  <td><input type="checkbox" checked={selectedIds.includes(supp.id)} onChange={() => toggleOne(supp.id)} /></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>

                      <div>
                        <span className="wp-row-title"
                          onClick={() => navigate(`#`)}
                          // onClick={() => navigate(`/dashboard/admin/suppliers?tab=detail&id=${supp.id}`)}
                        >
                          {supp.companyName}
                        </span>
                        <div className="wp-row-actions">
                          {supp.verificationStatus === 'UNVERIFIED' && (
                            <>
                            <button style={{ color: '#00a32a' }} onClick={() => handleStatusChange(supp.id, 'VERIFIED')}>
                              Xác minh
                            </button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => handleDelete(supp.id)}>
                              Xoá
                            </button>
                            </>
                          )}

                          {supp.verificationStatus === 'VERIFIED' && (
                            <>
                            <button className="delete" onClick={() => handleStatusChange(supp.id, 'UNVERIFIED')}>
                              Huỷ xác minh
                            </button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => handleDelete(supp.id)}>
                              Xóa
                            </button>
                            </>
                          )}

                        </div>
                      </div>
                    </div>
                  </td>

                  <td>{supp.companyPhone}</td>
                  <td><a href={`mailto:${supp.companyEmail}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{supp.companyEmail}</a></td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{supp.taxCode}</td>
                  <td><span className={`wp-badge ${statusBadgeClass[supp.verificationStatus]}`}>{statusLabels[supp.verificationStatus]}</span></td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <WPPagination 
          page={page}
          perPage={PROFILES_PER_PAGE}
          total={suppliersMeta.total}
          onPageChange={handlePageChange}
          />

      </div>
    );
  }
}
