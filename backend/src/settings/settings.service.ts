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
  async updateMany(data: Record<string, string>): Promise<Record<string, string>> {
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
