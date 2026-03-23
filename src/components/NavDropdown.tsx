import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../utils/cn';

interface NavDropdownProps {
  label: string;
  to?: string;
  children?: React.ReactNode;
  className?: string;
  panelClassName?: string;
  arrowClassName?: string;
}

export function NavDropdown({ label, to, children, className, panelClassName, arrowClassName }: NavDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const LabelElement = to ? Link : 'button';

  return (
    <div 
      className={cn("relative h-full flex items-center group", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <LabelElement 
        to={to as string}
        className="flex items-center gap-1 text-sm font-bold text-slate-700 hover:text-viet-red transition-colors h-full"
      >
        {label}
        <ChevronDown size={14} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </LabelElement>

      {isOpen && (
        <div className={cn(
          "absolute top-full left-0 pt-2 z-[100] animate-in fade-in slide-in-from-top-1 duration-200",
          panelClassName
        )}>
          {/* Pointer Arrow */}
          <div className={cn(
            "absolute top-[3px] left-6 w-2.5 h-2.5 bg-white border-t border-l border-slate-200 rotate-45 z-[101]",
            arrowClassName
          )} />
          
          <div className="bg-white border border-slate-200 shadow-xl rounded-sm overflow-hidden min-w-[200px] relative z-[100]">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
