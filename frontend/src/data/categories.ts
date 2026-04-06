export interface SubCategory {
  name: string;
  href: string;
}

export interface CategorySection {
  title: string;
  subcategories: SubCategory[];
}

export interface CategoryGroup {
  id: string;
  slug: string;
  name: string;
  image: string;
  sections: CategorySection[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: 'nong-san',
    slug: 'nong-san',
    name: 'Nông sản',
    image: 'https://picsum.photos/seed/agriculture/400/600',
    sections: [
      {
        title: 'Nông sản & Thực phẩm',
        subcategories: [
          { name: 'Hạt cà phê', href: '/products?category=hat-ca-phe' },
          { name: 'Gia vị', href: '/products?category=gia-vi' },
          { name: 'Gạo', href: '/products?category=gao' },
          { name: 'Trái cây sấy', href: '/products?category=trai-cay-say' },
          { name: 'Hải sản', href: '/products?category=hai-san' },
        ]
      }
    ]
  },
  {
    id: 'det-may-may-mac',
    slug: 'det-may-may-mac',
    name: 'Dệt may & May mặc',
    image: 'https://picsum.photos/seed/apparel/400/600',
    sections: [
      {
        title: 'Quần áo & Phụ kiện',
        subcategories: [
          { name: 'Áo thun', href: '/products?category=ao-thun' },
          { name: 'Áo khoác', href: '/products?category=ao-khoac' },
          { name: 'Váy', href: '/products?category=vay' },
          { name: 'Giày dép', href: '/products?category=giay-dep' },
          { name: 'Túi xách & Hành lý', href: '/products?category=tui-xach-hanh-ly' },
        ]
      }
    ]
  },
  {
    id: 'noi-that-trang-tri',
    slug: 'noi-that-trang-tri',
    name: 'Nội thất & Trang trí',
    image: 'https://picsum.photos/seed/furniture/400/600',
    sections: [
      {
        title: 'Nội thất',
        subcategories: [
          { name: 'Nội thất tre', href: '/products?category=noi-that-tre' },
          { name: 'Ghế mây', href: '/products?category=ghe-may' },
          { name: 'Trang trí nhà cửa', href: '/products?category=trang-tri-nha-cua' },
          { name: 'Nội thất văn phòng', href: '/products?category=noi-that-van-phong' },
          { name: 'Nội thất ngoài trời', href: '/products?category=noi-that-ngoai-troi' },
        ]
      }
    ]
  },
  {
    id: 'thu-cong-my-nghe',
    slug: 'thu-cong-my-nghe',
    name: 'Thủ công mỹ nghệ',
    image: 'https://picsum.photos/seed/handicrafts/400/600',
    sections: [
      {
        title: 'Sản phẩm thủ công',
        subcategories: [
          { name: 'Giỏ xách', href: '/products?category=gio-xach' },
          { name: 'Gốm sứ', href: '/products?category=gom-su' },
          { name: 'Sơn mài', href: '/products?category=son-mai' },
          { name: 'Sản phẩm lụa', href: '/products?category=san-pham-lua' },
          { name: 'Đồ gỗ chạm khắc', href: '/products?category=do-go-cham-khac' },
        ]
      }
    ]
  },
  {
    id: 'dien-tu',
    slug: 'dien-tu',
    name: 'Điện tử',
    image: 'https://picsum.photos/seed/electronics/400/600',
    sections: [
      {
        title: 'Thiết bị điện tử',
        subcategories: [
          { name: 'Điện thoại di động', href: '/products?category=dien-thoai-di-dong' },
          { name: 'Phụ kiện', href: '/products?category=phu-kien' },
          { name: 'Thiết bị thông minh', href: '/products?category=thiet-bi-thong-minh' },
          { name: 'Âm thanh gia đình', href: '/products?category=am-thanh-gia-dinh' },
          { name: 'Máy tính & Phần cứng', href: '/products?category=may-tinh-phan-cung' },
        ]
      }
    ]
  },
  {
    id: 'thuc-pham-do-uong',
    slug: 'thuc-pham-do-uong',
    name: 'Thực phẩm & Đồ uống',
    image: 'https://picsum.photos/seed/food/400/600',
    sections: [
      {
        title: 'Thực phẩm & Đồ uống',
        subcategories: [
          { name: 'Đồ ăn vặt', href: '/products?category=do-an-vat' },
          { name: 'Đồ uống', href: '/products?category=do-uong' },
          { name: 'Thực phẩm đóng hộp', href: '/products?category=thuc-pham-dong-hop' },
          { name: 'Thực phẩm chức năng', href: '/products?category=thuc-pham-chuc-nang' },
        ]
      }
    ]
  }
];

export const ALL_CATEGORIES_LIST = [
  { name: "Nông sản", slug: "nong-san" },
  { name: "Dệt may & May mặc", slug: "det-may-may-mac" },
  { name: "Nội thất & Trang trí", slug: "noi-that-trang-tri" },
  { name: "Thủ công mỹ nghệ", slug: "thu-cong-my-nghe" },
  { name: "Điện tử", slug: "dien-tu" },
  { name: "Thực phẩm & Đồ uống", slug: "thuc-pham-do-uong" }
];
