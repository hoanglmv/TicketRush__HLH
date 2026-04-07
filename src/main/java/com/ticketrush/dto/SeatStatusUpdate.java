package com.ticketrush.dto;

import com.ticketrush.enums.SeatStatus;
import lombok.Builder;
import lombok.Data;

/**
 * WebSocket message payload for real-time seat status updates.
 */
@Data
@Builder
public class SeatStatusUpdate {
    private Long seatId;
    private String label;
    private Long zoneId;
    private SeatStatus status;
    private String timestamp;
}
