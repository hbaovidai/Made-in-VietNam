import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { X, Check, ExternalLink, Settings, FileText, ChevronDown, ChevronUp, Image, Tag, Award } from 'lucide-react';
import { api } from '../../../lib/api';

interface CategoryNode {
  id: string;
  name: string;
  parentId?: string;
  children?: CategoryNode[];
}

interface PriceTier {
  id: string;
  minQty: number;
  maxQty: number | null;
  price: number;
}

export function AdminProductApproval() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Loading & error state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Product states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricingMode, setPricingMode] = useState('STANDARD');
  const [activeTab, setActiveTab] = useState<'general' | 'attributes'>('general');

  // Tab Chung
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [stockStatus, setStockStatus] = useState('instock');
  const [unit, setUnit] = useState('cái');
  const [moq, setMoq] = useState('1');

  // Tab Giá số lượng (Tiered Pricing)
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([]);

  // Tab Thuộc tính
  const [productAttributes, setProductAttributes] = useState<any[]>([]);

  // Status & Supplier info
  const [productStatus, setProductStatus] = useState('PENDING');
  const [supplierName, setSupplierName] = useState('');
  const [supplierId, setSupplierId] = useState('');

  // Categories & Brands
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');

  // Images
  const [productImage, setProductImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  // Rejection reason form
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Collapse status of Meta Boxes
  const [collapsedBoxes, setCollapsedBoxes] = useState<Record<string, boolean>>({
    publish: false,
    categories: false,
    image: false,
    gallery: false,
    certifications: false
  });

  useEffect(() => {
    // Load Categories & Brands
    const loadMetadata = async () => {
      try {
        const catRes = await api.get('/categories');
        setCategories(catRes.data || []);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }

      const storedBrands = localStorage.getItem('wp_brands');
      if (storedBrands) {
        try {
          const parsed = JSON.parse(storedBrands);
          setBrands(parsed.map((b: any) => typeof b === 'string' ? b : b.name));
        } catch {
          setBrands(['VIEproduct', 'Trung Nguyên', 'Vinamilk', 'Phúc Long', 'Highlands']);
        }
      } else {
        setBrands(['VIEproduct', 'Trung Nguyên', 'Vinamilk', 'Phúc Long', 'Highlands']);
      }
    };

    loadMetadata();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('mivn5_token');
        const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
        const res = await api.get(`/products/${id}`, authHeaders);
        const found = res.data;

        if (!found) {
          setError('Không tìm thấy sản phẩm hoặc bạn không có quyền kiểm duyệt sản phẩm này.');
          setLoading(false);
          return;
        }

        // Fill state
        setName(found.name || '');
        setDescription(found.description || '');
        setPricingMode(found.pricingMode || 'STANDARD');
        setRegularPrice(found.minPrice?.toString() || '');
        setSalePrice(found.maxPrice?.toString() || '');
        setUnit(found.unit || 'cái');
        setMoq(found.moq?.toString() || '1');
        setStockStatus(found.stockStatus || 'instock');
        setShortDesc(found.shortDesc || '');
        setProductStatus(found.status || 'PENDING');

        if (found.supplier) {
          setSupplierName(found.supplier.companyName || 'Nhà cung cấp chưa xác thực');
          setSupplierId(found.supplier.id || '');
          setCertifications(found.supplier.certifications || []);
        }

        if (found.priceTiers) {
          setPriceTiers(found.priceTiers);
        }

        if (found.attributes) {
          try {
            const parsedAttrs = typeof found.attributes === 'string' ? JSON.parse(found.attributes) : found.attributes;
            setProductAttributes(Array.isArray(parsedAttrs) ? parsedAttrs : []);
          } catch {
            setProductAttributes([]);
          }
        }

        if (found.categoryId) {
          setSelectedCategories([found.categoryId]);
        }

        if (found.brand) {
          setSelectedBrand(found.brand);
        }

        if (found.images && found.images.length > 0) {
          setProductImage(found.images[0]);
          setGallery(found.images.slice(1));
        }
      } catch (err: any) {
        console.error('Failed to load product details:', err);
        setError('Không thể tải chi tiết sản phẩm. Vui lòng kiểm tra lại kết nối.');
      }
      setLoading(false);
    };

    fetchProductDetails();
  }, [id]);

  const toggleBoxCollapse = (boxKey: string) => {
    setCollapsedBoxes(prev => ({ ...prev, [boxKey]: !prev[boxKey] }));
  };

  const handleApprove = async () => {
    if (!window.confirm('Bạn có chắc chắn muốn phê duyệt sản phẩm này lên sàn thương mại điện tử?')) return;
    setActionLoading(true);
    try {
      const token = localStorage.getItem('mivn5_token');
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/products/${id}/verify`, { status: 'ACTIVE' }, authHeaders);
      alert('Sản phẩm đã được phê duyệt thành công!');
      navigate('/dashboard/admin/products');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi phê duyệt sản phẩm.');
    }
    setActionLoading(false);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert('Vui lòng nhập lý do từ chối kiểm duyệt.');
      return;
    }
    setActionLoading(true);
    try {
      const token = localStorage.getItem('mivn5_token');
      const authHeaders = { headers: { Authorization: `Bearer ${token}` } };
      await api.put(`/products/${id}/verify`, { status: 'REJECTED', reason: rejectReason.trim() }, authHeaders);
      alert('Đã từ chối kiểm duyệt sản phẩm thành công!');
      navigate('/dashboard/admin/products');
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi từ chối sản phẩm.');
    }
    setActionLoading(false);
  };

  const renderCategoryTreeReadOnly = () => {
    const roots = categories.filter(c => !c.parentId);
    return roots.map(root => {
      const children = categories.filter(c => c.parentId === root.id);
      const isChecked = selectedCategories.includes(root.id);

      return (
        <div key={root.id} style={{ marginBottom: 4 }}>
          <label className="wp-category-tree-item" style={{ opacity: isChecked ? 1 : 0.5, cursor: 'not-allowed' }}>
            <input
              type="checkbox"
              checked={isChecked}
              disabled
            />
            <span>{root.name}</span>
          </label>
          {children.length > 0 && (
            <div className="wp-category-tree-child">
              {children.map(child => {
                const isChildChecked = selectedCategories.includes(child.id);
                return (
                  <label key={child.id} className="wp-category-tree-item" style={{ opacity: isChildChecked ? 1 : 0.5, cursor: 'not-allowed' }}>
                    <input
                      type="checkbox"
                      checked={isChildChecked}
                      disabled
                    />
                    <span>{child.name}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      );
    });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
        <div style={{ color: 'var(--wp-text-muted)', fontSize: 15 }}>Đang tải dữ liệu sản phẩm kiểm duyệt...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: '#fdf2f2', border: '1px solid #f8b4b4', padding: 20, borderRadius: 6, margin: '20px auto', maxWidth: 600 }}>
        <h3 style={{ color: 'var(--wp-danger)', fontWeight: 600, marginBottom: 8 }}>Đã xảy ra lỗi</h3>
        <p style={{ fontSize: 14, color: '#333' }}>{error}</p>
        <button onClick={() => navigate('/dashboard/admin/products')} className="wp-btn" style={{ marginTop: 12 }}>
          Quay lại danh sách sản phẩm
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="wp-page-header">
        <h1 className="wp-page-title">Kiểm duyệt sản phẩm: <span style={{ color: '#2271b1' }}>{name}</span></h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24, alignItems: 'start' }}>
        {/* ================= LEFT COLUMN (70%) ================= */}
        <div>
          {/* Tên sản phẩm */}
          <div className="wp-card" style={{ marginBottom: 20 }}>
            <div className="wp-card-body" style={{ padding: 16 }}>
              <label style={{ display: 'block', fontSize: 12, color: 'var(--wp-text-muted)', marginBottom: 6, fontWeight: 600 }}>TÊN SẢN PHẨM</label>
              <input
                className="wp-form-input"
                style={{
                  maxWidth: '100%',
                  fontSize: 18,
                  fontWeight: 600,
                  padding: '8px 12px',
                  background: '#f9f9f9',
                  border: '1px solid var(--wp-border-light)',
                  lineHeight: '1.4',
                  boxSizing: 'border-box',
                  cursor: 'not-allowed'
                }}
                value={name}
                disabled
              />
            </div>
          </div>

          {/* Trình soạn thảo mô tả sản phẩm (Read-only) */}
          <div className="wp-card" style={{ marginBottom: 20 }}>
            <div style={{ background: '#f6f7f7', borderBottom: '1px solid var(--wp-border-light)', padding: '10px 16px' }}>
              <span className="wp-card-title" style={{ fontSize: 13, fontWeight: 600 }}>Mô tả sản phẩm</span>
            </div>
            <div className="wp-card-body" style={{ padding: 16 }}>
              <div
                style={{
                  padding: 16,
                  border: '1px solid var(--wp-border-light)',
                  borderRadius: 4,
                  background: '#fcfcfc',
                  minHeight: 150,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#333',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {description || 'Không có mô tả sản phẩm.'}
              </div>
            </div>
          </div>

          {/* Khối Dữ liệu sản phẩm */}
          <div className="wp-card" style={{ marginBottom: 20 }}>
            <div className="wp-card-header" style={{ background: '#f6f7f7', borderBottom: '1px solid var(--wp-border-light)' }}>
              <span className="wp-card-title" style={{ fontSize: 13, fontWeight: 600 }}>
                Thông tin bán hàng
              </span>
            </div>
            <div className="wp-card-body" style={{ padding: 20 }}>
              <table className="wp-form-table">
                <tbody>
                  <tr>
                    <th style={{ width: 150, fontSize: 13, verticalAlign: 'top', paddingTop: 8 }}>Giá bán</th>
                    <td>
                      {pricingMode === 'CONTACT' ? (
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--wp-text-muted)' }}>
                          Giá liên hệ (RFQ)
                        </span>
                      ) : pricingMode === 'TIERED' ? (
                        <div>
                          <span style={{ fontSize: 12, color: 'var(--wp-text-muted)', display: 'block', marginBottom: 6 }}>
                            Giá sỉ theo số lượng (Tiered Pricing):
                          </span>
                          {priceTiers.length === 0 ? (
                            <span style={{ fontSize: 13, color: 'var(--wp-text-muted)', fontStyle: 'italic' }}>
                              Chưa thiết lập giá sỉ theo số lượng.
                            </span>
                          ) : (
                            <table style={{ width: '100%', maxWidth: 400, borderCollapse: 'collapse', border: '1px solid var(--wp-border-light)', borderRadius: 4 }}>
                              <thead>
                                <tr style={{ background: '#f6f7f7', borderBottom: '1px solid var(--wp-border-light)' }}>
                                  <th style={{ padding: '6px 10px', fontSize: 12, textAlign: 'left', fontWeight: 600 }}>Số lượng</th>
                                  <th style={{ padding: '6px 10px', fontSize: 12, textAlign: 'left', fontWeight: 600 }}>Đơn giá</th>
                                </tr>
                              </thead>
                              <tbody>
                                {priceTiers.map(tier => (
                                  <tr key={tier.id} style={{ borderBottom: '1px solid #f0f0f1' }}>
                                    <td style={{ padding: '6px 10px', fontSize: 13 }}>
                                      Từ {tier.minQty} {tier.maxQty ? `đến ${tier.maxQty}` : 'trở lên'} {unit}
                                    </td>
                                    <td style={{ padding: '6px 10px', fontSize: 13, fontWeight: 600, color: '#2271b1' }}>
                                      {tier.price.toLocaleString()} ₫
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      ) : (
                        <strong style={{ fontSize: 14, color: '#2271b1' }}>{Number(regularPrice || 0).toLocaleString()} ₫</strong>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: 13 }}>{t('don_vi_tinh')}</th>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{unit}</span>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ fontSize: 13 }}>MOQ (Đặt hàng tối thiểu)</th>
                    <td>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>{moq} {unit}</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN (30% - META BOXES) ================= */}
        <div>
          {/* Approval Widget */}
          <div className="wp-metabox" style={{ border: '1px solid #ccd0d4', boxShadow: '0 1px 1px rgba(0,0,0,.04)' }}>
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('publish')} style={{ cursor: 'pointer', background: '#f6f7f7', borderBottom: '1px solid #ccd0d4' }}>
              <span style={{ fontWeight: 600 }}>Xử lý phê duyệt</span>
              {collapsedBoxes.publish ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.publish && (
              <div className="wp-metabox-body" style={{ padding: 16 }}>
                {/* Dòng 1: Trạng thái duyệt */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: 'var(--wp-text-muted)' }}>Trạng thái:</span>
                  <span style={{
                    display: 'inline-block',
                    padding: '3px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    background: productStatus === 'PENDING' ? '#fef7e0' : productStatus === 'ACTIVE' ? '#e6f4ea' : productStatus === 'REJECTED' ? '#fce8e6' : '#f1f3f4',
                    color: productStatus === 'PENDING' ? '#b06000' : productStatus === 'ACTIVE' ? '#137333' : productStatus === 'REJECTED' ? '#c5221f' : '#5f6368',
                  }}>
                    {productStatus === 'PENDING' ? 'Chờ duyệt' : productStatus === 'ACTIVE' ? 'Đã duyệt' : productStatus === 'REJECTED' ? 'Từ chối' : 'Bản nháp'}
                  </span>
                </div>

                {/* Dòng 2: Nhà cung cấp */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderTop: '1px solid #eee', paddingTop: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--wp-text-muted)' }}>Nhà cung cấp:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={supplierName}>
                      {supplierName || 'VIEproduct Supplier'}
                    </span>
                    {supplierId && (
                      <a
                        href={`/dashboard/admin/suppliers/verified?id=${supplierId}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#2271b1', display: 'inline-flex', alignItems: 'center' }}
                      >
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>

                {/* Phê duyệt & Từ chối buttons */}
                {productStatus === 'PENDING' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                    {!showRejectForm ? (
                      <>
                        <button
                          type="button"
                          className="wp-btn wp-btn-primary"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            background: '#137333',
                            borderColor: '#137333',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            fontWeight: 600,
                            borderRadius: 4,
                            cursor: actionLoading ? 'not-allowed' : 'pointer'
                          }}
                          onClick={handleApprove}
                          disabled={actionLoading}
                        >
                          <Check size={16} />
                          <span>Phê duyệt</span>
                        </button>
                        <button
                          type="button"
                          className="wp-btn"
                          style={{
                            width: '100%',
                            justifyContent: 'center',
                            background: '#c5221f',
                            borderColor: '#c5221f',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            fontWeight: 600,
                            borderRadius: 4,
                            cursor: actionLoading ? 'not-allowed' : 'pointer'
                          }}
                          onClick={() => setShowRejectForm(true)}
                          disabled={actionLoading}
                        >
                          <X size={16} />
                          <span>Từ chối</span>
                        </button>
                      </>
                    ) : (
                      <div style={{ background: '#fcfcfc', border: '1px solid #ccd0d4', borderRadius: 4, padding: 12 }}>
                        <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 6 }}>LÝ DO TỪ CHỐI</label>
                        <textarea
                          rows={4}
                          className="wp-form-input"
                          style={{ fontSize: 13, width: '100%', boxSizing: 'border-box', marginBottom: 10 }}
                          placeholder="Nhập lý do gửi đến nhà cung cấp..."
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            className="wp-btn"
                            style={{
                              flex: 1,
                              background: '#c5221f',
                              color: '#fff',
                              justifyContent: 'center',
                              fontSize: 12,
                              padding: '5px 10px',
                              cursor: actionLoading ? 'not-allowed' : 'pointer'
                            }}
                            onClick={handleReject}
                            disabled={actionLoading}
                          >
                            Xác nhận từ chối
                          </button>
                          <button
                            type="button"
                            className="wp-btn"
                            style={{ flex: 1, justifyContent: 'center', fontSize: 12, padding: '5px 10px' }}
                            onClick={() => setShowRejectForm(false)}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {productStatus !== 'PENDING' && (
                  <div style={{ fontSize: 13, color: '#666', background: '#f9f9f9', padding: 10, borderRadius: 4, textAlign: 'center' }}>
                    Sản phẩm này đã được xử lý kiểm duyệt.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Danh mục sản phẩm (Read-only) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('categories')} style={{ cursor: 'pointer' }}>
              <span>Danh mục sản phẩm</span>
              {collapsedBoxes.categories ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.categories && (
              <div className="wp-metabox-body">
                <div className="wp-category-tree" style={{ pointerEvents: 'none' }}>
                  {renderCategoryTreeReadOnly()}
                </div>
              </div>
            )}
          </div>

          {/* Chứng chỉ sản phẩm (Read-only) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('certifications')} style={{ cursor: 'pointer' }}>
              <span>Chứng chỉ nhà cung cấp</span>
              {collapsedBoxes.certifications ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.certifications && (
              <div className="wp-metabox-body" style={{ padding: 12 }}>
                {certifications.length === 0 ? (
                  <div style={{ color: 'var(--wp-text-muted)', fontSize: 13, textAlign: 'center', padding: 16 }}>
                    Nhà cung cấp chưa đăng tải chứng chỉ nào.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {certifications.map((cert: any, i: number) => (
                      <div key={cert.id || i} style={{ border: '1px solid var(--wp-border-light)', borderRadius: 4, padding: '10px 12px', background: '#f9f9f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Award size={16} style={{ color: '#137333', flexShrink: 0 }} />
                          <span style={{ fontSize: 13, fontWeight: 600, color: '#333' }}>{cert.name}</span>
                        </div>
                        {cert.issuedBy && (
                          <div style={{ fontSize: 12, color: '#666', marginLeft: 22 }}>
                            Cấp bởi: <strong>{cert.issuedBy}</strong>
                          </div>
                        )}
                        {cert.documentUrl && (
                          <div style={{ marginTop: 6, marginLeft: 22 }}>
                            <a
                              href={cert.documentUrl}
                              target="_blank"
                              rel="noreferrer"
                              style={{ color: '#2271b1', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            >
                              <ExternalLink size={12} />
                              <span>Xem tài liệu chứng chỉ</span>
                            </a>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ảnh sản phẩm (Read-only) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('image')} style={{ cursor: 'pointer' }}>
              <span>Ảnh đại diện</span>
              {collapsedBoxes.image ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.image && (
              <div className="wp-metabox-body">
                {!productImage ? (
                  <div style={{ color: 'var(--wp-text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                    Sản phẩm không có ảnh đại diện.
                  </div>
                ) : (
                  <div className="wp-image-preview-container">
                    <img src={productImage} alt="Product preview" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Thư viện hình ảnh sản phẩm (Read-only) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('gallery')} style={{ cursor: 'pointer' }}>
              <span>Thư viện hình ảnh</span>
              {collapsedBoxes.gallery ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.gallery && (
              <div className="wp-metabox-body">
                {gallery.length === 0 ? (
                  <div style={{ color: 'var(--wp-text-muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>
                    Thư viện ảnh trống.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                    {gallery.map((img, i) => (
                      <div key={i} className="wp-image-preview-container" style={{ aspectRatio: '1/1' }}>
                        <div style={{ width: '100%', height: '100%', background: `url(${img}) center/cover` }} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
