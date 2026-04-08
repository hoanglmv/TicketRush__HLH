package com.ticketrush.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class TicketSellRequest {
    private BigDecimal price;
}
