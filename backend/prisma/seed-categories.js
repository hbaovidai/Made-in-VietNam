const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Cấu trúc cây ngành hàng B2B:
 * 
 * 1. Cơ khí & Gia công kim loại
 *    ├── Gia công kim loại chính xác
 *    │   ├── Máy Công Cụ & CNC
 *    │   │   ├── Trung tâm gia công CNC
 *    │   │   ├── Máy tiện
 *    │   │   ├── Máy phay
 *    │   │   ├── Máy mài & đánh bóng
 *    │   │   └── Máy khoan & doa
 *    │   └── Gia Công & Định Hình Kim Loại
 *    └── Nhựa, cao su & vật liệu tổng hợp
 * 
 * 2. Nông nghiệp & Thực phẩm
 *    ├── Nông sản xuất khẩu
 *    ├── Thủy hải sản
 *    └── Thực phẩm chế biến
 * 
 * 3. Dệt may & Thời trang
 *    ├── Vải & nguyên phụ liệu
 *    ├── May mặc xuất khẩu
 *    └── Giày dép & phụ kiện
 * 
 * 4. Điện & Điện tử
 *    ├── Linh kiện điện tử
 *    ├── Thiết bị điện công nghiệp
 *    └── Đèn LED & chiếu sáng
 * 
 * 5. Vật liệu xây dựng
 *    ├── Thép & kim loại
 *    ├── Xi măng & bê tông
 *    └── Gạch, đá & ốp lát
 * 
 * 6. Hóa chất & Dược phẩm
 *    ├── Hóa chất công nghiệp
 *    ├── Dược phẩm & y tế
 *    └── Mỹ phẩm & chăm sóc cá nhân
 * 
 * 7. Đồ gỗ & Nội thất
 *    ├── Nội thất gia đình
 *    ├── Nội thất văn phòng
 *    └── Gỗ nguyên liệu
 * 
 * 8. Bao bì & In ấn
 *    ├── Bao bì nhựa
 *    ├── Bao bì giấy & carton
 *    └── In ấn công nghiệp
 * 
 * 9. Logistics & Vận tải
 *    ├── Vận tải đường biển
 *    ├── Vận tải hàng không
 *    └── Kho bãi & fulfillment
 * 
 * 10. Năng lượng & Môi trường
 *     ├── Năng lượng tái tạo
 *     ├── Thiết bị xử lý nước
 *     └── Thiết bị môi trường
 */

