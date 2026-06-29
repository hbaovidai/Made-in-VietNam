import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../../components/SEOHead';
import { BreadcrumbBar } from '../../components/BreadcrumbBar';
import { List, X, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export interface LegalSection {
  id: string;
  titleVi: string;
  titleEn: string;
  slug: string;
  contentVi: string;
  contentEn: string;
  sortOrder: number;
  isActive: boolean;
}

interface SettingsKeys {
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  lastUpdated: string;
  bannerBg: string;
}

interface LegalPageLayoutProps {
  pageKey: 'terms' | 'privacy';
  breadcrumbLabel: string;
  seoTitle: string;
  seoKeywords: string;
  defaultTitle: string;
  defaultSubtitle: string;
  defaultLastUpdated: string;
  settingsKeys: SettingsKeys;
}

export function LegalPageLayout({
  pageKey,
  breadcrumbLabel,
  seoTitle,
  seoKeywords,
  defaultTitle,
  defaultSubtitle,
  defaultLastUpdated,
  settingsKeys,
}: LegalPageLayoutProps) {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language === 'vi';

  const [settings, setSettings] = useState<Record<string, string>>({});
  const [sections, setSections] = useState<LegalSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    Promise.all([
      api.get('/settings').then((res) => res.data || {}),
      api.get(`/legal-sections?pageKey=${pageKey}`).then((res) => res.data || []),
    ])
      .then(([settingsData, sectionsData]) => {
        setSettings(settingsData);
        setSections(sectionsData);
        if (sectionsData.length > 0) {
          setActiveId(sectionsData[0].slug);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(`Lỗi khi tải dữ liệu trang pháp lý (${pageKey}):`, err);
        setLoading(false);
      });
  }, [pageKey]);

  /* ─── Intersection Observer for active section ──────── */
  useEffect(() => {
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Pick the one closest to the top of viewport
          const sorted = visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          setActiveId(sorted[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -50% 0px', threshold: 0 }
    );

    sections.forEach((sec) => {
      const el = document.getElementById(sec.slug);
      if (el) {
        sectionRefs.current[sec.slug] = el;
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (slug: string) => {
    const el = document.getElementById(slug);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#f8fafc' }}>
        <Loader2 className="animate-spin text-slate-500 mb-3" size={36} />
        <span className="text-slate-500 font-medium">{t('loading') || 'Đang tải...'}</span>
      </div>
    );
  }

  const title = isVi
    ? settings[settingsKeys.titleVi] || defaultTitle
    : settings[settingsKeys.titleEn] || defaultTitle;

  const subtitle = isVi
    ? settings[settingsKeys.subtitleVi] || defaultSubtitle
    : settings[settingsKeys.subtitleEn] || defaultSubtitle;

  const lastUpdated = settings[settingsKeys.lastUpdated] || defaultLastUpdated;
  const bannerBg = settings[settingsKeys.bannerBg] || '';

  return (
    <div className="min-h-screen" style={{ background: '#f8fafc' }}>
      <SEOHead
        title={`${title} - VIEProduct`}
        description={subtitle}
        keywords={seoKeywords}
        canonical={pageKey === 'privacy' ? '/privacy' : '/terms'}
      />

      <BreadcrumbBar items={[{ label: breadcrumbLabel }]} />

      {/* ─── Premium Hero Section ──────────────────────────── */}
      <section
        style={{
          background: bannerBg
            ? `url(${bannerBg}) center center / cover no-repeat`
            : 'linear-gradient(135deg, #003366 0%, #004a8f 50%, #00295a 100%)',
          padding: '64px 0 72px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Dark overlay for readability if custom banner is uploaded */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: bannerBg ? 'rgba(0, 0, 0, 0.45)' : 'transparent',
            zIndex: 1,
          }}
        />

        {/* Radial subtle glow */}
        {!bannerBg && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '40%',
              height: '100%',
              background: 'radial-gradient(circle at 70% 50%, rgba(255,255,255,.05) 0%, transparent 70%)',
              zIndex: 1,
            }}
          />
        )}

        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 48px', position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <h1
            style={{
              fontSize: 'clamp(24px, 4vw, 36px)',
              fontWeight: 800,
              color: '#fff',
              margin: '0 0 14px',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              textShadow: '0 2px 4px rgba(0,0,0,0.15)',
            }}
          >
            {title}
          </h1>
          <p
            style={{
              fontSize: 'clamp(14px, 1.8vw, 16px)',
              color: 'rgba(255,255,255,.85)',
              margin: '0 auto 20px',
              lineHeight: 1.6,
              maxWidth: 800,
            }}
          >
            {subtitle}
          </p>
          <span
            style={{
              display: 'inline-block',
              padding: '6px 16px',
              borderRadius: 20,
              background: 'rgba(255,255,255,.12)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,.2)',
              fontSize: 12,
              color: '#fff',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {(t('last_updated') || 'Cập nhật lần cuối')}: {lastUpdated}
          </span>
        </div>
      </section>

      {/* ─── Wide 2-column layout ──────────────────────────── */}
      <div className="terms-container">
        {/* Mobile TOC Button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md-custom-hide"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '14px 20px',
            marginBottom: 20,
            background: '#fff',
            border: '1px solid #e2e8f0',
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            color: '#0f172a',
            cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        >
          <List size={18} /> {(t('toc_label') || 'Mục lục')}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: '#64748b' }}>
            {mobileOpen ? (t('admin_cancel') || 'Huỷ') : (t('learn_more') || 'Chi tiết')}
          </span>
        </button>

        <div className="terms-grid">
          {/* ─── Sidebar TOC ─────────────────────────────── */}
          <aside className={`terms-sidebar ${mobileOpen ? 'terms-sidebar--open' : ''}`}>
            <div className="sidebar-header">
              <h3 className="sidebar-title">{(t('toc_label') || 'Mục lục')}</h3>
              <button onClick={() => setMobileOpen(false)} className="sidebar-close-btn">
                <X size={18} />
              </button>
            </div>
            <nav style={{ padding: '12px 0' }}>
              {sections.map((sec, idx) => {
                const isActive = activeId === sec.slug;
                const secTitle = isVi ? sec.titleVi : sec.titleEn;
                // Strip prefixes like "Điều 1: " or "1. " to make short sidebar titles
                const shortTitle = secTitle
                  .replace(/^(Điều|Article|ĐIỀU|ARTICLE)\s+\d+:\s*/i, '')
                  .replace(/^\d+[\.\s\-]+/i, '');

                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollTo(sec.slug)}
                    className={`toc-item-btn ${isActive ? 'active' : ''}`}
                  >
                    <span className="toc-number-badge">{idx + 1}</span>
                    <span className="toc-text">{shortTitle}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* ─── Right Content Card ──────────────────────── */}
          <main className="content-card">
            <div className="inner-content-wrapper">
              {sections.map((sec) => {
                const secTitle = isVi ? sec.titleVi : sec.titleEn;
                const secContent = isVi ? sec.contentVi : sec.contentEn;
                return (
                  <section key={sec.id} id={sec.slug} className="terms-content-section">
                    <h2 className="section-heading">{secTitle}</h2>
                    <div className="section-body" dangerouslySetInnerHTML={{ __html: secContent }} />
                  </section>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />}

      {/* ─── Premium Layout CSS Variables & Media Queries ─── */}
      <style>{`
        /* Container styles */
        .terms-container {
          width: 100%;
          max-width: 1520px;
          margin: 0 auto;
          padding: 40px 48px 96px;
          box-sizing: border-box;
        }

        /* 2-column Grid */
        .terms-grid {
          display: grid;
          grid-template-columns: 320px minmax(0, 1fr);
          gap: 40px;
          align-items: start;
        }

        /* Sidebar styles */
        .terms-sidebar {
          position: sticky;
          top: 100px;
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 24px 0;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
          max-height: calc(100vh - 140px);
          overflow-y: auto;
        }
        .sidebar-header {
          padding: 0 24px 16px;
          border-bottom: 1px solid #f1f5f9;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .sidebar-title {
          margin: 0;
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .sidebar-close-btn {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: #64748b;
          padding: 4px;
        }

        /* Sidebar Item Button */
        .toc-item-btn {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          width: 100%;
          text-align: left;
          padding: 10px 24px;
          border: none;
          cursor: pointer;
          background: transparent;
          border-left: 3px solid transparent;
          transition: all 0.2s ease;
          font-size: 13.5px;
          line-height: 1.5;
          color: #475569;
          font-weight: 500;
          box-sizing: border-box;
        }
        .toc-item-btn:hover {
          background: #f8fafc;
          color: #0f172a;
        }
        .toc-item-btn.active {
          background: rgba(0, 51, 102, 0.05);
          border-left-color: #003366;
          color: #003366;
          font-weight: 600;
        }

        /* Number Badge in Sidebar */
        .toc-number-badge {
          min-width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          background: #e2e8f0;
          color: #64748b;
          transition: all 0.2s ease;
        }
        .toc-item-btn.active .toc-number-badge {
          background: #003366;
          color: #fff;
        }

        /* Right Content Card styling */
        .content-card {
          background: #fff;
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 56px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }

        /* Inner Wrapper inside card to guarantee optimal readable width */
        .inner-content-wrapper {
          max-width: 960px;
          margin: 0 auto;
        }

        /* Content Sections */
        .terms-content-section {
          padding-bottom: 40px;
          margin-bottom: 40px;
          border-bottom: 1px solid #f1f5f9;
        }
        .terms-content-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .section-heading {
          font-size: 20px;
          font-weight: 750;
          color: #0f172a;
          margin: 0 0 20px;
          line-height: 1.35;
          letter-spacing: -0.02em;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
        }

        .section-body {
          font-size: 15.5px;
          line-height: 1.8;
          color: #334155;
        }
        
        /* Body tags inside dynamic html */
        .section-body p {
          margin: 0 0 16px;
        }
        .section-body ul, .section-body ol {
          margin: 8px 0 16px;
          padding-left: 20px;
        }
        .section-body li {
          margin-bottom: 8px;
          list-style-type: disc;
        }
        .section-body strong {
          color: #0f172a;
          font-weight: 600;
        }

        /* Responsive controls */
        .md-custom-hide {
          display: none !important;
        }

        @media (max-width: 1024px) {
          .terms-container {
            padding: 24px 24px 64px;
          }
          .terms-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .content-card {
            padding: 24px !important;
          }
          .terms-sidebar {
            position: static !important;
            max-height: none !important;
            box-shadow: none !important;
            border-radius: 12px;
          }
          .sidebar-header {
            display: none !important;
          }
        }

        @media (max-width: 768px) {
          .terms-container {
            padding: 16px 16px 48px;
          }
          .md-custom-hide {
            display: flex !important;
          }
          .terms-sidebar {
            position: fixed !important;
            top: 0 !important;
            left: 0;
            bottom: 0;
            width: 320px;
            max-width: 85vw;
            z-index: 9999;
            border-radius: 0 16px 16px 0 !important;
            transform: translateX(-100%);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            max-height: 100vh !important;
            box-shadow: 10px 0 30px rgba(0,0,0,0.1) !important;
          }
          .terms-sidebar--open {
            transform: translateX(0);
          }
          .sidebar-header {
            display: flex !important;
          }
          .sidebar-close-btn {
            display: block !important;
          }
          .mobile-overlay {
            position: fixed;
            inset: 0;
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(4px);
            z-index: 9998;
          }
        }
      `}</style>
    </div>
  );
}
