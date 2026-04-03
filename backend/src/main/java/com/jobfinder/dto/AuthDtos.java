package com.jobfinder.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

public class AuthDtos {
    public static class RegisterRequest {
        @NotBlank public String firstName;
        @NotBlank public String lastName;
        @Email @NotBlank public String email;
        @Pattern(regexp = "^(?=.*[A-Z])(?=.*\\d).{8,}$", message = "Password must be 8+ chars with uppercase and number")
        public String password;
    }

    public static class LoginRequest {
        @Email @NotBlank public String email;
        @NotBlank public String password;
    }

    public static class RefreshRequest {
        @NotBlank public String refreshToken;
    }

    public static class AuthResponse {
        public String accessToken;
        public String refreshToken;
        public String tokenType = "Bearer";

        public AuthResponse() {}
        public AuthResponse(String accessToken, String refreshToken) {
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;
        }
    }
}
