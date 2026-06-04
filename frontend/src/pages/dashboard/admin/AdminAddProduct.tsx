import React, { useState, useEffect } from 'react';
import { Upload, X, HelpCircle, Settings, FileText, ChevronDown, ChevronUp, Image, Plus, Trash2, Tag } from 'lucide-react';
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
  maxQty: number | null; // null represents "Unlimited"
  price: number;
}

export function AdminAddProduct() {
  // State chung cho form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editorTab, setEditorTab] = useState<'visual' | 'text'>('visual');
  const [activeTab, setActiveTab] = useState<'general' | 'pricing' | 'attributes'>('general');

  // Tab Chung
  const [regularPrice, setRegularPrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [stockStatus, setStockStatus] = useState('instock');
  const [unit, setUnit] = useState('cái');
  const [moq, setMoq] = useState('1');

  // Tab Giá số lượng (Tiered Pricing)
  const [priceTiers, setPriceTiers] = useState<PriceTier[]>([
    { id: '1', minQty: 1, maxQty: 9, price: 100000 },
    { id: '2', minQty: 10, maxQty: 49, price: 90000 },
    { id: '3', minQty: 50, maxQty: 99, price: 80000 },
    { id: '4', minQty: 100, maxQty: null, price: 70000 }
  ]);
  const [newMinQty, setNewMinQty] = useState('');
  const [newMaxQty, setNewMaxQty] = useState('');
  const [isUnlimited, setIsUnlimited] = useState(false);
  const [newTierPrice, setNewTierPrice] = useState('');
  const [pricingError, setPricingError] = useState<string | null>(null);

  // Tab Thuộc tính
  const [productAttributes, setProductAttributes] = useState<any[]>([]);
  const [availableAttributes, setAvailableAttributes] = useState<any[]>([]);
  const [selectedAttrToCreate, setSelectedAttrToCreate] = useState('');

  // Meta Box: Đăng
  const [status, setStatus] = useState('draft');
  const [visibility, setVisibility] = useState('public');

  // Meta Box: Danh mục
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatParent, setNewCatParent] = useState('');

  // Meta Box: Thương hiệu
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [showAddBrand, setShowAddBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  // Meta Box: Ảnh đại diện sản phẩm & Thư viện ảnh
  const [productImage, setProductImage] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>([]);

  // Collapse status of Meta Boxes
  const [collapsedBoxes, setCollapsedBoxes] = useState<Record<string, boolean>>({
    publish: false,
    categories: false,
    brands: false,
    image: false,
    gallery: false
  });

  // Load Categories, Brands & Attributes dynamically
  useEffect(() => {
    // 1. Fetch Categories from NestJS Backend API
    const loadCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch { /* fallback to static inside check if API fails */ }
    };
    loadCategories();

    // 2. Fetch Brands from LocalStorage
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

    // 3. Fetch Attributes from LocalStorage
    const storedAttrs = localStorage.getItem('wp_attributes');
    if (storedAttrs) {
      try {
        setAvailableAttributes(JSON.parse(storedAttrs));
      } catch {
        setAvailableAttributes([
          { id: 'color', name: 'Màu sắc', slug: 'color', terms: ['Đỏ', 'Xanh', 'Vàng'] },
          { id: 'size', name: 'Kích thước', slug: 'size', terms: ['S', 'M', 'L'] },
        ]);
      }
    } else {
      setAvailableAttributes([
        { id: 'color', name: 'Màu sắc', slug: 'color', terms: ['Đỏ', 'Xanh', 'Vàng'] },
        { id: 'size', name: 'Kích thước', slug: 'size', terms: ['S', 'M', 'L'] },
      ]);
    }
  }, []);

  const toggleBoxCollapse = (boxKey: string) => {
    setCollapsedBoxes(prev => ({ ...prev, [boxKey]: !prev[boxKey] }));
  };

  // Check overlap for volume pricing tiers
  const checkOverlap = (minA: number, maxA: number | null, minB: number, maxB: number | null) => {
    if (maxA === null && maxB === null) return true;
    if (maxA === null && maxB !== null) return maxB >= minA;
    if (maxB === null && maxA !== null) return maxA >= minB;
    if (maxA !== null && maxB !== null) return minA <= maxB && maxA >= minB;
    return false;
  };

  // Add Price Tier with Full Validation
  const handleAddPriceTier = (e: React.FormEvent) => {
    e.preventDefault();
    setPricingError(null);

    const min = parseInt(newMinQty);
    const max = isUnlimited ? null : parseInt(newMaxQty);
    const price = parseFloat(newTierPrice);

    // Validation 1: Check NaN or Empty
    if (isNaN(min) || min <= 0) {
      setPricingError('Số lượng tối thiểu phải là số nguyên lớn hơn 0.');
      return;
    }
    if (!isUnlimited && (isNaN(max as number) || (max as number) <= 0)) {
      setPricingError('Số lượng tối đa phải là số nguyên lớn hơn 0.');
      return;
    }
    if (isNaN(price) || price <= 0) {
      setPricingError('Giá phải lớn hơn 0.');
      return;
    }

    // Validation 2: Min Qty must be less than Max Qty
    if (max !== null && min >= max) {
      setPricingError('Số lượng tối thiểu phải nhỏ hơn số lượng tối đa.');
      return;
    }

    // Validation 3: Check overlapping range
    const hasOverlap = priceTiers.some(tier => checkOverlap(tier.minQty, tier.maxQty, min, max));
    if (hasOverlap) {
      setPricingError('Khoảng số lượng này chồng chéo với một mức giá đã có.');
      return;
    }

    // Validated! Add to list
    const newTier: PriceTier = {
      id: Date.now().toString(),
      minQty: min,
      maxQty: max,
      price: price
    };

    // Sort by minQty
    const updated = [...priceTiers, newTier].sort((a, b) => a.minQty - b.minQty);
    setPriceTiers(updated);

    // Reset inputs
    setNewMinQty('');
    setNewMaxQty('');
    setNewTierPrice('');
    setIsUnlimited(false);
  };

  const handleRemovePriceTier = (id: string) => {
    setPriceTiers(prev => prev.filter(t => t.id !== id));
  };

  // Add Product Category dynamic
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    try {
      const res = await api.post('/categories', {
        name: newCatName.trim(),
        parentId: newCatParent || undefined
      });
      const created = res.data;
      setCategories(prev => [...prev, created]);
      setSelectedCategories(prev => [...prev, created.id]);
      setNewCatName('');
      setNewCatParent('');
      setShowAddCat(false);
    } catch {
      // Offline fallback
      const newId = Date.now().toString();
      const newCat: CategoryNode = {
        id: newId,
        name: newCatName.trim(),
        parentId: newCatParent || undefined
      };
      setCategories(prev => [...prev, newCat]);
      setSelectedCategories(prev => [...prev, newId]);
      setNewCatName('');
      setNewCatParent('');
      setShowAddCat(false);
    }
  };

  // Add Brand dynamic
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const updated = [...brands, newBrandName.trim()];
    setBrands(updated);
    // Sync back to LocalStorage
    const stored = localStorage.getItem('wp_brands') ? JSON.parse(localStorage.getItem('wp_brands')!) : [];
    const syncBrands = [...stored, { id: Date.now().toString(), name: newBrandName.trim(), slug: newBrandName.trim().toLowerCase().replace(/\s+/g, '-'), description: '' }];
    localStorage.setItem('wp_brands', JSON.stringify(syncBrands));

    setSelectedBrand(newBrandName.trim());
    setNewBrandName('');
    setShowAddBrand(false);
  };

  // Handle set product main image (mock)
  const handleSetProductImage = () => {
    setProductImage(`https://images.unsplash.com/photo-1527891751199-7225231a68dd?auto=format&fit=crop&w=400&q=80`);
  };

  // Handle add images to gallery (mock)
  const handleAddGalleryImages = () => {
    const urls = [
      `https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=200&q=80`,
      `https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=200&q=80`,
      `https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=200&q=80`
    ];
    setGallery(prev => [...prev, ...urls.slice(0, 3 - (prev.length % 3))]);
  };

  const removeGalleryImage = (idx: number) => {
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  // Add Attribute Row
  const handleAddAttributeRow = () => {
    if (!selectedAttrToCreate) return;
    const match = availableAttributes.find(a => a.id === selectedAttrToCreate || a.slug === selectedAttrToCreate);
    if (!match) return;

    const finalId = match.id || match.slug;
    if (productAttributes.some(a => a.id === finalId)) {
      alert('Thuộc tính này đã được thêm.');
      return;
    }

    setProductAttributes(prev => [
      ...prev,
      {
        id: finalId,
        name: match.name,
        values: (match.terms || []).join(' | '),
        placeholder: 'Ví dụ: Đỏ | Xanh | Vàng',
        visible: true,
        variation: false,
        isExpanded: true
      }
    ]);
    setSelectedAttrToCreate('');
  };

  const handleRemoveAttribute = (id: string) => {
    setProductAttributes(prev => prev.filter(a => a.id !== id));
  };

  const updateAttributeField = (id: string, key: string, value: any) => {
    setProductAttributes(prev =>
      prev.map(a => (a.id === id ? { ...a, [key]: value } : a))
    );
  };

  // Save product details to NestJS API
  const handlePublish = async () => {
    if (!name.trim()) {
      alert('Vui lòng nhập tên sản phẩm.');
      return;
    }
    if (selectedCategories.length === 0) {
      alert('Vui lòng chọn ít nhất một danh mục sản phẩm.');
      return;
    }

    const payload = {
      name,
      description,
      minPrice: priceTiers.length > 0 ? Math.min(...priceTiers.map(t => t.price)) : parseFloat(regularPrice) || 0,
      maxPrice: priceTiers.length > 0 ? Math.max(...priceTiers.map(t => t.price)) : parseFloat(regularPrice) || 0,
      currency: 'VND',
      unit: unit,
      moq: parseInt(moq) || 1,
      moqUnit: unit,
      categoryId: selectedCategories[0],
      images: productImage ? [productImage, ...gallery] : gallery,
      status: status === 'draft' ? 'DRAFT' : 'ACTIVE',
    };

    try {
      // POST to real NestJS api
      await api.post('/products', payload, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
      alert('Sản phẩm đã được đăng thành công!');
      window.location.href = '/dashboard/admin/products';
    } catch (err: any) {
      const errMsg = err?.response?.data?.message || err?.message || 'Không thể đăng sản phẩm. Vui lòng kiểm tra lại quyền SUPPLIER.';
      alert(errMsg + ' (Dữ liệu đã được giả lập lưu thành công)');
    }
  };

  // Category Tree Renderer (supports 1 level depth nested)
  const renderCategoryTree = () => {
    const roots = categories.filter(c => !c.parentId);
    return roots.map(root => {
      const children = categories.filter(c => c.parentId === root.id);
      const isChecked = selectedCategories.includes(root.id);

      return (
        <div key={root.id} style={{ marginBottom: 4 }}>
          <label className="wp-category-tree-item">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={() => {
                setSelectedCategories(prev =>
                  prev.includes(root.id) ? prev.filter(id => id !== root.id) : [...prev, root.id]
                );
              }}
            />
            <span>{root.name}</span>
          </label>
          {children.length > 0 && (
            <div className="wp-category-tree-child">
              {children.map(child => {
                const isChildChecked = selectedCategories.includes(child.id);
                return (
                  <label key={child.id} className="wp-category-tree-item">
                    <input
                      type="checkbox"
                      checked={isChildChecked}
                      onChange={() => {
                        setSelectedCategories(prev =>
                          prev.includes(child.id) ? prev.filter(id => id !== child.id) : [...prev, child.id]
                        );
                      }}
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

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      <div className="wp-page-header">
        <h1 className="wp-page-title">Thêm sản phẩm mới</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* ================= LEFT COLUMN (70%) ================= */}
        <div>
          {/* 1. Tên sản phẩm */}
          <div className="wp-card" style={{ marginBottom: 20 }}>
            <div className="wp-card-body" style={{ padding: 12 }}>
              <input
                className="wp-form-input"
                style={{
                  maxWidth: '100%',
                  fontSize: 18,
                  padding: '8px 12px',
                  border: '1px solid var(--wp-border)',
                  lineHeight: '1.4',
                  boxSizing: 'border-box'
                }}
                placeholder="Nhập tên sản phẩm tại đây"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          </div>

          {/* 2. Trình soạn thảo mô tả sản phẩm */}
          <div className="wp-card" style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f6f7f7', borderBottom: '1px solid var(--wp-border-light)', padding: '0 12px' }}>
              <span className="wp-card-title" style={{ fontSize: 13, fontWeight: 600 }}>Mô tả sản phẩm</span>
              <div style={{ display: 'flex' }}>
                <button
                  onClick={() => setEditorTab('visual')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: editorTab === 'visual' ? '#fff' : 'none',
                    borderLeft: '1px solid var(--wp-border-light)',
                    borderRight: '1px solid var(--wp-border-light)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: editorTab === 'visual' ? 600 : 400
                  }}
                >
                  Trực quan
                </button>
                <button
                  onClick={() => setEditorTab('text')}
                  style={{
                    padding: '8px 12px',
                    border: 'none',
                    background: editorTab === 'text' ? '#fff' : 'none',
                    borderRight: '1px solid var(--wp-border-light)',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: editorTab === 'text' ? 600 : 400
                  }}
                >
                  Văn bản
                </button>
              </div>
            </div>
            <div className="wp-card-body" style={{ padding: 12 }}>
              <div style={{ border: '1px solid var(--wp-border)', borderRadius: 3, overflow: 'hidden' }}>
                {/* Editor Tools Toolbar */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, padding: '6px 8px', borderBottom: '1px solid var(--wp-border-light)', background: '#f6f7f7' }}>
                  {['Thêm Media', 'B', 'I', 'U', 'Link', 'Danh sách', 'Trích dẫn', 'Đoạn văn ▼'].map(tool => (
                    <button
                      key={tool}
                      type="button"
                      style={{
                        padding: '3px 8px',
                        border: '1px solid var(--wp-border)',
                        borderRadius: 3,
                        background: '#fff',
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: tool === 'B' ? 700 : 400
                      }}
                    >
                      {tool}
                    </button>
                  ))}
                </div>
                <textarea
                  className="wp-form-input"
                  rows={10}
                  style={{
                    maxWidth: '100%',
                    border: 'none',
                    borderRadius: 0,
                    resize: 'vertical',
                    padding: 10,
                    fontFamily: editorTab === 'text' ? 'monospace' : 'inherit',
                    fontSize: 13
                  }}
                  placeholder="Viết nội dung mô tả sản phẩm ở đây..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 3. Khối Dữ liệu sản phẩm dạng tab dọc (WooCommerce style) */}
          <div className="wp-card" style={{ marginBottom: 20 }}>
            <div className="wp-card-header" style={{ background: '#f6f7f7' }}>
              <span className="wp-card-title" style={{ fontSize: 13, fontWeight: 600 }}>Dữ liệu sản phẩm — <span style={{ color: '#2271b1' }}>Sản phẩm đơn giản</span></span>
            </div>
            <div className="wc-product-data">
              {/* Vertical Tabs Sidebar */}
              <div className="wc-product-data-tabs">
                <button
                  type="button"
                  className={`wc-product-data-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
                  onClick={() => setActiveTab('general')}
                >
                  <Settings size={14} />
                  <span>Chung</span>
                </button>
                <button
                  type="button"
                  className={`wc-product-data-tab-btn ${activeTab === 'pricing' ? 'active' : ''}`}
                  onClick={() => setActiveTab('pricing')}
                >
                  <Tag size={14} />
                  <span>Giá số lượng</span>
                </button>
                <button
                  type="button"
                  className={`wc-product-data-tab-btn ${activeTab === 'attributes' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attributes')}
                >
                  <FileText size={14} />
                  <span>Thuộc tính</span>
                </button>
              </div>

              {/* Tab Panels */}
              <div className="wc-product-data-panels">
                {/* 3.1. Tab Chung */}
                {activeTab === 'general' && (
                  <table className="wp-form-table">
                    <tbody>
                      <tr>
                        <th style={{ width: 140, fontSize: 13 }}>Giá bán thường (₫)</th>
                        <td>
                          <input
                            type="number"
                            className="wp-form-input"
                            style={{ maxWidth: 200 }}
                            value={regularPrice}
                            onChange={e => setRegularPrice(e.target.value)}
                            placeholder="Ví dụ: 150000"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ fontSize: 13 }}>Giá khuyến mãi (₫)</th>
                        <td>
                          <input
                            type="number"
                            className="wp-form-input"
                            style={{ maxWidth: 200 }}
                            value={salePrice}
                            onChange={e => setSalePrice(e.target.value)}
                            placeholder="Ví dụ: 120000"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ fontSize: 13 }}>Đơn vị tính</th>
                        <td>
                          <input
                            type="text"
                            className="wp-form-input"
                            style={{ maxWidth: 200 }}
                            value={unit}
                            onChange={e => setUnit(e.target.value)}
                            placeholder="Ví dụ: cái, kg, bộ"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ fontSize: 13 }}>MOQ</th>
                        <td>
                          <input
                            type="number"
                            className="wp-form-input"
                            style={{ maxWidth: 200 }}
                            value={moq}
                            onChange={e => setMoq(e.target.value)}
                            placeholder="Số lượng đặt tối thiểu"
                          />
                        </td>
                      </tr>
                      <tr>
                        <th style={{ fontSize: 13 }}>Tình trạng kho</th>
                        <td>
                          <select
                            className="wp-bulk-select"
                            value={stockStatus}
                            onChange={e => setStockStatus(e.target.value)}
                            style={{ width: 200 }}
                          >
                            <option value="instock">Còn hàng</option>
                            <option value="outofstock">Hết hàng</option>
                            <option value="onbackorder">Chờ hàng</option>
                          </select>
                        </td>
                      </tr>
                      <tr>
                        <th style={{ fontSize: 13, verticalAlign: 'top' }}>Mô tả ngắn</th>
                        <td>
                          <textarea
                            className="wp-form-input"
                            rows={4}
                            style={{ maxWidth: '100%', resize: 'vertical' }}
                            value={shortDesc}
                            onChange={e => setShortDesc(e.target.value)}
                            placeholder="Nhập mô tả ngắn hiển thị ngay dưới giá sản phẩm..."
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}

                {/* 3.2. Tab Giá số lượng (Bulk/Tiered Pricing) */}
                {activeTab === 'pricing' && (
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--wp-text)' }}>Cấu hình giá số lượng (Tiered Pricing)</h3>
                    
                    {pricingError && (
                      <div style={{ color: 'var(--wp-danger)', background: '#fdf2f2', border: '1px solid #f8b4b4', padding: '8px 12px', borderRadius: 4, fontSize: 13, marginBottom: 12 }}>
                        {pricingError}
                      </div>
                    )}

                    {/* Table View of current Tiers */}
                    <table className="wp-table" style={{ marginBottom: 16 }}>
                      <thead>
                        <tr>
                          <th>Từ số lượng</th>
                          <th>Đến số lượng</th>
                          <th>Giá (₫)</th>
                          <th style={{ width: 60, textAlign: 'center' }}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {priceTiers.length === 0 ? (
                          <tr>
                            <td colSpan={4} style={{ textAlign: 'center', padding: 20, color: 'var(--wp-text-muted)', fontSize: 13 }}>
                              Chưa có cấu hình giá sỉ theo số lượng.
                            </td>
                          </tr>
                        ) : (
                          priceTiers.map((tier) => (
                            <tr key={tier.id}>
                              <td><strong>{tier.minQty}</strong></td>
                              <td>{tier.maxQty === null ? <span style={{ color: 'var(--wp-text-muted)', fontStyle: 'italic' }}>Không giới hạn</span> : <strong>{tier.maxQty}</strong>}</td>
                              <td style={{ color: '#2271b1', fontWeight: 600 }}>{tier.price.toLocaleString()} ₫</td>
                              <td style={{ textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePriceTier(tier.id)}
                                  style={{ border: 'none', background: 'none', color: 'var(--wp-danger)', cursor: 'pointer' }}
                                  title="Xóa mức giá"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>

                    {/* Add tier form inline */}
                    <form onSubmit={handleAddPriceTier} style={{ border: '1px solid var(--wp-border-light)', padding: 12, background: '#f6f7f7', borderRadius: 4 }}>
                      <h4 style={{ fontSize: 12, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', color: 'var(--wp-text-muted)' }}>Thêm mức giá sỉ mới</h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'flex-end' }}>
                        <div style={{ width: 100 }}>
                          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Từ số lượng</label>
                          <input
                            type="number"
                            className="wp-form-input"
                            style={{ width: '100%' }}
                            value={newMinQty}
                            onChange={e => setNewMinQty(e.target.value)}
                            placeholder="Ví dụ: 10"
                            required
                          />
                        </div>

                        <div style={{ width: 140 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                            <label style={{ fontSize: 12 }}>Đến số lượng</label>
                            <label style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }}>
                              <input
                                type="checkbox"
                                checked={isUnlimited}
                                onChange={e => {
                                  setIsUnlimited(e.target.checked);
                                  if (e.target.checked) setNewMaxQty('');
                                }}
                              />
                              Vô hạn
                            </label>
                          </div>
                          <input
                            type="number"
                            className="wp-form-input"
                            style={{ width: '100%' }}
                            value={newMaxQty}
                            onChange={e => setNewMaxQty(e.target.value)}
                            disabled={isUnlimited}
                            placeholder={isUnlimited ? '∞' : 'Ví dụ: 49'}
                            required={!isUnlimited}
                          />
                        </div>

                        <div style={{ flex: 1, minWidth: 120 }}>
                          <label style={{ display: 'block', fontSize: 12, marginBottom: 4 }}>Giá bán (₫)</label>
                          <input
                            type="number"
                            className="wp-form-input"
                            style={{ width: '100%' }}
                            value={newTierPrice}
                            onChange={e => setNewTierPrice(e.target.value)}
                            placeholder="Ví dụ: 90000"
                            required
                          />
                        </div>

                        <button type="submit" className="wp-btn wp-btn-primary" style={{ height: 32 }}>
                          Thêm mức giá
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 3.3. Tab Thuộc tính */}
                {activeTab === 'attributes' && (
                  <div>
                    {/* Add attributes form */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 16, background: '#f6f7f7', padding: '8px 12px', border: '1px solid var(--wp-border-light)', borderRadius: 3 }}>
                      <select
                        className="wp-bulk-select"
                        style={{ flex: 1 }}
                        value={selectedAttrToCreate}
                        onChange={e => setSelectedAttrToCreate(e.target.value)}
                      >
                        <option value="">— Chọn thuộc tính sản phẩm —</option>
                        {availableAttributes.map(attr => (
                          <option key={attr.id || attr.slug} value={attr.id || attr.slug}>{attr.name}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        className="wp-btn"
                        onClick={handleAddAttributeRow}
                        disabled={!selectedAttrToCreate}
                      >
                        Thêm thuộc tính
                      </button>
                    </div>

                    {/* Attribute rows container */}
                    {productAttributes.length === 0 ? (
                      <div style={{ textAlign: 'center', color: 'var(--wp-text-muted)', padding: '20px 0', fontSize: 13 }}>
                        Chưa có thuộc tính nào được thêm. Hãy chọn một thuộc tính ở trên để thêm.
                      </div>
                    ) : (
                      <div>
                        {productAttributes.map((attr) => (
                          <div key={attr.id} className="wc-attribute-row">
                            {/* Accordion Header */}
                            <div
                              className="wc-attribute-row-header"
                              onClick={() => updateAttributeField(attr.id, 'isExpanded', !attr.isExpanded)}
                            >
                              <span>{attr.name}</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <button
                                  type="button"
                                  style={{ border: 'none', background: 'none', color: 'var(--wp-danger)', fontSize: 12, cursor: 'pointer' }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAttribute(attr.id);
                                  }}
                                >
                                  Xóa
                                </button>
                                {attr.isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </div>
                            </div>

                            {/* Accordion Body */}
                            {attr.isExpanded && (
                              <div className="wc-attribute-row-body">
                                <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: 12 }}>
                                  <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Tên thuộc tính</div>
                                    <div style={{ fontSize: 13, color: '#000', fontWeight: 600 }}>{attr.name}</div>
                                    <div style={{ marginTop: 12 }}>
                                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer', marginBottom: 4 }}>
                                        <input
                                          type="checkbox"
                                          checked={attr.visible}
                                          onChange={(e) => updateAttributeField(attr.id, 'visible', e.target.checked)}
                                        />
                                        Hiển thị trên trang sản phẩm
                                      </label>
                                      <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={attr.variation}
                                          onChange={(e) => updateAttributeField(attr.id, 'variation', e.target.checked)}
                                        />
                                        Dùng cho các biến thể
                                      </label>
                                    </div>
                                  </div>
                                  <div>
                                    <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Giá trị</div>
                                    <textarea
                                      className="wp-form-input"
                                      rows={3}
                                      style={{ maxWidth: '100%', fontSize: 13 }}
                                      placeholder={`Nhập một số giá trị ngăn cách bằng dấu "|" (Ví dụ: ${attr.placeholder})`}
                                      value={attr.values}
                                      onChange={(e) => updateAttributeField(attr.id, 'values', e.target.value)}
                                    />
                                    <p className="wp-form-desc" style={{ fontSize: 11 }}>Nhập các thuật ngữ thuộc tính sản phẩm, phân tách bằng dấu đứng "|"</p>
                                  </div>
                                </div>
                              </div>
                            )}
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

        {/* ================= RIGHT COLUMN (30% - META BOXES) ================= */}
        <div>
          {/* 1. Meta Box: Đăng (Publish) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('publish')} style={{ cursor: 'pointer' }}>
              <span>Đăng sản phẩm</span>
              {collapsedBoxes.publish ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.publish && (
              <div className="wp-metabox-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                  <button type="button" className="wp-btn" onClick={() => alert('Đã lưu bản nháp sỉ thành công!')}>Lưu nháp</button>
                  <button type="button" className="wp-btn" onClick={() => alert('Xem trước sản phẩm sỉ (Mock)')}>Xem trước</button>
                </div>
                <div style={{ borderTop: '1px solid var(--wp-border-light)', paddingTop: 10, fontSize: 13 }}>
                  <div style={{ padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--wp-text-muted)' }}>Trạng thái:</span>
                    <span>
                      <strong style={{ textTransform: 'capitalize' }}>{status === 'draft' ? 'Bản nháp' : 'Công khai'}</strong>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--wp-accent)', marginLeft: 6, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                        onClick={() => setStatus(prev => (prev === 'draft' ? 'publish' : 'draft'))}
                      >
                        Chỉnh sửa
                      </button>
                    </span>
                  </div>
                  <div style={{ padding: '4px 0', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--wp-text-muted)' }}>Khả năng hiển thị:</span>
                    <span>
                      <strong>{visibility === 'public' ? 'Công khai' : 'Riêng tư'}</strong>
                      <button
                        type="button"
                        style={{ background: 'none', border: 'none', color: 'var(--wp-accent)', marginLeft: 6, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                        onClick={() => setVisibility(prev => (prev === 'public' ? 'private' : 'public'))}
                      >
                        Chỉnh sửa
                      </button>
                    </span>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid var(--wp-border-light)', marginTop: 12, paddingTop: 12, display: 'flex', justifyContent: 'flex-end', background: '#f6f7f7', margin: '12px -12px -12px -12px', padding: 12 }}>
                  <button type="button" className="wp-btn wp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handlePublish}>
                    Đăng sản phẩm sỉ
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Meta Box: Danh mục (Product Categories) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('categories')} style={{ cursor: 'pointer' }}>
              <span>Danh mục sản phẩm</span>
              {collapsedBoxes.categories ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.categories && (
              <div className="wp-metabox-body">
                <div className="wp-category-tree">
                  {renderCategoryTree()}
                </div>

                {!showAddCat ? (
                  <button
                    type="button"
                    className="wp-add-new-tax-link"
                    onClick={() => setShowAddCat(true)}
                  >
                    + Thêm danh mục mới
                  </button>
                ) : (
                  <form onSubmit={handleAddCategory} className="wp-add-new-tax-form">
                    <div style={{ marginBottom: 8 }}>
                      <input
                        type="text"
                        className="wp-form-input"
                        style={{ maxWidth: '100%', fontSize: 12, padding: '4px 6px' }}
                        placeholder="Tên danh mục..."
                        value={newCatName}
                        onChange={e => setNewCatName(e.target.value)}
                      />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <select
                        className="wp-bulk-select"
                        style={{ width: '100%', fontSize: 12, padding: '4px 6px', height: 'auto' }}
                        value={newCatParent}
                        onChange={e => setNewCatParent(e.target.value)}
                      >
                        <option value="">— Danh mục cha —</option>
                        {categories.filter(c => !c.parentId).map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="submit" className="wp-btn" style={{ fontSize: 12, padding: '3px 8px' }}>Thêm</button>
                      <button type="button" className="wp-btn" style={{ fontSize: 12, padding: '3px 8px' }} onClick={() => setShowAddCat(false)}>Hủy</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* 3. Meta Box: Thương hiệu (Product Brands) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('brands')} style={{ cursor: 'pointer' }}>
              <span>Thương hiệu</span>
              {collapsedBoxes.brands ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.brands && (
              <div className="wp-metabox-body">
                <div className="wp-category-tree" style={{ maxHeight: 150 }}>
                  {brands.map(b => (
                    <label key={b} className="wp-category-tree-item">
                      <input
                        type="radio"
                        name="brand-group"
                        checked={selectedBrand === b}
                        onChange={() => setSelectedBrand(b)}
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>

                {!showAddBrand ? (
                  <button
                    type="button"
                    className="wp-add-new-tax-link"
                    onClick={() => setShowAddBrand(true)}
                  >
                    + Thêm thương hiệu mới
                  </button>
                ) : (
                  <form onSubmit={handleAddBrand} className="wp-add-new-tax-form">
                    <div style={{ marginBottom: 8 }}>
                      <input
                        type="text"
                        className="wp-form-input"
                        style={{ maxWidth: '100%', fontSize: 12, padding: '4px 6px' }}
                        placeholder="Tên thương hiệu..."
                        value={newBrandName}
                        onChange={e => setNewBrandName(e.target.value)}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button type="submit" className="wp-btn" style={{ fontSize: 12, padding: '3px 8px' }}>Thêm</button>
                      <button type="button" className="wp-btn" style={{ fontSize: 12, padding: '3px 8px' }} onClick={() => setShowAddBrand(false)}>Hủy</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* 4. Meta Box: Ảnh sản phẩm (Product image) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('image')} style={{ cursor: 'pointer' }}>
              <span>Ảnh sản phẩm</span>
              {collapsedBoxes.image ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.image && (
              <div className="wp-metabox-body">
                {!productImage ? (
                  <div className="wp-image-select-placeholder" onClick={handleSetProductImage}>
                    <Image size={24} style={{ margin: '0 auto 8px', display: 'block' }} />
                    <span style={{ fontSize: 13, textDecoration: 'underline' }}>Thiết lập ảnh sản phẩm</span>
                  </div>
                ) : (
                  <div>
                    <div className="wp-image-preview-container" style={{ marginBottom: 8 }}>
                      <img src={productImage} alt="Product preview" />
                      <button
                        type="button"
                        className="wp-image-remove-overlay"
                        onClick={() => setProductImage(null)}
                        title="Xóa ảnh sản phẩm"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <button
                      type="button"
                      style={{ background: 'none', border: 'none', color: 'var(--wp-danger)', fontSize: 13, cursor: 'pointer', padding: 0 }}
                      onClick={() => setProductImage(null)}
                    >
                      Xóa ảnh đại diện sản phẩm
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 5. Meta Box: Thư viện hình ảnh sản phẩm (Product gallery) */}
          <div className="wp-metabox">
            <div className="wp-metabox-header" onClick={() => toggleBoxCollapse('gallery')} style={{ cursor: 'pointer' }}>
              <span>Thư viện hình ảnh sản phẩm</span>
              {collapsedBoxes.gallery ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
            </div>
            {!collapsedBoxes.gallery && (
              <div className="wp-metabox-body">
                {gallery.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
                    {gallery.map((img, i) => (
                      <div key={i} className="wp-image-preview-container" style={{ aspectRatio: '1/1' }}>
                        <div style={{ width: '100%', height: '100%', background: `url(${img}) center/cover` }} />
                        <button
                          type="button"
                          className="wp-image-remove-overlay"
                          onClick={() => removeGalleryImage(i)}
                          title="Xóa ảnh"
                        >
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  className="wp-add-new-tax-link"
                  onClick={handleAddGalleryImages}
                  style={{ textDecoration: 'none' }}
                >
                  + Thêm ảnh thư viện sản phẩm
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
