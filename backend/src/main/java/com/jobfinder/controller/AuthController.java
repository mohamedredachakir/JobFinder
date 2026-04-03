package com.jobfinder.controller;

import com.jobfinder.dto.AuthDtos;
import com.jobfinder.service.AuthService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody AuthDtos.RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("User registered");
    }

    @PostMapping("/login")
    public ResponseEntity<AuthDtos.AuthResponse> login(@Valid @RequestBody AuthDtos.LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthDtos.AuthResponse> refresh(@Valid @RequestBody AuthDtos.RefreshRequest request) {
        return ResponseEntity.ok(authService.refresh(request.refreshToken));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Logged out");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword() {
        return ResponseEntity.ok("Reset email sent");
    }
}
