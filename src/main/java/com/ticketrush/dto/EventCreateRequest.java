package com.ticketrush.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class EventCreateRequest {
    @NotBlank(message = "Event name is required")
    private String name;

    private String description;
    private String venue;
    private String address;
    private String bannerUrl;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private LocalDateTime saleStartTime;
    private LocalDateTime saleEndTime;
    private boolean queueEnabled;
    private Integer queueBatchSize;
}
