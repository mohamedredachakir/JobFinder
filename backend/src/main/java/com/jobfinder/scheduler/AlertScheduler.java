package com.jobfinder.scheduler;

import com.jobfinder.model.Alert;
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

    public AlertScheduler(AlertService alertService, EmailService emailService) {
        this.alertService = alertService;
        this.emailService = emailService;
    }

    @Scheduled(cron = "0 0 * * * *")
    public void dispatchAlerts() {
        List<Alert> alerts = alertService.listActive();
        for (Alert alert : alerts) {
            emailService.sendAlertEmail(
                    alert.getUser().getEmail(),
                    "JobFinder alert: " + alert.getKeywords(),
                    "New jobs found for your criteria at " + LocalDateTime.now()
            );
        }
    }
}
