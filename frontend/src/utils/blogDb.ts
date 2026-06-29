// ─── Blog Mock DB Utility using LocalStorage ──────────────────

export interface BlogPost {
  id: string;
  category: string; // matches category key
  slug?: string;
  title: {
    en: string;
    vi: string;
  };
  excerpt: {
    en: string;
    vi: string;
  };
  content: {
    en: string;
    vi: string;
  };
  date: string;
  readTime: {
    en: string;
    vi: string;
  };
  image: string;
  status: 'DRAFT' | 'PUBLISHED' | 'HIDDEN';
  author: string;
  order: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogCategory {
  id: string;
  key: string;
  en: string;
  vi: string;
  order: number;
  isVisible: boolean;
}

export interface BlogSettings {
  titleEn: string;
  titleVi: string;
  subtitleEn: string;
  subtitleVi: string;
  showSearch: boolean;
  showCategories: boolean;
  postsPerPage: number;
  layout: 'grid' | 'list';
  featuredPostId: string;
}

// ─── Default Data ─────────────────────────────────────────────
const DEFAULT_CATEGORIES: BlogCategory[] = [
  { id: 'cat-1', key: 'industry-news', en: 'Industry News', vi: 'Tin tức ngành', order: 1, isVisible: true },
  { id: 'cat-2', key: 'supplier-guide', en: 'Supplier Guide', vi: 'Hướng dẫn nhà cung cấp', order: 2, isVisible: true },
  { id: 'cat-3', key: 'sourcing-tips', en: 'Sourcing Tips', vi: 'Bí quyết tìm hàng', order: 3, isVisible: true },
  { id: 'cat-4', key: 'market-trends', en: 'Market Trends', vi: 'Xu hướng thị trường', order: 4, isVisible: true }
];

const DEFAULT_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    category: 'industry-news',
    title: {
      en: "Vietnam's Manufacturing Sector Records 12% Export Growth in Q2 2026",
      vi: "Ngành Sản Xuất Việt Nam Ghi Nhận Mức Tăng Trưởng Xuất Khẩu 12% Trong Quý II/2026"
    },
    excerpt: {
      en: "Detailed analysis of Vietnam's manufacturing boom, driven by strong demands in electronics, textiles, and wood products in the global market.",
      vi: "Phân tích chi tiết về sự bùng nổ sản xuất của Việt Nam, được thúc đẩy bởi nhu cầu mạnh mẽ đối với linh kiện điện tử, dệt may và đồ gỗ."
    },
    content: {
      en: "Vietnam's manufacturing and processing sector has continued its strong upward trajectory, recording a notable 12% year-on-year increase in export turnover for the second quarter of 2026. This surge is primarily driven by high global demand for electronics, footwear, apparel, and high-quality wooden furniture.\n\nIndustry experts attribute this positive performance to the continuous flow of Foreign Direct Investment (FDI) into northern manufacturing hubs like Hai Phong and Bac Ninh, alongside the growing optimization of supply chains by global brands shifting their production bases to Southeast Asia.\n\nB2B buyers sourcing from Vietnam can expect stabilized production capacities and improved port infrastructure. However, logistics partners advise booking shipments early to mitigate peak-season ocean freight spikes scheduled for the latter half of the year.",
      vi: "Ngành công nghiệp chế biến, chế tạo Việt Nam tiếp tục đà bứt phá mạnh mẽ, ghi nhận kim ngạch xuất khẩu tăng trưởng 12% so với cùng kỳ năm ngoái trong Quý II năm 2026. Động lực chính đến từ nhu cầu lớn trên toàn cầu đối với sản phẩm điện tử, giày dép, dệt may và đồ gỗ gia dụng chất lượng cao.\n\nCác chuyên gia kinh tế nhận định kết quả khả quan này có được nhờ dòng vốn đầu tư trực tiếp nước ngoài (FDI) liên tục đổ vào các cụm công nghiệp trọng điểm phía Bắc như Hải Phòng và Bắc Ninh, cùng sự tối ưu hóa chuỗi cung ứng của các thương hiệu đa quốc gia dịch chuyển cơ sở sản xuất sang Đông Nam Á.\n\nĐối với các nhà nhập khẩu B2B tìm nguồn hàng tại Việt Nam, đây là tín hiệu tích cực về năng lực sản xuất ổn định và cơ sở hạ tầng cảng biển đang ngày càng cải thiện. Tuy nhiên, các đơn vị logistics khuyến cáo nên chủ động đặt lịch xuất xưởng sớm để tránh tình trạng giá cước tàu biển tăng cao vào cuối năm."
    },
    date: '2026-06-15',
    readTime: { en: '4 min read', vi: '4 phút đọc' },
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    author: 'Admin',
    order: 1,
    seoTitle: "Vietnam Manufacturing Export Growth Q2 2026",
    seoDescription: "Analysis of Vietnam's 12% manufacturing export growth in Q2 2026."
  },
  {
    id: 'post-2',
    category: 'supplier-guide',
    title: {
      en: "How to Verify Vietnamese Suppliers: A Complete Checklist for Global Buyers",
      vi: "Hướng Dẫn Xác Minh Nhà Cung Cấp Việt Nam: Danh Sách Kiểm Tra Đầy Đủ Cho Người Mua Quốc Tế"
    },
    excerpt: {
      en: "Crucial steps and regulatory paperwork required to verify legal representative status, manufacturing licenses, and product certifications in Vietnam.",
      vi: "Các bước quan trọng và giấy tờ pháp lý cần thiết để xác minh tư cách người đại diện pháp luật, giấy phép kinh doanh và chứng nhận chất lượng tại Việt Nam."
    },
    content: {
      en: "Sourcing from a new country offers competitive pricing but demands strict due diligence. When evaluating potential business partners in Vietnam, the first step is to verify their Business Registration Certificate (ERC - Enterprise Registration Certificate) issued by the Ministry of Planning and Investment.\n\nAlways confirm that the legal representative named on the contract matches official government database records. Additionally, request audited financial statements, factory capacity reports, and check if they hold international certifications relevant to your market, such as ISO 9001, BSCI, or CE/FCC badges.\n\nVIEproduct simplifies this process by displaying verified tags next to suppliers who have passed our rigorous on-site inspection and legal document audits, helping you trade with confidence.",
      vi: "Tìm kiếm nhà cung cấp mới mở ra nhiều cơ hội về chi phí nhưng đòi hỏi quy trình rà soát đối tác nghiêm ngặt. Khi đánh giá các đối tác tiềm năng tại Việt Nam, bước đầu tiên là yêu cầu họ cung cấp Giấy Chứng Nhận Đăng Ký Doanh Nghiệp (ERC) do Bộ Kế hoạch và Đầu tư cấp.\n\nHãy luôn đối chiếu xem người đại diện pháp luật ký kết hợp đồng có khớp với thông tin đăng ký chính thức của chính phủ hay không. Bên cạnh đó, việc kiểm tra báo cáo tài chính đã kiểm toán, năng lực nhà máy thực tế và các chứng chỉ chất lượng quốc tế như ISO 9001, BSCI hay chứng nhận CE/FCC là vô cùng cần thiết.\n\nHệ thống VIEproduct hỗ trợ tối đa quy trình này bằng việc gắn nhãn 'Đã xác minh' (Verified) đối với các doanh nghiệp đã vượt qua vòng thẩm định hồ sơ pháp lý và kiểm tra nhà xưởng trực tiếp của chúng tôi."
    },
    date: '2026-06-10',
    readTime: { en: '6 min read', vi: '6 phút đọc' },
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    author: 'Sourcing Expert',
    order: 2,
    seoTitle: "Verify Vietnamese Suppliers Checklist",
    seoDescription: "Step-by-step guide to verify company registrations, licenses and tax codes in Vietnam."
  },
  {
    id: 'post-3',
    category: 'sourcing-tips',
    title: {
      en: "Navigating Logistics & Customs for Wood & Furniture Exports from Vietnam",
      vi: "Thủ Tục Hải Quan & Logistics Xuất Khẩu Đồ Gỗ Mỹ Nghệ Từ Việt Nam"
    },
    excerpt: {
      en: "Avoid costly shipping delays. Master the key custom declarations, HS codes, and required fumigation certificates for exporting furniture.",
      vi: "Tránh chậm trễ vận chuyển tốn kém. Nắm vững các tờ khai hải quan chính, mã HS và chứng nhận khử trùng bắt buộc khi xuất khẩu đồ nội thất."
    },
    content: {
      en: "Vietnam has grown into one of the world's leading wooden furniture exporters. However, exporting organic products like timber and rattan requires careful adherence to customs regulations, specifically forestry certifications and sanitation standards.\n\nTo ensure a smooth shipping process, buyers must verify the timber origin documents (compliant with VPA/FLEGT agreements) to prove the raw wood was legally harvested. Furthermore, a phytosanitary certificate and a fumigation treatment record are mandatory before the container is sealed and loaded onto the vessel.\n\nCollaborating with an experienced freight forwarder who is familiar with Vietnamese port clearance processes at Cat Lai (HCMC) or Lach Huyen (Hai Phong) will save you days of unnecessary customs hold-ups.",
      vi: "Việt Nam đã trở thành một trong những quốc gia xuất khẩu đồ gỗ nội thất lớn nhất thế giới. Tuy nhiên, việc xuất khẩu các sản phẩm có nguồn gốc tự nhiên như gỗ, tre nứa đòi hỏi sự hiểu biết kỹ lưỡng về thủ tục hải quan, đặc biệt là chứng chỉ xuất xứ lâm sản và kiểm dịch.\n\nĐể đảm bảo quá trình thông quan thuận lợi, người mua cần yêu cầu đối tác Việt Nam chuẩn bị hồ sơ chứng minh nguồn gốc gỗ hợp pháp (tuân thủ các thỏa thuận VPA/FLEGT). Ngoài ra, giấy chứng nhận kiểm dịch thực vật (Phytosanitary Certificate) và chứng thư khử trùng (Fumigation Certificate) là bắt buộc trước khi đóng container lên tàu.\n\nHợp tác với một đơn vị forwarder uy tín, thông thạo quy trình làm thủ tục thông quan tại cảng Cát Lái (TP.HCM) hoặc cảng Lạch Huyện (Hải Phòng) sẽ giúp doanh nghiệp tiết kiệm rất nhiều thời gian và chi phí phát sinh."
    },
    date: '2026-05-28',
    readTime: { en: '5 min read', vi: '5 phút đọc' },
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deceeaf7?auto=format&fit=crop&w=800&q=80',
    status: 'PUBLISHED',
    author: 'Logistics Team',
    order: 3,
    seoTitle: "Furniture Export Logistics Vietnam",
    seoDescription: "Customs clear guidelines for wood exports from Cat Lai or Lach Huyen ports."
  }
];

