import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../utils/cn';

interface MegaMenuSection {
  title: string;
  links: { label: string; href: string }[];
}

interface MegaMenuProps {
  sections: MegaMenuSection[];
  columns?: number;
  className?: string;
}

export function MegaMenu({ sections, columns = 3, className }: MegaMenuProps) {
  return (
    <div className={cn(
      "grid gap-8 p-8 bg-white",
      columns === 1 ? "grid-cols-1 w-[240px]" : 
      columns === 2 ? "grid-cols-2 w-[480px]" : 
      "grid-cols-3 w-[720px]",
      className
    )}>
      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2">
            {section.title}
          </h4>
          <ul className="space-y-2.5">
            {section.links.map((link) => (
              <li key={link.label}>
                <Link 
                  to={link.href} 
                  className="text-sm text-slate-600 hover:text-viet-red transition-colors block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
