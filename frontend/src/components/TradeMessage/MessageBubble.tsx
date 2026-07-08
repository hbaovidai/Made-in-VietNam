import React from 'react';
import { Message } from './types';
import { AttachmentCard } from './AttachmentCard';
import { Check, CheckCheck, FileSpreadsheet, ArrowRight } from 'lucide-react';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isBuyer = message.sender === 'buyer';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 8, alignItems: isBuyer ? 'flex-end' : 'flex-start' }}>
      <div style={{ maxWidth: '68%' }}>
        {message.type === 'text' && (
          <div style={{
            padding: '8px 12px', fontSize: 13, lineHeight: 1.5, borderRadius: 14,
            ...(isBuyer
              ? { background: '#eff6ff', color: '#1e293b', border: '1px solid #dbeafe', borderTopRightRadius: 4 }
              : { background: '#fff', color: '#1e293b', border: '1px solid #f1f5f9', borderTopLeftRadius: 4 }),
          }}>
            {message.content}
          </div>
        )}

        {message.type === 'file' && message.fileInfo && (
          <AttachmentCard
            name={message.fileInfo.name}
            size={message.fileInfo.size}
            onDownload={() => console.log('Downloading', message.fileInfo?.name)}
          />
        )}

        {message.type === 'quotation_summary' && message.quotationSummary && (
          <div style={{
            background: 'linear-gradient(135deg, #eff6ff, #eef2ff)', border: '1px solid #bfdbfe',
            borderRadius: 12, padding: 14, color: '#1e293b',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #dbeafe' }}>
              <div style={{ padding: 3, background: '#2563eb', color: '#fff', borderRadius: 4, display: 'flex' }}>
                <FileSpreadsheet size={14} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#1e293b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Tóm tắt báo giá
              </span>
            </div>

            {[
              ['Đơn giá', message.quotationSummary.unitPrice, '#2563eb'],
              ['MOQ', message.quotationSummary.moq, '#334155'],
              ['Thời gian sản xuất', message.quotationSummary.leadTime, '#334155'],
              ['Thanh toán', message.quotationSummary.paymentTerm, '#334155'],
            ].map(([label, val, clr]) => (
              <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 12 }}>
                <span style={{ color: '#64748b', fontWeight: 500 }}>{label}:</span>
                <span style={{ fontWeight: 600, color: clr as string }}>{val}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 12, paddingTop: 10, borderTop: '1px solid #dbeafe' }}>
              <button style={{
                flex: 1, padding: '6px 0', background: '#2563eb', color: '#fff', border: 'none',
                borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
              }}>
                Chấp nhận <ArrowRight size={11} />
              </button>
              <button style={{
                flex: 1, padding: '6px 0', background: '#fff', color: '#334155', border: '1px solid #e2e8f0',
                borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer',
              }}>
                Đàm phán lại
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timestamp & Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginTop: 3, padding: '0 2px', fontSize: 10, color: '#94a3b8' }}>
        <span>{message.timestamp}</span>
        {isBuyer && (
          <span style={{ marginLeft: 2, display: 'flex' }}>
            {message.status === 'read' ? <CheckCheck size={12} style={{ color: '#3b82f6' }} /> : <Check size={12} style={{ color: '#cbd5e1' }} />}
          </span>
        )}
      </div>
    </div>
  );
}
