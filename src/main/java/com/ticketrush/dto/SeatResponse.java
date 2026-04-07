package com.ticketrush.dto;

import com.ticketrush.enums.SeatStatus;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SeatResponse {
    private Long id;
    private Long zoneId;
    private String zoneName;
    private String zoneColor;
    private int rowNumber;
    private int colNumber;
    private String label;
    private SeatStatus status;
    private java.math.BigDecimal price;
}
