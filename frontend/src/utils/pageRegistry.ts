// ─── Central Page Registry ───────────────────────────────────
// Single source of truth for all public pages.
// AdminPages reads this automatically — no hardcoding needed.
// When you add a new page, just add an entry here.

export interface PageEntry {
  id: string;
  title: string;
  path: string;
  group: string;        // e.g. "Chính", "Dịch vụ", "Trợ giúp", "Pháp lý"
  status: 'Published' | 'Draft' | 'Hidden';
  author: string;
  createdAt: string;
  updatedAt: string;
  description?: string; // Short note for admin reference
}

export const PAGE_REGISTRY: PageEntry[] = [
  // ── Trang chính ──
  { id: 'p-home',       title: 'Trang chủ',                path: '/',                        group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-06-01', description: 'Landing page chính của website' },
  { id: 'p-products',   title: 'Danh sách sản phẩm',       path: '/products',                group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-06-01' },
  { id: 'p-suppliers',  title: 'Nhà cung cấp',             path: '/suppliers',               group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-06-01' },
  { id: 'p-rfq',        title: 'Yêu cầu báo giá (RFQ)',    path: '/rfq',                     group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-02-01', updatedAt: '2026-05-20' },
  { id: 'p-verify',     title: 'Xác minh sản phẩm',        path: '/verify',                  group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-02-01', updatedAt: '2026-05-15' },
  { id: 'p-about',      title: 'Giới thiệu',               path: '/about',                   group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-05-20' },
  { id: 'p-contact',    title: 'Liên hệ',                  path: '/contact',                 group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-05-20' },
  { id: 'p-blog',       title: 'Blog',                     path: '/blog',                    group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-03-01', updatedAt: '2026-06-15' },
  { id: 'p-careers',    title: 'Tuyển dụng',               path: '/careers',                 group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-06-01', updatedAt: '2026-06-22' },
  { id: 'p-cart',       title: 'Giỏ hàng',                 path: '/cart',                    group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-02-15', updatedAt: '2026-05-01' },
  { id: 'p-reports',    title: 'Báo cáo thị trường',       path: '/reports',                 group: 'Chính',    status: 'Published', author: 'Admin', createdAt: '2026-04-01', updatedAt: '2026-06-01' },

  // ── Dịch vụ ──
  { id: 'p-services',   title: 'Dịch vụ',                  path: '/services',                group: 'Dịch vụ',  status: 'Published', author: 'Admin', createdAt: '2026-03-01', updatedAt: '2026-05-20' },
  { id: 'p-trade',      title: 'Trade Assurance',           path: '/services/trade-assurance', group: 'Dịch vụ', status: 'Published', author: 'Admin', createdAt: '2026-03-01', updatedAt: '2026-05-20' },
  { id: 'p-secured',    title: 'Secured Trading',           path: '/services/secured-trading', group: 'Dịch vụ', status: 'Published', author: 'Admin', createdAt: '2026-03-15', updatedAt: '2026-05-20' },

  // ── Trợ giúp ──
  { id: 'p-help',       title: 'Trung tâm trợ giúp',       path: '/help',                    group: 'Trợ giúp', status: 'Published', author: 'Admin', createdAt: '2026-02-01', updatedAt: '2026-04-15' },
  { id: 'p-seller',     title: 'Hướng dẫn bán hàng',       path: '/help/seller-guide',       group: 'Trợ giúp', status: 'Published', author: 'Admin', createdAt: '2026-02-15', updatedAt: '2026-05-01' },
  { id: 'p-user',       title: 'Hướng dẫn sử dụng',        path: '/help/user-guide',         group: 'Trợ giúp', status: 'Published', author: 'Admin', createdAt: '2026-02-15', updatedAt: '2026-05-01' },

  // ── Pháp lý ──
  { id: 'p-privacy',    title: 'Chính sách bảo mật',       path: '/privacy',                 group: 'Pháp lý',  status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-03-10' },
  { id: 'p-terms',      title: 'Điều khoản dịch vụ',       path: '/terms',                   group: 'Pháp lý',  status: 'Published', author: 'Admin', createdAt: '2026-01-15', updatedAt: '2026-03-10' },

  // ── Xác thực ──
  { id: 'p-login',      title: 'Đăng nhập',                path: '/login',                   group: 'Xác thực', status: 'Published', author: 'System', createdAt: '2026-01-15', updatedAt: '2026-01-15' },
  { id: 'p-register',   title: 'Đăng ký',                  path: '/register',                group: 'Xác thực', status: 'Published', author: 'System', createdAt: '2026-01-15', updatedAt: '2026-01-15' },
];

// Helper functions
export const getPublishedPages = () => PAGE_REGISTRY.filter(p => p.status === 'Published');
export const getPageGroups = () => [...new Set(PAGE_REGISTRY.map(p => p.group))];
export const getPageByPath = (path: string) => PAGE_REGISTRY.find(p => p.path === path);
