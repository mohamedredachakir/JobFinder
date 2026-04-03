package com.jobfinder.service;

import com.jobfinder.dto.Requests;
import com.jobfinder.model.User;
import com.jobfinder.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    private final UserContextService userContextService;
    private final UserRepository userRepository;

    public UserService(UserContextService userContextService, UserRepository userRepository) {
        this.userContextService = userContextService;
        this.userRepository = userRepository;
    }

    public User me() {
        return userContextService.currentUser();
    }

    public User update(Requests.UserUpdateRequest request) {
        User user = userContextService.currentUser();
        if (request.firstName != null) user.setFirstName(request.firstName);
        if (request.lastName != null) user.setLastName(request.lastName);
        if (request.preferredLocation != null) user.setPreferredLocation(request.preferredLocation);
        if (request.preferredSector != null) user.setPreferredSector(request.preferredSector);
        if (request.preferredSalary != null) user.setPreferredSalary(request.preferredSalary);
        return userRepository.save(user);
    }

    public User uploadCv(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Maximum file size is 5MB");
        }
        User user = userContextService.currentUser();
        user.setCvUrl("uploads/" + file.getOriginalFilename());
        return userRepository.save(user);
    }

    public void deleteMe() {
        userRepository.delete(userContextService.currentUser());
    }
}
