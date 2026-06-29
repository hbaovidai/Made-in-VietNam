// ─── Careers Mock DB Utility using LocalStorage ──────────────────

export interface CareerJob {
  id: string;
  slug: string;
  title: { vi: string; en: string };
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Remote' | 'Hybrid' | 'Internship';
  experience: { vi: string; en: string };
  salary: { vi: string; en: string };
  shortDescription: { vi: string; en: string };
  description: { vi: string; en: string };
  requirements: { vi: string; en: string };
  benefits: { vi: string; en: string };
  postedDate: string;
  deadline: string;
  status: 'OPEN' | 'CLOSED' | 'DRAFT';
  order: number;
}

// ─── Default Data ─────────────────────────────────────────────
const DEFAULT_JOBS: CareerJob[] = [
  {
    id: 'job-1',
    slug: 'senior-backend-engineer-nodejs',
    title: {
      vi: 'Lập trình viên Senior Backend (Node.js/Prisma)',
      en: 'Senior Backend Engineer (Node.js/Prisma)'
    },
    department: 'Engineering',
    location: 'Hanoi',
    type: 'Full-time',
    experience: { vi: '3+ năm kinh nghiệm', en: '3+ years experience' },
    salary: { vi: '1,500 – 2,500 USD', en: '$1,500 – $2,500' },
    shortDescription: {
      vi: 'Xây dựng API hiệu năng cao, tối ưu cơ sở dữ liệu và tích hợp hệ thống logistics cho nền tảng B2B Marketplace.',
      en: 'Build high-performance APIs, optimize databases and integrate logistics solutions for our B2B marketplace platform.'
    },
    description: {
      vi: '• Thiết kế và phát triển các dịch vụ backend chất lượng cao sử dụng Node.js & NestJS.\n• Tối ưu hóa các câu lệnh SQL/Prisma và kiến trúc cơ sở dữ liệu PostgreSQL.\n• Hợp tác chặt chẽ với đội ngũ Frontend để cung cấp API trực quan, tin cậy.\n• Viết unit test và integration test, đảm bảo code coverage > 80%.',
      en: '• Design and implement high-quality backend services using Node.js & NestJS.\n• Optimize SQL/Prisma queries and PostgreSQL database schemas.\n• Collaborate with the Frontend team to deliver clean, reliable APIs.\n• Write unit and integration tests, maintaining >80% code coverage.'
    },
    requirements: {
      vi: '• Có ít nhất 3 năm kinh nghiệm lập trình Backend với Node.js.\n• Thành thạo cơ sở dữ liệu PostgreSQL và ORM như Prisma hoặc TypeORM.\n• Có tư duy giải quyết vấn đề tốt, làm việc độc lập và làm việc nhóm hiệu quả.\n• Ưu tiên ứng viên có kinh nghiệm với Docker, CI/CD pipeline.',
      en: '• At least 3 years of Backend development experience with Node.js.\n• Proficient in PostgreSQL and ORM frameworks such as Prisma or TypeORM.\n• Strong problem-solving skills and ability to work independently or in teams.\n• Docker and CI/CD pipeline experience is a plus.'
    },
    benefits: {
      vi: '• Lương cạnh tranh, thưởng theo hiệu suất.\n• Bảo hiểm y tế cao cấp cho nhân viên và gia đình.\n• 15 ngày phép năm + nghỉ lễ theo quy định.\n• Máy tính xách tay và thiết bị làm việc được cung cấp.',
      en: '• Competitive salary with performance bonus.\n• Premium health insurance for employee and family.\n• 15 annual leave days + national holidays.\n• Laptop and work equipment provided.'
    },
    postedDate: '2026-06-15',
    deadline: '2026-07-31',
    status: 'OPEN',
    order: 1
  },
  {
    id: 'job-2',
    slug: 'international-market-development-specialist',
    title: {
      vi: 'Chuyên viên Phát triển Thị trường Quốc tế (B2B)',
      en: 'International Market Development Specialist'
    },
    department: 'Sales & Marketing',
    location: 'Ho Chi Minh City',
    type: 'Full-time',
    experience: { vi: '2+ năm kinh nghiệm', en: '2+ years experience' },
    salary: { vi: 'Thỏa thuận (Lương cứng + Hoa hồng)', en: 'Negotiable (Base + Commission)' },
    shortDescription: {
      vi: 'Kết nối và hỗ trợ các nhà cung cấp Việt Nam xuất khẩu sản phẩm sang thị trường quốc tế.',
      en: 'Connect and support Vietnamese suppliers in exporting their products to international markets.'
    },
    description: {
      vi: '• Tìm kiếm, tiếp cận và thuyết phục các nhà máy, xưởng sản xuất lớn gia nhập nền tảng B2B.\n• Tư vấn giải pháp chuyển đổi số xuất khẩu và tối ưu gian hàng trực tuyến.\n• Hỗ trợ đàm phán thương mại giữa nhà mua hàng nước ngoài và nhà sản xuất trong nước.\n• Xây dựng chiến lược mở rộng thị trường và tăng trưởng doanh thu.',
      en: '• Identify, approach, and onboard factories and large manufacturers to our B2B platform.\n• Advise on export digital solutions and storefront optimizations.\n• Facilitate trade negotiations between foreign buyers and local manufacturers.\n• Develop market expansion strategies and revenue growth plans.'
    },
    requirements: {
      vi: '• Tốt nghiệp Đại học Ngoại thương, Kinh tế đối ngoại hoặc các ngành liên quan.\n• Có 2 năm kinh nghiệm trong lĩnh vực B2B Sales, xuất nhập khẩu hoặc logistics.\n• Khả năng giao tiếp tiếng Anh tốt (biết thêm tiếng Trung là một lợi thế lớn).',
      en: '• Bachelor degree in Foreign Trade, Economics, or related fields.\n• 2+ years of experience in B2B sales, import-export, or logistics.\n• Fluency in English (knowledge of Chinese is a major asset).'
    },
    benefits: {
      vi: '• Lương cứng hấp dẫn + hoa hồng không giới hạn.\n• Cơ hội du lịch công tác quốc tế.\n• Đào tạo chuyên sâu về thương mại quốc tế và nền tảng công nghệ.',
      en: '• Attractive base salary + uncapped commission.\n• International business travel opportunities.\n• In-depth training on international trade and technology platforms.'
    },
    postedDate: '2026-06-12',
    deadline: '2026-07-25',
    status: 'OPEN',
    order: 2
  },
  {
    id: 'job-3',
    slug: 'frontend-developer-react-typescript',
    title: {
      vi: 'Lập trình viên Frontend Developer (React/TS)',
      en: 'Frontend Developer (React/TypeScript)'
    },
    department: 'Engineering',
    location: 'Remote',
    type: 'Remote',
    experience: { vi: '2+ năm kinh nghiệm', en: '2+ years experience' },
    salary: { vi: '1,200 – 2,000 USD', en: '$1,200 – $2,000' },
    shortDescription: {
      vi: 'Phát triển các phân hệ quản trị Dashboard cho nhà cung cấp, nhà mua hàng và tối ưu hiệu năng hiển thị.',
      en: 'Develop Dashboard management modules for suppliers, buyers and optimize page speed performance.'
    },
    description: {
      vi: '• Xây dựng các giao diện người dùng tương tác cao, responsive sử dụng React, TypeScript và Tailwind CSS.\n• Tối ưu hóa SEO, khả năng truy cập (accessibility) và hiệu năng tải trang.\n• Phát triển các component dùng chung có tính tái sử dụng cao.\n• Tham gia code review và cải thiện chất lượng mã nguồn.',
      en: '• Build highly interactive, responsive user interfaces using React, TypeScript, and Tailwind CSS.\n• Optimize pages for SEO, accessibility, and loading performance.\n• Develop highly reusable shared components.\n• Participate in code reviews and improve overall code quality.'
    },
    requirements: {
      vi: '• Có từ 2 năm kinh nghiệm với React.js và hệ sinh thái Modern JavaScript.\n• Hiểu biết sâu sắc về HTML5, CSS3, ES6+ và responsive design.\n• Sử dụng tốt Git và có kinh nghiệm làm việc với RESTful APIs.',
      en: '• 2+ years of hands-on experience with React.js and modern JS ecosystem.\n• Strong knowledge of HTML5, CSS3, ES6+, and responsive design.\n• Proficient in Git and experienced working with RESTful APIs.'
    },
    benefits: {
      vi: '• Làm việc Remote toàn thời gian.\n• Lương cạnh tranh, trả theo USD.\n• Lịch làm việc linh hoạt, tự quản thời gian.',
      en: '• Full-time remote work.\n• Competitive salary paid in USD.\n• Flexible schedule, self-managed time.'
    },
    postedDate: '2026-06-10',
    deadline: '2026-07-20',
    status: 'OPEN',
    order: 3
  },
  {
    id: 'job-4',
    slug: 'supplier-verification-auditor',
    title: {
      vi: 'Chuyên viên Thẩm định Nhà cung cấp & Chuỗi cung ứng',
      en: 'Supplier Verification & Supply Chain Auditor'
    },
    department: 'Operations',
    location: 'Hanoi',
    type: 'Full-time',
    experience: { vi: '3+ năm kinh nghiệm', en: '3+ years experience' },
    salary: { vi: 'Thỏa thuận', en: 'Negotiable' },
    shortDescription: {
      vi: 'Thực hiện đánh giá thực địa năng lực sản xuất, giấy chứng nhận chất lượng của nhà máy sản xuất tại Việt Nam.',
      en: 'Perform on-site assessments of manufacturing capabilities and quality certificates of factories in Vietnam.'
    },
    description: {
      vi: '• Lên lịch trình và trực tiếp đi khảo sát thực địa tại các nhà máy, cơ sở sản xuất đối tác.\n• Xác minh giấy phép kinh doanh, tiêu chuẩn ISO, năng lực xuất khẩu và hệ thống QC.\n• Lập báo cáo thẩm định nhà cung cấp bằng tiếng Việt và tiếng Anh.',
      en: '• Schedule and conduct on-site factory audits and partner facility tours.\n• Verify business licenses, ISO standards, export capacities, and QC systems.\n• Compile supplier assessment reports in both Vietnamese and English.'
    },
    requirements: {
      vi: '• Có kinh nghiệm làm QC, đánh giá nhà máy hoặc quản lý chuỗi cung ứng trong ngành sản xuất.\n• Nắm rõ các quy chuẩn xuất khẩu cơ bản (CE, FDA, ISO, BSCI).\n• Có khả năng đi công tác tỉnh thường xuyên.',
      en: '• Experience in QC, factory audit, or supply chain management in manufacturing.\n• Familiar with basic export certifications (CE, FDA, ISO, BSCI).\n• Willingness to travel frequently for audits.'
    },
    benefits: {
      vi: '• Phụ cấp công tác phí đầy đủ.\n• Bảo hiểm y tế cho nhân viên.\n• Cơ hội tiếp xúc đa dạng ngành công nghiệp.',
      en: '• Full business travel allowance.\n• Employee health insurance.\n• Exposure to diverse industries.'
    },
    postedDate: '2026-06-08',
    deadline: '2026-07-15',
    status: 'OPEN',
    order: 4
  },
  {
    id: 'job-5',
    slug: 'product-manager-sourcing-verification',
    title: {
      vi: 'Quản trị viên Sản phẩm (Product Manager - Sourcing)',
      en: 'Product Manager - Sourcing & Verification'
    },
    department: 'Product Management',
    location: 'Hanoi',
    type: 'Full-time',
    experience: { vi: '4+ năm kinh nghiệm', en: '4+ years experience' },
    salary: { vi: 'Thỏa thuận', en: 'Negotiable' },
    shortDescription: {
      vi: 'Định hình lộ trình sản phẩm, phát triển tính năng hỗ trợ nhà mua hàng quốc tế tìm kiếm và thanh toán an toàn.',
      en: 'Shape product roadmap, developing features that help international buyers search products and conduct secure trade.'
    },
    description: {
      vi: '• Thu thập yêu cầu từ người dùng quốc tế và các phòng ban kinh doanh.\n• Phác thảo Wireframe, đặc tả tài liệu PRD cho bộ phận phát triển.\n• Đo lường các chỉ số trải nghiệm người dùng B2B (conversion rate, retention rate).',
      en: '• Gather requirements from global users and internal business units.\n• Draft wireframes, write detailed Product Requirement Documents (PRDs).\n• Measure and analyze B2B user experience metrics (conversion, retention).'
    },
    requirements: {
      vi: '• Có từ 4 năm kinh nghiệm làm PM cho các sản phẩm E-commerce, B2B SaaS hoặc Fintech.\n• Kỹ năng tư duy logic xuất sắc, hiểu biết tốt về UX/UI và Technical flow.\n• Khả năng tiếng Anh lưu loát để trao đổi trực tiếp với khách hàng nước ngoài.',
      en: '• 4+ years of Product Management experience in E-commerce, B2B SaaS, or Fintech.\n• Excellent analytical thinking, strong understanding of UX/UI and tech workflows.\n• Fluent English command to communicate directly with overseas buyers.'
    },
    benefits: {
      vi: '• Lương cạnh tranh nhất thị trường.\n• Cơ hội định hình sản phẩm B2B quy mô toàn cầu.\n• Môi trường đa quốc gia, trẻ trung và sáng tạo.',
      en: '• Top-of-market competitive salary.\n• Opportunity to shape a global-scale B2B product.\n• Multicultural, young, and creative environment.'
    },
    postedDate: '2026-06-05',
    deadline: '2026-07-10',
    status: 'OPEN',
    order: 5
  },
  {
    id: 'job-6',
    slug: 'global-customer-success-specialist',
    title: {
      vi: 'Chuyên viên Hỗ trợ Khách hàng Quốc tế (Anh - Trung)',
      en: 'Global Customer Success Specialist (EN - CN)'
    },
    department: 'Customer Success',
    location: 'Ho Chi Minh City',
    type: 'Full-time',
    experience: { vi: '1+ năm kinh nghiệm', en: '1+ years experience' },
    salary: { vi: '800 – 1,200 USD', en: '$800 – $1,200' },
    shortDescription: {
      vi: 'Hỗ trợ giải đáp thắc mắc, kết nối giao thương B2B và điều phối các yêu cầu báo giá (RFQ) từ khách hàng quốc tế.',
      en: 'Support inquiries, facilitate B2B matching and coordinate RFQs from international buyers.'
    },
    description: {
      vi: '• Tiếp nhận các yêu cầu báo giá RFQ, kiểm tra độ tin cậy và khớp thông tin với nhà cung cấp phù hợp.\n• Hỗ trợ khách hàng quốc tế giải quyết khiếu nại hoặc tranh chấp hợp đồng ban đầu.\n• Duy trì mối quan hệ và hướng dẫn khách hàng sử dụng các công cụ giao thương.',
      en: '• Receive RFQs, verify buyer details, and match with qualified manufacturers.\n• Assist international buyers in resolving dispute issues or initial contract queries.\n• Maintain relationship and onboard global buyers on using marketplace tools.'
    },
    requirements: {
      vi: '• Sử dụng thành thạo Tiếng Anh và Tiếng Trung (nghe, nói, đọc, viết).\n• Giao tiếp khéo léo, có kinh nghiệm làm Chăm sóc khách hàng hoặc Trợ lý xuất khẩu.\n• Chịu được áp lực công việc tốt và có tinh thần trách nhiệm cao.',
      en: '• Proficiency in both English and Chinese languages (verbal & written).\n• Strong communication skills, experience in Customer Success or export assistant roles.\n• Ability to handle work pressure and highly responsible.'
    },
    benefits: {
      vi: '• Phụ cấp ngôn ngữ hấp dẫn.\n• Đào tạo quy trình thương mại quốc tế.\n• Thưởng theo KPI hàng quý.',
      en: '• Attractive language allowance.\n• International trade process training.\n• Quarterly KPI bonuses.'
    },
    postedDate: '2026-06-01',
    deadline: '2026-07-05',
    status: 'CLOSED',
    order: 6
  }
];

// ─── DB Functions ─────────────────────────────────────────────
import { jsonStorage } from '../lib/jsonStorage';

const COLLECTION = 'careers';

export const careersDb = {
  getJobs: (): CareerJob[] => {
    return jsonStorage.readCached<CareerJob[]>(COLLECTION, DEFAULT_JOBS);
  },

  saveJobs: (jobs: CareerJob[]): void => {
    jsonStorage.writeCached(COLLECTION, jobs);
  },

  getJobBySlug: (slug: string): CareerJob | undefined => {
    const jobs = careersDb.getJobs();
    return jobs.find(j => j.slug === slug);
  },

  getOpenJobs: (): CareerJob[] => {
    return careersDb.getJobs()
      .filter(j => j.status === 'OPEN')
      .sort((a, b) => a.order - b.order || new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  },

  isSlugUnique: (slug: string, excludeId?: string): boolean => {
    const jobs = careersDb.getJobs();
    return !jobs.some(j => j.slug === slug && j.id !== excludeId);
  }
};

