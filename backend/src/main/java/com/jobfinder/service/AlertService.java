package com.jobfinder.service;

import com.jobfinder.dto.Requests;
import com.jobfinder.exception.ResourceNotFoundException;
import com.jobfinder.model.Alert;
import com.jobfinder.repository.AlertRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final UserContextService userContextService;

    public AlertService(AlertRepository alertRepository, UserContextService userContextService) {
        this.alertRepository = alertRepository;
        this.userContextService = userContextService;
    }

    public List<Alert> listCurrentUser() {
        return alertRepository.findAllByUserId(userContextService.currentUser().getId());
    }

    public List<Alert> listActive() {
        return alertRepository.findAllByIsActiveTrue();
    }

    @Transactional
    public Alert create(Requests.AlertRequest request) {
        Alert alert = new Alert();
        alert.setUser(userContextService.currentUser());
        apply(alert, request);
        return alertRepository.save(alert);
    }

    @Transactional
    public Alert update(Long id, Requests.AlertRequest request) {
        Alert alert = owned(id);
        apply(alert, request);
        return alertRepository.save(alert);
    }

    @Transactional
    public void delete(Long id) {
        alertRepository.delete(owned(id));
    }

    private Alert owned(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));
        if (!alert.getUser().getId().equals(userContextService.currentUser().getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        return alert;
    }

    private void apply(Alert alert, Requests.AlertRequest request) {
        alert.setKeywords(request.keywords);
        alert.setLocation(request.location);
        alert.setContractType(request.contractType);
        alert.setMinSalary(request.minSalary);
        alert.setFrequency(request.frequency);
        alert.setIsActive(request.isActive == null ? Boolean.TRUE : request.isActive);
    }
}
