"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const supplier = await prisma.supplier.findFirst();
    if (!supplier) {
        console.log('❌ Chưa có supplier. Tạo supplier trước!');
        return;
    }
    console.log('✅ Supplier:', supplier.companyName);
    await prisma.supplier.update({
        where: { id: supplier.id },
        data: {
            description: 'Chuyên sản xuất và xuất khẩu các sản phẩm gốm sứ cao cấp, nội thất tre và hàng thủ công mỹ nghệ Việt Nam. Đội ngũ nghệ nhân hơn 20 năm kinh nghiệm.',
            businessType: 'manufacturer',
            yearEstablished: 2005,
            employeeCount: '50-100',
            city: 'Bình Dương',
            province: 'Bình Dương',
            address: '123 Đường Mỹ Phước, TX Bến Cát, Bình Dương',
            website: 'https://congty-mau.vn',
            isVerified: true,
            verificationStatus: 'VERIFIED',
        },
    });
    console.log('✅ Cập nhật supplier đầy đủ');
    await prisma.certification.createMany({
        data: [
            { supplierId: supplier.id, name: 'ISO 9001:2015', issuedBy: 'Bureau Veritas', issuedDate: new Date('2022-01-15') },
            { supplierId: supplier.id, name: 'FSC Certified', issuedBy: 'FSC International', issuedDate: new Date('2023-06-01') },
        ],
        skipDuplicates: true,
    });
    await prisma.supplierMarket.createMany({
        data: [
            { supplierId: supplier.id, market: 'Bắc Mỹ' },
            { supplierId: supplier.id, market: 'Châu Âu' },
            { supplierId: supplier.id, market: 'Nhật Bản' },
            { supplierId: supplier.id, market: 'Hàn Quốc' },
        ],
        skipDuplicates: true,
    });
    const category = await prisma.category.upsert({
        where: { slug: 'noi-that-trang-tri' },
        update: {},
        create: { name: 'Nội thất & Trang trí', slug: 'noi-that-trang-tri' },
    });
    const subCategory = await prisma.category.upsert({
        where: { slug: 'gom-su-cao-cap' },
        update: {},
        create: { name: 'Gốm sứ cao cấp', slug: 'gom-su-cao-cap', parentId: category.id },
    });
    console.log('✅ Danh mục:', category.name, '>', subCategory.name);
    const product = await prisma.product.create({
        data: {
            supplierId: supplier.id,
            categoryId: subCategory.id,
            name: 'Bộ bình gốm sứ Bát Tràng men lam - Phong cách truyền thống Việt Nam',
            nameEn: 'Bat Trang Blue Glaze Ceramic Vase Set - Traditional Vietnamese Style',
            slug: 'bo-binh-gom-su-bat-trang-men-lam-' + Date.now(),
            description: `Bộ bình gốm sứ Bát Tràng men lam cao cấp, được chế tác hoàn toàn thủ công bởi các nghệ nhân làng nghề Bát Tràng với hơn 700 năm lịch sử.

🏺 ĐẶC ĐIỂM NỔI BẬT:
• Chất liệu đất sét Bát Tràng nguyên chất, nung ở 1.280°C
• Men lam cobalt truyền thống, màu sắc bền vĩnh viễn
• Hoạ tiết vẽ tay bởi nghệ nhân, mỗi sản phẩm là duy nhất
• An toàn thực phẩm, không chứa chì

🎁 BỘ SẢN PHẨM GỒM:
• 1 bình hoa lớn (H: 35cm, Ø: 18cm)
• 2 bình nhỏ trang trí (H: 20cm, Ø: 12cm)  
• 1 đĩa trang trí (Ø: 25cm)

📦 ĐÓNG GÓI XUẤT KHẨU:
• Hộp carton 5 lớp + xốp PE chống sốc
• Đạt tiêu chuẩn vận chuyển đường biển quốc tế
• Tỷ lệ hư hỏng < 0.5%

✅ CHỨNG NHẬN:
• ISO 9001:2015
• FSC Certified
• Kiểm tra chất lượng theo tiêu chuẩn EU`,
            descriptionEn: 'Premium Bat Trang blue glaze ceramic vase set, entirely handcrafted by artisans from Bat Trang village with over 700 years of history.',
            minPrice: 850000,
            maxPrice: 1200000,
            currency: 'VND',
            unit: 'bộ',
            moq: 50,
            moqUnit: 'bộ',
            status: 'ACTIVE',
            rating: 4.8,
            reviewCount: 127,
            viewCount: 3254,
            rfqMinQuantity: 100,
            images: [
                'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800',
                'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800',
                'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=800',
                'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800',
            ],
        },
    });
    console.log('✅ Sản phẩm:', product.name);
    console.log('\n🎉 Done! Truy cập: http://localhost:5173/products/' + product.id);
    console.log('⚠️  Xoá file này: rm prisma/seed-sample-product.ts');
}
main()
    .catch(e => { console.error('❌', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=seed-sample-product.js.map