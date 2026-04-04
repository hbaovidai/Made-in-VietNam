import React from 'react';
import { Link } from 'react-router-dom';
import { CategorySection } from '../../data/categories';
import { cn } from '../../utils/cn';

interface CategorySectionBlockProps {
  section: CategorySection;
  image?: string;
  className?: string;
}

export function CategorySectionBlock({ section, image, className }: CategorySectionBlockProps) {
  return (
    <div className={cn("bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row overflow-hidden", className)}>
      {/* Left Banner Area */}
      {image && (
        <div className="w-full md:w-64 lg:w-72 bg-slate-50 relative shrink-0">
          <img
            src={image}
            alt={section.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-white font-bold text-lg leading-tight uppercase tracking-wider">
              {section.title}
            </h3>
            <Link
              to={`/products?cat=${section.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="mt-4 inline-flex items-center text-xs font-bold text-white bg-primary px-4 py-2 hover:bg-primary-dark transition-colors uppercase tracking-widest"
            >
              View Products
            </Link>
          </div>
        </div>
      )}

      {/* Right Content Area */}
      <div className="flex-1 p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
          {section.subcategories.map((sub) => (
            <Link
              key={sub.name}
              to={sub.href}
              className="text-sm text-slate-600 hover:text-primary transition-colors block py-0.5 border-b border-transparent hover:border-primary/20"
            >
              {sub.name}
            </Link>
          ))}
          <Link
            to={`/products?cat=${section.title.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            More Categories »
          </Link>
        </div>
      </div>
    </div>
  );
}
