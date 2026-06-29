import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Default values for site settings
const DEFAULTS: Record<string, string> = {
  contact_email: 'contact@vieproduct.com',
  contact_phone: '+84 899 123 456',
  contact_address: '123 Lê Lợi, Quận 1, TP. Hồ Chí Minh, Việt Nam',
  facebook_url: '',
  twitter_url: '',
  linkedin_url: '',
  instagram_url: '',
  hero_banners: JSON.stringify([
    {
      id: 'slide-1',
      image:
        'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
      title: "Vietnam's Top Manufacturing Hub",
      titleVi: 'Trung tâm sản xuất hàng đầu Việt Nam',
      desc: 'Source directly from verified factories. High-quality industrial products, textiles, and electronics.',
      descVi:
        'Tìm nguồn cung ứng trực tiếp từ các nhà máy đã xác minh. Sản phẩm công nghiệp, dệt may và điện tử chất lượng cao.',
      link: '/products',
    },
    {
      id: 'slide-2',
      image:
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1200',
      title: 'Top Ranking Products',
      titleVi: 'Sản phẩm Xếp hạng Hàng đầu',
      desc: 'Verified suppliers and audited products',
      descVi: 'Những nhà cung cấp và sản phẩm đã qua kiểm định',
      link: '/products',
    },
    {
      id: 'slide-3',
      image:
        'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&q=80&w=1200',
      title: 'Secured Trading Service',
      titleVi: 'Dịch vụ giao dịch an toàn',
      desc: 'Cross-border secure trade assurance',
      descVi: 'Đảm bảo giao dịch an toàn xuyên quốc gia',
      link: '/products',
    },
  ]),
  legal_terms_title_vi: 'Điều khoản dịch vụ',
  legal_terms_title_en: 'Terms of Service',
  legal_terms_subtitle_vi:
    'Điều khoản và điều kiện sử dụng dịch vụ nền tảng VIEProduct B2B Trade.',
  legal_terms_subtitle_en:
    'Terms and conditions for using the VIEProduct B2B Trade platform.',
  legal_terms_last_updated: '2026-06-24',
  legal_terms_banner_bg: '',
  privacy_policy_title_vi: 'Chính sách bảo mật',
  privacy_policy_title_en: 'Privacy Policy',
  privacy_policy_subtitle_vi:
    'Chúng tôi cam kết bảo vệ dữ liệu cá nhân và quyền riêng tư của bạn.',
  privacy_policy_subtitle_en:
    'We are committed to protecting your personal data and privacy.',
  privacy_policy_last_updated: '2026-06-24',
  privacy_policy_banner_bg: '',
};

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  /** Get all settings as a flat object */
  async getAll(): Promise<Record<string, string>> {
    const rows = await this.prisma.siteSetting.findMany();
    const result = { ...DEFAULTS };
    for (const row of rows) {
      result[row.key] = row.value;
    }
    return result;
  }

  /** Get a single setting */
  async get(key: string): Promise<string> {
    const row = await this.prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? DEFAULTS[key] ?? '';
  }

  /** Upsert multiple settings at once */
  async updateMany(
    data: Record<string, string>,
  ): Promise<Record<string, string>> {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      }),
    );
    await this.prisma.$transaction(ops);
    return this.getAll();
  }
}
