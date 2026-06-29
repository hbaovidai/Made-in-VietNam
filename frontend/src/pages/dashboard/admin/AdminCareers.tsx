import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, Plus, Eye, X, Briefcase } from 'lucide-react';
import { careersDb, CareerJob } from '../../../utils/careersDb';
import { ConfirmDialog } from '../../../components/ui/Modal';

const DEPARTMENTS = ['Engineering', 'Product Management', 'Sales & Marketing', 'Customer Success', 'Operations'];
const LOCATIONS = ['Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Remote'];
const TYPES: CareerJob['type'][] = ['Full-time', 'Part-time', 'Remote', 'Hybrid', 'Internship'];
const STATUSES: CareerJob['status'][] = ['DRAFT', 'OPEN', 'CLOSED'];

const generateSlug = (text: string) =>
  text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd').replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');

const emptyForm = (): Omit<CareerJob, 'id'> => ({
  slug: '', title: { vi: '', en: '' }, department: 'Engineering', location: 'Hanoi',
  type: 'Full-time', experience: { vi: '', en: '' }, salary: { vi: '', en: '' },
  shortDescription: { vi: '', en: '' }, description: { vi: '', en: '' },
  requirements: { vi: '', en: '' }, benefits: { vi: '', en: '' },
  postedDate: new Date().toISOString().split('T')[0], deadline: '',
  status: 'DRAFT', order: 1,
});

