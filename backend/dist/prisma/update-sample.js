"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const product = await prisma.product.findFirst({
        where: { name: { contains: 'Bát Tràng' } },
    });
    if (!product) {
        console.log('❌ Không tìm thấy sản phẩm mẫu');
        return;
    }
    await prisma.product.update({
        where: { id: product.id },
        data: {
            origin: 'Việt Nam',
            leadTime: '15-30 ngày',
            brand: 'Bát Tràng Premium',
            sku: 'BT-VLAM-SET-001',
            productionCapacity: '5,000 bộ/tháng',
            port: 'Cảng Cát Lái, HCM',
            exportMarkets: 'Nhật Bản, Hàn Quốc, Châu Âu, Bắc Mỹ',
            attributes: {
                'Màu sắc': ['Men lam cổ điển', 'Men trắng ngà', 'Men xanh ngọc', 'Men nâu đất'],
                'Kích thước': ['Bộ nhỏ (3 món)', 'Bộ trung (4 món)', 'Bộ lớn (6 món)'],
                'Hoạ tiết': ['Hoa sen', 'Rồng phượng', 'Phong cảnh', 'Trơn'],
                'Chất liệu': ['Sứ trắng Bát Tràng', 'Đất sét đỏ'],
            },
            customizations: [
                'OEM Manufacturing',
                'ODM Service',
                'In logo riêng',
                'Bao bì tùy chỉnh',
                'Thiết kế hoạ tiết theo yêu cầu',
                'Đóng gói quà tặng',
            ],
            specifications: {
                'Chất liệu': 'Sứ trắng Bát Tràng nguyên chất',
                'Nhiệt độ nung': '1.280°C',
                'Men': 'Cobalt truyền thống',
                'Bình lớn': 'H: 35cm, Ø: 18cm',
                'Bình nhỏ': 'H: 20cm, Ø: 12cm',
                'Đĩa trang trí': 'Ø: 25cm',
                'Trọng lượng bộ': '4.5 kg',
                'An toàn thực phẩm': 'Có - không chứa chì',
                'Xuất xứ': 'Làng gốm Bát Tràng, Hà Nội',
                'Tiêu chuẩn': 'ISO 9001:2015, EU Food Contact',
            },
        },
    });
    console.log('✅ Đã cập nhật sản phẩm:', product.name);
    console.log('🔗 Truy cập: http://localhost:5173/products/' + product.id);
}
main()
    .catch(e => { console.error('❌', e); process.exit(1); })
    .finally(() => prisma.$disconnect());
//# sourceMappingURL=update-sample.js.map