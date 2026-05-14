const fs = require('fs');

const eventData = [
    { name: "Kịch: Bí Mật Trăm Đốt Tre", category: "ARTS", venue: "Nhà hát Kịch Hà Nội", city: "Hanoi" },
    { name: "Dạ Tiệc Nghệ Thuật 2026", category: "ARTS", venue: "Nhà hát Thành Phố", city: "Ho Chi Minh" },
    { name: "Liveshow Hài Hoài Linh - Xuân 2026", category: "ARTS", venue: "Sân Khấu Trống Đồng", city: "Ho Chi Minh" },
    { name: "Nhạc kịch Bầy Chim Thiên Nga", category: "ARTS", venue: "Nhà hát Tuổi Trẻ", city: "Hanoi" },
    { name: "Sân khấu Lệ Ngọc: Thị Nở", category: "ARTS", venue: "Nhà hát Lớn", city: "Hanoi" },
    { name: "Triển Lãm Nghệ Thuật Ánh Sáng", category: "ARTS", venue: "Bảo Tàng Mỹ Thuật", city: "Ho Chi Minh" },
    
    { name: "Giải Chạy Marathon Quốc Tế TP.HCM", category: "SPORTS", venue: "Đường Lê Duẩn", city: "Ho Chi Minh" },
    { name: "Bóng Đá Siêu Cúp Quốc Gia 2026", category: "SPORTS", venue: "SVĐ Hàng Đẫy", city: "Hanoi" },
    { name: "Giao Lưu Võ Thuật Châu Á", category: "SPORTS", venue: "Cung Thể Thao Quần Ngựa", city: "Hanoi" },
    { name: "Giải Đua Xe Đạp Toàn Quốc", category: "SPORTS", venue: "Quảng Trường Đại Đoàn Kết", city: "Gia Lai" },
    
    { name: "Workshop: Lãnh Đạo Tương Lai 2026", category: "WORKSHOP", venue: "GEM Center", city: "Ho Chi Minh" },
    { name: "Hội thảo: AI và Kỷ Nguyên Số", category: "WORKSHOP", venue: "Trung Tâm Hội Nghị Quốc Gia", city: "Hanoi" },
    { name: "Lớp Học Làm Gốm Nghệ Thuật", category: "WORKSHOP", venue: "Bát Tràng", city: "Hanoi" },
    { name: "Trải Nghiệm Trà Đạo Nhật Bản", category: "WORKSHOP", venue: "Khu Phố Nhật", city: "Ho Chi Minh" },
    
    { name: "Tour Khám Phá Địa Đạo Củ Chi Đêm", category: "EXPERIENCE", venue: "Địa Đạo Củ Chi", city: "Ho Chi Minh" },
    { name: "Trải Nghiệm Glamping Đà Lạt", category: "EXPERIENCE", venue: "Hồ Tuyền Lâm", city: "Da Lat" },
    { name: "Ngắm Cảnh Hoàng Hôn Du Thuyền", category: "EXPERIENCE", venue: "Bến Bạch Đằng", city: "Ho Chi Minh" },
    
    { name: "Sơn Tùng M-TP - Đêm Nhạc Kín", category: "LIVE_MUSIC", venue: "White Palace", city: "Ho Chi Minh" },
    { name: "Minishow Vũ Cát Tường", category: "LIVE_MUSIC", venue: "Soul Live Project", city: "Ho Chi Minh" },
    { name: "Noo Phước Thịnh - Live Concert", category: "LIVE_MUSIC", venue: "Cung Văn Hóa Hữu Nghị Việt Xô", city: "Hanoi" },
    
    { name: "Lễ Hội Âm Nhạc Bãi Biển 2026", category: "OTHER", venue: "Công Viên Biển Đông", city: "Da Nang" },
    { name: "Hội Chợ Triển Lãm Công Nghệ", category: "OTHER", venue: "SECC", city: "Ho Chi Minh" }
];

let sql = `\n-- Adding 22 more events\nINSERT INTO events (id, name, banner_url, category, city, venue, address, event_date, sale_start_time, sale_end_time, description, queue_enabled, queue_batch_size, status, is_hot, created_at) VALUES \n`;
let startId = 57;

for (let i = 0; i < eventData.length; i++) {
    const e = eventData[i];
    const id = startId + i;
    const isHot = Math.random() > 0.7 ? 1 : 0;
    
    const month = 8 + (i % 5); 
    const day = 10 + (i % 15);
    const dateStr = `2026-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} 19:30:00`;
    const saleStart = `2026-05-01 09:00:00`;
    const saleEnd = `2026-${month.toString().padStart(2, '0')}-${(day-1).toString().padStart(2, '0')} 23:59:59`;
    
    const isLast = i === eventData.length - 1;
    sql += `(${id}, '${e.name}', 'https://picsum.photos/seed/event${id}/800/400', '${e.category}', '${e.city}', '${e.venue}', '${e.city}', '${dateStr}', '${saleStart}', '${saleEnd}', 'Sự kiện hấp dẫn không thể bỏ lỡ.', 0, 0, 'PUBLISHED', ${isHot}, NOW())${isLast ? ';' : ','}\n`;
}

let zoneSql = "\nINSERT INTO zones (id, event_id, name, color, price, total_rows, seats_per_row, sort_order) VALUES\n";
let nextZoneId = 2000;
let seatSql = "\nINSERT INTO seats (zone_id, `row_number`, col_number, label, status) VALUES\n";
let seatValues = [];

for (let i = 0; i < eventData.length; i++) {
    const ev = startId + i;
    let zoneId1 = nextZoneId++;
    let zoneId2 = nextZoneId++;
    
    const isLastEv = i === eventData.length - 1;
    zoneSql += `(${zoneId1}, ${ev}, 'VIP', '#e74c3c', 1500000, 2, 10, 1),\n`;
    zoneSql += `(${zoneId2}, ${ev}, 'GA', '#3498db', 800000, 2, 10, 2)${isLastEv ? ';' : ','}\n`;
    
    for (let r = 1; r <= 2; r++) {
        for (let c = 1; c <= 10; c++) {
            let label = String.fromCharCode(64 + r) + c;
            seatValues.push(`(${zoneId1}, ${r}, ${c}, '${label}', 'AVAILABLE')`);
        }
    }
    for (let r = 1; r <= 2; r++) {
        for (let c = 1; c <= 10; c++) {
            let label = String.fromCharCode(64 + r + 2) + c; 
            seatValues.push(`(${zoneId2}, ${r}, ${c}, '${label}', 'AVAILABLE')`);
        }
    }
}

seatSql += seatValues.join(',\n') + ';\n';

fs.appendFileSync('seed.sql', sql + zoneSql + seatSql);
console.log('Successfully appended 22 more events to seed.sql');
