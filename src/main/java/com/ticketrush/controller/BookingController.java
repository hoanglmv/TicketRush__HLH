package com.ticketrush.controller;

import com.ticketrush.dto.*;
import com.ticketrush.entity.User;
import com.ticketrush.service.AuthService;
import com.ticketrush.service.SeatBookingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BookingController {

    private final SeatBookingService bookingService;
    private final AuthService authService;

    @PostMapping("/seats/{seatId}/lock")
    public ResponseEntity<ApiResponse<TicketResponse>> lockSeat(
            @PathVariable Long seatId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TicketResponse ticket = bookingService.lockSeat(user.getId(), seatId);
        return ResponseEntity.ok(ApiResponse.success("Seat locked successfully. You have 10 minutes to pay.", ticket));
    }

    @PostMapping("/tickets/{ticketId}/confirm")
    public ResponseEntity<ApiResponse<TicketResponse>> confirmPayment(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TicketResponse ticket = bookingService.confirmPayment(user.getId(), ticketId);
        return ResponseEntity.ok(ApiResponse.success("Payment confirmed! Your ticket is ready.", ticket));
    }

    @DeleteMapping("/tickets/{ticketId}")
    public ResponseEntity<ApiResponse<Void>> cancelTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        bookingService.cancelTicket(user.getId(), ticketId);
        return ResponseEntity.ok(ApiResponse.success("Ticket cancelled. Seat released.", null));
    }

    @GetMapping("/tickets/my")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getMyTickets(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bookingService.getUserTickets(user.getId())));
    }

    @GetMapping("/tickets/{ticketId}")
    public ResponseEntity<ApiResponse<TicketResponse>> getTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success(bookingService.getTicketById(user.getId(), ticketId)));
    }

    @PostMapping("/tickets/{ticketId}/transfer")
    public ResponseEntity<ApiResponse<TicketResponse>> transferTicket(
            @PathVariable Long ticketId,
            @RequestBody TicketTransferRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TicketResponse ticket = bookingService.transferTicket(user.getId(), ticketId, request.getTargetEmail());
        return ResponseEntity.ok(ApiResponse.success("Ticket transferred successfully", ticket));
    }

    @PostMapping("/tickets/{ticketId}/sell")
    public ResponseEntity<ApiResponse<TicketResponse>> sellTicket(
            @PathVariable Long ticketId,
            @RequestBody TicketSellRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TicketResponse ticket = bookingService.sellTicket(user.getId(), ticketId, request.getPrice());
        return ResponseEntity.ok(ApiResponse.success("Ticket listed for resale successfully", ticket));
    }

    @GetMapping("/tickets/resale")
    public ResponseEntity<ApiResponse<List<TicketResponse>>> getResaleTickets() {
        return ResponseEntity.ok(ApiResponse.success(bookingService.getResaleTickets()));
    }

    @PostMapping("/tickets/{ticketId}/buy-resale")
    public ResponseEntity<ApiResponse<TicketResponse>> buyResaleTicket(
            @PathVariable Long ticketId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        TicketResponse ticket = bookingService.buyResaleTicket(user.getId(), ticketId);
        return ResponseEntity.ok(ApiResponse.success("Resale ticket purchased successfully", ticket));
    }
}
