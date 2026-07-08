import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, ChevronLeft, Trash2, CheckSquare, MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';

interface ChatMessage {
  sender: string;
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  buyerName: string;
  buyerEmail: string;
  buyerCompany?: string;
  supplierName: string;
  supplierEmail: string;
  relatedType: 'order' | 'rfq';
  relatedId: string;
  lastMessage: string;
  status: 'active' | 'blocked';
  unread: boolean;
  lastUpdated: string;
  messages: ChatMessage[];
}

// Mock request details matching AdminRequests.tsx
const mockRequestDetails: Record<string, { type: 'order' | 'rfq'; title: string; qty: string; statusText: string; extraLabel?: string; extraVal?: string }> = {
  REQ001: { type: 'order', title: 'Cà phê Robusta Đăk Lăk S18', qty: '500 kg', statusText: 'Chưa xử lý', extraLabel: 'Nhà cung cấp', extraVal: 'Đăk Lăk Coffee Co.' },
  REQ005: { type: 'order', title: 'Trà ô long Thiết Quan Âm', qty: '200 hộp', statusText: 'Đã xử lý', extraLabel: 'Nhà cung cấp', extraVal: 'Lâm Đồng Tea House' },
  RFQ001: { type: 'rfq', title: 'Cà phê hạt Robusta xuất khẩu Trung Đông', qty: '1000 kg', statusText: 'Đang xử lý', extraLabel: 'Số NCC nhận', extraVal: '4 nhà cung cấp' },
  RFQ002: { type: 'rfq', title: 'Tiêu đen Phú Quốc số lượng lớn', qty: '5000 tấn', statusText: 'Đang xử lý', extraLabel: 'Số NCC nhận', extraVal: '3 nhà cung cấp' },
};

