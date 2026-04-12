import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  return (
    <div className={`relative overflow-hidden bg-slate-900 border-b border-slate-800 ${className}`}>
      {/* Dynamic Backgound Patterns */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-primary/20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-overlay pointer-events-none translate-x-1/3 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-overlay pointer-events-none -translate-x-1/4 translate-y-1/3" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGcgc3Ryb2tlPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiPjxwYXRoIGQ9Ik00MCAwaC00MHY0MGg0MHoiLz48L2c+PC9zdmc+')] opacity-20 pointer-events-none" />

      <div className="relative z-10">
        {/* Breadcrumbs */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs text-slate-400">
          <Link to="/" className="hover:text-white transition-colors flex items-center gap-1">
            <Home size={12} /> Home
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight size={12} className="text-slate-600" />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-white transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className={idx === breadcrumbs.length - 1 ? "text-primary-light font-bold" : "text-slate-300 font-medium"}>
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Hero Content */}
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight uppercase tracking-tighter">
              {title}
            </h1>
            {description && (
              <p className="text-slate-300 text-lg md:text-xl leading-relaxed max-w-2xl font-light">
                {description}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
