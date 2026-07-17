import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbBarProps {
  items: BreadcrumbItem[];
}

/**
 * Standalone breadcrumb bar that sits between the header and page content.
 * Renders a subtle strip with "Trang chủ > ... > Current Page" navigation.
 */
export function BreadcrumbBar({ items }: BreadcrumbBarProps) {
  const { t } = useTranslation();

  return (
    <div className="breadcrumb-bar" style={{
      background: 'linear-gradient(180deg, #f0f4f8 0%, #f7f9fb 100%)',
      padding: '8px 0',
    }}>
      <nav style={{
        maxWidth: 1600, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', gap: 6,
        fontSize: 12, color: '#6b7a8d',
      }}>
        <Link
          to="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 5,
            color: '#6b7a8d', textDecoration: 'none',
            fontWeight: 500, transition: 'color .15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#003366')}
          onMouseLeave={e => (e.currentTarget.style.color = '#6b7a8d')}
        >
          <Home size={12} />
          <span>{t('home')}</span>
        </Link>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={idx}>
              <ChevronRight size={11} style={{ color: '#b0bac6', flexShrink: 0 }} />
              {item.href && !isLast ? (
                <Link
                  to={item.href}
                  style={{
                    color: '#6b7a8d', textDecoration: 'none',
                    fontWeight: 500, transition: 'color .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#003366')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7a8d')}
                >
                  {item.label}
                </Link>
              ) : (
                <span style={{
                  color: '#1a2b4a', fontWeight: 600,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {item.label}
                </span>
              )}
            </React.Fragment>
          );
        })}
      </nav>
    </div>
  );
}

