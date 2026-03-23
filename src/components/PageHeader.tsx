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

export function PageHeader({ title, description, breadcrumbs, image, className }: PageHeaderProps) {
  return (
    <div className={`bg-white border-b border-slate-200 ${className}`}>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
        <Link to="/" className="hover:text-viet-red flex items-center gap-1">
          <Home size={12} /> Home
        </Link>
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={idx}>
            <ChevronRight size={12} />
            {crumb.href ? (
              <Link to={crumb.href} className="hover:text-viet-red">
                {crumb.label}
              </Link>
            ) : (
              <span className={idx === breadcrumbs.length - 1 ? "text-viet-red font-bold" : "text-slate-900 font-medium"}>
                {crumb.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Hero Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <h1 className="text-4xl font-black text-slate-900 leading-tight uppercase tracking-tighter">
              {title}
            </h1>
            {description && (
              <p className="text-slate-600 text-lg leading-relaxed">
                {description}
              </p>
            )}
          </div>
          {image && (
            <div className="hidden lg:block w-64 h-64 bg-slate-100 rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 shrink-0">
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
