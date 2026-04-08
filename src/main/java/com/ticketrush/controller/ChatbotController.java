package com.ticketrush.controller;

import com.ticketrush.dto.ChatRequest;
import com.ticketrush.service.ChatbotService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/chatbot")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class ChatbotController {

    private final ChatbotService chatbotService;

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Message cannot be empty.");
        }
        
        String responseMessage = chatbotService.getResponse(request.getMessage());
        return ResponseEntity.ok(Collections.singletonMap("reply", responseMessage));
    }
}