const DEFAULT_SETTINGS: BlogSettings = {
  titleEn: "Insights & Blog",
  titleVi: "Tin tức & Xu hướng",
  subtitleEn: "Insights, guides and industry updates for global sourcing.",
  subtitleVi: "Kiến thức, cẩm nang và cập nhật thị trường dành cho nguồn cung ứng toàn cầu.",
  showSearch: true,
  showCategories: true,
  postsPerPage: 6,
  layout: 'grid',
  featuredPostId: 'post-1'
};

// ─── DB Functions ─────────────────────────────────────────────
import { jsonStorage } from '../lib/jsonStorage';

export const blogDb = {
  getPosts: (): BlogPost[] => {
    return jsonStorage.readCached<BlogPost[]>('blog-posts', DEFAULT_POSTS);
  },

  savePosts: (posts: BlogPost[]): void => {
    jsonStorage.writeCached('blog-posts', posts);
  },

  getCategories: (): BlogCategory[] => {
    return jsonStorage.readCached<BlogCategory[]>('blog-categories', DEFAULT_CATEGORIES);
  },

  saveCategories: (categories: BlogCategory[]): void => {
    jsonStorage.writeCached('blog-categories', categories);
  },

  getSettings: (): BlogSettings => {
    return jsonStorage.readCached<BlogSettings>('blog-settings', DEFAULT_SETTINGS);
  },

  saveSettings: (settings: BlogSettings): void => {
    jsonStorage.writeCached('blog-settings', settings);
  }
};

