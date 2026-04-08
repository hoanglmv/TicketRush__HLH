package com.ticketrush.controller;

import com.ticketrush.dto.*;
import com.ticketrush.service.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getPublicEvents() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getPublicEvents()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> getEvent(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getEvent(id)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<EventResponse>>> searchEvents(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime startDate,
            @RequestParam(required = false) @org.springframework.format.annotation.DateTimeFormat(iso = org.springframework.format.annotation.DateTimeFormat.ISO.DATE_TIME) java.time.LocalDateTime endDate) {
        return ResponseEntity.ok(ApiResponse.success(eventService.searchEvents(q, category, city, startDate, endDate)));
    }

    @GetMapping("/{eventId}/zones")
    public ResponseEntity<ApiResponse<List<ZoneResponse>>> getZones(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getZonesByEvent(eventId)));
    }

    @GetMapping("/{eventId}/seats")
    public ResponseEntity<ApiResponse<List<SeatResponse>>> getSeats(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(eventService.getSeatsByEvent(eventId)));
    }
}