const initialConversations: Conversation[] = [
  {
    id: 'CHAT001',
    buyerName: 'Nguyễn Văn A',
    buyerEmail: 'vana@gmail.com',
    supplierName: 'Đăk Lăk Coffee Co.',
    supplierEmail: 'info@daklakcoffee.vn',
    relatedType: 'order',
    relatedId: 'REQ001',
    lastMessage: 'Tôi muốn nhận báo giá cho đơn hàng 500kg.',
    status: 'active',
    unread: true,
    lastUpdated: '2 phút trước',
    messages: [
      { sender: 'Nguyễn Văn A', text: 'Xin chào, tôi cần báo giá cho 500kg cà phê Robusta Đăk Lăk S18.', time: '09:15 AM' },
      { sender: 'Đăk Lăk Coffee Co.', text: 'Chào bạn, chúng tôi đã nhận được yêu cầu đóng bao 50kg và đang lên báo giá.', time: '09:20 AM' },
      { sender: 'Nguyễn Văn A', text: 'Tôi muốn nhận báo giá cho đơn hàng 500kg.', time: '09:22 AM' }
    ]
  },
  {
    id: 'CHAT002',
    buyerName: 'Trần Thị B',
    buyerEmail: 'thib@yahoo.com',
    supplierName: 'Lâm Đồng Tea House',
    supplierEmail: 'teahouse@lamdong.vn',
    relatedType: 'order',
    relatedId: 'REQ005',
    lastMessage: 'Cảm ơn doanh nghiệp đã phản hồi nhanh chóng.',
    status: 'blocked',
    unread: false,
    lastUpdated: '1 ngày trước',
    messages: [
      { sender: 'Trần Thị B', text: 'Vui lòng gửi mẫu trà thử trước khi giao hàng hàng loạt.', time: 'Yesterday 10:00 AM' },
      { sender: 'Lâm Đồng Tea House', text: 'Chúng tôi đã gửi mẫu thử chuyển phát nhanh chiều nay.', time: 'Yesterday 10:45 AM' },
      { sender: 'Trần Thị B', text: 'Cảm ơn doanh nghiệp đã phản hồi nhanh chóng.', time: 'Yesterday 11:00 AM' }
    ]
  },
  {
    id: 'CHAT003',
    buyerName: 'Phạm Minh C',
    buyerEmail: 'minhc@abccorp.vn',
    buyerCompany: 'ABC Company',
    supplierName: 'Đăk Lăk Coffee Co.',
    supplierEmail: 'info@daklakcoffee.vn',
    relatedType: 'rfq',
    relatedId: 'RFQ001',
    lastMessage: 'Đơn hàng xuất khẩu đi Trung Đông cần giấy tờ gì?',
    status: 'active',
    unread: false,
    lastUpdated: '2 giờ trước',
    messages: [
      { sender: 'Phạm Minh C', text: 'Xin chào, chúng tôi đang có nhu cầu xuất khẩu hạt Robusta đi Trung Đông số lượng lớn.', time: '02:00 PM' },
      { sender: 'Đăk Lăk Coffee Co.', text: 'Chào quý công ty, chúng tôi hoàn toàn đáp ứng đầy đủ tiêu chuẩn xuất khẩu Halal.', time: '02:30 PM' },
      { sender: 'Phạm Minh C', text: 'Đơn hàng xuất khẩu đi Trung Đông cần giấy tờ gì?', time: '02:45 PM' }
    ]
  },
  {
    id: 'CHAT004',
    buyerName: 'Lê Hoàng D',
    buyerEmail: 'hoangd@glocalfoods.com',
    buyerCompany: 'Glocal Foods',
    supplierName: 'Gia vị Tây Nguyên',
    supplierEmail: 'taynguyen@spices.vn',
    relatedType: 'rfq',
    relatedId: 'RFQ002',
    lastMessage: 'Chúng tôi sẽ gửi hợp đồng mẫu qua email.',
    status: 'active',
    unread: true,
    lastUpdated: '30 phút trước',
    messages: [
      { sender: 'Lê Hoàng D', text: 'Xin chào, chúng tôi cần báo giá 5000 tấn tiêu đen Phú Quốc.', time: '04:12 PM' },
      { sender: 'Gia vị Tây Nguyên', text: 'Chúng tôi đang chuẩn bị tài liệu năng lực và báo giá chi tiết.', time: '04:30 PM' },
      { sender: 'Gia vị Tây Nguyên', text: 'Chúng tôi sẽ gửi hợp đồng mẫu qua email.', time: '04:45 PM' }
    ]
  }
];

