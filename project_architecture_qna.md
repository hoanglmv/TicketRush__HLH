# Q&A: Kiến trúc và Tính năng Dự án TicketRush

## Câu hỏi 1: Dự án hiện đang có những tính năng gì và kiến trúc code được đánh giá như thế nào?

**Trả lời:**

**1. Các tính năng chính:**
*   **Dành cho Người dùng:** 
    *   Xác thực: Đăng ký, đăng nhập, quản lý hồ sơ.
    *   Duyệt sự kiện: Xem danh sách và chi tiết các sự kiện sắp tới.
    *   Đặt vé & Flash Sale: 
        *   **Hàng đợi ảo (Virtual Queue):** Xếp hàng chờ công bằng, giúp điều phối lượng người dùng lớn lúc mở bán vé sự kiện hot.
        *   **Bản đồ ghế Real-time:** Cập nhật trạng thái ghế ngồi theo thời gian thực qua WebSocket để tránh việc 2 người cùng chọn 1 ghế.
        *   **Thanh toán:** Tạm khóa ghế trong 10 phút, nếu quá thời hạn mà không xác nhận thanh toán hệ thống sẽ nhả ghế.
    *   Quản lý vé cá nhân.
*   **Dành cho Admin:**
    *   Dashboard thống kê (doanh thu, số lượng vé bán ra).
    *   Quản lý sự kiện: Thêm mới, chỉnh sửa, xem danh sách sự kiện.

**2. Đánh giá kiến trúc (Code Review):**
*   **Backend (Java 21 + Spring Boot):** Áp dụng kiến trúc N-Tier chuẩn mực (Controller -> Service -> Repository). Sử dụng `ApiResponse` để chuẩn hóa dữ liệu trả về, bảo mật chặt chẽ với `@AuthenticationPrincipal`. Đặc biệt, Backend xử lý cực tốt vấn đề tranh chấp dữ liệu (Race Condition) bằng hàng đợi ảo và `PESSIMISTIC_WRITE` lock ở Database.
*   **Frontend (React 18 + Vite + TypeScript):** Sử dụng TypeScript giúp chặt chẽ kiểu dữ liệu, cấu trúc thư mục rõ ràng giữa components/pages/admin. Tích hợp hiệu quả WebSocket cho trải nghiệm thời gian thực.
*   **DevOps:** Ứng dụng Docker Compose giúp quá trình setup toàn bộ môi trường (MySQL, Redis, Backend, Frontend) trở nên cực kỳ đơn giản chỉ với 1 dòng lệnh.

---

## Câu hỏi 2: Tại sao dự án lại chọn công nghệ Java Spring Boot + MySQL + React thay vì sử dụng combo MERN Stack (MongoDB, Express, React, Node.js)?

**Trả lời:**

Việc chọn Tech Stack phụ thuộc rất lớn vào đặc thù của dự án. Với TicketRush (một hệ thống bán vé, booking, flash sale), cấu trúc hiện tại có những ưu điểm vượt trội so với combo MERN:

**1. Đảm bảo toàn vẹn dữ liệu (MySQL vs MongoDB):**
*   Hệ thống bán vé yêu cầu tính **ACID** cực kỳ khắt khe: Tuyệt đối không được bán 1 ghế cho 2 người khác nhau. 
*   **MySQL** (Cơ sở dữ liệu quan hệ) kiểm soát các ràng buộc chặt chẽ (User -> Vé -> Ghế -> Sự kiện) và hỗ trợ việc khóa dòng (Locking) an toàn hơn nhiều.
*   **MongoDB** (NoSQL) thiên về dữ liệu phi cấu trúc, đọc ghi cực nhanh nhưng khó kiểm soát các giao dịch tài chính/đặt chỗ phức tạp bằng DB Quan hệ.

**2. Khả năng xử lý đồng thời & Flash Sale (Java Spring Boot vs Node.js/Express):**
*   **Java 21:** Rất mạnh mẽ nhờ kiến trúc Đa luồng (Multi-threaded) và tính năng Virtual Threads. Nó giúp ứng dụng có thể "gánh" hàng ngàn request mua vé ập tới cùng lúc rất hiệu quả.
*   **Node.js/Express:** Sử dụng cơ chế Event Loop (Đơn luồng). Nó rất giỏi xử lý I/O nhưng luồng chính rất dễ bị nghẽn (blocking) khi phải tính toán hoặc khóa DB liên tục lúc nhiều người tranh nhau mua vé cùng lúc.

**3. Cấu trúc, bảo trì và phát triển lâu dài:**
*   **Java (OOP, Định kiểu tĩnh):** Ép lập trình viên viết code chuẩn theo Design Pattern, dễ bảo trì và dễ mở rộng (scale) cho các dự án lớn, cực kỳ phù hợp khi làm việc nhóm.
*   **Node.js (Javascript):** Viết code và khởi chạy dự án cực nhanh, nhưng nếu không quản lý tốt, mã nguồn dễ bị lộn xộn (Spaghetti code) khi dự án phình to.

**4. Frontend (React + Vite + TypeScript):**
*   Việc áp dụng **TypeScript** (thay vì JS thuần như nhiều dự án MERN) giúp frontend đồng bộ chặt chẽ kiểu dữ liệu (Model) với backend Java, tránh lỗi vặt. **Vite** mang lại tốc độ build và hot-reload vượt trội hơn Webpack truyền thống.

**Tóm lại:** MERN stack rất tốt cho việc làm nguyên mẫu (MVP) ra mắt nhanh hoặc các ứng dụng thiên về mạng xã hội, chat real-time. Nhưng đối với hệ thống giao dịch, đặt chỗ khắt khe như **TicketRush**, kiến trúc **Java Spring Boot + MySQL** mang lại độ ổn định, tính toàn vẹn dữ liệu và khả năng chịu tải vượt trội hơn hẳn.
