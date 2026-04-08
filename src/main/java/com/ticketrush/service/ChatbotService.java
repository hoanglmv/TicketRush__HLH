package com.ticketrush.service;

import com.ticketrush.entity.Event;
import com.ticketrush.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotService {

    private final EventRepository eventRepository;
    private final RestTemplate restTemplate = new RestTemplate();

    @Value("${app.llm.groq.api-key:YOUR_GROQ_API_KEY_HERE}")
    private String groqApiKey;

    @Value("${app.llm.groq.model:llama3-8b-8192}")
    private String groqModel;

    public String getResponse(String userMessage) {
        if (groqApiKey == null || groqApiKey.isEmpty() || groqApiKey.equals("YOUR_GROQ_API_KEY_HERE")) {
            return "CHÚ Ý ĐỂ CHẠY THỬ: Bạn cần vào file `application.yml`, tìm khóa `app.llm.groq.api-key` và dán mã API Key của bạn (lấy miễn phí tại console.groq.com) vào! Sau đó khởi động lại Backend.";
        }

        try {
            // RAG Phase: Lấy thông tin sự kiện từ DB để cung cấp context cho AI
            List<Event> availableEvents = eventRepository.findAll();
            StringBuilder contextBuilder = new StringBuilder("Dưới đây là danh sách sự kiện ĐANG BÁN trên TicketRush hiện tại: \n");
            for (Event event : availableEvents) {
                contextBuilder.append("- ").append(event.getName())
                        .append(" (").append(event.getCategory()).append(")")
                        .append(" diễn ra vào ").append(event.getEventDate())
                        .append(" tại ").append(event.getVenue()).append(".\n");
            }

            // Xây dựng Prompt cho AI
            String systemPrompt = "Bạn là trợ lý ảo thân thiện của hệ thống bán vé sự kiện TicketRush. Bạn chỉ trả lời bằng tiếng Việt. " +
                    "Hãy sử dụng ngữ cảnh danh sách các sự kiện hiện có trên hệ thống sau đây để tư vấn cho khách hàng. Nếu khách hỏi sự kiện không có trong danh sách, hãy khéo léo nói rằng hệ thống chưa mở bán sự kiện đó. Ngữ cảnh: " + contextBuilder.toString();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(groqApiKey);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", groqModel);
            requestBody.put("temperature", 0.5);

            List<Map<String, String>> messagesArray = new ArrayList<>();
            messagesArray.add(Map.of("role", "system", "content", systemPrompt));
            messagesArray.add(Map.of("role", "user", "content", userMessage));
            requestBody.put("messages", messagesArray);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "https://api.groq.com/openai/v1/chat/completions",
                    entity,
                    Map.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> messageMap = (Map<String, Object>) choices.get(0).get("message");
                    return (String) messageMap.get("content");
                }
            }

        } catch (Exception e) {
            log.error("Lỗi khi gọi tới Groq API: ", e);
            return "Xin lỗi, tổng đài AI đang bận. Lỗi hệ thống: " + e.getMessage();
        }

        return "Xin lỗi, hiện tôi không thể trả lời lúc này.";
    }
}
