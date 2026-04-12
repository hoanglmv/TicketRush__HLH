package com.ticketrush.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:noreply@ticketrush.com}")
    private String fromEmail;

    public void sendOtp(String toEmail, String otp) {
        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("TicketRush - Verify your registration (OTP)");
                message.setText("Your OTP code is: " + otp + "\nThis code will expire in 5 minutes.");
                
                message.setFrom(fromEmail);
                
                mailSender.send(message);
                log.info("OTP email sent successfully to {}", toEmail);
                return;
            } catch (Exception e) {
                log.error("Failed to send email to {}. Error: {}", toEmail, e.getMessage());
            }
        } else {
            log.warn("JavaMailSender bean is not available. Please configure spring.mail properties.");
        }
        
        // Mock output if email fails or is not configured
        log.warn("========== DEV OUPUT ==========");
        log.warn("Please use this OTP to verify {}: {}", toEmail, otp);
        log.warn("===============================");
    }
}
