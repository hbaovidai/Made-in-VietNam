# HƯỚNG DẪN TEST TÍNH NĂNG DASHBOARD (MIVN5)

Dưới đây là tài liệu tổng hợp cách test các tính năng (Phase 1 -> Phase 4) đã được chuyển đổi từ Mock Data (dữ liệu giả) sang lấy dữ liệu thật (Real API) từ Database của hệ thống.

---

## 1. YÊU CẦU CHUẨN BỊ TÀI KHOẢN
Trong hệ thống đã seed (chạy lệnh tạo) sẵn các tài khoản sau:
- **Tài khoản Buyer (Người mua):** `buyer@example.com` / Pass: `123456`
- **Tài khoản Supplier (Nhà cung cấp):** `agroviet@example.com` / Pass: `123456`
*(Bạn có thể dùng màn hình ẩn danh để mở song song 2 trình duyệt, test tính năng nhắn tin hoặc gửi RFQ).*

---

## 2. CÁC TÍNH NĂNG CẦN TEST KHU VỰC BUYER (Người Mua)

### A. Đăng Yêu Cầu Báo Giá (POST RFQ)
- **Truy cập:** Đăng nhập `buyer@example.com` -> Bấm nút **Gửi Yêu Cầu** ở Dashboard hoặc truy cập `/rfq`.
- **Chức năng:** Bạn sẽ thấy form "Gửi Yêu Cầu Báo Giá". 
  - Khung **Sản phẩm** giờ là một Dropdown load toàn bộ sản phẩm thực tế từ Database.
  - Điền Số lượng, Yêu cầu chi tiết, Quốc gia và Email liên hệ.
  - Bấm **Gửi Yêu cầu**. Thông tin sẽ được ghi thẳng xuống cơ sở dữ liệu (Database) thông qua chức năng `CreateRFQDto`.

### B. Buyer Overview & Danh Sách RFQ Của Tôi
- **Truy cập:** Trở lại **Dashboard** (Tổng quan). Bảng số liệu "My RFQs" (Yêu cầu báo giá) sẽ hiển thị số đếm cập nhật tự động.
- **Truy cập:** Chọn menu **Yêu cầu báo giá**. Hệ thống sẽ gọi API `/rfqs/buyer/:id` và hiện danh sách các RFQ bạn vừa đăng thành công với trạng thái `Mới (OPEN)`.

### C. Buyer Messages (Nhắn tin)
- **Truy cập:** Chọn menu **Tin nhắn**. 
- **Chức năng:** 
  - Backend sử dụng API nhắn tin thời gian thực để liên kết nội dung `/messages/conversations/`.
  - Danh bạ bên trái là những Supplier đã từng kết nối nhắn tin. 
  - Nếu chưa có ai, bạn thử gõ 1 câu text trong khung Chat hoặc chuyển sang quy trình Buyer chủ động liên lạc từ trang Profile của Supplier.

---

## 3. CÁC TÍNH NĂNG CẦN TEST KHU VỰC SUPPLIER (Nhà cung cấp)

### A. Trình Tổng quan Nhà cung cấp (Supplier Overview)
- **Truy cập:** Đăng nhập dưới tài khoản `agroviet@example.com` -> Vào **Dashboard**.
- **Chức năng:** Các hộp số liệu trên cùng (**Sản phẩm, Batches (Lô hàng), Mã QR, Lượt xem**) giờ đã kết nối với API `/suppliers/:id/stats` gom dữ liệu thời gian thực từ Database. Nếu bạn tạo thêm QR hoặc thêm SP, số này sẽ tự động nhảy.

### B. Nhận Yêu cầu báo giá (Supplier RFQs)
- **Truy cập:** Menu **Yêu cầu báo giá**.
- **Chức năng:** Tự động bắt API `/rfqs/open` của hê thống và hiển thị lên toàn bộ các RFQ Public đang chờ. 
- Tại đây sẽ thấy hiển thị các "Yêu cầu báo giá (RFQ)" mà tài khoản Buyer vừa tạo ra ở bước 2. Bấm "View Quote" / "Submit Quote".

### C. Phân Tích Dữ Liệu (Supplier Analytics)
- **Truy cập:** Menu **Phân tích (Analytics)**.
- **Chức năng:** Bảng đồ thị thay vì dùng Data tĩnh như trước, nay đã dùng API để tính toán. 
- Tính năng quan trọng: **Danh sách sản phẩm được xem nhiều nhất (Top Performing Products)** tự động bắt API `/products?sortBy=viewCount&sortOrder=desc` để xếp hạng các sản phẩm có chỉ số View cao nhất theo thời gian thực.

---

_Tài liệu này được lưu trữ tại máy của bạn để tiện xem lại quy trình kiểm tra các nâng cấp về API sau này._
