import React, { useState, useRef, useEffect } from 'react';
import { Paperclip, Send, Smile, FileText, Image as ImageIcon } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onSendFile: (fileName: string, fileSize: string) => void;
}

export function ChatInput({ onSendMessage, onSendFile }: ChatInputProps) {
  const [text, setText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close attachment menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowAttachMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  const selectMockFile = (name: string, size: string) => {
    onSendFile(name, size);
    setShowAttachMenu(false);
  };

  const attachItems = [
    { name: 'Buyer_Specs_Sheet_V4.pdf', size: '1.8 MB', label: 'Product Specification', color: '#ef4444' },
    { name: 'Technical_Drawing_CAD.pdf', size: '4.2 MB', label: 'Blueprints / CAD', color: '#3b82f6' },
    { name: 'Material_Inspection_Report.pdf', size: '950 KB', label: 'Quality Cert / Test Report', color: '#10b981' },
    { name: 'Reference_Product_Photo.png', size: '2.1 MB', label: 'Product Image', color: '#8b5cf6' },
  ];

  return (
    <div style={{
      padding: '8px 12px', background: '#fff', borderTop: '1px solid #f1f5f9',
      flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {/* Attachment */}
      <div style={{ position: 'relative' }} ref={menuRef}>
        <button
          onClick={() => setShowAttachMenu(!showAttachMenu)}
          style={{
            background: showAttachMenu ? '#eff6ff' : 'transparent', border: 'none', cursor: 'pointer',
            padding: 6, borderRadius: 6, color: showAttachMenu ? '#2563eb' : '#94a3b8', display: 'flex',
          }}
        >
          <Paperclip size={16} />
        </button>

        {showAttachMenu && (
          <div style={{
            position: 'absolute', left: 0, bottom: '100%', marginBottom: 8, width: 220,
            background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10,
            boxShadow: '0 4px 12px rgba(0,0,0,.1)', padding: 6, zIndex: 50,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', padding: '4px 8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Attachments
            </div>
            {attachItems.map(item => (
              <button
                key={item.name}
                onClick={() => selectMockFile(item.name, item.size)}
                style={{
                  width: '100%', textAlign: 'left', padding: '6px 8px', display: 'flex', alignItems: 'center',
                  gap: 8, fontSize: 12, fontWeight: 600, color: '#334155', background: 'none', border: 'none',
                  cursor: 'pointer', borderRadius: 6,
                }}
                onMouseOver={e => (e.currentTarget.style.background = '#f8fafc')}
                onMouseOut={e => (e.currentTarget.style.background = 'transparent')}
              >
                {item.name.endsWith('.png')
                  ? <ImageIcon size={14} style={{ color: item.color, flexShrink: 0 }} />
                  : <FileText size={14} style={{ color: item.color, flexShrink: 0 }} />}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <input
        type="text"
        placeholder="Type a message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1, background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8,
          padding: '7px 12px', fontSize: 13, color: '#1e293b', outline: 'none',
          fontFamily: 'inherit',
        }}
      />

      {/* Emoji */}
      <button
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, color: '#94a3b8', display: 'flex' }}
        onClick={() => setText(prev => prev + ' 😊')}
      >
        <Smile size={16} />
      </button>

      {/* Send */}
      <button
        onClick={handleSend}
        disabled={!text.trim()}
        style={{
          background: text.trim() ? '#2563eb' : '#e2e8f0', border: 'none', cursor: text.trim() ? 'pointer' : 'not-allowed',
          padding: 7, borderRadius: 8, color: text.trim() ? '#fff' : '#94a3b8', display: 'flex',
          transition: 'background .15s',
        }}
      >
        <Send size={15} />
      </button>
    </div>
  );
}
