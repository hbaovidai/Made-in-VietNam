import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Search } from 'lucide-react';

export interface CustomSelectOption {
  value: string;
  label: string;
  breadcrumb?: string; // Đường dẫn cha, ví dụ: "Chuyên biệt → An ninh & bảo hộ → Báo động"
}

export interface CustomSelectProps {
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  searchable?: boolean;
}

export function CustomSelect({ options, value, onChange, placeholder, className = '', searchable = true }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Scroll tới item đang chọn khi mở dropdown
    if (isOpen && selectedItemRef.current) {
      setTimeout(() => {
        selectedItemRef.current?.scrollIntoView({ block: 'nearest' });
      }, 50);
    }
  }, [isOpen, searchable]);

  const selectedOption = options.find(o => o.value === value);

  const filteredOptions = searchTerm.trim()
    ? options.filter(o => {
        const term = searchTerm.toLowerCase();
        return (
          o.label.toLowerCase().includes(term) ||
          (o.breadcrumb && o.breadcrumb.toLowerCase().includes(term))
        );
      })
    : options;

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setSearchTerm('');
        }}
        className={`w-full h-[38px] flex items-center justify-between px-3.5 py-2 bg-surface-1 border outline-none text-left text-xs text-ink transition-all select-none font-normal ${
          isOpen ? 'border-primary' : 'border-hairline'
        }`}
        style={{ borderRadius: 0, letterSpacing: '0.16px' }}
      >
        <div className="min-w-0 flex-1">
          {selectedOption ? (
            <div>
              <span className="text-ink">{selectedOption.label}</span>
              {selectedOption.breadcrumb && (
                <span className="text-ink-subtle text-[11px] ml-2">{selectedOption.breadcrumb}</span>
              )}
            </div>
          ) : (
            <span className="text-ink-subtle">{placeholder || 'Select option'}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-ink-muted shrink-0 ml-2" />
        ) : (
          <ChevronDown size={16} className="text-ink-muted shrink-0 ml-2" />
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute left-0 right-0 mt-1 bg-canvas border border-hairline z-50 max-h-80 overflow-hidden flex flex-col"
          style={{ borderRadius: 0, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}
        >
          {/* Search input */}
          {searchable && (
            <div className="px-3 py-2.5 border-b border-hairline">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-subtle" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  placeholder="Tìm danh mục..."
                  className="w-full pl-8 pr-3 py-2 bg-surface-1 border border-hairline text-sm outline-none focus:border-primary transition-colors font-normal"
                  style={{ borderRadius: 0, letterSpacing: '0.16px' }}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="overflow-y-auto flex-1 py-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-4 text-sm text-ink-subtle text-center" style={{ letterSpacing: '0.16px' }}>
                Không tìm thấy danh mục nào
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = option.value === value;
                return (
                  <div
                    key={option.value}
                    ref={isSelected ? selectedItemRef : undefined}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`px-4 py-2.5 cursor-pointer select-none transition-colors ${
                      isSelected 
                        ? 'bg-primary/5 border-l-2 border-l-primary' 
                        : 'text-ink-muted hover:bg-surface-1 hover:text-ink border-l-2 border-l-transparent'
                    }`}
                    style={{ letterSpacing: '0.16px' }}
                  >
                    <div className={`text-sm font-normal ${isSelected ? 'text-primary' : ''}`}>
                      {option.label}
                    </div>
                    {option.breadcrumb && (
                      <div className="text-[11px] text-ink-subtle mt-0.5 truncate">
                        {option.breadcrumb}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
