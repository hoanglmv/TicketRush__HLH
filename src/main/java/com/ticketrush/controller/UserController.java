package com.ticketrush.controller;

import com.ticketrush.dto.ApiResponse;
import com.ticketrush.dto.UserProfileResponse;
import com.ticketrush.dto.UserProfileUpdateRequest;
import com.ticketrush.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile(Authentication authentication) {
        UserProfileResponse profile = userService.getUserProfile(authentication.getName());
        return ApiResponse.success("Profile fetched successfully", profile);
    }

    @PutMapping("/me")
    public ApiResponse<UserProfileResponse> updateMyProfile(Authentication authentication,
                                                            @RequestBody UserProfileUpdateRequest request) {
        UserProfileResponse profile = userService.updateUserProfile(authentication.getName(), request);
        return ApiResponse.success("Profile updated successfully", profile);
    }
}
