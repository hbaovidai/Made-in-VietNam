#!/usr/bin/env node
/**
 * i18n Auto-Apply Script
 * Scans .tsx files for hardcoded Vietnamese, generates keys, translates offline, 
 * updates locale files and replaces in source code.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');
const VI_PATH = path.join(SRC, 'locales', 'vi.json');
const EN_PATH = path.join(SRC, 'locales', 'en.json');

// ── Vietnamese-to-English dictionary (manually curated for B2B platform) ──
const DICT = {
  // Cart
  "Vui lòng đăng nhập": { key: "cart_login_required", en: "Please log in" },
  "Bạn cần đăng nhập để xem Giỏ yêu cầu báo giá": { key: "cart_login_desc", en: "You need to log in to view the Inquiry Basket" },
  "Đang tải Giỏ yêu cầu...": { key: "cart_loading", en: "Loading Inquiry Basket..." },
  "Giỏ yêu cầu trống": { key: "cart_empty_title", en: "Inquiry Basket is empty" },
  "Bạn chưa thêm sản phẩm nào vào Giỏ yêu cầu báo giá.": { key: "cart_empty_desc", en: "You have not added any products to the Inquiry Basket." },
  "Giỏ yêu cầu báo giá (Inquiry Basket)": { key: "cart_page_title", en: "Inquiry Basket" },
  "Tổng lượng yêu cầu": { key: "cart_total_quantity", en: "Total Quantity" },
  "Tạm tính (Tham khảo)": { key: "cart_subtotal_ref", en: "Subtotal (Reference)" },
  "Ước tính tổng cộng": { key: "cart_estimated_total", en: "Estimated Total" },
  "Giao dịch Trung gian B2B An toàn": { key: "cart_b2b_safe_trading", en: "Secure B2B Intermediary Trading" },
  "Tổng sản phẩm": { key: "cart_total_products", en: "Total Products" },
  "Tóm tắt yêu cầu": { key: "cart_inquiry_summary", en: "Inquiry Summary" },

  // Checkout
  "Đang tải trang thanh toán...": { key: "checkout_loading", en: "Loading checkout page..." },
  "Gửi yêu cầu Báo giá hàng loạt": { key: "checkout_bulk_rfq_title", en: "Submit Bulk RFQ" },
  "Kiểm tra thông tin liên hệ và danh sách sản phẩm cần gửi báo giá": { key: "checkout_review_desc", en: "Review contact information and product list for quotation" },
  "Họ tên người liên hệ": { key: "checkout_contact_name", en: "Contact Full Name" },
  "Số điện thoại liên hệ": { key: "checkout_contact_phone", en: "Contact Phone Number" },
  "Địa chỉ nhận hàng dự kiến": { key: "checkout_shipping_address", en: "Expected Delivery Address" },
  "Ghi chú / Yêu cầu đặc biệt (Tùy chọn)": { key: "checkout_special_notes", en: "Notes / Special Requirements (Optional)" },
  "Xác nhận yêu cầu": { key: "checkout_confirm_request", en: "Confirm Request" },
  "Nhà cung cấp sẽ kiểm tra số lượng tồn kho, thời gian sản xuất và liên hệ lại với bạn.": { key: "checkout_confirm_desc", en: "Supplier will check stock availability, production time and get back to you." },
  "Thỏa thuận thương mại": { key: "checkout_trade_agreement", en: "Trade Agreement" },
  "Hai bên tự do đàm phán phương thức thanh toán doanh nghiệp (L/C, T/T, bảo lãnh...) và phương thức vận chuyển phù hợp.": { key: "checkout_trade_agreement_desc", en: "Both parties freely negotiate payment methods (L/C, T/T, guarantee...) and suitable shipping methods." },
  "Giá sỉ tham khảo": { key: "checkout_ref_wholesale_price", en: "Reference Wholesale Price" },
  "Vận chuyển & Thuế": { key: "checkout_shipping_tax", en: "Shipping & Tax" },
  "Thương lượng sau": { key: "checkout_negotiate_later", en: "To be negotiated" },
  "Tổng giá trị tham khảo": { key: "checkout_ref_total", en: "Reference Total Value" },
  "Đang gửi yêu cầu...": { key: "checkout_submitting", en: "Submitting request..." },
  "Thông tin bảo mật": { key: "checkout_privacy_info", en: "Information Security" },
  "Kết nối trực tiếp": { key: "checkout_direct_connect", en: "Direct Connection" },
  "Nền tảng Made in Vietnam đóng vai trò trung gian kết nối B2B, không thu phí giao dịch hay xử lý thanh toán trực tuyến.": { key: "checkout_platform_disclaimer", en: "Made in Vietnam platform acts as a B2B connection intermediary, no transaction fees or online payment processing." },
  "Sản phẩm": { key: "checkout_product_col", en: "Product" },
  "Tạm tính": { key: "checkout_subtotal", en: "Subtotal" },
  "GỬI YÊU CẦU BÁO GIÁ HÀNG LOẠT": { key: "checkout_submit_bulk_rfq", en: "SUBMIT BULK RFQ" },

  // Home
  "Các ngành hàng tiêu biểu": { key: "home_featured_categories", en: "Featured Categories" },
  "Chưa có danh mục nào. Vui lòng thêm danh mục qua Admin Dashboard.": { key: "home_no_categories", en: "No categories yet. Please add categories via Admin Dashboard." },
  "Nhà cung cấp tiêu biểu": { key: "home_featured_suppliers", en: "Featured Suppliers" },
  "Ngành hàng:": { key: "home_industry_label", en: "Industry:" },
  "Xem tất cả": { key: "home_view_all", en: "View All" },
  "Nhà cung cấp xác thực": { key: "home_verified_supplier_badge", en: "Verified Supplier" },
  "Sản phẩm nổi bật": { key: "home_featured_products_section", en: "Featured Products" },
  "Khẳng định sự minh bạch, tăng độ tin cậy với đối tác và nâng cao lợi thế cạnh tranh trên thị trường thông qua hồ sơ": { key: "home_verified_cta_text", en: "Affirm transparency, increase trust with partners and enhance competitive advantage through" },

  // ProductDetail
  "Quay lại danh sách": { key: "product_back_to_list", en: "Back to list" },
  "Mã sản phẩm:": { key: "product_sku_label", en: "Product Code:" },
  "(120 Đơn hàng)": { key: "product_orders_count", en: "(120 Orders)" },
  "Chứng nhận doanh nghiệp": { key: "product_business_certs", en: "Business Certifications" },
  "Các sản phẩm tương tự": { key: "product_similar_items", en: "Similar Products" },
  "Thông tin chi tiết": { key: "product_detail_info", en: "Detailed Information" },
  "Bảng giá theo số lượng (MOQ)": { key: "product_moq_pricing", en: "Quantity-based Pricing (MOQ)" },
  "Yêu cầu báo giá": { key: "product_request_quote", en: "Request a Quote" },
  "Thông tin vận chuyển": { key: "product_shipping_info", en: "Shipping Information" },
  "Hồ sơ doanh nghiệp": { key: "product_company_profile", en: "Company Profile" },
  "Thị trường xuất khẩu chính": { key: "product_main_export_markets", en: "Main Export Markets" },
  "Liên hệ nhà cung cấp": { key: "product_contact_supplier", en: "Contact Supplier" },
  "Thêm vào giỏ yêu cầu": { key: "product_add_to_basket", en: "Add to Inquiry Basket" },
  "Số lượng": { key: "product_quantity", en: "Quantity" },
  "Đơn giá": { key: "product_unit_price", en: "Unit Price" },
  "Đơn hàng tối thiểu": { key: "product_min_order_qty", en: "Minimum Order" },
  "Giá thương lượng": { key: "product_negotiable_price", en: "Negotiable Price" },
  "Nhà sản xuất": { key: "product_manufacturer_label", en: "Manufacturer" },
  "Nguồn gốc": { key: "product_origin_label", en: "Origin" },
  "Cảng xuất": { key: "product_port_label", en: "Port of Loading" },
  "Thời gian giao hàng": { key: "product_lead_time_label", en: "Lead Time" },
  "Công suất sản xuất": { key: "product_capacity_label", en: "Production Capacity" },
  "Nhà cung cấp": { key: "product_supplier_label", en: "Supplier" },
  "Thành lập": { key: "product_established", en: "Established" },
  "Nhân viên": { key: "product_employees", en: "Employees" },
  "Loại hình": { key: "product_business_type_label", en: "Business Type" },
  "Nhận báo giá tốt nhất": { key: "product_get_best_quote", en: "Get the Best Quote" },
  "Mô tả sản phẩm": { key: "product_description_section", en: "Product Description" },
  "Thông số kỹ thuật": { key: "product_specifications_section", en: "Specifications" },
  "Chưa có mô tả chi tiết": { key: "product_no_description", en: "No detailed description available" },
  "Chưa có thông số kỹ thuật": { key: "product_no_specs", en: "No specifications available" },
  "Đánh giá": { key: "product_reviews_label", en: "Reviews" },
  "Xem chi tiết nhà cung cấp →": { key: "product_view_supplier", en: "View Supplier Details →" },

  // ProductListing
  "sản phẩm": { key: "listing_products_unit", en: "products" },
  "Sắp xếp theo:": { key: "listing_sort_by", en: "Sort by:" },
  "Liên hệ": { key: "listing_contact_btn", en: "Contact" },

  // ProfileSubmission
  "Thông tin liên hệ người kiểm soát tài khoản": { key: "profile_account_controller", en: "Account Controller Contact Information" },
  "Thông tin Doanh nghiệp": { key: "profile_business_info", en: "Business Information" },

  // SearchResults
  "Mục": { key: "search_items_label", en: "Items" },
  "Sắp xếp: Mặc định": { key: "search_sort_default", en: "Sort: Default" },
  "Giá thấp đến cao": { key: "search_price_asc", en: "Price: Low to High" },
  "Giá cao đến thấp": { key: "search_price_desc", en: "Price: High to Low" },
  "Mới nhất": { key: "search_newest", en: "Newest" },
  "Kết quả tìm kiếm cho": { key: "search_results_for", en: "Search results for" },
  "Không tìm thấy kết quả": { key: "search_no_results", en: "No results found" },
  "Thử tìm kiếm với từ khóa khác": { key: "search_try_other_keywords", en: "Try searching with different keywords" },
  "Tìm kiếm sản phẩm, nhà cung cấp...": { key: "search_placeholder_main", en: "Search products, suppliers..." },

  // SupplierCard
  "Sản phẩm chính:": { key: "supplier_main_products_label", en: "Main Products:" },

  // SupplierDetail
  "Giới thiệu": { key: "supplier_about_tab", en: "About" },
  "Sản phẩm": { key: "supplier_products_tab", en: "Products" },
  "Chứng nhận": { key: "supplier_certs_tab", en: "Certifications" },
  "Liên hệ nhà cung cấp này": { key: "supplier_contact_this", en: "Contact This Supplier" },
  "Thành viên từ": { key: "supplier_member_since", en: "Member Since" },
  "Năm thành lập": { key: "supplier_year_established", en: "Year Established" },
  "Quy mô": { key: "supplier_scale", en: "Scale" },
  "Loại hình kinh doanh": { key: "supplier_business_type", en: "Business Type" },
  "Sản phẩm chính": { key: "supplier_main_products", en: "Main Products" },
  "Thị trường xuất khẩu": { key: "supplier_export_markets", en: "Export Markets" },
  "Chưa có sản phẩm": { key: "supplier_no_products", en: "No products available" },
  "Chưa có chứng nhận": { key: "supplier_no_certs", en: "No certifications available" },
  "Đang tải...": { key: "loading_text", en: "Loading..." },
  "Không tìm thấy nhà cung cấp": { key: "supplier_not_found_msg", en: "Supplier not found" },
  "Quay lại": { key: "go_back", en: "Go back" },
  "người": { key: "people_unit", en: "people" },
  "Tên công ty": { key: "company_name_label", en: "Company Name" },
  "Địa chỉ": { key: "address_label", en: "Address" },
  "Mã số thuế": { key: "tax_code_label", en: "Tax Code" },
  "Người đại diện pháp luật": { key: "legal_representative_label", en: "Legal Representative" },
  "Email công ty": { key: "company_email_label", en: "Company Email" },
  "Điện thoại công ty": { key: "company_phone_label", en: "Company Phone" },

  // SupplierList  
  "Tìm kiếm theo tên công ty hoặc ngành hàng...": { key: "supplier_search_hint", en: "Search by company name or industry..." },

  // Dashboard/Admin
  "Quản lý nhà cung cấp": { key: "admin_supplier_mgmt", en: "Supplier Management" },
  "Quản lý người dùng": { key: "admin_user_mgmt", en: "User Management" },
  "Cài đặt hệ thống": { key: "admin_system_settings", en: "System Settings" },
  "Tổng quan": { key: "admin_overview", en: "Overview" },
  "Danh sách đơn hàng": { key: "admin_orders_list", en: "Orders List" },
  "Thống kê": { key: "admin_statistics", en: "Statistics" },
  "Đang xử lý": { key: "status_processing", en: "Processing" },
  "Đã hoàn thành": { key: "status_completed", en: "Completed" },
  "Đã hủy": { key: "status_cancelled", en: "Cancelled" },
  "Chờ xác nhận": { key: "status_awaiting_confirm", en: "Awaiting Confirmation" },
  "Hoạt động": { key: "status_active_label", en: "Active" },
  "Tạm khóa": { key: "status_suspended", en: "Suspended" },
  "Chưa xác minh": { key: "status_unverified", en: "Unverified" },
  "Đã xác minh": { key: "status_verified", en: "Verified" },
  "Từ chối": { key: "status_rejected", en: "Rejected" },
  "Không có dữ liệu": { key: "no_data", en: "No data" },
  "Xác nhận": { key: "confirm_action", en: "Confirm" },
  "Xóa": { key: "delete_action", en: "Delete" },
  "Cập nhật": { key: "update_action", en: "Update" },
  "Tạo mới": { key: "create_new", en: "Create New" },
  "Tìm kiếm...": { key: "search_ellipsis", en: "Search..." },
  "Hành động": { key: "action_label", en: "Action" },
  "Trạng thái": { key: "status_label", en: "Status" },
  "Chi tiết": { key: "detail_label", en: "Details" },
  "Thời gian": { key: "time_label", en: "Time" },
  "Tên": { key: "name_label", en: "Name" },
  "Email": { key: "email_label", en: "Email" },
  "Vai trò": { key: "role_label", en: "Role" },
  "Ngày tạo": { key: "created_at_label", en: "Created Date" },
  "Chỉnh sửa": { key: "edit_action", en: "Edit" },
  "Lưu": { key: "save_action", en: "Save" },
  "Hủy": { key: "cancel_action", en: "Cancel" },
  "Đóng": { key: "close_action", en: "Close" },
  "Tiếp tục": { key: "continue_action", en: "Continue" },
  "Quay lại trang chủ": { key: "back_to_home_action", en: "Back to Home" },
  "Xem thêm": { key: "view_more_action", en: "View More" },
  "Duyệt sản phẩm": { key: "browse_products_action", en: "Browse Products" },
  "Thêm vào giỏ hàng": { key: "add_to_cart_action", en: "Add to Cart" },
  "Mua ngay": { key: "buy_now_action", en: "Buy Now" },
  "Gửi yêu cầu": { key: "send_request_action", en: "Send Request" },
  "Đăng nhập": { key: "login_action", en: "Log In" },
  "Đăng ký": { key: "register_action", en: "Register" },
  "Đăng xuất": { key: "logout_action", en: "Log Out" },
  "Tài khoản": { key: "account_label", en: "Account" },
  "Hồ sơ": { key: "profile_label", en: "Profile" },
  "Cài đặt": { key: "settings_label", en: "Settings" },
  "Thông báo": { key: "notification_label", en: "Notifications" },
  "Tin nhắn": { key: "messages_label", en: "Messages" },

  // QR / Anti-counterfeit
  "Xác minh sản phẩm": { key: "verify_product", en: "Verify Product" },
  "Quét mã QR": { key: "scan_qr_code", en: "Scan QR Code" },
  "Sản phẩm chính hãng": { key: "authentic_product", en: "Authentic Product" },
  "Sản phẩm không xác định": { key: "unknown_product", en: "Unknown Product" },
  "Thông tin lô hàng": { key: "batch_info", en: "Batch Information" },
  "Ngày sản xuất": { key: "manufacture_date", en: "Manufacture Date" },
  "Hạn sử dụng": { key: "expiry_date_label", en: "Expiry Date" },
  "Số lượng trong lô": { key: "batch_quantity", en: "Batch Quantity" },

  // Orders
  "Đơn hàng của tôi": { key: "my_orders", en: "My Orders" },
  "Chi tiết đơn hàng": { key: "order_detail", en: "Order Details" },
  "Mã đơn hàng": { key: "order_id", en: "Order ID" },
  "Ngày đặt hàng": { key: "order_date", en: "Order Date" },
  "Tổng tiền": { key: "order_total", en: "Order Total" },
  "Thanh toán": { key: "payment_label_v2", en: "Payment" },
  "Giao hàng": { key: "delivery_label_v2", en: "Delivery" },
  
  // Misc  
  "Tất cả": { key: "all_label", en: "All" },
  "Khác": { key: "other_label", en: "Other" },
  "Không": { key: "no_label", en: "No" },
  "Có": { key: "yes_label", en: "Yes" },
  "Chọn": { key: "select_label", en: "Select" },
  "Tải lên": { key: "upload_label", en: "Upload" },
  "Tải xuống": { key: "download_label", en: "Download" },
  "Trang": { key: "page_label", en: "Page" },
  "Trước": { key: "prev_label", en: "Previous" },
  "Sau": { key: "next_label", en: "Next" },
  "Hiển thị": { key: "display_label", en: "Display" },
  "Dòng": { key: "rows_label", en: "Rows" },
  "Bộ lọc": { key: "filter_label", en: "Filter" },
  "Áp dụng": { key: "apply_label", en: "Apply" },
  "Đặt lại": { key: "reset_label", en: "Reset" },
  "Kết quả": { key: "results_label", en: "Results" },
  "Thành công": { key: "success_label", en: "Success" },
  "Thất bại": { key: "failure_label", en: "Failed" },
  "Cảnh báo": { key: "warning_label", en: "Warning" },
  "Lỗi": { key: "error_label", en: "Error" },
  "Thông tin": { key: "info_label", en: "Information" },
};

// ── Main Logic ──

const viData = JSON.parse(fs.readFileSync(VI_PATH, 'utf-8'));
const enData = JSON.parse(fs.readFileSync(EN_PATH, 'utf-8'));
const existingKeys = new Set(Object.keys(viData));
const existingVals = new Set(Object.values(viData));

let addedKeys = 0;

// 1. Add all dictionary entries to locale files
for (const [viText, { key, en }] of Object.entries(DICT)) {
  if (!existingKeys.has(key)) {
    viData[key] = viText;
    enData[key] = en;
    existingKeys.add(key);
    addedKeys++;
  }
}

fs.writeFileSync(VI_PATH, JSON.stringify(viData, null, 2) + '\n', 'utf-8');
fs.writeFileSync(EN_PATH, JSON.stringify(enData, null, 2) + '\n', 'utf-8');

console.log(`✅ Added ${addedKeys} new translation keys to locale files`);
console.log(`📁 vi.json: ${Object.keys(viData).length} keys`);
console.log(`📁 en.json: ${Object.keys(enData).length} keys`);

// 2. Auto-replace in source files
const filesToScan = [
  'pages/Cart.tsx', 'pages/Checkout.tsx', 'pages/Home.tsx',
  'pages/ProductDetail.tsx', 'pages/ProductListing.tsx',
  'pages/ProfileSubmission.tsx', 'pages/SearchResults.tsx',
  'pages/SupplierDetail.tsx', 'pages/SupplierList.tsx',
  'components/SupplierCard.tsx',
];

let totalReplaced = 0;

for (const relFile of filesToScan) {
  const filePath = path.join(SRC, relFile);
  if (!fs.existsSync(filePath)) continue;
  
  let content = fs.readFileSync(filePath, 'utf-8');
  let changed = false;
  
  for (const [viText, { key }] of Object.entries(DICT)) {
    const escaped = viText.replace(/[.*+?^${}()|[\]\\&]/g, '\\$&');
    
    // Replace >Vietnamese text< with >{t('key')}<
    const re = new RegExp(`>(\\s*)${escaped}(\\s*)<`, 'g');
    const newContent = content.replace(re, `>$1{t('${key}')}$2<`);
    if (newContent !== content) {
      content = newContent;
      changed = true;
      totalReplaced++;
    }
  }
  
  if (changed) {
    // Ensure import
    if (!content.includes('useTranslation') && content.includes("{t('")) {
      content = content.replace(
        /(import .+ from 'react';?\n)/m,
        `$1import { useTranslation } from 'react-i18next';\n`
      );
    }
    // Ensure hook
    if (content.includes("{t('") && !content.includes('useTranslation()')) {
      content = content.replace(
        /(export (?:default )?function \w+[^{]*\{)\n/,
        `$1\n  const { t } = useTranslation();\n`
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`  ✏️  ${relFile}`);
  }
}

console.log(`\n🎉 Replaced ${totalReplaced} hardcoded strings in source files.`);
