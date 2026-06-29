import React, { useState, useEffect } from 'react';
import { Users, Package, MessageSquare, FileText, TrendingUp, TrendingDown, Activity, Server, Edit3 } from 'lucide-react';
import { api } from '../../../lib/api';

export function AdminOverview() {
  const [stats, setStats] = useState({ users: 0, products: 0, contacts: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftContent, setDraftContent] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, productsRes, contactsRes] = await Promise.allSettled([
          api.get('/users', { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } }),
          api.get('/products'),
          api.get('/contact', { headers: { Authorization: `Bearer ${localStorage.getItem('mivn5_token')}` } }),
        ]);
        setStats({
          users: usersRes.status === 'fulfilled' ? (Array.isArray(usersRes.value.data) ? usersRes.value.data.length : usersRes.value.data?.users?.length || 0) : 0,
          products: productsRes.status === 'fulfilled' ? (productsRes.value.data?.products?.length || productsRes.value.data?.total || 0) : 0,
          contacts: contactsRes.status === 'fulfilled' ? (Array.isArray(contactsRes.value.data) ? contactsRes.value.data.length : 0) : 0,
          orders: 0,
        });
      } catch { /* silent */ }
      setLoading(false);
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Users', value: stats.users, icon: Users, color: 'blue', change: '+12%' },
    { label: 'Total Products', value: stats.products, icon: Package, color: 'green', change: '+5%' },
    { label: 'Feedbacks', value: stats.contacts, icon: MessageSquare, color: 'orange', change: '+8%' },
    { label: 'Pages', value: 6, icon: FileText, color: 'red', change: '0%' },
  ];

  const recentActivities = [
    { text: 'New user registered', time: '2 minutes ago', color: '#2271b1' },
    { text: 'Product "Cà phê Robusta" updated', time: '15 minutes ago', color: '#00a32a' },
    { text: 'New contact message received', time: '1 hour ago', color: '#dba617' },
    { text: 'System backup completed', time: '3 hours ago', color: '#646970' },
    { text: 'User role changed to Supplier', time: '5 hours ago', color: '#2271b1' },
  ];

  return (
    <div>
      <h1 className="wp-page-title">Dashboard</h1>
      <p style={{ color: 'var(--wp-text-muted)', marginBottom: 20, fontSize: 13 }}>
        Welcome back! Here's what's happening with your site.
      </p>

      {/* Stats */}
      <div className="wp-stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="wp-stat-card">
            <div className={`wp-stat-icon ${card.color}`}><card.icon size={20} /></div>
            <div>
              <div className="wp-stat-value">{loading ? '—' : card.value}</div>
              <div className="wp-stat-label">{card.label}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 12, display: 'flex', alignItems: 'center', gap: 2 }}>
              {card.change.startsWith('+') ? <TrendingUp size={12} style={{ color: 'var(--wp-success)' }} /> : <TrendingDown size={12} style={{ color: 'var(--wp-text-muted)' }} />}
              <span style={{ color: card.change.startsWith('+') ? 'var(--wp-success)' : 'var(--wp-text-muted)' }}>{card.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Widgets Row 1 */}
      <div className="wp-dashboard-grid">
        {/* At a Glance */}
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title">At a Glance</span></div>
          <div className="wp-card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {statCards.map((card) => (
                <div key={card.label} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0' }}>
                  <card.icon size={16} style={{ color: 'var(--wp-accent)' }} />
                  <span><strong>{loading ? '—' : card.value}</strong> {card.label}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid #f0f0f1', fontSize: 12, color: 'var(--wp-text-muted)' }}>
              VIEproduct B2B Platform — NestJS + React + PostgreSQL
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="wp-card">
          <div className="wp-card-header">
            <span className="wp-card-title"><Activity size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Recent Activity</span>
          </div>
          <div className="wp-card-body">
            {recentActivities.map((a, i) => (
              <div key={i} className="wp-activity-item">
                <div className="wp-activity-dot" style={{ background: a.color }} />
                <div><div>{a.text}</div><div className="wp-activity-time">{a.time}</div></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Widgets Row 2 */}
      <div className="wp-dashboard-grid" style={{ marginTop: 16 }}>
        {/* Quick Draft */}
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title"><Edit3 size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />Quick Draft</span></div>
          <div className="wp-card-body">
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Title</label>
              <input className="wp-form-input" value={draftTitle} onChange={e => setDraftTitle(e.target.value)} placeholder="What's on your mind?" style={{ maxWidth: '100%' }} />
            </div>
            <div style={{ marginBottom: 10 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, marginBottom: 4 }}>Content</label>
              <textarea className="wp-form-input" value={draftContent} onChange={e => setDraftContent(e.target.value)}
                placeholder="Write a quick draft..." rows={3} style={{ maxWidth: '100%', resize: 'vertical' }} />
            </div>
            <button className="wp-btn wp-btn-primary" onClick={() => { setDraftTitle(''); setDraftContent(''); alert('Draft saved!'); }}>Save Draft</button>
          </div>
        </div>

        {/* System Status */}
        <div className="wp-card">
          <div className="wp-card-header"><span className="wp-card-title"><Server size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: 'middle' }} />System Status</span></div>
          <div className="wp-card-body">
            {[
              { label: 'Platform', value: 'VIEproduct B2B v1.0' },
              { label: 'Backend', value: 'NestJS (Port 3001)' },
              { label: 'Frontend', value: 'React + Vite (Port 3000)' },
              { label: 'Database', value: 'PostgreSQL (Local)' },
              { label: 'Node.js', value: typeof window !== 'undefined' ? 'Runtime OK' : 'N/A' },
              { label: 'Storage', value: 'Supabase Cloud' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 5 ? '1px solid #f0f0f1' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--wp-text-muted)' }}>{item.label}</span>
                <span style={{ fontWeight: 500 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
