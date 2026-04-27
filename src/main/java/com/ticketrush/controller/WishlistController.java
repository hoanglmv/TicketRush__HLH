package com.ticketrush.controller;

import com.ticketrush.dto.ApiResponse;
import com.ticketrush.dto.EventResponse;
import com.ticketrush.entity.User;
import com.ticketrush.service.AuthService;
import com.ticketrush.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;
    private final AuthService authService;

    @PostMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Void>> addEventToWishlist(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        wishlistService.addEventToWishlist(user.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Event added to wishlist", null));
    }

    @DeleteMapping("/{eventId}")
    public ResponseEntity<ApiResponse<Void>> removeEventFromWishlist(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        wishlistService.removeEventFromWishlist(user.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Event removed from wishlist", null));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getUserWishlist(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        List<EventResponse> wishlist = wishlistService.getUserWishlist(user.getId());
        return ResponseEntity.ok(ApiResponse.success("User wishlist retrieved", wishlist));
    }

    @GetMapping("/{eventId}/status")
    public ResponseEntity<ApiResponse<Boolean>> checkWishlistStatus(
            @PathVariable Long eventId,
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = authService.getCurrentUser(userDetails.getUsername());
        boolean status = wishlistService.checkWishlistStatus(user.getId(), eventId);
        return ResponseEntity.ok(ApiResponse.success("Wishlist status retrieved", status));
    }
}
