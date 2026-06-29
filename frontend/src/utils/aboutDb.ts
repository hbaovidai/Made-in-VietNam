// ─── About Page Data Utility ─────────────────────────────────
// Manages content for the public /about page.
// Uses JSON file storage on server (via API), with localStorage as cache.

import { jsonStorage } from '../lib/jsonStorage';

export interface AboutStat {
  labelVi: string;
  labelEn: string;
  value: string;
  icon: string; // 'shield' | 'globe' | 'users' | 'award'
}

export interface AboutData {
  heroTitleVi: string;
  heroTitleEn: string;
  heroDescVi: string;
  heroDescEn: string;
  stats: AboutStat[];
  missionTitleVi: string;
  missionTitleEn: string;
  missionDescVi: string;
  missionDescEn: string;
  missionPoints: { vi: string; en: string }[];
  missionImage: string;
  missionQuoteVi: string;
  missionQuoteEn: string;
}

const DEFAULT_DATA: AboutData = {
  heroTitleVi: 'Nâng tầm chất lượng sản xuất Việt Nam ra thế giới',
  heroTitleEn: 'Empowering Vietnamese Excellence Globally',
  heroDescVi: 'VIEproduct là nền tảng B2B kết nối các nhà sản xuất và cung cấp uy tín tại Việt Nam với người mua trên toàn thế giới — giúp đơn giản hoá quy trình tìm kiếm nguồn hàng, xác minh đối tác và giao thương quốc tế.',
  heroDescEn: 'VIEproduct is a B2B platform connecting verified Vietnamese manufacturers and suppliers with global buyers — simplifying sourcing, partner verification, and international trade.',
  stats: [
    { labelVi: 'Nhà cung cấp đã xác minh', labelEn: 'Verified Suppliers', value: '50+', icon: 'shield' },
    { labelVi: 'Sản phẩm trên sàn', labelEn: 'Products Listed', value: '500+', icon: 'globe' },
    { labelVi: 'Người mua quốc tế', labelEn: 'Global Buyers', value: '200+', icon: 'users' },
    { labelVi: 'Thị trường xuất khẩu', labelEn: 'Export Markets', value: '10+', icon: 'award' },
  ],
  missionTitleVi: 'Sứ mệnh của chúng tôi',
  missionTitleEn: 'Our Mission',
  missionDescVi: 'Chúng tôi tin rằng các doanh nghiệp sản xuất Việt Nam hoàn toàn có thể cạnh tranh trên thị trường quốc tế. VIEproduct cam kết trở thành cầu nối tin cậy nhất, giúp các nhà cung cấp Việt Nam tiếp cận người mua toàn cầu một cách dễ dàng và minh bạch.',
  missionDescEn: 'We believe Vietnamese manufacturers can compete globally. VIEproduct is committed to being the most trusted bridge, helping Vietnamese suppliers reach global buyers with ease and transparency.',
  missionPoints: [
    { vi: 'Xác minh nhà cung cấp thực địa 100%', en: 'On-site supplier verification' },
    { vi: 'Hỗ trợ giao thương đa ngôn ngữ', en: 'Multi-language trade support' },
    { vi: 'Bảo vệ giao dịch an toàn (Trade Assurance)', en: 'Trade Assurance protection' },
    { vi: 'Báo giá nhanh — RFQ trong 24h', en: 'Fast quotation — RFQ within 24h' },
  ],
  missionImage: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&q=80&w=1000',
  missionQuoteVi: '"Kết nối Việt Nam với thế giới — từng sản phẩm, từng đối tác."',
  missionQuoteEn: '"Connecting Vietnam to the world — one product, one partner at a time."',
};

const COLLECTION = 'about';

export const aboutDb = {
  getData: (): AboutData => {
    return jsonStorage.readCached<AboutData>(COLLECTION, DEFAULT_DATA);
  },

  saveData: (data: AboutData): void => {
    jsonStorage.writeCached(COLLECTION, data);
  },

  resetToDefault: (): AboutData => {
    jsonStorage.writeCached(COLLECTION, DEFAULT_DATA);
    return DEFAULT_DATA;
  }
};
