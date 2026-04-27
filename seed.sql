SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE events;
TRUNCATE TABLE zones;
TRUNCATE TABLE seats;
SET FOREIGN_KEY_CHECKS = 1;

INSERT INTO events (id, name, banner_url, category, city, venue, address, event_date, sale_start_time, sale_end_time, description, queue_enabled, queue_batch_size, status, created_at) VALUES 
(1, 'Vietnamese E-Sports Championship', 'https://picsum.photos/seed/esport/800/400', 'SPORTS', 'Hanoi', 'Trung tâm Hội nghị Quốc gia', 'Phạm Hùng, Mễ Trì, Nam Từ Liêm', '2026-07-20 09:00:00', '2026-06-01 10:00:00', '2026-07-19 23:59:59', 'Giải đấu thể thao điện tử lớn nhất Việt Nam.', 1, 50, 'ON_SALE', NOW()),
(2, 'Vũ điệu Sài Gòn', 'https://picsum.photos/seed/vudieu/800/400', 'CONCERTS', 'Ho Chi Minh', 'Nhà hát Thành Phố', 'Số 7 Công Trường Lam Sơn, Bến Nghé, Quận 1', '2026-06-15 19:30:00', '2026-05-01 09:00:00', '2026-06-14 23:59:59', 'Một đêm nhạc đặc biệt mang âm hưởng văn hóa Sài Gòn xưa và nay.', 0, 0, 'ON_SALE', NOW()),
(3, 'Triển lãm Áo dài 3 Miền', 'https://picsum.photos/seed/aodai/800/400', 'EXPERIENCE', 'Ho Chi Minh', 'Bảo tàng Phụ nữ Nam Bộ', '202 Võ Thị Sáu, Quận 3', '2026-08-01 08:30:00', '2026-07-01 09:00:00', '2026-07-31 23:59:59', 'Trưng bày và trải nghiệm trang phục Áo dài truyền thống.', 0, 0, 'PUBLISHED', NOW()),
(4, 'Nhạc Kịch: Tiếng Trống Mê Linh', 'https://picsum.photos/seed/kịch/800/400', 'THEATER', 'Ho Chi Minh', 'Sân khấu Idecaf', '28 Lê Thánh Tôn, Bến Nghé, Quận 1', '2026-09-02 20:00:00', '2026-08-01 09:00:00', '2026-09-01 23:59:59', 'Vở nhạc kịch lịch sử hào hùng do các nghệ sĩ gạo cội biểu diễn.', 0, 0, 'PUBLISHED', NOW()),
(5, '[NUNA NU NONG X BLUE AQUARIUM] XƯƠNG RỒNG LOVE YOU', 'https://picsum.photos/seed/ns1/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'Sân khấu ca nhạc', 'Q1, TP.HCM', '2026-06-06 19:00:00', '2026-05-01 09:00:00', '2026-06-05 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(6, 'BADASS CITY 2026 - Saigon Hiphop Festival', 'https://picsum.photos/seed/ns2/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'SECC', 'Q7, TP.HCM', '2026-05-16 19:00:00', '2026-05-01 09:00:00', '2026-05-15 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(7, '2026 KIM SUNG KYU LIVE [LV4: LEAP to VECTOR]', 'https://picsum.photos/seed/ns3/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'Nhà hát Hòa Bình', 'Q10, TP.HCM', '2026-06-13 19:00:00', '2026-05-01 09:00:00', '2026-06-12 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(8, '[BẾN THÀNH] Đêm nhạc Minh Tuyết - Hoàng Hải', 'https://picsum.photos/seed/ns4/800/400', 'LIVE_MUSIC', 'Ho Chi Minh', 'Nhà hát Bến Thành', 'Q1, TP.HCM', '2026-04-28 19:00:00', '2026-04-01 09:00:00', '2026-04-27 23:59:59', '', 0, 0, 'ON_SALE', NOW()),

(9, 'ART WORKSHOP "SAKURA BLOSSOM WHITE CHOCOLATE"', 'https://picsum.photos/seed/sk1/800/400', 'ARTS', 'Ho Chi Minh', 'The Art Studio', 'Q3, TP.HCM', '2026-04-29 09:00:00', '2026-04-01 09:00:00', '2026-04-28 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(10, 'Thanh Gươm Và Bà Mẹ', 'https://picsum.photos/seed/sk2/800/400', 'ARTS', 'Ho Chi Minh', 'Sân khấu Kịch Hồng Vân', 'Phú Nhuận, TP.HCM', '2026-04-27 20:00:00', '2026-04-01 09:00:00', '2026-04-26 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(11, 'Chào Show', 'https://picsum.photos/seed/sk3/800/400', 'ARTS', 'Ho Chi Minh', 'Nhà hát Thành Phố', 'Q1, TP.HCM', '2026-04-28 20:00:00', '2026-04-01 09:00:00', '2026-04-27 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(12, 'ART WORKSHOP "UJI MATCHA CHEESECAKE TARTE"', 'https://picsum.photos/seed/sk4/800/400', 'ARTS', 'Ho Chi Minh', 'The Art Studio', 'Q3, TP.HCM', '2026-04-29 14:00:00', '2026-04-01 09:00:00', '2026-04-28 23:59:59', '', 0, 0, 'ON_SALE', NOW()),

(13, 'WORKSHOP NẤU ĂN ẤN ĐỘ', 'https://picsum.photos/seed/ht1/800/400', 'WORKSHOP', 'Ho Chi Minh', 'Benaras Heritage', 'Q1, TP.HCM', '2026-05-16 10:00:00', '2026-04-01 09:00:00', '2026-05-15 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(14, 'ART WORKSHOP "BLUSH & BERRIES CHARLOTTE"', 'https://picsum.photos/seed/ht2/800/400', 'WORKSHOP', 'Ho Chi Minh', 'Baking Studio', 'Q10, TP.HCM', '2026-04-30 09:00:00', '2026-04-01 09:00:00', '2026-04-29 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(15, 'ART WORKSHOP THÊU TÚI', 'https://picsum.photos/seed/ht3/800/400', 'WORKSHOP', 'Ho Chi Minh', 'Craft Room', 'Q3, TP.HCM', '2026-05-02 14:00:00', '2026-04-01 09:00:00', '2026-05-01 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(16, 'GSTAR SUMMIT: AI & HUMANITY 2026', 'https://picsum.photos/seed/ht4/800/400', 'WORKSHOP', 'Ho Chi Minh', 'Trung tâm Hội nghị GEM Center', 'Q1, TP.HCM', '2026-05-29 08:30:00', '2026-04-01 09:00:00', '2026-05-28 23:59:59', '', 0, 0, 'ON_SALE', NOW()),

(17, 'DU LỊCH VĂN HÓA SUỐI TIÊN', 'https://picsum.photos/seed/tq1/800/400', 'EXPERIENCE', 'Ho Chi Minh', 'Khu du lịch Suối Tiên', 'Q9, TP.HCM', '2026-04-01 08:00:00', '2026-03-01 09:00:00', '2026-12-31 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(18, 'Vé Trải Nghiệm KidZania Hà Nội', 'https://picsum.photos/seed/tq2/800/400', 'EXPERIENCE', 'Hanoi', 'Lotte Mall Tây Hồ', 'Tây Hồ, HN', '2026-04-27 09:00:00', '2026-03-01 09:00:00', '2026-12-31 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(19, 'Sensation of I DO tại White Palace HVT', 'https://picsum.photos/seed/tq3/800/400', 'EXPERIENCE', 'Ho Chi Minh', 'White Palace Hoàng Văn Thụ', 'Phú Nhuận, TP.HCM', '2026-05-23 18:00:00', '2026-04-01 09:00:00', '2026-05-22 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(20, 'Sensation of I DO tại White Palace PVD', 'https://picsum.photos/seed/tq4/800/400', 'EXPERIENCE', 'Ho Chi Minh', 'White Palace Phạm Văn Đồng', 'Thủ Đức, TP.HCM', '2026-05-16 18:00:00', '2026-04-01 09:00:00', '2026-05-15 23:59:59', '', 0, 0, 'ON_SALE', NOW()),

(21, 'Trải nghiệm bay dù lượn tại Sapa', 'https://picsum.photos/seed/tt1/800/400', 'SPORTS', 'Sapa', 'Đỉnh Ô Quy Hồ', 'Sapa, Lào Cai', '2026-01-28 08:00:00', '2025-12-01 09:00:00', '2026-12-31 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(22, 'PHÂN TÍCH DỮ LIỆU VỚI POWER BI', 'https://picsum.photos/seed/tt2/800/400', 'SPORTS', 'Online', 'Zoom', 'Online', '2026-04-06 19:00:00', '2026-03-01 09:00:00', '2026-04-05 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(23, 'PPA ASIA 1000 - MB HANOI CUP 2026', 'https://picsum.photos/seed/tt3/800/400', 'SPORTS', 'Hanoi', 'Sân VĐV Quốc gia Mỹ Đình', 'Nam Từ Liêm, HN', '2026-04-08 09:00:00', '2026-03-01 09:00:00', '2026-04-07 23:59:59', '', 0, 0, 'ON_SALE', NOW()),
(24, 'VCT Pacific Stage 1 Finals: Ho Chi Minh', 'https://picsum.photos/seed/tt4/800/400', 'SPORTS', 'Ho Chi Minh', 'Nhà thi đấu Phú Thọ', 'Q11, TP.HCM', '2026-05-15 14:00:00', '2026-04-01 09:00:00', '2026-05-14 23:59:59', '', 0, 0, 'ON_SALE', NOW());

INSERT INTO zones (id, event_id, name, color, price, total_rows, seats_per_row, sort_order) VALUES
(1, 1, 'VIP', '#ff0000', 500000, 10, 10, 1),
(2, 2, 'Standard', '#00ff00', 300000, 20, 20, 1),
(3, 3, 'General Admission', '#0000ff', 150000, 5, 20, 1),
(4, 4, 'Premium', '#ffff00', 800000, 15, 15, 1);
