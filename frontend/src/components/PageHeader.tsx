import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs: Breadcrumb[];
  image?: string;
  className?: string;
}

export function PageHeader({ title, description, breadcrumbs, className }: PageHeaderProps) {
  const { t } = useTranslation();

  return (
    <div className={`bg-gradient-to-b from-blue-50/50 to-transparent border-b border-slate-200 pt-4 pb-12 relative overflow-hidden ${className}`}>
      {/* Light Soft Glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/4 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-viet-gold/5 rounded-full blur-[100px] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-8">
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1 outline-none">
              <Home size={12} /> {t('home')}
            </Link>
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                <ChevronRight size={12} className="text-slate-400" />
                {crumb.href ? (
                  <Link to={crumb.href} className="hover:text-primary transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className={idx === breadcrumbs.length - 1 ? "text-primary font-bold" : "text-slate-600"}>
                    {crumb.label}
                  </span>
                )}
              </React.Fragment>
            ))}
          </nav>
        )}

        {/* Hero Content */}
        <div className="max-w-3xl space-y-4 flex flex-col items-center text-center mx-auto mt-2">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-primary to-blue-600 leading-tight tracking-tight drop-shadow-sm pb-1">
            {title}
          </h1>
          {description && (
            <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium mt-2">
              {description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
