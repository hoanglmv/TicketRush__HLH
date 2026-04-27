package com.ticketrush.service;

import com.ticketrush.dto.EventResponse;
import com.ticketrush.entity.Event;
import com.ticketrush.entity.User;
import com.ticketrush.entity.Wishlist;
import com.ticketrush.exception.ResourceNotFoundException;
import com.ticketrush.repository.EventRepository;
import com.ticketrush.repository.UserRepository;
import com.ticketrush.repository.WishlistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final EventService eventService;

    @Transactional
    public void addEventToWishlist(Long userId, Long eventId) {
        if (wishlistRepository.existsByUserIdAndEventId(userId, eventId)) {
            return; // Already in wishlist
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        Wishlist wishlist = Wishlist.builder()
                .user(user)
                .event(event)
                .build();
        wishlistRepository.save(wishlist);
    }

    @Transactional
    public void removeEventFromWishlist(Long userId, Long eventId) {
        wishlistRepository.deleteByUserIdAndEventId(userId, eventId);
    }

    @Transactional(readOnly = true)
    public List<EventResponse> getUserWishlist(Long userId) {
        return wishlistRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(wishlist -> eventService.getEvent(wishlist.getEvent().getId()))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public boolean checkWishlistStatus(Long userId, Long eventId) {
        return wishlistRepository.existsByUserIdAndEventId(userId, eventId);
    }
}
