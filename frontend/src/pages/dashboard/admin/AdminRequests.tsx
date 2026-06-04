import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, Eye, Check, RefreshCw, Download, FileText, ShoppingBag, Mail, Users as UsersIcon } from 'lucide-react';

type MainTab = 'all_requests' | 'customers';
type ReqType = 'all' | 'order' | 'rfq';
type ReqStatus = 'all' | 'pending' | 'processed';

interface OrderRequest {
  id: string;
  type: 'order';
  customerName: string;
  email: string;
  phone: string;
  productName: string;
  sku: string;
  category: string;
  supplierName: string;
  quantity: number;
  unit: string;
  message: string;
  status: 'pending' | 'processed';
  createdAt: string;
}

interface RFQRequest {
  id: string;
  type: 'rfq';
  customerName: string;
  companyName?: string;
  email: string;
  phone: string;
  category: string;
  quantity: number;
  unit: string;
  message: string;
  createdAt: string;
  suppliers: { name: string; email: string; status: 'pending' | 'processed' }[];
}

const mockOrders: OrderRequest[] = [
  { id: 'REQ001', type: 'order', customerName: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0912345678', productName: 'Cà phê Robusta Đăk Lăk S18', sku: 'CF-ROB-S18', category: 'Cà phê', supplierName: 'Đăk Lăk Coffee Co.', quantity: 500, unit: 'kg', message: 'Cần hàng gấp trong tuần sau, đóng bao 50kg.', status: 'pending', createdAt: '2026-06-01' },
  { id: 'REQ005', type: 'order', customerName: 'Trần Thị B', email: 'thib@yahoo.com', phone: '0987654321', productName: 'Trà ô long Thiết Quan Âm', sku: 'TR-OLO-TQA', category: 'Trà', supplierName: 'Lâm Đồng Tea House', quantity: 200, unit: 'hộp', message: 'Gửi mẫu thử trước khi giao số lượng lớn.', status: 'processed', createdAt: '2026-05-28' },
  { id: 'REQ006', type: 'order', customerName: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0912345678', productName: 'Hạt điều rang muối vỏ lụa', sku: 'HD-RM-VL', category: 'Hạt dinh dưỡng', supplierName: 'Bình Phước Cashew Corp', quantity: 1000, unit: 'hũ', message: 'Yêu cầu tem nhãn tiếng Anh xuất khẩu.', status: 'pending', createdAt: '2026-06-02' }
];

const mockRfqs: RFQRequest[] = [
  { id: 'RFQ001', type: 'rfq', customerName: 'Phạm Minh C', companyName: 'ABC Company', email: 'minhc@abccorp.vn', phone: '0909123456', category: 'Cà phê', quantity: 1000, unit: 'kg', message: 'Tìm nhà cung cấp cà phê hạt Robusta xuất khẩu Trung Đông.', createdAt: '2026-06-02', suppliers: [
    { name: 'Đăk Lăk Coffee Co.', email: 'info@daklakcoffee.vn', status: 'processed' },
    { name: 'Trung Nguyên B2B', email: 'sales@trungnguyen.com.vn', status: 'processed' },
    { name: 'Mê Trang Coffee', email: 'contact@metrang.com', status: 'pending' },
    { name: 'Highlands Wholesale', email: 'wholesale@highlands.com.vn', status: 'pending' }
  ] },
  { id: 'RFQ002', type: 'rfq', customerName: 'Lê Hoàng D', companyName: 'Glocal Foods', email: 'hoangd@glocalfoods.com', phone: '0933445566', category: 'Gia vị', quantity: 5000, unit: 'tấn', message: 'Cần nguồn hàng tiêu đen Phú Quốc số lượng lớn ổn định lâu dài.', createdAt: '2026-05-30', suppliers: [
    { name: 'Phu Quoc Pepper Co.', email: 'pepper@phuquoc.vn', status: 'processed' },
    { name: 'Nông sản Việt', email: 'vietagro@nongsan.vn', status: 'processed' },
    { name: 'Gia vị Tây Nguyên', email: 'taynguyen@spices.vn', status: 'processed' }
  ] },
  { id: 'RFQ003', type: 'rfq', customerName: 'Nguyễn Văn A', email: 'vana@gmail.com', phone: '0912345678', category: 'Trà', quantity: 300, unit: 'kg', message: 'Tìm nguồn cung cấp trà xanh Thái Nguyên loại ngon đóng gói quà tặng.', createdAt: '2026-05-25', suppliers: [
    { name: 'Lâm Đồng Tea House', email: 'teahouse@lamdong.vn', status: 'processed' },
    { name: 'Trà Thái Nguyên Ty Co', email: 'sales@thainguyentea.vn', status: 'pending' }
  ] }
];

export function AdminRequests() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const tab = (searchParams.get('tab') as MainTab) || 'all_requests';

  // State
  const [orders, setOrders] = useState<OrderRequest[]>(mockOrders);
  const [rfqs, setRfqs] = useState<RFQRequest[]>(mockRfqs);
  const [reqType, setReqType] = useState<ReqType>('all');
  const [statusFilter, setStatusFilter] = useState<ReqStatus>('all');
  const [supplierSearch, setSupplierSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);
  const perPage = 10;

  // Detail Modal view
  const [detailOrder, setDetailOrder] = useState<OrderRequest | null>(null);
  const [detailRfq, setDetailRfq] = useState<RFQRequest | null>(null);

  // Customer History view
  const [selectedCustomerEmail, setSelectedCustomerEmail] = useState<string | null>(null);

  const setTab = (t: MainTab) => {
    if (t === 'all_requests') setSearchParams({});
    else setSearchParams({ tab: t });
    setSelectedCustomerEmail(null);
  };

  const closeDetails = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('id');
      return next;
    });
  };

  const openDetail = (id: string) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.set('id', id);
      return next;
    });
  };

  // Sync state with URL id param (e.g. when linked from Messages page)
  React.useEffect(() => {
    const idParam = searchParams.get('id');
    if (idParam) {
      const order = orders.find(o => o.id === idParam);
      if (order) {
        setDetailOrder(order);
        setDetailRfq(null);
        return;
      }
      const rfq = rfqs.find(r => r.id === idParam);
      if (rfq) {
        setDetailRfq(rfq);
        setDetailOrder(null);
        return;
      }
    } else {
      setDetailOrder(null);
      setDetailRfq(null);
    }
  }, [searchParams, orders, rfqs]);

  // ═══ Filters & Matching ═══
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const ms = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase()) || o.productName.toLowerCase().includes(search.toLowerCase()) || o.email.toLowerCase().includes(search.toLowerCase());
      const mStatus = statusFilter === 'all' || o.status === statusFilter;
      const mSupplier = !supplierSearch || o.supplierName.toLowerCase().includes(supplierSearch.toLowerCase());
      const mCat = categoryFilter === 'all' || o.category === categoryFilter;
      return ms && mStatus && mSupplier && mCat;
    });
  }, [orders, search, statusFilter, supplierSearch, categoryFilter]);

  const filteredRfqs = useMemo(() => {
    return rfqs.filter(r => {
      const ms = !search || r.id.toLowerCase().includes(search.toLowerCase()) || r.customerName.toLowerCase().includes(search.toLowerCase()) || (r.companyName && r.companyName.toLowerCase().includes(search.toLowerCase())) || r.email.toLowerCase().includes(search.toLowerCase());
      const mCat = categoryFilter === 'all' || r.category === categoryFilter;
      const processedCount = r.suppliers.filter(s => s.status === 'processed').length;
      const isProcessed = processedCount === r.suppliers.length;
      const mStatus = statusFilter === 'all' || (statusFilter === 'processed' ? isProcessed : !isProcessed);
      const mSupplier = !supplierSearch || r.suppliers.some(s => s.name.toLowerCase().includes(supplierSearch.toLowerCase()));
      return ms && mStatus && mSupplier && mCat;
    });
  }, [rfqs, search, statusFilter, supplierSearch, categoryFilter]);

  // Combined List for "Tất cả" view
  const combinedRequests = useMemo(() => {
    const list: (OrderRequest | RFQRequest)[] = [];
    if (reqType === 'all' || reqType === 'order') list.push(...filteredOrders);
    if (reqType === 'all' || reqType === 'rfq') list.push(...filteredRfqs);
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [reqType, filteredOrders, filteredRfqs]);

  // Customers data
  const customers = useMemo(() => {
    const map = new Map<string, any>();
    
    // Add from orders
    orders.forEach(o => {
      const email = o.email;
      if (!map.has(email)) {
        map.set(email, { name: o.customerName, company: '—', email, phone: o.phone, total: 0, orders: 0, rfqs: 0, lastDate: o.createdAt });
      }
      const c = map.get(email)!;
      c.total++;
      c.orders++;
      if (o.createdAt > c.lastDate) c.lastDate = o.createdAt;
    });

    // Add from RFQs
    rfqs.forEach(r => {
      const email = r.email;
      if (!map.has(email)) {
        map.set(email, { name: r.customerName, company: r.companyName || '—', email, phone: r.phone, total: 0, orders: 0, rfqs: 0, lastDate: r.createdAt });
      }
      const c = map.get(email)!;
      c.total++;
      c.rfqs++;
      if (r.companyName && c.company === '—') c.company = r.companyName;
      if (r.createdAt > c.lastDate) c.lastDate = r.createdAt;
    });

    return Array.from(map.values());
  }, [orders, rfqs]);

  const selectedCustomerInfo = useMemo(() => {
    if (!selectedCustomerEmail) return null;
    return customers.find(c => c.email === selectedCustomerEmail) || null;
  }, [customers, selectedCustomerEmail]);

  const customerHistory = useMemo(() => {
    if (!selectedCustomerEmail) return [];
    const list: (OrderRequest | RFQRequest)[] = [];
    orders.forEach(o => { if (o.email === selectedCustomerEmail) list.push(o); });
    rfqs.forEach(r => { if (r.email === selectedCustomerEmail) list.push(r); });
    return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [orders, rfqs, selectedCustomerEmail]);

  // Pagination helper
  const totalPages = Math.ceil((reqType === 'all' ? combinedRequests.length : reqType === 'order' ? filteredOrders.length : filteredRfqs.length) / perPage);
  const paginatedList = useMemo(() => {
    const src = reqType === 'all' ? combinedRequests : reqType === 'order' ? filteredOrders : filteredRfqs;
    return src.slice((page - 1) * perPage, page * perPage);
  }, [reqType, combinedRequests, filteredOrders, filteredRfqs, page]);

  // Actions
  const toggleOrderStatus = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: o.status === 'pending' ? 'processed' : 'pending' } : o));
    if (detailOrder && detailOrder.id === id) {
      setDetailOrder(prev => prev ? { ...prev, status: prev.status === 'pending' ? 'processed' : 'pending' } : null);
    }
  };

  const toggleRfqSupplierStatus = (rfqId: string, supplierEmail: string) => {
    setRfqs(prev => prev.map(r => {
      if (r.id !== rfqId) return r;
      return {
        ...r,
        suppliers: r.suppliers.map(s => s.email === supplierEmail ? { ...s, status: s.status === 'pending' ? 'processed' : 'pending' } : s)
      };
    }));
    if (detailRfq && detailRfq.id === rfqId) {
      setDetailRfq(prev => {
        if (!prev) return null;
        return {
          ...prev,
          suppliers: prev.suppliers.map(s => s.email === supplierEmail ? { ...s, status: s.status === 'pending' ? 'processed' : 'pending' } : s)
        };
      });
    }
  };

  const deleteRequest = (id: string) => {
    if (id.startsWith('REQ')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    } else {
      setRfqs(prev => prev.filter(r => r.id !== id));
    }
    closeDetails();
  };

  const handleExportExcel = () => {
    alert(t('req_export_success'));
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString('vi-VN');

  // Categories list for dropdown
  const categories = ['Cà phê', 'Trà', 'Gia vị', 'Hạt dinh dưỡng'];

  // ═══ Render Detail Order Request ═══
  if (detailOrder) return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <button onClick={closeDetails} style={{ background: 'none', border: 'none', color: 'var(--wp-accent)', cursor: 'pointer', padding: 0 }}>{t('req_breadcrumb_requests')}</button>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{t('req_breadcrumb_order_detail')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={closeDetails} className="wp-btn" style={{ padding: '4px 8px' }}><ChevronLeft size={16} /></button>
        <h1 className="wp-page-title" style={{ margin: 0 }}>{t('req_detail_title', { id: detailOrder.id })}</h1>
        <span className={`wp-badge ${detailOrder.status === 'processed' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
          {detailOrder.status === 'processed' ? t('req_status_processed') : t('req_status_pending')}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="wp-card">
            <div className="wp-card-header"><span className="wp-card-title">{t('req_detail_customer_info')}</span></div>
            <div className="wp-card-body">
              <table className="wp-form-table"><tbody>
                <tr><th style={{ width: 120, fontSize: 13 }}>{t('req_detail_fullname')}</th><td>{detailOrder.customerName}</td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_email')}</th><td><a href={`mailto:${detailOrder.email}`} style={{ color: 'var(--wp-accent)' }}>{detailOrder.email}</a></td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_phone')}</th><td>{detailOrder.phone}</td></tr>
              </tbody></table>
            </div>
          </div>

          <div className="wp-card">
            <div className="wp-card-header"><span className="wp-card-title">{t('req_detail_product_info')}</span></div>
            <div className="wp-card-body">
              <table className="wp-form-table"><tbody>
                <tr><th style={{ width: 120, fontSize: 13 }}>{t('req_detail_product')}</th><td style={{ fontWeight: 600 }}>{detailOrder.productName}</td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_sku')}</th><td><code style={{ background: '#f0f0f1', padding: '2px 4px', borderRadius: 3 }}>{detailOrder.sku}</code></td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_category')}</th><td>{detailOrder.category}</td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_supplier')}</th><td><strong>{detailOrder.supplierName}</strong></td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_quantity')}</th><td>{detailOrder.quantity} {detailOrder.unit}</td></tr>
                <tr><th style={{ fontSize: 13 }}>{t('req_detail_content')}</th><td><p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{detailOrder.message}</p></td></tr>
              </tbody></table>
            </div>
          </div>
        </div>

        <div>
          <div className="wp-card">
            <div className="wp-card-header"><span className="wp-card-title">{t('req_detail_actions')}</span></div>
            <div className="wp-card-body" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>{t('req_detail_status_label')}</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" checked={detailOrder.status === 'pending'} onChange={() => toggleOrderStatus(detailOrder.id)} />
                    {t('req_status_pending')}
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13 }}>
                    <input type="radio" checked={detailOrder.status === 'processed'} onChange={() => toggleOrderStatus(detailOrder.id)} />
                    {t('req_status_processed')}
                  </label>
                </div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--wp-border)', margin: '8px 0' }} />
              <button onClick={() => toggleOrderStatus(detailOrder.id)} className="wp-btn button-primary" style={{ width: '100%' }}>{t('req_detail_save_status')}</button>
              <button onClick={() => { if(confirm(t('req_detail_confirm_delete'))) deleteRequest(detailOrder.id); }} className="wp-btn" style={{ width: '100%', borderColor: 'var(--wp-danger)', color: 'var(--wp-danger)' }}>{t('req_detail_delete')}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══ Render Detail RFQ Request ═══
  if (detailRfq) {
    const processedCount = detailRfq.suppliers.filter(s => s.status === 'processed').length;
    const progressPercent = detailRfq.suppliers.length > 0 ? Math.round((processedCount / detailRfq.suppliers.length) * 100) : 0;

    return (
      <div>
        <div className="wp-breadcrumb">
          <Link to="/dashboard/admin">Dashboard</Link>
          <span className="wp-breadcrumb-sep">›</span>
          <button onClick={closeDetails} style={{ background: 'none', border: 'none', color: 'var(--wp-accent)', cursor: 'pointer', padding: 0 }}>{t('req_breadcrumb_requests')}</button>
          <span className="wp-breadcrumb-sep">›</span>
          <span className="wp-breadcrumb-current">{t('req_breadcrumb_rfq_detail')}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button onClick={closeDetails} className="wp-btn" style={{ padding: '4px 8px' }}><ChevronLeft size={16} /></button>
          <h1 className="wp-page-title" style={{ margin: 0 }}>{t('req_detail_title', { id: detailRfq.id })}</h1>
          <span className={`wp-badge ${processedCount === detailRfq.suppliers.length ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
            {t('req_rfq_progress_badge', { processed: processedCount, total: detailRfq.suppliers.length })}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="wp-card">
              <div className="wp-card-header"><span className="wp-card-title">{t('req_detail_customer_info')}</span></div>
              <div className="wp-card-body">
                <table className="wp-form-table"><tbody>
                  <tr><th style={{ width: 120, fontSize: 13 }}>{t('req_detail_fullname')}</th><td>{detailRfq.customerName}</td></tr>
                  {detailRfq.companyName && <tr><th style={{ fontSize: 13 }}>{t('req_detail_company')}</th><td>{detailRfq.companyName}</td></tr>}
                  <tr><th style={{ fontSize: 13 }}>{t('req_detail_email')}</th><td><a href={`mailto:${detailRfq.email}`} style={{ color: 'var(--wp-accent)' }}>{detailRfq.email}</a></td></tr>
                  <tr><th style={{ fontSize: 13 }}>{t('req_detail_phone')}</th><td>{detailRfq.phone}</td></tr>
                </tbody></table>
              </div>
            </div>

            <div className="wp-card">
              <div className="wp-card-header"><span className="wp-card-title">{t('req_detail_request_info')}</span></div>
              <div className="wp-card-body">
                <table className="wp-form-table"><tbody>
                  <tr><th style={{ width: 120, fontSize: 13 }}>{t('req_detail_category')}</th><td>{detailRfq.category}</td></tr>
                  <tr><th style={{ fontSize: 13 }}>{t('req_detail_quantity_request')}</th><td>{detailRfq.quantity} {detailRfq.unit}</td></tr>
                  <tr><th style={{ fontSize: 13 }}>{t('req_detail_description')}</th><td><p style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{detailRfq.message}</p></td></tr>
                </tbody></table>
              </div>
            </div>

            <div className="wp-card">
              <div className="wp-card-header"><span className="wp-card-title">{t('req_rfq_suppliers_title', { count: detailRfq.suppliers.length })}</span></div>
              <div className="wp-card-body" style={{ padding: 0 }}>
                <table className="wp-table" style={{ margin: 0 }}>
                  <thead>
                    <tr>
                      <th>{t('req_rfq_supplier_col')}</th>
                      <th>{t('req_rfq_supplier_email')}</th>
                      <th style={{ width: 140 }}>{t('req_rfq_supplier_status')}</th>
                      <th style={{ width: 100 }}>{t('req_rfq_supplier_action')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {detailRfq.suppliers.map(s => (
                      <tr key={s.email}>
                        <td style={{ fontWeight: 600 }}>{s.name}</td>
                        <td>{s.email}</td>
                        <td>
                          <span className={`wp-badge ${s.status === 'processed' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                            {s.status === 'processed' ? t('req_status_processed') : t('req_status_pending')}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => toggleRfqSupplierStatus(detailRfq.id, s.email)} className="wp-btn" style={{ padding: '2px 8px', fontSize: 11 }}>
                            {t('req_rfq_toggle_status')}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <div className="wp-card">
              <div className="wp-card-header"><span className="wp-card-title">{t('req_rfq_progress_title')}</span></div>
              <div className="wp-card-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>
                  <span>{t('req_rfq_progress_label')}</span>
                  <span>{progressPercent}%</span>
                </div>
                <div style={{ height: 10, background: '#e0e0e0', borderRadius: 5, overflow: 'hidden', marginBottom: 12 }}>
                  <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--wp-accent)', borderRadius: 5, transition: 'width 0.3s' }} />
                </div>
                <div style={{ fontSize: 12, color: 'var(--wp-text-muted)', lineHeight: 1.4 }} dangerouslySetInnerHTML={{ __html: t('req_rfq_progress_desc', { processed: processedCount, total: detailRfq.suppliers.length }) }} />
                <hr style={{ border: 'none', borderTop: '1px solid var(--wp-border)', margin: '14px 0' }} />
                <button onClick={() => { if(confirm(t('req_detail_confirm_delete_rfq'))) deleteRequest(detailRfq.id); }} className="wp-btn" style={{ width: '100%', borderColor: 'var(--wp-danger)', color: 'var(--wp-danger)' }}>{t('req_detail_delete')}</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══ Render Customer Profile ═══
  if (selectedCustomerEmail && selectedCustomerInfo) return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <button onClick={() => setSelectedCustomerEmail(null)} style={{ background: 'none', border: 'none', color: 'var(--wp-accent)', cursor: 'pointer', padding: 0 }}>{t('req_customers')}</button>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{selectedCustomerInfo.name}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <button onClick={() => setSelectedCustomerEmail(null)} className="wp-btn" style={{ padding: '4px 8px' }}><ChevronLeft size={16} /></button>
        <h1 className="wp-page-title" style={{ margin: 0 }}>{t('req_customer_profile_title', { name: selectedCustomerInfo.name })}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '30% 70%', gap: 16 }}>
        <div>
          <div className="wp-card">
            <div className="wp-card-header"><span className="wp-card-title">{t('req_customer_contact')}</span></div>
            <div className="wp-card-body">
              <table className="wp-form-table"><tbody>
                <tr><th style={{ width: 90, fontSize: 12 }}>{t('req_detail_fullname')}</th><td>{selectedCustomerInfo.name}</td></tr>
                <tr><th style={{ fontSize: 12 }}>{t('req_detail_company')}</th><td>{selectedCustomerInfo.company}</td></tr>
                <tr><th style={{ fontSize: 12 }}>{t('req_detail_email')}</th><td><a href={`mailto:${selectedCustomerInfo.email}`} style={{ color: 'var(--wp-accent)' }}>{selectedCustomerInfo.email}</a></td></tr>
                <tr><th style={{ fontSize: 12 }}>{t('req_detail_phone')}</th><td>{selectedCustomerInfo.phone}</td></tr>
              </tbody></table>
              <hr style={{ border: 'none', borderTop: '1px solid var(--wp-border)', margin: '14px 0' }} />
              <button onClick={handleExportExcel} className="wp-btn button-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Download size={14} /> {t('req_action_export_excel')}
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="wp-card">
            <div className="wp-card-header"><span className="wp-card-title">{t('req_customer_history', { count: customerHistory.length })}</span></div>
            <div className="wp-card-body" style={{ padding: 0 }}>
              <table className="wp-table" style={{ margin: 0 }}>
                <thead>
                  <tr>
                    <th>{t('req_col_id')}</th>
                    <th>{t('req_customer_history_col_type')}</th>
                    <th>{t('req_customer_history_col_detail')}</th>
                    <th>{t('req_col_quantity')}</th>
                    <th>{t('req_customer_history_col_status')}</th>
                    <th>{t('req_col_date')}</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {customerHistory.map(req => {
                    const isOrder = req.type === 'order';
                    return (
                      <tr key={req.id}>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{req.id}</td>
                        <td>
                          <span className={`wp-badge ${isOrder ? 'wp-badge-published' : 'wp-badge-draft'}`}>
                            {isOrder ? t('req_type_order') : t('req_type_rfq')}
                          </span>
                        </td>
                        <td>{isOrder ? (req as OrderRequest).productName : (req as RFQRequest).category}</td>
                        <td>{req.quantity} {req.unit}</td>
                        <td>
                          {isOrder ? (
                            <span className={`wp-badge ${(req as OrderRequest).status === 'processed' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                              {(req as OrderRequest).status === 'processed' ? t('req_status_processed') : t('req_status_pending')}
                            </span>
                          ) : (
                            <span>
                              {(req as RFQRequest).suppliers.filter(s => s.status === 'processed').length}/{(req as RFQRequest).suppliers.length} {t('req_status_processed').toLowerCase()}
                            </span>
                          )}
                        </td>
                        <td>{fmtDate(req.createdAt)}</td>
                        <td>
                          <button onClick={() => openDetail(req.id)} className="wp-btn" style={{ padding: '2px 8px', fontSize: 11 }}>
                            {t('req_action_view_detail')}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // ═══ Main Table View ═══
  return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{t('req_breadcrumb_requests')}</span>
      </div>

      {/* ═══ TAB 1: Danh sách yêu cầu ═══ */}
      {tab === 'all_requests' && (
        <>
          <h1 className="wp-page-title">{t('req_page_title')}</h1>

          {/* WordPress filter tabs */}
          <div className="wp-filter-tabs">
            <button className={`wp-filter-tab ${reqType === 'all' ? 'active' : ''}`} onClick={() => { setReqType('all'); setPage(1); }}>
              {t('req_tab_all')} <span className="count">({orders.length + rfqs.length})</span>
            </button>
            <span className="wp-filter-sep">|</span>
            <button className={`wp-filter-tab ${reqType === 'order' ? 'active' : ''}`} onClick={() => { setReqType('order'); setPage(1); }}>
              {t('req_tab_order')} <span className="count">({orders.length})</span>
            </button>
            <span className="wp-filter-sep">|</span>
            <button className={`wp-filter-tab ${reqType === 'rfq' ? 'active' : ''}`} onClick={() => { setReqType('rfq'); setPage(1); }}>
              {t('req_tab_rfq')} <span className="count">({rfqs.length})</span>
            </button>
          </div>

          {/* Toolbar lọc */}
          <div className="wp-table-top" style={{ flexWrap: 'wrap', gap: 8 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <select className="wp-bulk-select" value={statusFilter} onChange={e => { setStatusFilter(e.target.value as ReqStatus); setPage(1); }}>
                <option value="all">{t('req_filter_all_status')}</option>
                <option value="pending">{t('req_filter_pending')}</option>
                <option value="processed">{t('req_filter_processed')}</option>
              </select>

              <select className="wp-bulk-select" value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1); }}>
                <option value="all">{t('req_filter_all_category')}</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>

              <input
                type="text"
                placeholder={t('req_filter_supplier_placeholder')}
                value={supplierSearch}
                onChange={e => { setSupplierSearch(e.target.value); setPage(1); }}
                style={{ padding: '6px 10px', border: '1px solid var(--wp-border)', borderRadius: 3, fontSize: 13 }}
              />
            </div>

            <div className="wp-table-search">
              <input
                type="text"
                placeholder={t('req_search_placeholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <button className="wp-btn"><Search size={14} /> {t('req_search_btn')}</button>
            </div>
          </div>

          <div className="wp-table-wrap">
            <table className="wp-table">
              <thead>
                {reqType === 'order' ? (
                  <tr>
                    <th style={{ width: 30 }}><input type="checkbox" checked={selectedReqs.length === paginatedList.length && paginatedList.length > 0} onChange={() => selectedReqs.length === paginatedList.length ? setSelectedReqs([]) : setSelectedReqs(paginatedList.map(r => r.id))} /></th>
                    <th>{t('req_col_id')}</th>
                    <th>{t('req_col_customer')}</th>
                    <th>{t('req_col_email')}</th>
                    <th>{t('req_col_phone')}</th>
                    <th>{t('req_col_product')}</th>
                    <th>{t('req_col_supplier')}</th>
                    <th>{t('req_col_quantity')}</th>
                    <th>{t('req_col_status')}</th>
                    <th>{t('req_col_date')}</th>
                  </tr>
                ) : reqType === 'rfq' ? (
                  <tr>
                    <th style={{ width: 30 }}><input type="checkbox" checked={selectedReqs.length === paginatedList.length && paginatedList.length > 0} onChange={() => selectedReqs.length === paginatedList.length ? setSelectedReqs([]) : setSelectedReqs(paginatedList.map(r => r.id))} /></th>
                    <th>{t('req_col_id')}</th>
                    <th>{t('req_col_customer')}</th>
                    <th>{t('req_col_email')}</th>
                    <th>{t('req_col_phone')}</th>
                    <th>{t('req_detail_category')}</th>
                    <th>{t('req_col_quantity')}</th>
                    <th>{t('req_col_supplier_count')}</th>
                    <th>{t('req_col_progress')}</th>
                    <th>{t('req_col_date')}</th>
                  </tr>
                ) : (
                  <tr>
                    <th style={{ width: 30 }}><input type="checkbox" checked={selectedReqs.length === paginatedList.length && paginatedList.length > 0} onChange={() => selectedReqs.length === paginatedList.length ? setSelectedReqs([]) : setSelectedReqs(paginatedList.map(r => r.id))} /></th>
                    <th>{t('req_col_id')}</th>
                    <th style={{ width: 80 }}>{t('req_col_type')}</th>
                    <th>{t('req_col_customer')}</th>
                    <th>{t('req_col_product_category')}</th>
                    <th>{t('req_col_supplier')}</th>
                    <th>{t('req_col_quantity')}</th>
                    <th>{t('req_col_status')}</th>
                    <th>{t('req_col_date')}</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {paginatedList.length === 0 ? (
                  <tr>
                    <td colSpan={10} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>
                      {t('req_empty_table')}
                    </td>
                  </tr>
                ) : paginatedList.map(req => {
                  const isSelected = selectedReqs.includes(req.id);
                  if (req.type === 'order') {
                    const o = req as OrderRequest;
                    return (
                      <tr key={o.id} className={isSelected ? 'selected' : ''}>
                        <td><input type="checkbox" checked={isSelected} onChange={() => setSelectedReqs(prev => prev.includes(o.id) ? prev.filter(x => x !== o.id) : [...prev, o.id])} /></td>
                        <td>
                          <span className="wp-row-title" style={{ fontFamily: 'monospace' }}>#{o.id}</span>
                          <div className="wp-row-actions">
                            <button onClick={() => openDetail(o.id)}>{t('req_action_view')}</button>
                            <span className="sep">|</span>
                            <button onClick={() => toggleOrderStatus(o.id)}>{t('req_action_edit_status')}</button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => { if(confirm(t('req_detail_confirm_delete'))) deleteRequest(o.id); }}>{t('req_action_delete')}</button>
                          </div>
                        </td>
                        {reqType === 'all' && (
                          <td>
                            <span className="wp-badge wp-badge-published">{t('req_type_order')}</span>
                          </td>
                        )}
                        <td style={{ fontWeight: 600 }}>{o.customerName}</td>
                        {reqType === 'all' ? (
                          <>
                            <td>{o.productName}</td>
                            <td>{o.supplierName}</td>
                            <td>{o.quantity} {o.unit}</td>
                            <td>
                              <span className={`wp-badge ${o.status === 'processed' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                                {o.status === 'processed' ? t('req_status_processed') : t('req_status_pending')}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td><a href={`mailto:${o.email}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{o.email}</a></td>
                            <td>{o.phone}</td>
                            <td>{o.productName}</td>
                            <td>{o.supplierName}</td>
                            <td>{o.quantity} {o.unit}</td>
                            <td>
                              <span className={`wp-badge ${o.status === 'processed' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                                {o.status === 'processed' ? t('req_status_processed') : t('req_status_pending')}
                              </span>
                            </td>
                          </>
                        )}
                        <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{fmtDate(o.createdAt)}</td>
                      </tr>
                    );
                  } else {
                    const r = req as RFQRequest;
                    const isProcessed = r.suppliers.some(s => s.status === 'processed');
                    return (
                      <tr key={r.id} className={isSelected ? 'selected' : ''}>
                        <td><input type="checkbox" checked={isSelected} onChange={() => setSelectedReqs(prev => prev.includes(r.id) ? prev.filter(x => x !== r.id) : [...prev, r.id])} /></td>
                        <td>
                          <span className="wp-row-title" style={{ fontFamily: 'monospace' }}>#{r.id}</span>
                          <div className="wp-row-actions">
                            <button onClick={() => openDetail(r.id)}>{t('req_action_view')}</button>
                            <span className="sep">|</span>
                            <button className="delete" onClick={() => { if(confirm(t('req_detail_confirm_delete'))) deleteRequest(r.id); }}>{t('req_action_delete')}</button>
                          </div>
                        </td>
                        {reqType === 'all' && (
                          <td>
                            <span className="wp-badge wp-badge-draft">{t('req_type_rfq')}</span>
                          </td>
                        )}
                        <td style={{ fontWeight: 600 }}>{r.customerName}</td>
                        {reqType === 'all' ? (
                          <>
                            <td>{r.category}</td>
                            <td>{r.suppliers.length} {t('req_suppliers_unit')}</td>
                            <td>{r.quantity} {r.unit}</td>
                            <td>
                              <span className={`wp-badge ${isProcessed ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                                {isProcessed ? t('req_status_processed') : t('req_status_pending')}
                              </span>
                            </td>
                          </>
                        ) : (
                          <>
                            <td><a href={`mailto:${r.email}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{r.email}</a></td>
                            <td>{r.phone}</td>
                            <td>{r.category}</td>
                            <td>{r.quantity} {r.unit}</td>
                            <td><strong>{r.suppliers.length}</strong> {t('req_suppliers_business')}</td>
                            <td>
                              {t('req_progress_label')} <strong>{r.suppliers.filter(s => s.status === 'processed').length}/{r.suppliers.length}</strong>
                            </td>
                          </>
                        )}
                        <td style={{ fontSize: 12, color: 'var(--wp-text-muted)', whiteSpace: 'nowrap' }}>{fmtDate(r.createdAt)}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', fontSize: 12, color: 'var(--wp-text-muted)' }}>
              <span>{t('req_items_range', { from: (page - 1) * perPage + 1, to: Math.min(page * perPage, reqType === 'all' ? combinedRequests.length : reqType === 'order' ? filteredOrders.length : filteredRfqs.length), total: reqType === 'all' ? combinedRequests.length : reqType === 'order' ? filteredOrders.length : filteredRfqs.length })}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className="wp-btn"
                    style={{ padding: '2px 8px', background: page === i + 1 ? 'var(--wp-accent)' : undefined, color: page === i + 1 ? '#fff' : undefined, border: page === i + 1 ? 'none' : undefined }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* ═══ TAB 2: Khách hàng ═══ */}
      {tab === 'customers' && (
        <>
          <h1 className="wp-page-title">{t('req_customers_page_title')}</h1>
          <div className="wp-table-top">
            <div></div>
            <div className="wp-table-search">
              <input
                type="text"
                placeholder={t('req_search_customer_placeholder')}
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
              />
              <button className="wp-btn"><Search size={14} /> {t('req_search_btn')}</button>
            </div>
          </div>

          <div className="wp-table-wrap">
            <table className="wp-table">
              <thead>
                <tr>
                  <th>{t('req_col_customer')}</th>
                  <th>{t('req_col_company')}</th>
                  <th>{t('req_col_email')}</th>
                  <th>{t('req_col_phone')}</th>
                  <th>{t('req_col_total_requests')}</th>
                  <th>{t('req_col_order_count')}</th>
                  <th>{t('req_col_rfq_count')}</th>
                  <th>{t('req_col_last_sent')}</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>
                      {t('req_empty_customers')}
                    </td>
                  </tr>
                ) : customers.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <tr key={c.email}>
                    <td>
                      <span className="wp-row-title" style={{ color: 'var(--wp-accent)', cursor: 'pointer' }} onClick={() => setSelectedCustomerEmail(c.email)}>
                        {c.name}
                      </span>
                      <div className="wp-row-actions">
                        <button onClick={() => setSelectedCustomerEmail(c.email)}>{t('req_action_view_profile')}</button>
                        <span className="sep">|</span>
                        <button onClick={handleExportExcel}>{t('req_action_export_excel')}</button>
                      </div>
                    </td>
                    <td>{c.company}</td>
                    <td><a href={`mailto:${c.email}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none' }}>{c.email}</a></td>
                    <td>{c.phone}</td>
                    <td><strong>{c.total}</strong></td>
                    <td>{c.orders}</td>
                    <td>{c.rfqs}</td>
                    <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{fmtDate(c.lastDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
