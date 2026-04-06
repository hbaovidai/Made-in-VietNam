export interface Product {
  id: string;
  name: string;
  priceRange: string;
  moq: string;
  category: string;
  image: string;
  supplierId: string;
  description: string;
  rating: number;
  reviews: number;
}

export interface Supplier {
  id: string;
  name: string;
  logo: string;
  banner: string;
  description: string;
  isVerified: boolean;
  industry: string[];
  location: string;
  markets: string[];
  certifications: string[];
  yearEstablished: number;
}

export interface Category {
  name: string;
  children: string[];
}

export const categories: string[] = [
  "Nông sản",
  "Dệt may & May mặc",
  "Nội thất & Trang trí",
  "Thủ công mỹ nghệ",
  "Điện tử",
  "Thực phẩm & Đồ uống"
];

export const nestedCategories: Category[] = [
  {
    name: "Nông sản",
    children: ["Hạt cà phê", "Gia vị", "Gạo", "Trái cây sấy", "Hải sản"]
  },
  {
    name: "Dệt may & May mặc",
    children: ["Áo thun", "Áo khoác", "Váy", "Giày dép", "Túi xách & Hành lý"]
  },
  {
    name: "Nội thất & Trang trí",
    children: ["Nội thất tre", "Ghế mây", "Trang trí nhà cửa", "Nội thất văn phòng", "Nội thất ngoài trời"]
  },
  {
    name: "Thủ công mỹ nghệ",
    children: ["Giỏ xách", "Gốm sứ", "Sơn mài", "Sản phẩm lụa", "Đồ gỗ chạm khắc"]
  },
  {
    name: "Điện tử",
    children: ["Điện thoại di động", "Phụ kiện", "Thiết bị thông minh", "Âm thanh gia đình", "Máy tính & Phần cứng"]
  },
  {
    name: "Thực phẩm & Đồ uống",
    children: ["Đồ ăn vặt", "Đồ uống", "Thực phẩm đóng hộp", "Thực phẩm chức năng"]
  }
];

export const suppliers: Supplier[] = [];

export const products: Product[] = [];
