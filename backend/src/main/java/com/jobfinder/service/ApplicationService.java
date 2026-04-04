package com.jobfinder.service;

import com.jobfinder.dto.Requests;
import com.jobfinder.exception.ResourceNotFoundException;
import com.jobfinder.model.Application;
import com.jobfinder.repository.ApplicationRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final UserContextService userContextService;

    public ApplicationService(ApplicationRepository applicationRepository, UserContextService userContextService) {
        this.applicationRepository = applicationRepository;
        this.userContextService = userContextService;
    }

    public List<Application> list() {
        return applicationRepository.findAllByUserIdOrderByUpdatedAtDesc(userContextService.currentUser().getId());
    }

    @Transactional
    public Application create(Requests.ApplicationCreateRequest request) {
        Application app = new Application();
        app.setUser(userContextService.currentUser());
        app.setJobId(request.jobId);
        app.setJobData(request.jobData);
        return applicationRepository.save(app);
    }

    @Transactional
    public Application updateStatus(Long id, Requests.ApplicationStatusUpdateRequest request) {
        Application app = owned(id);
        app.setStatus(request.status);
        return applicationRepository.save(app);
    }

    @Transactional
    public Application updateNotes(Long id, Requests.ApplicationNotesRequest request) {
        Application app = owned(id);
        app.setNotes(request.notes);
        return applicationRepository.save(app);
    }

    @Transactional
    public void delete(Long id) {
        applicationRepository.delete(owned(id));
    }

    private Application owned(Long id) {
        Application app = applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        if (!app.getUser().getId().equals(userContextService.currentUser().getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        return app;
    }
}
