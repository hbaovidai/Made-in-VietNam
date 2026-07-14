import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ options, value, onChange, placeholder, className = '' }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between px-4 py-3 bg-surface-1 border outline-none text-left text-sm text-ink transition-all select-none ${
          isOpen ? 'border-primary' : 'border-hairline'
        }`}
        style={{ borderRadius: 0 }}
      >
        <span className={selectedOption ? 'text-ink' : 'text-ink-subtle'}>
          {selectedOption ? selectedOption.label : placeholder || 'Select option'}
        </span>
        {isOpen ? (
          <ChevronUp size={16} className="text-ink-muted shrink-0 ml-2" />
        ) : (
          <ChevronDown size={16} className="text-ink-muted shrink-0 ml-2" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-1 bg-canvas border border-hairline z-50 max-h-60 overflow-y-auto py-1"
          style={{ borderRadius: 0 }}
        >
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <div
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`px-4 py-2.5 text-sm cursor-pointer select-none transition-colors ${
                  isSelected 
                    ? 'bg-surface-2 text-ink font-normal' 
                    : 'text-ink-muted hover:bg-surface-1'
                }`}
              >
                {option.label}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
