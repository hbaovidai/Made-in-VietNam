"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Seeding database...');
    await prisma.scanEvent.deleteMany();
    await prisma.qRCode.deleteMany();
    await prisma.batch.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.quote.deleteMany();
    await prisma.rFQ.deleteMany();
    await prisma.product.deleteMany();
    await prisma.certification.deleteMany();
    await prisma.supplierIndustry.deleteMany();
    await prisma.supplierMarket.deleteMany();
    await prisma.supplier.deleteMany();
    await prisma.category.deleteMany();
    await prisma.user.deleteMany();
    console.log('  ✅ Cleaned existing data');
    const categoriesData = [
        {
            name: 'Nông sản',
            slug: 'nong-san',
            children: ['Hạt cà phê', 'Gia vị', 'Gạo', 'Trái cây sấy', 'Hải sản'],
        },
        {
            name: 'Dệt may & May mặc',
            slug: 'det-may-may-mac',
            children: ['Áo thun', 'Áo khoác', 'Váy', 'Giày dép', 'Túi xách & Hành lý'],
        },
        {
            name: 'Nội thất & Trang trí',
            slug: 'noi-that-trang-tri',
            children: ['Nội thất tre', 'Ghế mây', 'Trang trí nhà cửa', 'Nội thất văn phòng', 'Nội thất ngoài trời'],
        },
        {
            name: 'Thủ công mỹ nghệ',
            slug: 'thu-cong-my-nghe',
            children: ['Giỏ xách', 'Gốm sứ', 'Sơn mài', 'Sản phẩm lụa', 'Đồ gỗ chạm khắc'],
        },
        {
            name: 'Điện tử',
            slug: 'dien-tu',
            children: ['Điện thoại di động', 'Phụ kiện', 'Thiết bị thông minh', 'Âm thanh gia đình', 'Máy tính & Phần cứng'],
        },
        {
            name: 'Thực phẩm & Đồ uống',
            slug: 'thuc-pham-do-uong',
            children: ['Đồ ăn vặt', 'Đồ uống', 'Thực phẩm đóng hộp', 'Thực phẩm chức năng'],
        },
    ];
    const categoryMap = {};
    for (const cat of categoriesData) {
        const parent = await prisma.category.create({
            data: { name: cat.name, slug: cat.slug },
        });
        categoryMap[cat.name] = parent.id;
        for (const childName of cat.children) {
            const childSlug = childName
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            const child = await prisma.category.create({
                data: { name: childName, slug: childSlug, parentId: parent.id },
            });
            categoryMap[childName] = child.id;
        }
    }
    console.log(`  ✅ Created ${Object.keys(categoryMap).length} categories`);
    const passwordHash = await bcrypt.hash('123456', 10);
    const suppliersData = [
        {
            email: 'agroviet@example.com',
            fullName: 'Nguyễn Văn Hùng',
            company: 'Công ty Xuất khẩu Nông sản Việt',
            slug: 'nong-san-viet',
            description: 'Nhà xuất khẩu hàng đầu về hạt cà phê và gia vị Việt Nam chất lượng cao.',
            businessType: 'manufacturer',
            yearEstablished: 2005,
            city: 'Buôn Ma Thuột',
            province: 'Đắk Lắk',
            industries: ['Nông sản', 'Thực phẩm & Đồ uống'],
            markets: ['Châu Âu', 'Bắc Mỹ', 'Nhật Bản'],
            certifications: ['ISO 9001', 'HACCP', 'Fair Trade'],
        },
        {
            email: 'saigontextile@example.com',
            fullName: 'Trần Thanh Sơn',
            company: 'Tập đoàn Dệt may Sài Gòn',
            slug: 'det-may-sai-gon',
            description: 'Chuyên sản xuất hàng may mặc cao cấp cho các thương hiệu toàn cầu.',
            businessType: 'both',
            yearEstablished: 1998,
            city: 'TP. Hồ Chí Minh',
            province: 'TP. Hồ Chí Minh',
            industries: ['Dệt may & May mặc'],
            markets: ['Mỹ', 'EU', 'Úc'],
            certifications: ['WRAP', 'OEKO-TEX', 'SA8000'],
        },
        {
            email: 'bamboocraft@example.com',
            fullName: 'Lê Minh Tuấn',
            company: 'Thủ công mỹ nghệ Tre Việt',
            slug: 'tre-viet',
            description: 'Thủ công mỹ nghệ truyền thống kết hợp thiết kế hiện đại.',
            businessType: 'manufacturer',
            yearEstablished: 2012,
            city: 'Hà Nội',
            province: 'Hà Nội',
            industries: ['Nội thất & Trang trí', 'Thủ công mỹ nghệ'],
            markets: ['Toàn cầu'],
            certifications: ['FSC', 'BSCI'],
        },
        {
            email: 'mekongfarm@example.com',
            fullName: 'Phạm Thị Lan',
            company: 'Nông sản Đồng bằng sông Cửu Long',
            slug: 'mekong-farm',
            description: 'Nhà xuất khẩu sản phẩm nông nghiệp cao cấp từ vùng Đồng bằng sông Cửu Long.',
            businessType: 'trading',
            yearEstablished: 2012,
            city: 'Cần Thơ',
            province: 'Cần Thơ',
            industries: ['Nông sản', 'Thực phẩm & Đồ uống'],
            markets: ['Trung Quốc', 'Hàn Quốc', 'Trung Đông'],
            certifications: ['GlobalGAP', 'HACCP', 'USDA Organic'],
        },
        {
            email: 'hanoielec@example.com',
            fullName: 'Hoàng Đức Minh',
            company: 'Điện tử & Linh kiện Hà Nội',
            slug: 'ha-noi-elec',
            description: 'Chuyên cung cấp linh kiện điện tử có độ chính xác cao.',
            businessType: 'manufacturer',
            yearEstablished: 2015,
            city: 'Bắc Ninh',
            province: 'Bắc Ninh',
            industries: ['Điện tử'],
            markets: ['Mỹ', 'Hàn Quốc', 'Đài Loan'],
            certifications: ['ISO 9001', 'RoHS', 'UL'],
        },
    ];
    const supplierIdMap = {};
    for (const s of suppliersData) {
        const user = await prisma.user.create({
            data: {
                email: s.email,
                passwordHash,
                fullName: s.fullName,
                role: 'SUPPLIER',
            },
        });
        const supplier = await prisma.supplier.create({
            data: {
                userId: user.id,
                companyName: s.company,
                slug: s.slug,
                description: s.description,
                businessType: s.businessType,
                yearEstablished: s.yearEstablished,
                city: s.city,
                province: s.province,
                logo: `https://picsum.photos/seed/${s.slug}/200/200`,
                banner: `https://picsum.photos/seed/${s.slug}-banner/1200/400`,
                isVerified: true,
            },
        });
        supplierIdMap[s.slug] = supplier.id;
        for (const ind of s.industries) {
            await prisma.supplierIndustry.create({ data: { supplierId: supplier.id, industry: ind } });
        }
        for (const mkt of s.markets) {
            await prisma.supplierMarket.create({ data: { supplierId: supplier.id, market: mkt } });
        }
        for (const cert of s.certifications) {
            await prisma.certification.create({ data: { supplierId: supplier.id, name: cert } });
        }
    }
    console.log(`  ✅ Created ${suppliersData.length} suppliers with users`);
    await prisma.user.create({
        data: {
            email: 'buyer@example.com',
            passwordHash,
            fullName: 'Buyer Test',
            role: 'BUYER',
        },
    });
    console.log('  ✅ Created 1 test buyer');
    const productsData = [
        {
            name: 'Hạt cà phê Arabica thượng hạng',
            slug: 'hat-ca-phe-arabica-thuong-hang',
            minPrice: 110000, maxPrice: 150000, unit: 'kg', moq: 500, moqUnit: 'kg',
            category: 'Hạt cà phê', supplier: 'nong-san-viet',
            description: 'Hạt Arabica hái bằng tay từ vùng cao nguyên miền Trung Việt Nam.',
            image: 'https://picsum.photos/seed/coffee/600/600',
            rating: 4.8, reviews: 124,
        },
        {
            name: 'Hạt tiêu đen hữu cơ',
            slug: 'hat-tieu-den-huu-co',
            minPrice: 80000, maxPrice: 100000, unit: 'kg', moq: 200, moqUnit: 'kg',
            category: 'Gia vị', supplier: 'nong-san-viet',
            description: 'Hạt tiêu đen hữu cơ nguyên chất, phơi nắng và phân loại cẩn thận.',
            image: 'https://picsum.photos/seed/pepper/600/600',
            rating: 4.9, reviews: 86,
        },
        {
            name: 'Áo thun cotton - In theo yêu cầu',
            slug: 'ao-thun-cotton-in-theo-yeu-cau',
            minPrice: 60000, maxPrice: 85000, unit: 'cái', moq: 1000, moqUnit: 'cái',
            category: 'Áo thun', supplier: 'det-may-sai-gon',
            description: 'Áo thun 100% cotton chất lượng cao.',
            image: 'https://picsum.photos/seed/tshirt/600/600',
            rating: 4.7, reviews: 342,
        },
        {
            name: 'Bộ giỏ tre đan tay',
            slug: 'bo-gio-tre-dan-tay',
            minPrice: 300000, maxPrice: 380000, unit: 'bộ', moq: 50, moqUnit: 'bộ',
            category: 'Giỏ xách', supplier: 'tre-viet',
            description: 'Giỏ tre đan tay tuyệt đẹp, hoàn hảo để trang trí nhà cửa.',
            image: 'https://picsum.photos/seed/basket/600/600',
            rating: 4.6, reviews: 54,
        },
        {
            name: 'Gạo thơm hoa nhài cao cấp',
            slug: 'gao-thom-hoa-nhai-cao-cap',
            minPrice: 15000000, maxPrice: 20000000, unit: 'tấn', moq: 20, moqUnit: 'tấn',
            category: 'Gạo', supplier: 'mekong-farm',
            description: 'Gạo thơm hoa nhài hạt dài, thu hoạch từ Đồng bằng sông Cửu Long.',
            image: 'https://picsum.photos/seed/rice/600/600',
            rating: 4.9, reviews: 215,
        },
        {
            name: 'Bảng điều khiển nhà thông minh',
            slug: 'bang-dieu-khien-nha-thong-minh',
            minPrice: 1100000, maxPrice: 1600000, unit: 'thiết bị', moq: 100, moqUnit: 'thiết bị',
            category: 'Thiết bị thông minh', supplier: 'ha-noi-elec',
            description: 'Bảng điều khiển màn hình cảm ứng tiên tiến cho hệ thống nhà thông minh.',
            image: 'https://picsum.photos/seed/smartpanel/600/600',
            rating: 4.8, reviews: 42,
        },
        {
            name: 'Áo khoác Polyester tái chế',
            slug: 'ao-khoac-polyester-tai-che',
            minPrice: 300000, maxPrice: 450000, unit: 'cái', moq: 300, moqUnit: 'cái',
            category: 'Áo khoác', supplier: 'det-may-sai-gon',
            description: 'Áo khoác dã ngoại thân thiện với môi trường từ 100% polyester tái chế.',
            image: 'https://picsum.photos/seed/jacket/600/600',
            rating: 4.7, reviews: 128,
        },
        {
            name: 'Thanh long sấy dẻo',
            slug: 'thanh-long-say-deo',
            minPrice: 200000, maxPrice: 300000, unit: 'kg', moq: 500, moqUnit: 'kg',
            category: 'Trái cây sấy', supplier: 'mekong-farm',
            description: 'Thanh long đỏ sấy dẻo tự nhiên. Không thêm đường hoặc chất bảo quản.',
            image: 'https://picsum.photos/seed/dragonfruit/600/600',
            rating: 4.8, reviews: 67,
        },
        {
            name: 'Ghế thư giãn mây hiện đại',
            slug: 'ghe-thu-gian-may-hien-dai',
            minPrice: 2100000, maxPrice: 2800000, unit: 'cái', moq: 10, moqUnit: 'cái',
            category: 'Ghế mây', supplier: 'tre-viet',
            description: 'Ghế mây thiết kế công thái học với tính thẩm mỹ hiện đại.',
            image: 'https://picsum.photos/seed/chair/600/600',
            rating: 4.9, reviews: 21,
        },
        {
            name: 'Bảng mạch in chính xác',
            slug: 'bang-mach-in-chinh-xac',
            minPrice: 50000, maxPrice: 125000, unit: 'cái', moq: 5000, moqUnit: 'cái',
            category: 'Máy tính & Phần cứng', supplier: 'ha-noi-elec',
            description: 'Bảng mạch in nhiều lớp có độ chính xác cao cho ứng dụng công nghiệp.',
            image: 'https://picsum.photos/seed/pcb/600/600',
            rating: 4.9, reviews: 15,
        },
    ];
    for (const p of productsData) {
        await prisma.product.create({
            data: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                minPrice: p.minPrice,
                maxPrice: p.maxPrice,
                currency: 'VND',
                unit: p.unit,
                moq: p.moq,
                moqUnit: p.moqUnit,
                categoryId: categoryMap[p.category],
                supplierId: supplierIdMap[p.supplier],
                images: [p.image],
                rating: p.rating,
                reviewCount: p.reviews,
            },
        });
    }
    console.log(`  ✅ Created ${productsData.length} products`);
    console.log('\n🎉 Seed completed!');
    console.log('📧 Login accounts (password: 123456):');
    console.log('   - buyer@example.com (BUYER)');
    suppliersData.forEach(s => console.log(`   - ${s.email} (SUPPLIER - ${s.company})`));
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map