export function AdminMessages() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const detailId = searchParams.get('id');

  // Local state
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [bulkAction, setBulkAction] = useState('');
  const [currentFilter, setCurrentFilter] = useState<'all' | 'unread' | 'active' | 'blocked'>('all');

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const res = await api.get('/messages/admin/all');
      const mapped = res.data.map((c: any) => ({
        id: c.id,
        buyerName: c.buyerName,
        buyerEmail: c.buyerEmail,
        supplierName: c.supplierName,
        supplierEmail: c.supplierEmail,
        relatedType: 'rfq',
        relatedId: 'RFQ-' + c.id.slice(0, 8).toUpperCase(),
        lastMessage: c.lastMessage || 'Chưa có tin nhắn',
        status: c.status || 'active',
        unread: c.unread || false,
        lastUpdated: c.lastMessageAt
          ? new Date(c.lastMessageAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
          : new Date(c.updatedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
        participants: c.participants,
        messages: [],
      }));
      setConversations(mapped);
    } catch (err) {
      console.error('Failed to fetch admin conversations', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  // Selected conversation details
  const selectedChat = useMemo(() => {
    if (!detailId) return null;
    return conversations.find(c => c.id === detailId) || null;
  }, [detailId, conversations]);

  const fetchMessages = async (chat: any) => {
    if (!chat) return;
    try {
      setLoadingMessages(true);
      const pId = chat.participants?.[0]?.userId || '';
      const res = await api.get(`/messages/admin/${chat.id}/history?userId=${pId}`);
      const formatted = res.data.reverse().map((m: any) => ({
        sender: m.sender?.fullName || 'Người gửi',
        text: m.content,
        time: new Date(m.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      }));
      
      setConversations(prev => prev.map(c => {
        if (c.id === chat.id) {
          return { ...c, messages: formatted };
        }
        return c;
      }));
    } catch (err) {
      console.error('Failed to fetch messages for admin', err);
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat]);

  const filteredConversations = useMemo(() => {
    return conversations.filter(c => {
      // Filter tab
      if (currentFilter === 'unread' && !c.unread) return false;
      if (currentFilter === 'active' && c.status !== 'active') return false;
      if (currentFilter === 'blocked' && c.status !== 'blocked') return false;

      // Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          c.id.toLowerCase().includes(query) ||
          c.buyerName.toLowerCase().includes(query) ||
          c.supplierName.toLowerCase().includes(query) ||
          c.lastMessage.toLowerCase().includes(query) ||
          c.relatedId.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [conversations, currentFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: conversations.length,
      unread: conversations.filter(c => c.unread).length,
      active: conversations.filter(c => c.status === 'active').length,
      blocked: conversations.filter(c => c.status === 'blocked').length,
    };
  }, [conversations]);

  // Handle single action
  const toggleStatus = (id: string) => {
    setConversations(prev => prev.map(c => {
      if (c.id === id) {
        const nextStatus = c.status === 'active' ? 'blocked' : 'active';
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  const deleteConversation = async (id: string) => {
    if (confirm(t('msg_confirm_delete'))) {
      try {
        await api.delete(`/messages/conversations/${id}`);
        setConversations(prev => prev.filter(c => c.id !== id));
        if (detailId === id) {
          setSearchParams({});
        }
      } catch (err) {
        console.error('Failed to delete conversation', err);
      }
    }
  };

  // Bulk actions handler
  const handleBulkAction = async () => {
    if (!bulkAction || selectedReqs.length === 0) return;

    if (bulkAction === 'delete') {
      if (confirm(t('msg_confirm_delete'))) {
        try {
          await Promise.all(selectedReqs.map(id => api.delete(`/messages/conversations/${id}`)));
          setConversations(prev => prev.filter(c => !selectedReqs.includes(c.id)));
          setSelectedReqs([]);
        } catch (err) {
          console.error('Failed to bulk delete', err);
        }
      }
      setBulkAction('');
      return;
    }

    setConversations(prev => {
      return prev.map(c => {
        if (selectedReqs.includes(c.id)) {
          if (bulkAction === 'block') return { ...c, status: 'blocked' };
          if (bulkAction === 'unblock') return { ...c, status: 'active' };
          if (bulkAction === 'read') return { ...c, unread: false };
          if (bulkAction === 'unread') return { ...c, unread: true };
        }
        return c;
      });
    });

    setBulkAction('');
  };

  const relatedRequest = useMemo(() => {
    if (!selectedChat) return null;
    return mockRequestDetails[selectedChat.relatedId] || {
      type: 'rfq',
      title: 'Yêu cầu báo giá liên quan',
      qty: 'Liên hệ',
      statusText: 'Đang xử lý',
    };
  }, [selectedChat]);

  // View switch render
  if (selectedChat) {
    return (
      <div>
        <div className="wp-breadcrumb">
          <Link to="/dashboard/admin">Dashboard</Link>
          <span className="wp-breadcrumb-sep">›</span>
          <button onClick={() => setSearchParams({})} style={{ background: 'none', border: 'none', color: 'var(--wp-accent)', cursor: 'pointer', padding: 0 }}>
            {t('msg_menu_label')}
          </button>
          <span className="wp-breadcrumb-sep">›</span>
          <span className="wp-breadcrumb-current">{selectedChat.id}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <button onClick={() => setSearchParams({})} className="wp-btn" style={{ padding: '4px 8px' }}><ChevronLeft size={16} /></button>
          <h1 className="wp-page-title" style={{ margin: 0 }}>{t('msg_page_title')} #{selectedChat.id}</h1>
          <span className={`wp-badge ${selectedChat.status === 'active' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
            {selectedChat.status === 'active' ? t('msg_status_active') : t('msg_status_blocked')}
          </span>
        </div>

        {/* 2-column Detail View */}
        <div style={{ display: 'grid', gridTemplateColumns: '70% 30%', gap: 16 }}>
          {/* Left Column: Chat Pane */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="wp-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '450px' }}>
              <div className="wp-card-header" style={{ background: '#f6f7f7' }}>
                <div>
                  <span className="wp-card-title" style={{ display: 'block', fontSize: 14 }}>
                    {selectedChat.buyerName} ↔ {selectedChat.supplierName}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>
                    {t('msg_detail_related')}: <Link to={`/dashboard/admin/requests?id=${selectedChat.relatedId}`} style={{ color: 'var(--wp-accent)', fontWeight: 600 }}>{selectedChat.relatedId}</Link>
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => toggleStatus(selectedChat.id)} className="wp-btn" style={{ fontSize: 12 }}>
                    {selectedChat.status === 'active' ? t('msg_detail_block_btn') : t('msg_detail_unblock_btn')}
                  </button>
                  <button onClick={() => deleteConversation(selectedChat.id)} className="wp-btn" style={{ borderColor: 'var(--wp-danger)', color: 'var(--wp-danger)', fontSize: 12 }}>
                    {t('msg_detail_delete_btn')}
                  </button>
                </div>
              </div>

              {/* Chat Timeline */}
              <div style={{ flex: 1, padding: 16, background: '#fcfcfc', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14, minHeight: '300px', justifyContent: loadingMessages ? 'center' : 'flex-start', alignItems: loadingMessages ? 'center' : 'stretch' }}>
                {loadingMessages ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: 'var(--wp-text-muted)' }}>
                    <Loader2 className="animate-spin" size={24} style={{ color: 'var(--wp-accent)' }} />
                    <span style={{ fontSize: 12 }}>Đang tải tin nhắn...</span>
                  </div>
                ) : !selectedChat.messages || selectedChat.messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--wp-text-muted)', fontSize: 12 }}>
                    Chưa có tin nhắn nào.
                  </div>
                ) : (
                  selectedChat.messages.map((m: any, index: number) => {
                    const isBuyer = m.sender === selectedChat.buyerName;

                    return (
                      <div key={index} style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isBuyer ? 'flex-start' : 'flex-end',
                        maxWidth: '85%',
                        alignSelf: isBuyer ? 'flex-start' : 'flex-end'
                      }}>
                        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--wp-text-muted)', marginBottom: 2 }}>
                          {m.sender}
                        </span>
                        <div style={{
                          padding: '10px 14px',
                          borderRadius: 8,
                          fontSize: 13,
                          lineHeight: 1.4,
                          background: isBuyer ? '#fff' : 'var(--wp-accent)',
                          color: isBuyer ? 'var(--wp-text)' : '#fff',
                          border: isBuyer ? '1px solid var(--wp-border-light)' : 'none',
                          boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                        }}>
                          {m.text}
                        </div>
                        <span style={{ fontSize: 10, color: 'var(--wp-text-muted)', marginTop: 2 }}>
                          {m.time}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Participant Card */}
            <div className="wp-card">
              <div className="wp-card-header"><span className="wp-card-title">{t('req_detail_customer_info')}</span></div>
              <div className="wp-card-body">
                <table className="wp-form-table"><tbody>
                  <tr><th style={{ width: 90, fontSize: 12 }}>{t('msg_detail_buyer')}</th><td><strong>{selectedChat.buyerName}</strong></td></tr>
                  {selectedChat.buyerCompany && <tr><th style={{ fontSize: 12 }}>{t('req_detail_company')}</th><td>{selectedChat.buyerCompany}</td></tr>}
                  <tr><th style={{ fontSize: 12 }}>{t('req_detail_email')}</th><td><a href={`mailto:${selectedChat.buyerEmail}`} style={{ color: 'var(--wp-accent)' }}>{selectedChat.buyerEmail}</a></td></tr>
                </tbody></table>
                <hr style={{ border: 'none', borderTop: '1px solid var(--wp-border-light)', margin: '10px 0' }} />
                <table className="wp-form-table"><tbody>
                  <tr><th style={{ width: 90, fontSize: 12 }}>{t('msg_detail_supplier')}</th><td><strong>{selectedChat.supplierName}</strong></td></tr>
                  <tr><th style={{ fontSize: 12 }}>{t('req_detail_email')}</th><td><a href={`mailto:${selectedChat.supplierEmail}`} style={{ color: 'var(--wp-accent)' }}>{selectedChat.supplierEmail}</a></td></tr>
                </tbody></table>
              </div>
            </div>

            {/* Request Card */}
            {relatedRequest && (
              <div className="wp-card">
                <div className="wp-card-header"><span className="wp-card-title">{t('msg_related_card_title')}</span></div>
                <div className="wp-card-body">
                  <div style={{ fontSize: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div>
                      <strong>{t('req_col_id')}:</strong>{' '}
                      <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{selectedChat.relatedId}</span>
                    </div>
                    <div>
                      <strong>{relatedRequest.type === 'order' ? t('req_detail_product') : t('req_detail_category')}:</strong>{' '}
                      {relatedRequest.title}
                    </div>
                    <div>
                      <strong>{t('req_col_quantity')}:</strong> {relatedRequest.qty}
                    </div>
                    {relatedRequest.extraLabel && (
                      <div>
                        <strong>{relatedRequest.extraLabel}:</strong> {relatedRequest.extraVal}
                      </div>
                    )}
                    <div>
                      <strong>{t('req_col_status')}:</strong>{' '}
                      <span className={`wp-badge ${relatedRequest.statusText === 'Đã xử lý' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                        {relatedRequest.statusText}
                      </span>
                    </div>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--wp-border-light)', margin: '12px 0' }} />
                  <Link to={`/dashboard/admin/requests?id=${selectedChat.relatedId}`} className="wp-btn button-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center', gap: 4 }}>
                    <ExternalLink size={14} /> {t('msg_action_view_request')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // List rendering (WordPress comments list-style)
  return (
    <div>
      <div className="wp-breadcrumb">
        <Link to="/dashboard/admin">Dashboard</Link>
        <span className="wp-breadcrumb-sep">›</span>
        <span className="wp-breadcrumb-current">{t('msg_menu_label')}</span>
      </div>

      <h1 className="wp-page-title">{t('msg_page_title')}</h1>

      {/* Filter Tabs */}
      <div className="wp-filter-tabs">
        <button className={`wp-filter-tab ${currentFilter === 'all' ? 'active' : ''}`} onClick={() => setCurrentFilter('all')}>
          {t('msg_tab_all')} <span className="count">({counts.all})</span>
        </button>
        <span className="wp-filter-sep">|</span>
        <button className={`wp-filter-tab ${currentFilter === 'unread' ? 'active' : ''}`} onClick={() => setCurrentFilter('unread')}>
          {t('msg_tab_unread')} <span className="count">({counts.unread})</span>
        </button>
        <span className="wp-filter-sep">|</span>
        <button className={`wp-filter-tab ${currentFilter === 'active' ? 'active' : ''}`} onClick={() => setCurrentFilter('active')}>
          {t('msg_tab_active')} <span className="count">({counts.active})</span>
        </button>
        <span className="wp-filter-sep">|</span>
        <button className={`wp-filter-tab ${currentFilter === 'blocked' ? 'active' : ''}`} onClick={() => setCurrentFilter('blocked')}>
          {t('msg_tab_blocked')} <span className="count">({counts.blocked})</span>
        </button>
      </div>

      {/* Toolbar / Actions */}
      <div className="wp-table-top">
        <div className="wp-bulk-actions">
          <select className="wp-bulk-select" value={bulkAction} onChange={e => setBulkAction(e.target.value)}>
            <option value="">Bulk Actions</option>
            <option value="read">{t('msg_bulk_read')}</option>
            <option value="unread">{t('msg_bulk_unread')}</option>
            <option value="block">{t('msg_bulk_block')}</option>
            <option value="unblock">{t('msg_bulk_unblock')}</option>
            <option value="delete">{t('msg_bulk_delete')}</option>
          </select>
          <button className="wp-btn" onClick={handleBulkAction}>Apply</button>
        </div>

        <div className="wp-table-search">
          <input
            type="text"
            placeholder={t('msg_search_placeholder')}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="wp-btn"><Search size={14} /> {t('req_search_btn')}</button>
        </div>
      </div>

      {/* Table */}
      <div className="wp-table-wrap">
        <table className="wp-table">
          <thead>
            <tr>
              <th style={{ width: 30 }}>
                <input
                  type="checkbox"
                  checked={selectedReqs.length === filteredConversations.length && filteredConversations.length > 0}
                  onChange={() => selectedReqs.length === filteredConversations.length ? setSelectedReqs([]) : setSelectedReqs(filteredConversations.map(c => c.id))}
                />
              </th>
              <th style={{ width: 90 }}>{t('msg_col_id')}</th>
              <th style={{ width: 140 }}>{t('msg_col_buyer')}</th>
              <th style={{ width: 140 }}>{t('msg_col_supplier')}</th>
              <th style={{ width: 100 }}>{t('msg_col_related')}</th>
              <th>{t('msg_col_last_msg')}</th>
              <th style={{ width: 110 }}>{t('msg_col_status')}</th>
              <th style={{ width: 130 }}>{t('msg_col_last_updated')}</th>
            </tr>
          </thead>
          <tbody>
            {filteredConversations.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: 30, color: 'var(--wp-text-muted)' }}>
                  {t('msg_empty_table')}
                </td>
              </tr>
            ) : filteredConversations.map(c => {
              const isSelected = selectedReqs.includes(c.id);
              return (
                <tr key={c.id} className={`${isSelected ? 'selected' : ''} ${c.unread ? 'wp-row-unread' : ''}`} style={{
                  background: c.unread ? '#fbfcfe' : undefined,
                  fontWeight: c.unread ? '600' : 'normal'
                }}>
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => setSelectedReqs(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])}
                    />
                  </td>
                  <td>
                    <span className="wp-row-title" onClick={() => setSearchParams({ id: c.id })}>
                      {c.id}
                    </span>
                    <div className="wp-row-actions">
                      <button onClick={() => setSearchParams({ id: c.id })}>View</button>
                      <span className="sep">|</span>
                      <button onClick={() => toggleStatus(c.id)}>
                        {c.status === 'active' ? t('msg_detail_block_btn') : t('msg_detail_unblock_btn')}
                      </button>
                      <span className="sep">|</span>
                      <button className="delete" onClick={() => deleteConversation(c.id)}>Delete</button>
                    </div>
                  </td>
                  <td>{c.buyerName}</td>
                  <td>{c.supplierName}</td>
                  <td>
                    <Link to={`/dashboard/admin/requests?id=${c.relatedId}`} style={{ color: 'var(--wp-accent)', textDecoration: 'none', fontWeight: 600 }}>
                      {c.relatedId}
                    </Link>
                  </td>
                  <td style={{ color: 'var(--wp-text-muted)', fontSize: 12 }}>
                    {c.unread && <span style={{ color: 'var(--wp-danger)', marginRight: 4 }}>●</span>}
                    "{c.lastMessage}"
                  </td>
                  <td>
                    <span className={`wp-badge ${c.status === 'active' ? 'wp-badge-approved' : 'wp-badge-pending'}`}>
                      {c.status === 'active' ? t('msg_status_active') : t('msg_status_blocked')}
                    </span>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--wp-text-muted)' }}>{c.lastUpdated}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
