package com.jobfinder.scheduler;

import com.jobfinder.model.Alert;
import com.jobfinder.model.AlertFrequency;
import com.jobfinder.repository.AlertRepository;
import com.jobfinder.service.AlertService;
import com.jobfinder.service.EmailService;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class AlertScheduler {

    private final AlertService alertService;
    private final EmailService emailService;
    private final AlertRepository alertRepository;

    public AlertScheduler(AlertService alertService, EmailService emailService, AlertRepository alertRepository) {
        this.alertService = alertService;
        this.emailService = emailService;
        this.alertRepository = alertRepository;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void dispatchAlerts() {
        List<Alert> alerts = alertService.listActive();
        for (Alert alert : alerts) {
            if (shouldSendAlert(alert)) {
                emailService.sendAlertEmail(
                        alert.getUser().getEmail(),
                        "JobFinder alert: " + alert.getKeywords(),
                        "New jobs found for your criteria at " + LocalDateTime.now()
                );
                alert.setLastSentAt(LocalDateTime.now());
                alertRepository.save(alert);
            }
        }
    }

    private boolean shouldSendAlert(Alert alert) {
        LocalDateTime lastSent = alert.getLastSentAt();
        if (lastSent == null) {
            return true;
        }
        
        LocalDateTime now = LocalDateTime.now();
        switch (alert.getFrequency()) {
            case IMMEDIATE:
                return true;
            case DAILY:
                return lastSent.plusDays(1).isBefore(now);
            case WEEKLY:
                return lastSent.plusWeeks(1).isBefore(now);
            default:
                return true;
        }
    }
}
