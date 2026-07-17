import React, { useState, useMemo } from 'react';
import { SEOHead } from '../components/SEOHead';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { Search, MapPin, Briefcase, Clock, DollarSign, Calendar, X, CheckCircle, FileText, Send, Building } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { careersDb, CareerJob } from '../utils/careersDb';
import { CustomSelect } from '../components/CustomSelect';

export function Careers() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'en' ? 'en' : 'vi';

  const allJobs = useMemo(() => careersDb.getOpenJobs(), []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedLoc, setSelectedLoc] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<CareerJob | null>(null);
  const [applyingJob, setApplyingJob] = useState<CareerJob | null>(null);
  const [appSuccess, setAppSuccess] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cvLink, setCvLink] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = useMemo(() => [...new Set(allJobs.map(j => j.department))], [allJobs]);
  const locations = useMemo(() => [...new Set(allJobs.map(j => j.location))], [allJobs]);
  const types = useMemo(() => [...new Set(allJobs.map(j => j.type))], [allJobs]);

  const filtered = useMemo(() => allJobs.filter(job => {
    const ms = !searchTerm.trim() || job.title[lang].toLowerCase().includes(searchTerm.toLowerCase()) || job.shortDescription[lang].toLowerCase().includes(searchTerm.toLowerCase());
    return ms && (!selectedDept || job.department === selectedDept) && (!selectedLoc || job.location === selectedLoc) && (!selectedType || job.type === selectedType);
  }), [allJobs, searchTerm, selectedDept, selectedLoc, selectedType, lang]);

  const perPage = 5;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleApply = (job: CareerJob, e: React.MouseEvent) => {
    e.stopPropagation();
    setApplyingJob(job);
    setAppSuccess(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phone.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAppSuccess(true);
      setFullName(''); setEmail(''); setPhone(''); setCvLink(''); setCoverLetter('');
    }, 1200);
  };

  const loc = (vi: string, en: string) => lang === 'en' ? en : vi;

  return (
    <div className="bg-slate-50 min-h-screen text-slate-800 antialiased font-sans">
      <SEOHead title={loc("Tuyển dụng - VIEProduct", "Careers - VIEProduct B2B Trade")} description={loc("Cơ hội nghề nghiệp tại VIEProduct", "Join us in building the future of global B2B trade.")} keywords="careers, jobs, vieproduct, tuyen dung" canonical="/careers" />

      <BreadcrumbBar items={[{ label: t('careers') }]} />

      {/* Hero */}
      <section className="bg-white border-b border-slate-200 py-10 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900 tracking-tight">{loc('Cơ hội nghề nghiệp', 'Careers')}</h1>
          <p className="mt-2 text-slate-600 text-base max-w-xl">{loc('Đồng hành cùng chúng tôi kiến tạo tương lai của giao thương B2B toàn cầu.', 'Join us in building the future of global B2B trade.')}</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8">
        {/* Filter */}
        <div className="bg-white border border-slate-200 rounded-md p-4 mb-8 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" placeholder={loc('Tìm kiếm vị trí...', 'Search jobs...')} value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <CustomSelect
              value={selectedDept}
              onChange={(v) => { setSelectedDept(v); setCurrentPage(1); }}
              placeholder={loc('Tất cả phòng ban', 'All Departments')}
              options={[{ value: '', label: loc('Tất cả phòng ban', 'All Departments') }, ...departments.map(d => ({ value: d, label: d }))]}
            />
            <CustomSelect
              value={selectedLoc}
              onChange={(v) => { setSelectedLoc(v); setCurrentPage(1); }}
              placeholder={loc('Tất cả địa điểm', 'All Locations')}
              options={[{ value: '', label: loc('Tất cả địa điểm', 'All Locations') }, ...locations.map(l => ({ value: l, label: l }))]}
            />
            <CustomSelect
              value={selectedType}
              onChange={(v) => { setSelectedType(v); setCurrentPage(1); }}
              placeholder={loc('Mọi hình thức', 'All Types')}
              options={[{ value: '', label: loc('Mọi hình thức', 'All Types') }, ...types.map(tp => ({ value: tp, label: tp }))]}
            />
          </div>
        </div>

        {/* Job List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-md py-12 text-center text-slate-500">{loc('Không tìm thấy vị trí phù hợp.', 'No job vacancies found.')}</div>
          ) : paged.map(job => (
            <div key={job.id} onClick={() => setSelectedJob(job)} className="bg-white border border-slate-200 rounded-md p-5 hover:border-slate-300 transition duration-150 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold text-slate-900 hover:text-primary transition">{job.title[lang]}</h3>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-medium text-slate-700"><Building size={13} className="text-slate-400" />{job.department}</span>
                  <span className="flex items-center gap-1"><MapPin size={13} className="text-slate-400" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" />{job.type}</span>
                  <span className="flex items-center gap-1"><Briefcase size={13} className="text-slate-400" />{job.experience[lang]}</span>
                  <span className="flex items-center gap-1 text-slate-700 font-medium"><DollarSign size={13} className="text-slate-400" />{job.salary[lang]}</span>
                </div>
                <p className="text-slate-600 text-sm line-clamp-1">{job.shortDescription[lang]}</p>
                <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1"><Calendar size={11} /><span>{loc(`Đăng ${job.postedDate}`, `Posted ${job.postedDate}`)}</span></div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button onClick={(e) => handleApply(job, e)} className="flex-1 md:flex-none px-4 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/95 transition shadow-sm">{loc('Ứng tuyển', 'Apply Now')}</button>
                <button className="flex-1 md:flex-none px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded transition" onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}>{loc('Chi tiết', 'Details')}</button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 mt-8 pt-4">
            <span className="text-xs text-slate-500">{loc(`Trang ${currentPage} / ${totalPages}`, `Page ${currentPage} of ${totalPages}`)}</span>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition">{loc('Trước', 'Previous')}</button>
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-3 py-1.5 border border-slate-200 rounded text-xs font-semibold bg-white text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition">{loc('Sau', 'Next')}</button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-start gap-4">
              <div>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{selectedJob.department}</span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{selectedJob.title[lang]}</h3>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-2">
                  <span>{selectedJob.location}</span><span>•</span><span>{selectedJob.type}</span><span>•</span><span>{selectedJob.experience[lang]}</span>
                </div>
              </div>
              <button onClick={() => setSelectedJob(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition"><X size={20} /></button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 leading-relaxed">
              <div><h4 className="font-semibold text-slate-950 mb-2">{loc('Mô tả', 'Description')}</h4><p>{selectedJob.shortDescription[lang]}</p></div>
              {selectedJob.description[lang] && <div><h4 className="font-semibold text-slate-950 mb-2">{loc('Chi tiết công việc', 'Responsibilities')}</h4><pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">{selectedJob.description[lang]}</pre></div>}
              {selectedJob.requirements[lang] && <div><h4 className="font-semibold text-slate-950 mb-2">{loc('Yêu cầu', 'Requirements')}</h4><pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">{selectedJob.requirements[lang]}</pre></div>}
              {selectedJob.benefits[lang] && <div><h4 className="font-semibold text-slate-950 mb-2">{loc('Quyền lợi', 'Benefits')}</h4><pre className="whitespace-pre-wrap font-sans text-sm text-slate-600 leading-relaxed">{selectedJob.benefits[lang]}</pre></div>}
              <div className="bg-slate-50 border border-slate-200 rounded p-4 flex justify-between items-center">
                <div><span className="text-xs text-slate-500 block">{loc('Mức lương', 'Salary')}</span><span className="font-semibold text-slate-900">{selectedJob.salary[lang]}</span></div>
                <div className="text-xs text-slate-400 text-right">{selectedJob.deadline ? loc(`Hạn nộp: ${selectedJob.deadline}`, `Deadline: ${selectedJob.deadline}`) : ''}</div>
              </div>
            </div>
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
              <button onClick={() => setSelectedJob(null)} className="px-4 py-2 border border-slate-200 rounded hover:bg-slate-100 text-slate-700 text-sm font-medium transition">{loc('Đóng', 'Close')}</button>
              <button onClick={(e) => { setSelectedJob(null); handleApply(selectedJob, e); }} className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/95 transition shadow-sm">{loc('Ứng tuyển ngay', 'Apply for this position')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {applyingJob && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-lg max-w-md w-full overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-2"><FileText size={18} className="text-primary" /><span className="font-bold text-slate-900 text-sm">{loc('Ứng tuyển', 'Apply')}</span></div>
              <button onClick={() => setApplyingJob(null)} className="text-slate-400 hover:text-slate-600 transition"><X size={18} /></button>
            </div>
            {appSuccess ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto text-green-600"><CheckCircle size={28} /></div>
                <h4 className="text-lg font-bold text-slate-900">{loc('Ứng tuyển thành công!', 'Application Submitted!')}</h4>
                <p className="text-slate-500 text-sm">{loc('Cảm ơn bạn. Chúng tôi sẽ phản hồi sớm.', 'Thank you. We will get back to you soon.')}</p>
                <button onClick={() => setApplyingJob(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded transition">{loc('Hoàn tất', 'Done')}</button>
              </div>
            ) : (
              <form onSubmit={handleFormSubmit} className="p-5 space-y-4">
                <div className="p-3 bg-primary/5 rounded border border-primary/10 text-xs text-slate-700">
                  {loc('Vị trí:', 'Position:')}<strong className="block text-slate-900 text-sm mt-0.5">{applyingJob.title[lang]}</strong>
                </div>
                <div className="space-y-1"><label className="text-xs font-semibold text-slate-700 block">{loc('Họ và tên *', 'Full Name *')}</label><input required type="text" value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1"><label className="text-xs font-semibold text-slate-700 block">Email *</label><input required type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" /></div>
                  <div className="space-y-1"><label className="text-xs font-semibold text-slate-700 block">{loc('SĐT *', 'Phone *')}</label><input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" /></div>
                </div>
                <div className="space-y-1"><label className="text-xs font-semibold text-slate-700 block">{loc('Link CV *', 'CV URL *')}</label><input required type="url" value={cvLink} onChange={e => setCvLink(e.target.value)} placeholder="https://drive.google.com/..." className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-slate-700 block">{loc('Thư giới thiệu', 'Cover Letter')}</label><textarea rows={3} value={coverLetter} onChange={e => setCoverLetter(e.target.value)} className="w-full px-3 py-2 border border-slate-200 rounded text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition resize-none" /></div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setApplyingJob(null)} className="flex-1 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-medium rounded transition">{loc('Hủy', 'Cancel')}</button>
                  <button type="submit" disabled={isSubmitting} className="flex-1 py-2 bg-primary text-white text-sm font-semibold rounded hover:bg-primary/95 transition disabled:opacity-50 flex items-center justify-center gap-1.5">
                    {isSubmitting ? <span>{loc('Đang nộp...', 'Submitting...')}</span> : <><Send size={14} /><span>{loc('Nộp hồ sơ', 'Submit')}</span></>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
