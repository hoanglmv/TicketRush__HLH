package com.ticketrush.controller;

import com.ticketrush.dto.*;
import com.ticketrush.enums.EventStatus;
import com.ticketrush.service.AdminDashboardService;
import com.ticketrush.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final EventService eventService;
    private final AdminDashboardService dashboardService;

    // ========== DASHBOARD ==========

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDashboard() {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getDashboardStats()));
    }

    // ========== EVENT MANAGEMENT ==========

    @GetMapping("/events")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllEvents() {
        return ResponseEntity.ok(ApiResponse.success(eventService.getAllEvents()));
    }

    @PostMapping("/events")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(@Valid @RequestBody EventCreateRequest request) {
        EventResponse event = eventService.createEvent(request);
        return ResponseEntity.ok(ApiResponse.success("Event created", event));
    }

    @PutMapping("/events/{id}")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventCreateRequest request) {
        EventResponse event = eventService.updateEvent(id, request);
        return ResponseEntity.ok(ApiResponse.success("Event updated", event));
    }

    @PutMapping("/events/{id}/status")
    public ResponseEntity<ApiResponse<EventResponse>> updateStatus(
            @PathVariable Long id,
            @RequestParam EventStatus status) {
        EventResponse event = eventService.updateEventStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Status updated to " + status, event));
    }

    // ========== ZONE MANAGEMENT ==========

    @PostMapping("/events/{eventId}/zones")
    public ResponseEntity<ApiResponse<ZoneResponse>> createZone(
            @PathVariable Long eventId,
            @Valid @RequestBody ZoneCreateRequest request) {
        ZoneResponse zone = eventService.createZone(eventId, request);
        return ResponseEntity.ok(ApiResponse.success("Zone created with seats", zone));
    }

    // ========== STATS ==========

    @GetMapping("/events/{eventId}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEventStats(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getEventStats(eventId)));
    }

    @GetMapping("/events/{eventId}/demographics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getDemographics(@PathVariable Long eventId) {
        return ResponseEntity.ok(ApiResponse.success(dashboardService.getEventDemographics(eventId)));
    }
}
