import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding new ecosystem features (Phase 5)...');

  // --- 1. MEMBERSHIP PLANS ---
  console.log('Creating Membership Plans...');
  await prisma.membershipPlan.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'plan_basic_001',
        name: 'Basic Buyer',
        price: 0,
        currency: 'VND',
        billingCycle: 'monthly',
        features: ['Browse Products', 'Send Inquiries', 'Standard Support'],
        isActive: true,
      },
      {
        id: 'plan_gold_001',
        name: 'Gold Supplier',
        price: 990000,
        currency: 'VND',
        billingCycle: 'monthly',
        features: ['Verified Badge', 'Unlimited RFQs', 'Priority Search Ranking', '24/7 Support'],
        isActive: true,
      },
    ],
  });

  // --- 2. REPORTS ---
  console.log('Creating Reports...');
  await prisma.report.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'rep_001',
        title: 'Vietnam Wood & Furniture Industry Outlook 2026',
        description: 'Báo cáo toàn cảnh ngành xuất khẩu gỗ và nội thất Việt Nam, phân tích nhu cầu thị trường EU & US.',
        category: 'Industry Data',
        coverImage: 'https://images.unsplash.com/photo-1611082531652-fddba4cdd3ca?auto=format&fit=crop&q=80&w=600',
        pdfUrl: 'https://example.com/reports/vietnam-wood-2026.pdf',
        price: 0,
      },
      {
        id: 'rep_002',
        title: 'Q2/2026 Agricultural Export Growth Analysis',
        description: 'Phân tích số liệu xuất khẩu nông sản quý 2 năm 2026, đánh giá cơ hội và thách thức chuỗi cung ứng.',
        category: 'AgriBusiness',
        coverImage: 'https://images.unsplash.com/photo-1595841696677-6489ff3f8cd1?auto=format&fit=crop&q=80&w=600',
        pdfUrl: 'https://example.com/reports/agri-q2-2026.pdf',
        price: 0,
      },
      {
        id: 'rep_003',
        title: 'Báo cáo Cung ứng Bền vững (Sustainability Index)',
        description: 'Khảo sát hơn 1000 nhà máy sản xuất về áp dụng các tiêu chuẩn quản trị ESG.',
        category: 'ESG',
        coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600',
        pdfUrl: 'https://example.com/reports/esg-impact.pdf',
        price: 15.0,
      }
    ]
  });

  console.log('✅ Seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
