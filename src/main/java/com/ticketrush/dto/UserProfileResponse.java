package com.ticketrush.dto;

import com.ticketrush.enums.Gender;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UserProfileResponse {
    private Long id;
    private String username;
    private String email;
    private String fullName;
    private String phone;
    private LocalDate dateOfBirth;
    private Gender gender;
    private String role;
}
