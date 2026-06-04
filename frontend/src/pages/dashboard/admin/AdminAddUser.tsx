import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../lib/api';
import { Eye, EyeOff } from 'lucide-react';

export function AdminAddUser() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    fullName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'BUYER' as 'ADMIN' | 'SUPPLIER' | 'BUYER',
    companyName: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate
    if (!form.email.trim()) { setError('Email là bắt buộc.'); return; }
    if (!form.fullName.trim()) { setError('Họ và tên là bắt buộc.'); return; }
    if (!form.password) { setError('Mật khẩu là bắt buộc.'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự.'); return; }
    if (form.password !== form.confirmPassword) { setError('Mật khẩu xác nhận không khớp.'); return; }
    if (form.role === 'SUPPLIER' && !form.companyName.trim()) { setError('Tên doanh nghiệp là bắt buộc cho vai trò Doanh nghiệp.'); return; }

    setLoading(true);
    try {
      await api.post('/auth/register', {
        email: form.email,
        fullName: form.fullName,
        phone: form.phone || undefined,
        password: form.password,
        role: form.role,
        companyName: form.role === 'SUPPLIER' ? form.companyName : undefined,
      });
      setSuccess(true);
      // Reset form
      setForm({ email: '', fullName: '', phone: '', password: '', confirmPassword: '', role: 'BUYER', companyName: '' });
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Không thể tạo người dùng.';
      setError(typeof msg === 'string' ? msg : JSON.stringify(msg));
    }
    setLoading(false);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <Link to="/dashboard/admin/users">Users</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Thêm người dùng</span>
      </div>

      <h1 className="wp-page-title">Thêm người dùng mới</h1>

      <p style={{ color: 'var(--wp-text-muted)', fontSize: 13, marginBottom: 20 }}>
        Tạo tài khoản mới cho người dùng. Người dùng sẽ nhận thông tin đăng nhập qua email.
      </p>

      {success && (
        <div style={{ background: '#d1e4dd', border: '1px solid #00a32a', padding: '12px 16px', marginBottom: 20, borderRadius: 4, fontSize: 13 }}>
          <strong>Thành công!</strong> Người dùng mới đã được tạo.{' '}
          <Link to="/dashboard/admin/users" style={{ color: 'var(--wp-accent)' }}>← Quay lại danh sách</Link>
          {' '}hoặc{' '}
          <button onClick={() => setSuccess(false)} style={{ color: 'var(--wp-accent)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline', padding: 0 }}>
            tạo thêm người dùng khác
          </button>
        </div>
      )}

      {error && (
        <div style={{ background: '#fcf0f1', border: '1px solid var(--wp-danger)', padding: '12px 16px', marginBottom: 20, borderRadius: 4, fontSize: 13, color: 'var(--wp-danger)' }}>
          <strong>Lỗi:</strong> {error}
        </div>
      )}

      <div className="wp-card" style={{ maxWidth: 700 }}>
        <div className="wp-card-body">
          <form onSubmit={handleSubmit}>
            <table className="wp-form-table">
              <tbody>
                {/* Email */}
                <tr>
                  <th style={{ width: 180, fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                    <label>Email <span style={{ color: 'var(--wp-danger)' }}>*</span></label>
                  </th>
                  <td>
                    <input
                      type="email"
                      className="wp-form-input"
                      style={{ maxWidth: 400 }}
                      value={form.email}
                      onChange={e => handleChange('email', e.target.value)}
                      placeholder="user@example.com"
                      required
                    />
                  </td>
                </tr>

                {/* Full Name */}
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                    <label>Họ và tên <span style={{ color: 'var(--wp-danger)' }}>*</span></label>
                  </th>
                  <td>
                    <input
                      type="text"
                      className="wp-form-input"
                      style={{ maxWidth: 400 }}
                      value={form.fullName}
                      onChange={e => handleChange('fullName', e.target.value)}
                      placeholder="Nguyễn Văn A"
                      required
                    />
                  </td>
                </tr>

                {/* Phone */}
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                    <label>Số điện thoại</label>
                  </th>
                  <td>
                    <input
                      type="tel"
                      className="wp-form-input"
                      style={{ maxWidth: 400 }}
                      value={form.phone}
                      onChange={e => handleChange('phone', e.target.value)}
                      placeholder="0901234567"
                    />
                  </td>
                </tr>

                {/* Password */}
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                    <label>Mật khẩu <span style={{ color: 'var(--wp-danger)' }}>*</span></label>
                  </th>
                  <td>
                    <div style={{ position: 'relative', maxWidth: 400 }}>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="wp-form-input"
                        style={{ maxWidth: '100%', paddingRight: 36 }}
                        value={form.password}
                        onChange={e => handleChange('password', e.target.value)}
                        placeholder="Tối thiểu 6 ký tự"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-text-muted)' }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <p className="wp-form-desc">Mật khẩu phải có ít nhất 6 ký tự.</p>
                  </td>
                </tr>

                {/* Confirm Password */}
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                    <label>Xác nhận mật khẩu <span style={{ color: 'var(--wp-danger)' }}>*</span></label>
                  </th>
                  <td>
                    <div style={{ position: 'relative', maxWidth: 400 }}>
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="wp-form-input"
                        style={{ maxWidth: '100%', paddingRight: 36 }}
                        value={form.confirmPassword}
                        onChange={e => handleChange('confirmPassword', e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--wp-text-muted)' }}
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Role */}
                <tr>
                  <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                    <label>Vai trò <span style={{ color: 'var(--wp-danger)' }}>*</span></label>
                  </th>
                  <td>
                    <select
                      className="wp-bulk-select"
                      style={{ width: 250 }}
                      value={form.role}
                      onChange={e => handleChange('role', e.target.value)}
                    >
                      <option value="BUYER">Khách hàng (Customer)</option>
                      <option value="SUPPLIER">Doanh nghiệp (Business)</option>
                      <option value="ADMIN">Quản trị viên (Administrator)</option>
                    </select>
                    <p className="wp-form-desc">
                      {form.role === 'ADMIN' && 'Quản trị viên có toàn quyền quản lý hệ thống.'}
                      {form.role === 'SUPPLIER' && 'Doanh nghiệp có thể đăng sản phẩm và quản lý đơn hàng.'}
                      {form.role === 'BUYER' && 'Khách hàng có thể duyệt sản phẩm và gửi yêu cầu báo giá.'}
                    </p>
                  </td>
                </tr>

                {/* Company Name - only show for SUPPLIER */}
                {form.role === 'SUPPLIER' && (
                  <tr>
                    <th style={{ fontSize: 13, verticalAlign: 'top', paddingTop: 12 }}>
                      <label>Tên doanh nghiệp <span style={{ color: 'var(--wp-danger)' }}>*</span></label>
                    </th>
                    <td>
                      <input
                        type="text"
                        className="wp-form-input"
                        style={{ maxWidth: 400 }}
                        value={form.companyName}
                        onChange={e => handleChange('companyName', e.target.value)}
                        placeholder="Tên công ty/doanh nghiệp"
                        required
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ borderTop: '1px solid var(--wp-border-light)', paddingTop: 16, marginTop: 16 }}>
              <button
                type="submit"
                className="wp-btn wp-btn-primary"
                disabled={loading}
                style={{ fontSize: 13 }}
              >
                {loading ? 'Đang tạo...' : 'Thêm người dùng'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
