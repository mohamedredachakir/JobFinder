package com.jobfinder.controller;

import com.jobfinder.dto.Requests;
import com.jobfinder.model.Application;
import com.jobfinder.service.ApplicationService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @GetMapping
    public ResponseEntity<List<Application>> list() {
        return ResponseEntity.ok(applicationService.list());
    }

    @PostMapping
    public ResponseEntity<Application> create(@Valid @RequestBody Requests.ApplicationCreateRequest request) {
        return ResponseEntity.ok(applicationService.create(request));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Application> updateStatus(@PathVariable Long id,
                                                    @Valid @RequestBody Requests.ApplicationStatusUpdateRequest request) {
        return ResponseEntity.ok(applicationService.updateStatus(id, request));
    }

    @PutMapping("/{id}/notes")
    public ResponseEntity<Application> updateNotes(@PathVariable Long id,
                                                   @Valid @RequestBody Requests.ApplicationNotesRequest request) {
        return ResponseEntity.ok(applicationService.updateNotes(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        applicationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