function slugify(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const CATEGORIES_TREE = [
  {
    name: 'Cơ khí & Gia công kim loại',
    children: [
      {
        name: 'Gia công kim loại chính xác',
        children: [
          {
            name: 'Máy Công Cụ & CNC',
            children: [
              { name: 'Trung tâm gia công CNC' },
              { name: 'Máy tiện' },
              { name: 'Máy phay' },
              { name: 'Máy mài & đánh bóng' },
              { name: 'Máy khoan & doa' },
            ],
          },
          {
            name: 'Gia Công & Định Hình Kim Loại',
            children: [
              { name: 'Dập, cắt & đột dập' },
              { name: 'Hàn & cắt laser' },
              { name: 'Uốn & gấp kim loại' },
            ],
          },
        ],
      },
      {
        name: 'Nhựa, cao su & vật liệu tổng hợp',
        children: [
          { name: 'Ép nhựa & đùn nhựa' },
          { name: 'Sản phẩm cao su kỹ thuật' },
        ],
      },
    ],
  },
  {
    name: 'Nông nghiệp & Thực phẩm',
    children: [
      {
        name: 'Nông sản xuất khẩu',
        children: [
          {
            name: 'Gạo & ngũ cốc',
            children: [
              { name: 'Gạo Jasmine' },
              { name: 'Gạo ST25' },
              { name: 'Gạo nếp' },
            ],
          },
          {
            name: 'Cà phê & ca cao',
            children: [
              { name: 'Cà phê Robusta' },
              { name: 'Cà phê Arabica' },
              { name: 'Ca cao nguyên chất' },
            ],
          },
          {
            name: 'Hạt điều & gia vị',
            children: [
              { name: 'Hạt điều nhân trắng' },
              { name: 'Hồ tiêu đen' },
              { name: 'Quế & hồi' },
            ],
          },
        ],
      },
      {
        name: 'Thủy hải sản',
        children: [
          {
            name: 'Tôm xuất khẩu',
            children: [
              { name: 'Tôm sú' },
              { name: 'Tôm thẻ chân trắng' },
              { name: 'Tôm hùm' },
            ],
          },
          {
            name: 'Cá & hải sản khác',
            children: [
              { name: 'Cá tra fillet' },
              { name: 'Cá ngừ đại dương' },
              { name: 'Mực & bạch tuộc' },
            ],
          },
        ],
      },
      {
        name: 'Thực phẩm chế biến',
        children: [
          { name: 'Nước mắm & gia vị' },
          { name: 'Mì ăn liền & snack' },
          { name: 'Đồ hộp & đông lạnh' },
        ],
      },
    ],
  },
  {
    name: 'Dệt may & Thời trang',
    children: [
      {
        name: 'Vải & nguyên phụ liệu',
        children: [
          {
            name: 'Vải dệt thoi',
            children: [
              { name: 'Vải cotton' },
              { name: 'Vải polyester' },
              { name: 'Vải pha sợi' },
            ],
          },
          {
            name: 'Vải dệt kim',
            children: [
              { name: 'Vải thun cotton' },
              { name: 'Vải thun lạnh' },
              { name: 'Vải rib & interlock' },
            ],
          },
          { name: 'Phụ liệu may mặc' },
        ],
      },
      {
        name: 'May mặc xuất khẩu',
        children: [
          { name: 'Áo sơ mi & áo polo' },
          { name: 'Quần jeans & khaki' },
          { name: 'Đồng phục công sở' },
          { name: 'Áo khoác & jacket' },
        ],
      },
      {
        name: 'Giày dép & phụ kiện',
        children: [
          { name: 'Giày da nam nữ' },
          { name: 'Giày thể thao' },
          { name: 'Dép & sandal' },
          { name: 'Túi xách & ba lô' },
        ],
      },
    ],
  },
  {
    name: 'Điện & Điện tử',
    children: [
      {
        name: 'Linh kiện điện tử',
        children: [
          { name: 'IC & vi mạch' },
          { name: 'Tụ điện & điện trở' },
          { name: 'Board mạch PCB' },
          { name: 'Connector & cáp' },
        ],
      },
      {
        name: 'Thiết bị điện công nghiệp',
        children: [
          { name: 'Tủ điện & bảng điều khiển' },
          { name: 'Biến tần & khởi động từ' },
          { name: 'Cảm biến công nghiệp' },
        ],
      },
      {
        name: 'Đèn LED & chiếu sáng',
        children: [
          { name: 'Đèn LED panel' },
          { name: 'Đèn LED công nghiệp' },
          { name: 'Đèn trang trí & sân vườn' },
        ],
      },
    ],
  },
  {
    name: 'Vật liệu xây dựng',
    children: [
      {
        name: 'Thép & kim loại',
        children: [
          { name: 'Thép hình & thép ống' },
          { name: 'Thép tấm & cuộn' },
          { name: 'Inox & nhôm' },
        ],
      },
      {
        name: 'Xi măng & bê tông',
        children: [
          { name: 'Xi măng Portland' },
          { name: 'Bê tông trộn sẵn' },
          { name: 'Phụ gia bê tông' },
        ],
      },
      {
        name: 'Gạch, đá & ốp lát',
        children: [
          { name: 'Gạch ceramic' },
          { name: 'Đá granite & marble' },
          { name: 'Gạch block & gạch không nung' },
        ],
      },
    ],
  },
  {
    name: 'Bao bì & In ấn',
    children: [
      {
        name: 'Bao bì nhựa',
        children: [
          { name: 'Túi PE & PP' },
          { name: 'Chai nhựa PET' },
          { name: 'Màng co & màng stretch' },
        ],
      },
      {
        name: 'Bao bì giấy & carton',
        children: [
          { name: 'Thùng carton sóng' },
          { name: 'Hộp giấy in offset' },
          { name: 'Bao bì giấy kraft' },
        ],
      },
      { name: 'In ấn công nghiệp' },
    ],
  },
];

async function upsertCategory(name, parentId = null) {
  const slug = slugify(name);
  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) {
    console.log(`  ✓ Đã có: ${name}`);
    return existing;
  }
  const created = await prisma.category.create({
    data: { name, slug, parentId },
  });
  console.log(`  + Tạo mới: ${name}`);
  return created;
}

async function seedTree(items, parentId = null, depth = 0) {
  for (const item of items) {
    const indent = '  '.repeat(depth);
    const cat = await upsertCategory(item.name, parentId);
    if (item.children && item.children.length > 0) {
      await seedTree(item.children, cat.id, depth + 1);
    }
  }
}

async function main() {
  console.log('\n🌱 Bắt đầu seed ngành hàng B2B...\n');
  await seedTree(CATEGORIES_TREE);
  
  // Show result
  const total = await prisma.category.count();
  const roots = await prisma.category.count({ where: { parentId: null } });
  console.log(`\n✅ Hoàn tất! Tổng: ${total} danh mục (${roots} ngành hàng cha)\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
