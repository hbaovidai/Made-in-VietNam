import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';

interface AttachmentCardProps {
  name: string;
  size: string;
  onDownload?: () => void;
}

export function AttachmentCard({ name, size, onDownload }: AttachmentCardProps) {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm max-w-sm hover:border-blue-400 transition-colors group">
      <div className="p-2 bg-red-50 text-red-600 rounded-md">
        <FileText size={24} className="shrink-0" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-blue-600 transition-colors" title={name}>
          {name}
        </h4>
        <p className="text-[10px] text-slate-400 font-medium">{size}</p>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        <button 
          onClick={onDownload}
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors" 
          title="Tải tài liệu"
        >
          <Download size={14} />
        </button>
        <button 
          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-50 rounded transition-colors" 
          title="Xem trực tiếp"
        >
          <ExternalLink size={14} />
        </button>
      </div>
    </div>
  );
}
