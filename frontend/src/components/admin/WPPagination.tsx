import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface WPPaginationProps {
  page: number;
  perPage: number;
  total: number;
  onPageChange: (page: number) => void;
}

export function WPPagination({ page, perPage, total, onPageChange }: WPPaginationProps) {
  const totalPages = Math.ceil(total / perPage);
  if (total === 0) return null;

  const start = (page - 1) * perPage + 1;
  const end = Math.min(page * perPage, total);

  return (
    <div className="wp-pagination">
      <span className="wp-pagination-info">
        {start}–{end} trên tổng <strong>{total}</strong> mục
      </span>
      <div className="wp-pagination-nav">
        <button className="wp-pagination-btn" disabled={page <= 1}
          onClick={() => onPageChange(1)} title="Trang đầu">
          <ChevronsLeft size={14} />
        </button>
        <button className="wp-pagination-btn" disabled={page <= 1}
          onClick={() => onPageChange(page - 1)} title="« Trước">
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: 13 }}>
          Trang <input className="wp-pagination-input" type="number" min={1} max={totalPages}
            value={page} onChange={e => {
              const v = parseInt(e.target.value);
              if (v >= 1 && v <= totalPages) onPageChange(v);
            }} /> / {totalPages}
        </span>
        <button className="wp-pagination-btn" disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)} title="Tiếp »">
          <ChevronRight size={14} />
        </button>
        <button className="wp-pagination-btn" disabled={page >= totalPages}
          onClick={() => onPageChange(totalPages)} title="Trang cuối">
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}
