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
          { name: 'Hạt cà phê', href: '/products?cat=coffee' },
          { name: 'Gia vị', href: '/products?cat=spices' },
          { name: 'Gạo', href: '/products?cat=rice' },
          { name: 'Trái cây sấy', href: '/products?cat=dried-fruits' },
          { name: 'Hải sản', href: '/products?cat=seafood' },
        ]
      }
    ]
  },
  {
    id: 'det-may',
    slug: 'det-may',
    name: 'Dệt may & May mặc',
    image: 'https://picsum.photos/seed/apparel/400/600',
    sections: [
      {
        title: 'Quần áo & Phụ kiện',
        subcategories: [
          { name: 'Áo thun', href: '/products?cat=tshirts' },
          { name: 'Áo khoác', href: '/products?cat=jackets' },
          { name: 'Váy', href: '/products?cat=dresses' },
          { name: 'Giày dép', href: '/products?cat=footwear' },
          { name: 'Túi xách & Hành lý', href: '/products?cat=bags' },
        ]
      }
    ]
  },
  {
    id: 'noi-that',
    slug: 'noi-that',
    name: 'Nội thất & Trang trí',
    image: 'https://picsum.photos/seed/furniture/400/600',
    sections: [
      {
        title: 'Nội thất',
        subcategories: [
          { name: 'Nội thất tre', href: '/products?cat=bamboo-furniture' },
          { name: 'Ghế mây', href: '/products?cat=rattan-chairs' },
          { name: 'Trang trí nhà cửa', href: '/products?cat=home-decor' },
          { name: 'Nội thất văn phòng', href: '/products?cat=office-furniture' },
          { name: 'Nội thất ngoài trời', href: '/products?cat=outdoor-furniture' },
        ]
      }
    ]
  },
  {
    id: 'thu-cong',
    slug: 'thu-cong',
    name: 'Thủ công mỹ nghệ',
    image: 'https://picsum.photos/seed/handicrafts/400/600',
    sections: [
      {
        title: 'Sản phẩm thủ công',
        subcategories: [
          { name: 'Giỏ xách', href: '/products?cat=baskets' },
          { name: 'Gốm sứ', href: '/products?cat=ceramics' },
          { name: 'Sơn mài', href: '/products?cat=lacquerware' },
          { name: 'Sản phẩm lụa', href: '/products?cat=silk' },
          { name: 'Đồ gỗ chạm khắc', href: '/products?cat=wood-carvings' },
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
          { name: 'Điện thoại di động', href: '/products?cat=mobile' },
          { name: 'Phụ kiện', href: '/products?cat=accessories' },
          { name: 'Thiết bị thông minh', href: '/products?cat=smart-devices' },
          { name: 'Âm thanh gia đình', href: '/products?cat=home-audio' },
          { name: 'Máy tính & Phần cứng', href: '/products?cat=computers' },
        ]
      }
    ]
  },
  {
    id: 'thuc-pham',
    slug: 'thuc-pham',
    name: 'Thực phẩm & Đồ uống',
    image: 'https://picsum.photos/seed/food/400/600',
    sections: [
      {
        title: 'Thực phẩm & Đồ uống',
        subcategories: [
          { name: 'Đồ ăn vặt', href: '/products?cat=snacks' },
          { name: 'Đồ uống', href: '/products?cat=beverages' },
          { name: 'Thực phẩm đóng hộp', href: '/products?cat=canned-food' },
          { name: 'Thực phẩm chức năng', href: '/products?cat=supplements' },
        ]
      }
    ]
  }
];

export const ALL_CATEGORIES_LIST = [
  { name: "Nông sản", slug: "nong-san" },
  { name: "Dệt may & May mặc", slug: "det-may" },
  { name: "Nội thất & Trang trí", slug: "noi-that" },
  { name: "Thủ công mỹ nghệ", slug: "thu-cong" },
  { name: "Điện tử", slug: "dien-tu" },
  { name: "Thực phẩm & Đồ uống", slug: "thuc-pham" }
];
