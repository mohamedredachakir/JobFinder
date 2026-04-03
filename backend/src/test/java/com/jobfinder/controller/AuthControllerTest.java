package com.jobfinder.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobfinder.dto.AuthDtos;
import com.jobfinder.service.AuthService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
class AuthControllerTest {

    @Autowired
    MockMvc mockMvc;

    @Autowired
    ObjectMapper objectMapper;

    @MockBean
    AuthService authService;

    @Test
    void registerShouldReturnOk() throws Exception {
        AuthDtos.RegisterRequest request = new AuthDtos.RegisterRequest();
        request.firstName = "John";
        request.lastName = "Doe";
        request.email = "john@doe.com";
        request.password = "Password1";

        Mockito.doNothing().when(authService).register(Mockito.any(AuthDtos.RegisterRequest.class));

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk());
    }
}
