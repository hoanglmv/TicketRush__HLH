package com.ticketrush.controller;

import com.ticketrush.dto.ApiResponse;
import com.ticketrush.service.SiteSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class SiteSettingController {

    private final SiteSettingService siteSettingService;

    @GetMapping("/public/settings")
    public ResponseEntity<ApiResponse<Map<String, String>>> getAllSettings() {
        return ResponseEntity.ok(ApiResponse.success("Settings fetched", siteSettingService.getAllSettingsAsMap()));
    }

    // Since this is /admin/, we rely on Spring Security configuration protecting /api/admin/**
    @PostMapping("/admin/settings")
    public ResponseEntity<ApiResponse<Void>> updateSettings(@RequestBody Map<String, String> newSettings) {
        siteSettingService.updateSettings(newSettings);
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", null));
    }
}