export function AdminCareers() {
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterLoc, setFilterLoc] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<CareerJob, 'id'>>(emptyForm());
  const [slugManual, setSlugManual] = useState(false);
  const [slugError, setSlugError] = useState('');
  const [previewJob, setPreviewJob] = useState<CareerJob | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ isOpen: boolean; job: CareerJob | null }>({ isOpen: false, job: null });
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setJobs(careersDb.getJobs()); }, []);

  const save = (updated: CareerJob[]) => { setJobs(updated); careersDb.saveJobs(updated); };

  const filtered = jobs.filter(j => {
    const ms = !search || j.title.vi.toLowerCase().includes(search.toLowerCase()) || j.title.en.toLowerCase().includes(search.toLowerCase());
    return ms && (!filterDept || j.department === filterDept) && (!filterLoc || j.location === filterLoc)
      && (!filterType || j.type === filterType) && (!filterStatus || j.status === filterStatus);
  });

  const openAdd = () => {
    setEditingId(null); setForm(emptyForm()); setSlugManual(false); setSlugError('');
    setIsModalOpen(true); setTimeout(() => titleRef.current?.focus(), 100);
  };

  const openEdit = (job: CareerJob) => {
    setEditingId(job.id);
    const { id: _, ...rest } = job; // eslint-disable-line @typescript-eslint/no-unused-vars
    setForm(rest); setSlugManual(true); setSlugError(''); setIsModalOpen(true);
  };

  const handleTitleViChange = (val: string) => {
    setForm(prev => ({ ...prev, title: { ...prev.title, vi: val } }));
    if (!slugManual) setForm(prev => ({ ...prev, slug: generateSlug(val) }));
  };

  const handleSlugChange = (val: string) => {
    setSlugManual(true); setForm(prev => ({ ...prev, slug: val }));
    const unique = careersDb.isSlugUnique(val, editingId || undefined);
    setSlugError(unique ? '' : 'Slug đã tồn tại, vui lòng chọn slug khác.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.vi.trim() || !form.title.en.trim() || !form.slug.trim()) return;
    if (slugError) return;
    const jobData: CareerJob = { id: editingId || `job-${Date.now()}`, ...form };
    let updated: CareerJob[];
    if (editingId) { updated = jobs.map(j => j.id === editingId ? jobData : j); }
    else { updated = [...jobs, jobData]; }
    save(updated.sort((a, b) => a.order - b.order));
    setIsModalOpen(false);
  };

  const handleToggleStatus = (job: CareerJob) => {
    const next = job.status === 'OPEN' ? 'CLOSED' : 'OPEN';
    save(jobs.map(j => j.id === job.id ? { ...j, status: next } : j));
  };

  const handleDelete = () => {
    if (!confirmDelete.job) return;
    save(jobs.filter(j => j.id !== confirmDelete.job!.id));
    setConfirmDelete({ isOpen: false, job: null });
  };

  const statusBadge = (s: string) => {
    const cls = s === 'OPEN' ? 'wp-badge-published' : s === 'CLOSED' ? 'wp-badge-rejected' : 'wp-badge-draft';
    const label = s === 'OPEN' ? 'Đang tuyển' : s === 'CLOSED' ? 'Đã đóng' : 'Bản nháp';
    return <span className={`wp-badge ${cls}`}>{label}</span>;
  };

  /* ─── Field helper for the modal form ─── */
  const Field = ({ label, children, desc }: { label: string; children: React.ReactNode; desc?: string }) => (
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#1d2327', marginBottom: 4 }}>{label}</label>
      {children}
      {desc && <p className="wp-form-desc">{desc}</p>}
    </div>
  );

  const inputCls = "wp-form-input";

  return (
    <div>
      {/* Breadcrumb */}
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">Quản lý tuyển dụng</span>
      </div>

      <div className="wp-page-header">
        <h1 className="wp-page-title">
          Quản lý tuyển dụng
          <button className="wp-page-title-btn" onClick={openAdd}><Plus size={14} /> Thêm vị trí</button>
        </h1>
      </div>
      <p style={{ fontSize: 12, color: '#646970', marginTop: -12, marginBottom: 16 }}>
        Quản lý các vị trí tuyển dụng hiển thị trên trang Careers.
      </p>

      {/* Filter bar */}
      <div className="wp-table-top">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <select className="wp-bulk-select" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
            <option value="">Tất cả phòng ban</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <select className="wp-bulk-select" value={filterLoc} onChange={e => setFilterLoc(e.target.value)}>
            <option value="">Tất cả địa điểm</option>
            {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
          <select className="wp-bulk-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
            <option value="">Tất cả hình thức</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select className="wp-bulk-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            <option value="OPEN">Đang tuyển</option>
            <option value="CLOSED">Đã đóng</option>
            <option value="DRAFT">Bản nháp</option>
          </select>
        </div>
        <div className="wp-table-search">
          <input type="text" placeholder="Tìm theo tiêu đề..." value={search} onChange={e => setSearch(e.target.value)} />
          <button className="wp-btn"><Search size={14} /> Tìm</button>
        </div>
      </div>

      {/* Table */}
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th>Tiêu đề</th>
              <th style={{ width: 120 }}>Phòng ban</th>
              <th style={{ width: 110 }}>Địa điểm</th>
              <th style={{ width: 90 }}>Hình thức</th>
              <th style={{ width: 100 }}>Kinh nghiệm</th>
              <th style={{ width: 120 }}>Mức lương</th>
              <th style={{ width: 90, textAlign: 'center' }}>Trạng thái</th>
              <th style={{ width: 90 }}>Ngày đăng</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: 40, color: '#646970' }}>Không tìm thấy vị trí tuyển dụng nào.</td></tr>
            ) : filtered.map(job => (
              <tr key={job.id}>
                <td>
                  <div>
                    <a href="#" onClick={e => { e.preventDefault(); openEdit(job); }} className="wp-row-title" style={{ textDecoration: 'none' }}>
                      {job.title.vi}
                    </a>
                    <div style={{ fontSize: 11, color: '#646970', marginTop: 1 }}>{job.title.en}</div>
                    <div className="wp-row-actions">
                      <a href="#" onClick={e => { e.preventDefault(); openEdit(job); }}>Sửa</a>
                      <span className="sep">|</span>
                      <button type="button" onClick={() => handleToggleStatus(job)}>
                        {job.status === 'OPEN' ? 'Đóng tuyển' : 'Mở tuyển'}
                      </button>
                      <span className="sep">|</span>
                      <button type="button" onClick={() => setPreviewJob(job)}>Xem trước</button>
                      <span className="sep">|</span>
                      <button type="button" className="delete" onClick={() => setConfirmDelete({ isOpen: true, job })}>Xoá</button>
                    </div>
                  </div>
                </td>
                <td style={{ fontSize: 12 }}>{job.department}</td>
                <td style={{ fontSize: 12 }}>{job.location}</td>
                <td style={{ fontSize: 12 }}>{job.type}</td>
                <td style={{ fontSize: 12, color: '#646970' }}>{job.experience.vi}</td>
                <td style={{ fontSize: 12, color: '#646970' }}>{job.salary.vi}</td>
                <td style={{ textAlign: 'center' }}>{statusBadge(job.status)}</td>
                <td style={{ fontSize: 12, color: '#646970', fontFamily: 'monospace' }}>{job.postedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ─── Add/Edit Modal ─── */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setIsModalOpen(false)} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 6, width: '95%', maxWidth: 780, maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>
            {/* Header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #dcdcde', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{editingId ? 'Sửa vị trí tuyển dụng' : 'Thêm vị trí tuyển dụng mới'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#646970' }}><X size={18} /></button>
            </div>
            {/* Body */}
            <form onSubmit={handleSubmit} style={{ overflow: 'auto', padding: 20, flex: 1 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Tiêu đề VI *">
                  <input ref={titleRef} required className={inputCls} value={form.title.vi} onChange={e => handleTitleViChange(e.target.value)} />
                </Field>
                <Field label="Tiêu đề EN *">
                  <input required className={inputCls} value={form.title.en} onChange={e => setForm(p => ({ ...p, title: { ...p.title, en: e.target.value } }))} />
                </Field>
              </div>

              <Field label="Slug *" desc={slugError || 'Đường dẫn URL thân thiện, tự sinh từ tiêu đề VI.'}>
                <input required className={inputCls} value={form.slug} onChange={e => handleSlugChange(e.target.value)}
                  style={slugError ? { borderColor: '#d63638' } : undefined} />
              </Field>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <Field label="Phòng ban">
                  <select className={inputCls} value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </Field>
                <Field label="Địa điểm">
                  <select className={inputCls} value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}>
                    {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>
                <Field label="Hình thức">
                  <select className={inputCls} value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as CareerJob['type'] }))}>
                    {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Kinh nghiệm (VI)"><input className={inputCls} value={form.experience.vi} onChange={e => setForm(p => ({ ...p, experience: { ...p.experience, vi: e.target.value } }))} placeholder="3+ năm" /></Field>
                <Field label="Kinh nghiệm (EN)"><input className={inputCls} value={form.experience.en} onChange={e => setForm(p => ({ ...p, experience: { ...p.experience, en: e.target.value } }))} placeholder="3+ years" /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Mức lương (VI)"><input className={inputCls} value={form.salary.vi} onChange={e => setForm(p => ({ ...p, salary: { ...p.salary, vi: e.target.value } }))} /></Field>
                <Field label="Mức lương (EN)"><input className={inputCls} value={form.salary.en} onChange={e => setForm(p => ({ ...p, salary: { ...p.salary, en: e.target.value } }))} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Mô tả ngắn (VI)"><textarea className={inputCls} rows={2} value={form.shortDescription.vi} onChange={e => setForm(p => ({ ...p, shortDescription: { ...p.shortDescription, vi: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
                <Field label="Mô tả ngắn (EN)"><textarea className={inputCls} rows={2} value={form.shortDescription.en} onChange={e => setForm(p => ({ ...p, shortDescription: { ...p.shortDescription, en: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Mô tả công việc (VI)" desc="Mỗi mục trên 1 dòng, bắt đầu bằng •"><textarea className={inputCls} rows={4} value={form.description.vi} onChange={e => setForm(p => ({ ...p, description: { ...p.description, vi: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
                <Field label="Job Description (EN)"><textarea className={inputCls} rows={4} value={form.description.en} onChange={e => setForm(p => ({ ...p, description: { ...p.description, en: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Yêu cầu (VI)"><textarea className={inputCls} rows={4} value={form.requirements.vi} onChange={e => setForm(p => ({ ...p, requirements: { ...p.requirements, vi: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
                <Field label="Requirements (EN)"><textarea className={inputCls} rows={4} value={form.requirements.en} onChange={e => setForm(p => ({ ...p, requirements: { ...p.requirements, en: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Field label="Quyền lợi (VI)"><textarea className={inputCls} rows={3} value={form.benefits.vi} onChange={e => setForm(p => ({ ...p, benefits: { ...p.benefits, vi: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
                <Field label="Benefits (EN)"><textarea className={inputCls} rows={3} value={form.benefits.en} onChange={e => setForm(p => ({ ...p, benefits: { ...p.benefits, en: e.target.value } }))} style={{ maxWidth: '100%' }} /></Field>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 16 }}>
                <Field label="Ngày đăng"><input type="date" className={inputCls} value={form.postedDate} onChange={e => setForm(p => ({ ...p, postedDate: e.target.value }))} /></Field>
                <Field label="Hạn nộp"><input type="date" className={inputCls} value={form.deadline} onChange={e => setForm(p => ({ ...p, deadline: e.target.value }))} /></Field>
                <Field label="Trạng thái">
                  <select className={inputCls} value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value as CareerJob['status'] }))}>
                    {STATUSES.map(s => <option key={s} value={s}>{s === 'OPEN' ? 'Đang tuyển' : s === 'CLOSED' ? 'Đã đóng' : 'Bản nháp'}</option>)}
                  </select>
                </Field>
                <Field label="Thứ tự"><input type="number" className={inputCls} min={1} value={form.order} onChange={e => setForm(p => ({ ...p, order: parseInt(e.target.value) || 1 }))} /></Field>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 16, justifyContent: 'flex-end', borderTop: '1px solid #dcdcde', paddingTop: 16 }}>
                <button type="button" className="wp-btn" onClick={() => setIsModalOpen(false)}>Huỷ</button>
                <button type="submit" className="wp-btn wp-btn-primary" disabled={!!slugError}>
                  {editingId ? 'Cập nhật' : 'Thêm vị trí'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Preview Modal ─── */}
      {previewJob && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div style={{ position: 'absolute', inset: 0 }} onClick={() => setPreviewJob(null)} />
          <div style={{ position: 'relative', background: '#fff', borderRadius: 6, width: '95%', maxWidth: 640, maxHeight: '85vh', display: 'flex', flexDirection: 'column', boxShadow: '0 8px 32px rgba(0,0,0,.2)' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #dcdcde', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><Eye size={16} color="#2271b1" /><span style={{ fontWeight: 600, fontSize: 14 }}>Xem trước</span></div>
              <button onClick={() => setPreviewJob(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#646970' }}><X size={18} /></button>
            </div>
            <div style={{ overflow: 'auto', padding: 20, fontSize: 13 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>{previewJob.title.vi}</h3>
              <p style={{ fontSize: 12, color: '#646970', margin: '0 0 12px' }}>{previewJob.title.en}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, color: '#1d2327', marginBottom: 16 }}>
                <span><Briefcase size={12} style={{ verticalAlign: -1 }} /> {previewJob.department}</span>
                <span>📍 {previewJob.location}</span>
                <span>⏰ {previewJob.type}</span>
                <span>💼 {previewJob.experience.vi}</span>
                <span>💰 {previewJob.salary.vi}</span>
              </div>
              {previewJob.shortDescription.vi && <p style={{ color: '#444', marginBottom: 16 }}>{previewJob.shortDescription.vi}</p>}
              {previewJob.description.vi && <><h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Mô tả công việc</h4><pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#444', lineHeight: 1.6, marginBottom: 16, fontFamily: 'inherit' }}>{previewJob.description.vi}</pre></>}
              {previewJob.requirements.vi && <><h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Yêu cầu</h4><pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#444', lineHeight: 1.6, marginBottom: 16, fontFamily: 'inherit' }}>{previewJob.requirements.vi}</pre></>}
              {previewJob.benefits.vi && <><h4 style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Quyền lợi</h4><pre style={{ whiteSpace: 'pre-wrap', fontSize: 12, color: '#444', lineHeight: 1.6, fontFamily: 'inherit' }}>{previewJob.benefits.vi}</pre></>}
              {previewJob.deadline && <p style={{ fontSize: 11, color: '#646970', marginTop: 16 }}>Hạn nộp: {previewJob.deadline}</p>}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, job: null })}
        onConfirm={handleDelete}
        title="Xoá vị trí tuyển dụng"
        message={`Bạn có chắc chắn muốn xoá vị trí "${confirmDelete.job?.title.vi}"?`}
        confirmText="Xoá"
        variant="danger"
      />
    </div>
  );
}
