const fs = require('fs');

const sql = `
-- Adding new events 47 to 56
INSERT INTO events (id, name, banner_url, category, city, venue, address, event_date, sale_start_time, sale_end_time, description, queue_enabled, queue_batch_size, status, is_hot, created_at) VALUES 
(47, 'Gala Nhạc Việt 2026 - Thanh Âm Tương Lai', 'https://picsum.photos/seed/galanhacviet/800/400', 'CONCERTS', 'Ho Chi Minh', 'Nhà hát Hòa Bình', 'Q10, TP.HCM', '2026-08-15 19:30:00', '2026-05-01 09:00:00', '2026-08-14 23:59:59', 'Đại nhạc hội quy tụ những ngôi sao hàng đầu Việt Nam.', 1, 50, 'ON_SALE', 1, NOW()),
(48, 'Hồ Ngọc Hà - Love Songs 2026', 'https://picsum.photos/seed/hongocha/800/400', 'LIVE_MUSIC', 'Da Lat', 'Quảng trường Lâm Viên', 'TP. Đà Lạt', '2026-07-20 19:00:00', '2026-05-15 09:00:00', '2026-07-19 23:59:59', 'Đêm nhạc acoustic lãng mạn tại thành phố sương mù.', 1, 30, 'ON_SALE', 1, NOW()),
(49, 'Trúc Nhân - The Live Concert', 'https://picsum.photos/seed/trucnhan/800/400', 'LIVE_MUSIC', 'Hanoi', 'Cung Thể thao Quần Ngựa', 'Ba Đình, Hà Nội', '2026-09-10 20:00:00', '2026-06-01 09:00:00', '2026-09-09 23:59:59', 'Live concert bùng nổ của ca sĩ Trúc Nhân với các bản hit trăm triệu view.', 0, 0, 'ON_SALE', 0, NOW()),
(50, 'SpaceSpeakers - KOSMIK 2026', 'https://picsum.photos/seed/spacespeakers/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'Sân Vận Động Quân Khu 7', 'Q. Phú Nhuận, TP.HCM', '2026-10-15 19:00:00', '2026-07-01 09:00:00', '2026-10-14 23:59:59', 'Siêu concert rap / hip-hop hoành tráng nhất năm.', 1, 100, 'PUBLISHED', 1, NOW()),
(51, 'Rock Storm 2026 - Sự Trở Lại', 'https://picsum.photos/seed/rockstorm/800/400', 'CONCERTS', 'Da Nang', 'Sân Vận Động Chi Lăng', 'Hải Châu, Đà Nẵng', '2026-08-05 18:00:00', '2026-05-01 09:00:00', '2026-08-04 23:59:59', 'Bão Rock đã quay trở lại với sự góp mặt của Bức Tường, Ngũ Cung...', 1, 50, 'ON_SALE', 1, NOW()),
(52, 'Soobin - The Playah Live Show', 'https://picsum.photos/seed/soobin/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'Nhà hát Thành Phố', 'Q1, TP.HCM', '2026-11-20 20:00:00', '2026-09-01 09:00:00', '2026-11-19 23:59:59', 'Live show đẳng cấp quốc tế của hoàng tử R&B Soobin.', 0, 0, 'PUBLISHED', 0, NOW()),
(53, 'Hoàng Dũng - Yên Concert 2026', 'https://picsum.photos/seed/hoangdung/800/400', 'LIVE_MUSIC', 'Hanoi', 'Nhà hát Lớn', 'Tràng Tiền, Hoàn Kiếm, HN', '2026-07-15 20:00:00', '2026-05-10 09:00:00', '2026-07-14 23:59:59', 'Đêm nhạc nhẹ nhàng, sâu lắng dành riêng cho những tâm hồn "Yên".', 0, 0, 'ON_SALE', 0, NOW()),
(54, 'Chung Kết Hoa Hậu Hoàn Vũ Việt Nam 2026', 'https://picsum.photos/seed/hoahau/800/400', 'EXPERIENCE', 'Nha Trang', 'Crown Convention Center', 'Nha Trang, Khánh Hòa', '2026-12-25 19:00:00', '2026-10-01 09:00:00', '2026-12-24 23:59:59', 'Đêm chung kết tôn vinh nhan sắc Việt Nam.', 1, 100, 'PUBLISHED', 1, NOW()),
(55, 'Show của Đen 2026', 'https://picsum.photos/seed/denvau/800/400', 'LIVE_MUSIC', 'Hanoi', 'Sân vận động Mỹ Đình', 'Nam Từ Liêm, Hà Nội', '2026-11-09 20:00:00', '2026-08-01 09:00:00', '2026-11-08 23:59:59', 'Chuyến hành trình âm nhạc của những Đồng Âm cùng Đen Vâu.', 1, 150, 'ON_SALE', 1, NOW()),
(56, 'Anh Trai Say Hi - Live Concert 2026', 'https://picsum.photos/seed/atsayhi/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'Khu Du Lịch Văn Thánh', 'Bình Thạnh, TP.HCM', '2026-12-15 19:30:00', '2026-10-15 09:00:00', '2026-12-14 23:59:59', 'Dàn cast hot nhất show Anh Trai Say Hi hội ngộ tại Live Concert.', 1, 150, 'PUBLISHED', 1, NOW());
`;

let zoneSql = "\\nINSERT INTO zones (id, event_id, name, color, price, total_rows, seats_per_row, sort_order) VALUES\\n";
let nextZoneId = 1000;
let seatSql = "\\nINSERT INTO seats (zone_id, \\`row_number\\`, col_number, label, status) VALUES\\n";
let seatValues = [];

for (let ev = 47; ev <= 56; ev++) {
    // 2 zones per event
    let zoneId1 = nextZoneId++;
    let zoneId2 = nextZoneId++;
    
    zoneSql += `(${zoneId1}, ${ev}, 'VIP', '#e74c3c', 1500000, 2, 10, 1),\\n`;
    zoneSql += `(${zoneId2}, ${ev}, 'GA', '#3498db', 800000, 3, 10, 2)${ev === 56 ? ';' : ','}\\n`;
    
    // seats for zone 1 (2 rows, 10 cols)
    for (let r = 1; r <= 2; r++) {
        for (let c = 1; c <= 10; c++) {
            let label = String.fromCharCode(64 + r) + c;
            seatValues.push(`(${zoneId1}, ${r}, ${c}, '${label}', 'AVAILABLE')`);
        }
    }
    
    // seats for zone 2 (3 rows, 10 cols)
    for (let r = 1; r <= 3; r++) {
        for (let c = 1; c <= 10; c++) {
            let label = String.fromCharCode(64 + r + 2) + c; // starts from row C
            seatValues.push(`(${zoneId2}, ${r}, ${c}, '${label}', 'AVAILABLE')`);
        }
    }
}

seatSql += seatValues.join(',\\n') + ';\\n';

fs.appendFileSync('seed.sql', sql + zoneSql + seatSql);
console.log('Appended events, zones, and seats to seed.sql');
