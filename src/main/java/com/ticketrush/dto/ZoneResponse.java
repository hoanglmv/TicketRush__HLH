package com.ticketrush.dto;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data
@Builder
public class ZoneResponse {
    private Long id;
    private Long eventId;
    private String name;
    private String color;
    private BigDecimal price;
    private int totalRows;
    private int seatsPerRow;
    private int sortOrder;
    private long availableSeats;
    private long totalSeats;
}
