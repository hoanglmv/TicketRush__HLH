# TicketRush

Nền tảng đặt vé trực tuyến cho sự kiện âm nhạc/giải trí với real-time seat map, virtual queue, và flash sale support.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Spring Boot 4.0.5, Java 21 |
| Database | MySQL 8 (Docker) |
| Cache/Queue | Redis 7 (Docker) |
| Security | Spring Security + JWT |
| WebSocket | STOMP + SockJS |
| Frontend | React 18, Vite, TypeScript |
| Charts | Recharts |
| DevOps | Docker Compose |

---

## 🚀 Quick Start (Cho toàn bộ team)

### Yêu cầu duy nhất: cài [Docker Desktop](https://www.docker.com/products/docker-desktop/)

Không cần cài Java, Node, MySQL, Redis — Docker lo hết.

### Bước 1: Clone và chạy

```powershell
git clone <repo-url>
cd TicketRush

# Khởi động Docker Desktop trước, sau đó:
docker compose up -d --build
```

### Bước 2: Truy cập

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080/api |

### Bước 3: Login

| Username | Password | Role |
|----------|----------|------|
| admin | admin123 | Admin |

---

## 📋 Các lệnh Docker thường dùng

```powershell
# Khởi động toàn bộ (lần đầu hoặc khi có thay đổi code)
docker compose up -d --build

# Khởi động (không build lại, nhanh hơn)
docker compose up -d

# Xem trạng thái
docker compose ps

# Xem logs
docker compose logs -f              # Tất cả
docker compose logs -f backend      # Chỉ backend
docker compose logs -f frontend     # Chỉ frontend

# Dừng tất cả
docker compose down

# Reset database (XÓA HẾT data, tạo lại từ đầu)
docker compose down -v
docker compose up -d --build

# Rebuild 1 service cụ thể
docker compose up -d --build backend
docker compose up -d --build frontend
```

---

## 🔧 Phát triển hàng ngày

### Khi sửa code Backend (Java):
```powershell
docker compose up -d --build backend
```

### Khi sửa code Frontend (React):
Frontend sử dụng Vite HMR nên **tự động hot-reload** khi sửa code.
Nếu cần rebuild (ví dụ thêm dependency mới):
```powershell
docker compose up -d --build frontend
```

### Khi chạy local (không dùng Docker cho backend/frontend):
```powershell
# Chỉ khởi động MySQL + Redis
docker compose up -d mysql redis

# Chạy backend local (cần Java 21)
.\gradlew.bat bootRun

# Chạy frontend local (cần Node.js 20+)
cd frontend; npm install; npm run dev
```

---

## 🌐 Port Mapping

| Service | Host Port | Container Port | Ghi chú |
|---------|-----------|---------------|---------|
| MySQL | **3307** | 3306 | Tránh xung đột MySQL local (3306) |
| Redis | **6380** | 6379 | Tránh xung đột Redis local (6379) |
| Backend | 8080 | 8080 | |
| Frontend | 5173 | 5173 | |

> **Tại sao port 3307/6380?** Nhiều máy dev có MySQL hoặc Redis cài sẵn trên port mặc định. Dùng port khác đảm bảo không bao giờ bị xung đột.

---

## 📁 Project Structure

```
TicketRush/
├── docker-compose.yml          # ⭐ Full stack Docker setup
├── Dockerfile                  # Backend Docker image
├── .dockerignore
├── build.gradle                # Backend dependencies
├── src/main/
│   ├── java/com/ticketrush/
│   │   ├── config/             # WebSocket, Redis, Security configs
│   │   ├── controller/         # REST API controllers
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── entity/             # JPA entities
│   │   ├── enums/              # Status enums
│   │   ├── exception/          # Global error handling
│   │   ├── repository/         # Data access (PESSIMISTIC_WRITE lock)
│   │   ├── security/           # JWT authentication
│   │   └── service/            # Business logic
│   └── resources/
│       ├── application.yml         # Config local dev
│       └── application-docker.yml  # Config Docker (auto-used)
└── frontend/
    ├── Dockerfile              # Frontend Docker image
    ├── .dockerignore
    ├── src/
    │   ├── api/                # Axios HTTP client
    │   ├── components/         # Shared UI components
    │   ├── contexts/           # React Auth context
    │   ├── pages/              # All pages
    │   │   └── admin/          # Admin pages
    │   └── types/              # TypeScript interfaces
    └── vite.config.ts          # Dev server + API proxy
```

---

## ❓ Troubleshooting

### "Port 3307 already in use"
```powershell
# Tìm process đang dùng port
netstat -ano | findstr :3307
# Kill nó
taskkill /PID <PID> /F
```

### "Docker Desktop not running"
→ Mở Docker Desktop app và đợi nó khởi động xong.

### Backend lỗi "Access denied"
→ Chạy `docker compose down -v` rồi `docker compose up -d --build` để reset DB.

### Frontend không thấy API
→ Đợi backend khởi động xong (check logs: `docker compose logs -f backend`)
