package com.jobfinder.service;

import com.jobfinder.dto.AuthDtos;
import com.jobfinder.model.Role;
import com.jobfinder.model.User;
import com.jobfinder.repository.UserRepository;
import com.jobfinder.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider jwtTokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtTokenProvider = jwtTokenProvider;
    }

    public void register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email)) {
            throw new IllegalArgumentException("Email already in use");
        }
        User user = new User();
        user.setFirstName(request.firstName);
        user.setLastName(request.lastName);
        user.setEmail(request.email.toLowerCase());
        user.setPasswordHash(passwordEncoder.encode(request.password));
        user.setRole(Role.USER);
        user.setIsActive(Boolean.TRUE);
        userRepository.save(user);
    }

    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email.toLowerCase(), request.password));
        String accessToken = jwtTokenProvider.generateAccessToken(authentication);
        String refreshToken = jwtTokenProvider.generateRefreshToken(request.email.toLowerCase());
        return new AuthDtos.AuthResponse(accessToken, refreshToken);
    }

    public AuthDtos.AuthResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }
        String email = jwtTokenProvider.getEmailFromToken(refreshToken);
        Authentication authentication = new UsernamePasswordAuthenticationToken(email, null, null);
        String newAccess = jwtTokenProvider.generateAccessToken(authentication);
        String newRefresh = jwtTokenProvider.generateRefreshToken(email);
        return new AuthDtos.AuthResponse(newAccess, newRefresh);
    }
}
