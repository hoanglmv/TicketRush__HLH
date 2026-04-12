package com.ticketrush.service;

import com.ticketrush.dto.AuthResponse;
import com.ticketrush.dto.LoginRequest;
import com.ticketrush.dto.RegisterRequest;
import com.ticketrush.entity.User;
import com.ticketrush.enums.Role;
import com.ticketrush.exception.InvalidOperationException;
import com.ticketrush.repository.UserRepository;
import com.ticketrush.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.data.redis.core.StringRedisTemplate;
import com.ticketrush.dto.VerifyOtpRequest;
import com.ticketrush.dto.ForgotPasswordRequest;
import com.ticketrush.dto.ResetPasswordRequest;
import com.ticketrush.dto.ChangePasswordRequest;
import java.util.concurrent.TimeUnit;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final StringRedisTemplate redisTemplate;
    private final EmailService emailService;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new InvalidOperationException("Username already exists");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new InvalidOperationException("Email already exists");
        }

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .email(request.getEmail())
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .role(Role.ROLE_CUSTOMER)
                .isActive(false)
                .build();

        userRepository.save(user);

        String otp = String.format("%06d", new Random().nextInt(999999));
        redisTemplate.opsForValue().set("OTP_REGISTER_" + user.getEmail(), otp, 5, TimeUnit.MINUTES);
        
        emailService.sendOtp(user.getEmail(), otp);

        return AuthResponse.builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String cacheKey = "OTP_REGISTER_" + request.getEmail();
        String cachedOtp = redisTemplate.opsForValue().get(cacheKey);
        
        if (cachedOtp == null || !cachedOtp.equals(request.getOtp())) {
            throw new InvalidOperationException("Invalid or expired OTP");
        }
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidOperationException("User not found"));
                
        user.setActive(true);
        userRepository.save(user);
        redisTemplate.delete(cacheKey);
        
        String token = jwtTokenProvider.generateTokenFromUsername(user.getUsername());
        return buildAuthResponse(user, token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        String token = jwtTokenProvider.generateToken(authentication);
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new InvalidOperationException("User not found"));

        return buildAuthResponse(user, token);
    }

    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidOperationException("Email not found"));
        
        String otp = String.format("%06d", new Random().nextInt(999999));
        redisTemplate.opsForValue().set("OTP_FORGOT_" + user.getEmail(), otp, 10, TimeUnit.MINUTES);
        
        emailService.sendOtp(user.getEmail(), otp);
    }

    public void resetPassword(ResetPasswordRequest request) {
        String cacheKey = "OTP_FORGOT_" + request.getEmail();
        String cachedOtp = redisTemplate.opsForValue().get(cacheKey);
        
        if (cachedOtp == null || !cachedOtp.equals(request.getOtp())) {
            throw new InvalidOperationException("Invalid or expired OTP");
        }
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidOperationException("User not found"));
                
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        redisTemplate.delete(cacheKey);
    }

    public void changePassword(String username, ChangePasswordRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidOperationException("User not found"));
                
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new InvalidOperationException("Old password does not match");
        }
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    public User getCurrentUser(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new InvalidOperationException("User not found"));
    }

    private AuthResponse buildAuthResponse(User user, String token) {
        return AuthResponse.builder()
                .accessToken(token)
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .gender(user.getGender())
                .dateOfBirth(user.getDateOfBirth())
                .build();
    }
}
