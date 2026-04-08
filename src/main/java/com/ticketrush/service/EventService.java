package com.ticketrush.service;

import com.ticketrush.dto.*;
import com.ticketrush.entity.Event;
import com.ticketrush.entity.Seat;
import com.ticketrush.entity.Zone;
import com.ticketrush.enums.EventStatus;
import com.ticketrush.enums.SeatStatus;
import com.ticketrush.exception.InvalidOperationException;
import com.ticketrush.exception.ResourceNotFoundException;
import com.ticketrush.repository.EventRepository;
import com.ticketrush.repository.SeatRepository;
import com.ticketrush.repository.ZoneRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final ZoneRepository zoneRepository;
    private final SeatRepository seatRepository;

    // ========== EVENT CRUD ==========

    @Transactional
    public EventResponse createEvent(EventCreateRequest request) {
        Event event = Event.builder()
                .name(request.getName())
                .description(request.getDescription())
                .venue(request.getVenue())
                .address(request.getAddress())
                .bannerUrl(request.getBannerUrl())
                .category(request.getCategory())
                .city(request.getCity())
                .eventDate(request.getEventDate())
                .saleStartTime(request.getSaleStartTime())
                .saleEndTime(request.getSaleEndTime())
                .status(EventStatus.DRAFT)
                .queueEnabled(request.isQueueEnabled())
                .queueBatchSize(request.getQueueBatchSize() != null ? request.getQueueBatchSize() : 50)
                .build();

        event = eventRepository.save(event);
        return toEventResponse(event);
    }

    @Transactional
    public EventResponse updateEvent(Long eventId, EventCreateRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        event.setName(request.getName());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setAddress(request.getAddress());
        event.setBannerUrl(request.getBannerUrl());
        event.setCategory(request.getCategory());
        event.setCity(request.getCity());
        event.setEventDate(request.getEventDate());
        event.setSaleStartTime(request.getSaleStartTime());
        event.setSaleEndTime(request.getSaleEndTime());
        event.setQueueEnabled(request.isQueueEnabled());
        if (request.getQueueBatchSize() != null) {
            event.setQueueBatchSize(request.getQueueBatchSize());
        }

        event = eventRepository.save(event);
        return toEventResponse(event);
    }

    @Transactional
    public EventResponse updateEventStatus(Long eventId, EventStatus newStatus) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        validateStatusTransition(event.getStatus(), newStatus);
        event.setStatus(newStatus);
        event = eventRepository.save(event);
        return toEventResponse(event);
    }

    public EventResponse getEvent(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));
        return toEventResponse(event);
    }

    public List<EventResponse> getPublicEvents() {
        List<EventStatus> publicStatuses = List.of(EventStatus.PUBLISHED, EventStatus.ON_SALE);
        return eventRepository.findByStatusIn(publicStatuses).stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> getAllEvents() {
        return eventRepository.findAll().stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    public List<EventResponse> searchEvents(String keyword, String category, String city, java.time.LocalDateTime startDate, java.time.LocalDateTime endDate) {
        List<EventStatus> publicStatuses = List.of(EventStatus.PUBLISHED, EventStatus.ON_SALE);
        return eventRepository.searchWithFilters(keyword, category, city, publicStatuses, startDate, endDate).stream()
                .map(this::toEventResponse)
                .collect(Collectors.toList());
    }

    // ========== ZONE MANAGEMENT ==========

    @Transactional
    public ZoneResponse createZone(Long eventId, ZoneCreateRequest request) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found: " + eventId));

        if (event.getStatus() != EventStatus.DRAFT) {
            throw new InvalidOperationException("Zones can only be added to DRAFT events");
        }

        Zone zone = Zone.builder()
                .event(event)
                .name(request.getName())
                .color(request.getColor())
                .price(request.getPrice())
                .totalRows(request.getTotalRows())
                .seatsPerRow(request.getSeatsPerRow())
                .sortOrder(request.getSortOrder())
                .build();

        zone = zoneRepository.save(zone);

        // Auto-generate seats
        generateSeats(zone);

        return toZoneResponse(zone);
    }

    public List<ZoneResponse> getZonesByEvent(Long eventId) {
        return zoneRepository.findByEventIdOrderBySortOrder(eventId).stream()
                .map(this::toZoneResponse)
                .collect(Collectors.toList());
    }

    // ========== SEAT LISTING ==========

    public List<SeatResponse> getSeatsByEvent(Long eventId) {
        return seatRepository.findByEventId(eventId).stream()
                .map(this::toSeatResponse)
                .collect(Collectors.toList());
    }

    // ========== PRIVATE HELPERS ==========

    private void generateSeats(Zone zone) {
        List<Seat> seats = new ArrayList<>();
        for (int row = 0; row < zone.getTotalRows(); row++) {
            char rowChar = (char) ('A' + row);
            for (int col = 1; col <= zone.getSeatsPerRow(); col++) {
                Seat seat = Seat.builder()
                        .zone(zone)
                        .rowNumber(row + 1)
                        .colNumber(col)
                        .label(String.valueOf(rowChar) + col)
                        .status(SeatStatus.AVAILABLE)
                        .build();
                seats.add(seat);
            }
        }
        seatRepository.saveAll(seats);
    }

    private void validateStatusTransition(EventStatus current, EventStatus next) {
        boolean valid = switch (current) {
            case DRAFT -> next == EventStatus.PUBLISHED;
            case PUBLISHED -> next == EventStatus.ON_SALE || next == EventStatus.CANCELLED;
            case ON_SALE -> next == EventStatus.COMPLETED || next == EventStatus.CANCELLED;
            default -> false;
        };
        if (!valid) {
            throw new InvalidOperationException(
                    String.format("Cannot transition from %s to %s", current, next));
        }
    }

    public EventResponse toEventResponse(Event event) {
        long totalSeats = seatRepository.countByEventIdAndStatus(event.getId(), SeatStatus.AVAILABLE)
                + seatRepository.countByEventIdAndStatus(event.getId(), SeatStatus.LOCKED)
                + seatRepository.countByEventIdAndStatus(event.getId(), SeatStatus.SOLD);
        long availableSeats = seatRepository.countByEventIdAndStatus(event.getId(), SeatStatus.AVAILABLE);
        long soldSeats = seatRepository.countByEventIdAndStatus(event.getId(), SeatStatus.SOLD);

        List<ZoneResponse> zones = zoneRepository.findByEventIdOrderBySortOrder(event.getId())
                .stream().map(this::toZoneResponse).collect(Collectors.toList());

        return EventResponse.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .venue(event.getVenue())
                .address(event.getAddress())
                .bannerUrl(event.getBannerUrl())
                .category(event.getCategory())
                .city(event.getCity())
                .eventDate(event.getEventDate())
                .saleStartTime(event.getSaleStartTime())
                .saleEndTime(event.getSaleEndTime())
                .status(event.getStatus())
                .queueEnabled(event.isQueueEnabled())
                .queueBatchSize(event.getQueueBatchSize())
                .createdAt(event.getCreatedAt())
                .zones(zones)
                .totalSeats(totalSeats)
                .availableSeats(availableSeats)
                .soldSeats(soldSeats)
                .build();
    }

    private ZoneResponse toZoneResponse(Zone zone) {
        long total = zone.getTotalRows() * zone.getSeatsPerRow();
        long available = seatRepository.findByZoneId(zone.getId()).stream()
                .filter(s -> s.getStatus() == SeatStatus.AVAILABLE)
                .count();

        return ZoneResponse.builder()
                .id(zone.getId())
                .eventId(zone.getEvent().getId())
                .name(zone.getName())
                .color(zone.getColor())
                .price(zone.getPrice())
                .totalRows(zone.getTotalRows())
                .seatsPerRow(zone.getSeatsPerRow())
                .sortOrder(zone.getSortOrder())
                .totalSeats(total)
                .availableSeats(available)
                .build();
    }

    private SeatResponse toSeatResponse(Seat seat) {
        return SeatResponse.builder()
                .id(seat.getId())
                .zoneId(seat.getZone().getId())
                .zoneName(seat.getZone().getName())
                .zoneColor(seat.getZone().getColor())
                .rowNumber(seat.getRowNumber())
                .colNumber(seat.getColNumber())
                .label(seat.getLabel())
                .status(seat.getStatus())
                .price(seat.getZone().getPrice())
                .build();
    }
}
