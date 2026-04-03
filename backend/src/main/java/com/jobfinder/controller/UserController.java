package com.jobfinder.controller;

import com.jobfinder.dto.Requests;
import com.jobfinder.model.User;
import com.jobfinder.service.UserService;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<User> me() {
        return ResponseEntity.ok(userService.me());
    }

    @PutMapping("/me")
    public ResponseEntity<User> update(@Valid @RequestBody Requests.UserUpdateRequest request) {
        return ResponseEntity.ok(userService.update(request));
    }

    @PostMapping("/me/cv")
    public ResponseEntity<User> uploadCv(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadCv(file));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMe() {
        userService.deleteMe();
        return ResponseEntity.noContent().build();
    }
}
