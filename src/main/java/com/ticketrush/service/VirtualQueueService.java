package com.ticketrush.service;

import com.ticketrush.dto.QueueStatusResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ZSetOperations;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Set;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class VirtualQueueService {

    private final StringRedisTemplate redisTemplate;

    private static final String QUEUE_KEY_PREFIX = "queue:";
    private static final String ACCESS_KEY_PREFIX = "access:";
    private static final Duration ACCESS_TOKEN_TTL = Duration.ofMinutes(5);

    /**
     * Thêm người dùng vào hàng đợi ảo (Virtual Queue) cho một sự kiện.
     * Sử dụng Redis ZSET với thời điểm tham gia (timestamp) làm điểm số (score) để đảm bảo tính công bằng (FIFO).
     */
    public QueueStatusResponse joinQueue(Long userId, Long eventId) {
        String queueKey = QUEUE_KEY_PREFIX + eventId;
        String userIdStr = userId.toString();

        // Check if user already has access
        String existingToken = getAccessToken(userId, eventId);
        if (existingToken != null) {
            return QueueStatusResponse.builder()
                    .eventId(eventId)
                    .userId(userId)
                    .hasAccess(true)
                    .accessToken(existingToken)
                    .message("You already have access to book seats")
                    .build();
        }

        // Add to queue if not already in it (ZADD NX)
        Double existingScore = redisTemplate.opsForZSet().score(queueKey, userIdStr);
        if (existingScore == null) {
            redisTemplate.opsForZSet().add(queueKey, userIdStr, System.currentTimeMillis());
        }

        // Get position
        Long rank = redisTemplate.opsForZSet().rank(queueKey, userIdStr);
        Long totalInQueue = redisTemplate.opsForZSet().size(queueKey);

        return QueueStatusResponse.builder()
                .eventId(eventId)
                .userId(userId)
                .position(rank != null ? rank + 1 : null)
                .totalInQueue(totalInQueue)
                .hasAccess(false)
                .message(String.format("You are at position %d in the queue. Please wait...", rank != null ? rank + 1 : 0))
                .build();
    }

    /**
     * Kiểm tra vị trí hiện tại trong hàng đợi. Nếu đến lượt, trả về token truy cập.
     */
    public QueueStatusResponse checkStatus(Long userId, Long eventId) {
        // Check if user already has access token
        String token = getAccessToken(userId, eventId);
        if (token != null) {
            return QueueStatusResponse.builder()
                    .eventId(eventId)
                    .userId(userId)
                    .hasAccess(true)
                    .accessToken(token)
                    .message("You have access to book seats!")
                    .build();
        }

        // Check position in queue
        String queueKey = QUEUE_KEY_PREFIX + eventId;
        Long rank = redisTemplate.opsForZSet().rank(queueKey, userId.toString());
        Long totalInQueue = redisTemplate.opsForZSet().size(queueKey);

        if (rank == null) {
            return QueueStatusResponse.builder()
                    .eventId(eventId)
                    .userId(userId)
                    .hasAccess(false)
                    .message("You are not in the queue. Please join first.")
                    .build();
        }

        return QueueStatusResponse.builder()
                .eventId(eventId)
                .userId(userId)
                .position(rank + 1)
                .totalInQueue(totalInQueue)
                .hasAccess(false)
                .message(String.format("You are at position %d of %d. Please wait...", rank + 1, totalInQueue))
                .build();
    }

    /**
     * Xử lý hàng đợi: lấy ra N người dùng ở đầu hàng đợi (batch) và cấp quyền truy cập (token) cho họ.
     * Hàm này được gọi liên tục bởi Scheduler mỗi vài giây.
     */
    public int processQueue(Long eventId, int batchSize) {
        String queueKey = QUEUE_KEY_PREFIX + eventId;

        // Pop the first N users from the sorted set
        Set<ZSetOperations.TypedTuple<String>> batch = redisTemplate.opsForZSet()
                .popMin(queueKey, batchSize);

        if (batch == null || batch.isEmpty()) {
            return 0;
        }

        int processed = 0;
        for (ZSetOperations.TypedTuple<String> entry : batch) {
            String userIdStr = entry.getValue();
            if (userIdStr != null) {
                grantAccess(Long.parseLong(userIdStr), eventId);
                processed++;
            }
        }

        log.info("Processed {} users from queue for event {}", processed, eventId);
        return processed;
    }

    /**
     * Cấp quyền truy cập cho người dùng, lưu token vào Redis với thời gian hết hạn (TTL).
     */
    private void grantAccess(Long userId, Long eventId) {
        String accessKey = ACCESS_KEY_PREFIX + eventId + ":" + userId;
        String token = UUID.randomUUID().toString();
        redisTemplate.opsForValue().set(accessKey, token, ACCESS_TOKEN_TTL);
    }

    /**
     * Xác thực xem token truy cập có hợp lệ hay không.
     */
    public boolean validateAccess(Long userId, Long eventId, String token) {
        String accessKey = ACCESS_KEY_PREFIX + eventId + ":" + userId;
        String storedToken = redisTemplate.opsForValue().get(accessKey);
        return storedToken != null && storedToken.equals(token);
    }

    /**
     * Check if user has valid access (for internal use).
     */
    public boolean hasAccess(Long userId, Long eventId) {
        String accessKey = ACCESS_KEY_PREFIX + eventId + ":" + userId;
        return Boolean.TRUE.equals(redisTemplate.hasKey(accessKey));
    }

    private String getAccessToken(Long userId, Long eventId) {
        String accessKey = ACCESS_KEY_PREFIX + eventId + ":" + userId;
        return redisTemplate.opsForValue().get(accessKey);
    }

    /**
     * Bỏ xếp hàng (rời khỏi hàng đợi) khi người dùng thoát trang.
     */
    public void leaveQueue(Long userId, Long eventId) {
        String queueKey = QUEUE_KEY_PREFIX + eventId;
        redisTemplate.opsForZSet().remove(queueKey, userId.toString());
    }

    public Long getQueueSize(Long eventId) {
        String queueKey = QUEUE_KEY_PREFIX + eventId;
        Long size = redisTemplate.opsForZSet().size(queueKey);
        return size != null ? size : 0;
    }
}
