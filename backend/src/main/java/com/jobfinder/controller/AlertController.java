package com.jobfinder.controller;

import com.jobfinder.dto.Requests;
import com.jobfinder.model.Alert;
import com.jobfinder.service.AlertService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<Alert>> list() {
        return ResponseEntity.ok(alertService.listCurrentUser());
    }

    @PostMapping
    public ResponseEntity<Alert> create(@Valid @RequestBody Requests.AlertRequest request) {
        return ResponseEntity.ok(alertService.create(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Alert> update(@PathVariable Long id, @Valid @RequestBody Requests.AlertRequest request) {
        return ResponseEntity.ok(alertService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        alertService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
