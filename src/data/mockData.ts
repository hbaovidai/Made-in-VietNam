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

export const suppliers: Supplier[] = [
  {
    id: "s1",
    name: "Công ty Xuất khẩu Nông sản Việt",
    logo: "https://picsum.photos/seed/agro/200/200",
    banner: "https://picsum.photos/seed/agrobanner/1200/400",
    description: "Nhà xuất khẩu hàng đầu về hạt cà phê và gia vị Việt Nam chất lượng cao. Chúng tôi làm việc trực tiếp với nông dân địa phương để đảm bảo các phương thức canh tác bền vững.",
    isVerified: true,
    industry: ["Nông sản", "Thực phẩm & Đồ uống"],
    location: "Đắk Lắk, Việt Nam",
    markets: ["Châu Âu", "Bắc Mỹ", "Nhật Bản"],
    certifications: ["ISO 9001", "HACCP", "Fair Trade"],
    yearEstablished: 2005
  },
  {
    id: "s2",
    name: "Tập đoàn Dệt may Sài Gòn",
    logo: "https://picsum.photos/seed/textile/200/200",
    banner: "https://picsum.photos/seed/textilebanner/1200/400",
    description: "Chuyên sản xuất hàng may mặc cao cấp cho các thương hiệu toàn cầu. Các cơ sở của chúng tôi được trang bị máy móc hiện đại.",
    isVerified: true,
    industry: ["Dệt may & May mặc"],
    location: "TP. Hồ Chí Minh, Việt Nam",
    markets: ["Mỹ", "EU", "Úc"],
    certifications: ["WRAP", "OEKO-TEX", "SA8000"],
    yearEstablished: 1998
  },
  {
    id: "s3",
    name: "Thủ công mỹ nghệ Tre Việt",
    logo: "https://picsum.photos/seed/bamboo/200/200",
    banner: "https://picsum.photos/seed/bamboobanner/1200/400",
    description: "Thủ công mỹ nghệ truyền thống kết hợp với thiết kế hiện đại. Chúng tôi sản xuất nội thất tre và mây thân thiện với môi trường cho thị trường quốc tế.",
    isVerified: true,
    industry: ["Nội thất & Trang trí", "Thủ công mỹ nghệ"],
    location: "Hà Nội, Việt Nam",
    markets: ["Toàn cầu"],
    certifications: ["FSC", "BSCI"],
    yearEstablished: 2012
  },
  {
    id: "s4",
    name: "Nông sản Đồng bằng sông Cửu Long",
    logo: "https://picsum.photos/seed/mekong/200/200",
    banner: "https://picsum.photos/seed/mekong-banner/1200/400",
    description: "Nhà xuất khẩu trực tiếp các sản phẩm nông nghiệp cao cấp từ vùng Đồng bằng sông Cửu Long màu mỡ. Chúng tôi tập trung vào canh tác hữu cơ và thương mại công bằng.",
    isVerified: true,
    industry: ["Nông sản", "Thực phẩm & Đồ uống"],
    location: "Cần Thơ, Việt Nam",
    markets: ["Trung Quốc", "Hàn Quốc", "Trung Đông"],
    certifications: ["GlobalGAP", "HACCP", "USDA Organic"],
    yearEstablished: 2012
  },
  {
    id: "s5",
    name: "Điện tử & Linh kiện Hà Nội",
    logo: "https://picsum.photos/seed/hanoielec/200/200",
    banner: "https://picsum.photos/seed/hanoielec-banner/1200/400",
    description: "Chuyên cung cấp các linh kiện điện tử có độ chính xác cao và dịch vụ lắp ráp cho ngành công nghiệp công nghệ toàn cầu.",
    isVerified: true,
    industry: ["Điện tử"],
    location: "Bắc Ninh, Việt Nam",
    markets: ["Mỹ", "Hàn Quốc", "Đài Loan"],
    certifications: ["ISO 9001", "RoHS", "UL"],
    yearEstablished: 2015
  }
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Hạt cà phê Arabica thượng hạng",
    priceRange: "110.000đ - 150.000đ / kg",
    moq: "500 kg",
    category: "Nông sản",
    image: "https://picsum.photos/seed/coffee/600/600",
    supplierId: "s1",
    description: "Hạt Arabica hái bằng tay từ vùng cao nguyên miền Trung Việt Nam. Rang vừa với hương vị sô cô la.",
    rating: 4.8,
    reviews: 124
  },
  {
    id: "p2",
    name: "Hạt tiêu đen hữu cơ",
    priceRange: "80.000đ - 100.000đ / kg",
    moq: "200 kg",
    category: "Nông sản",
    image: "https://picsum.photos/seed/pepper/600/600",
    supplierId: "s1",
    description: "Hạt tiêu đen hữu cơ nguyên chất, phơi nắng và phân loại cẩn thận để có hương thơm và độ cay tối đa.",
    rating: 4.9,
    reviews: 86
  },
  {
    id: "p3",
    name: "Áo thun cotton - In theo yêu cầu",
    priceRange: "60.000đ - 85.000đ / cái",
    moq: "1000 cái",
    category: "Dệt may & May mặc",
    image: "https://picsum.photos/seed/tshirt/600/600",
    supplierId: "s2",
    description: "Áo thun 100% cotton chất lượng cao. Có nhiều kích cỡ và màu sắc. Có sẵn dịch vụ in theo yêu cầu.",
    rating: 4.7,
    reviews: 342
  },
  {
    id: "p4",
    name: "Bộ giỏ tre đan tay",
    priceRange: "300.000đ - 380.000đ / bộ",
    moq: "50 bộ",
    category: "Thủ công mỹ nghệ",
    image: "https://picsum.photos/seed/basket/600/600",
    supplierId: "s3",
    description: "Giỏ tre đan tay tuyệt đẹp, hoàn hảo để trang trí nhà cửa hoặc lưu trữ. Thân thiện với môi trường và bền bỉ.",
    rating: 4.6,
    reviews: 54
  },
  {
    id: "p5",
    name: "Gạo thơm hoa nhài cao cấp",
    priceRange: "15.000.000đ - 20.000.000đ / tấn",
    moq: "20 tấn",
    category: "Nông sản",
    image: "https://picsum.photos/seed/rice/600/600",
    supplierId: "s4",
    description: "Gạo thơm hoa nhài hạt dài, thu hoạch từ những cánh đồng tốt nhất ở Đồng bằng sông Cửu Long. Chất lượng xuất khẩu, đánh bóng hai lần.",
    rating: 4.9,
    reviews: 215
  },
  {
    id: "p6",
    name: "Bảng điều khiển nhà thông minh",
    priceRange: "1.100.000đ - 1.600.000đ / thiết bị",
    moq: "100 thiết bị",
    category: "Điện tử",
    image: "https://picsum.photos/seed/smartpanel/600/600",
    supplierId: "s5",
    description: "Bảng điều khiển màn hình cảm ứng tiên tiến cho các hệ thống nhà thông minh. Tương thích với các giao thức IoT lớn.",
    rating: 4.8,
    reviews: 42
  },
  {
    id: "p7",
    name: "Áo khoác Polyester tái chế",
    priceRange: "300.000đ - 450.000đ / cái",
    moq: "300 cái",
    category: "Dệt may & May mặc",
    image: "https://picsum.photos/seed/jacket/600/600",
    supplierId: "s2",
    description: "Áo khoác dã ngoại thân thiện với môi trường làm từ 100% polyester tái chế. Chống nước và thoáng khí.",
    rating: 4.7,
    reviews: 128
  },
  {
    id: "p8",
    name: "Thanh long sấy dẻo",
    priceRange: "200.000đ - 300.000đ / kg",
    moq: "500 kg",
    category: "Thực phẩm & Đồ uống",
    image: "https://picsum.photos/seed/dragonfruit/600/600",
    supplierId: "s4",
    description: "Thanh long đỏ sấy dẻo tự nhiên. Không thêm đường hoặc chất bảo quản. Chứa nhiều chất chống oxy hóa.",
    rating: 4.8,
    reviews: 67
  },
  {
    id: "p9",
    name: "Ghế thư giãn mây hiện đại",
    priceRange: "2.100.000đ - 2.800.000đ / cái",
    moq: "10 cái",
    category: "Nội thất & Trang trí",
    image: "https://picsum.photos/seed/chair/600/600",
    supplierId: "s3",
    description: "Ghế mây thiết kế công thái học với tính thẩm mỹ hiện đại. Thích hợp để sử dụng trong nhà và ngoài trời.",
    rating: 4.9,
    reviews: 21
  },
  {
    id: "p10",
    name: "Bảng mạch in chính xác",
    priceRange: "50.000đ - 125.000đ / cái",
    moq: "5000 cái",
    category: "Điện tử",
    image: "https://picsum.photos/seed/pcb/600/600",
    supplierId: "s5",
    description: "Bảng mạch in nhiều lớp có độ chính xác cao cho các ứng dụng công nghiệp.",
    rating: 4.9,
    reviews: 15
  }
];
