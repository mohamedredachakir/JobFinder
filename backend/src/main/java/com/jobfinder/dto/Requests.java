package com.jobfinder.dto;

import com.jobfinder.model.AlertFrequency;
import com.jobfinder.model.ApplicationStatus;
import java.math.BigDecimal;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class Requests {
    public static class FavoriteCreateRequest {
        @NotBlank public String jobId;
        @NotBlank public String jobData;
    }

    public static class ApplicationCreateRequest {
        @NotBlank public String jobId;
        @NotBlank public String jobData;
    }

    public static class ApplicationStatusUpdateRequest {
        @NotNull public ApplicationStatus status;
    }

    public static class ApplicationNotesRequest {
        public String notes;
    }

    public static class AlertRequest {
        @NotBlank public String keywords;
        public String location;
        public String contractType;
        public BigDecimal minSalary;
        @NotNull public AlertFrequency frequency;
        public Boolean isActive = true;
    }

    public static class UserUpdateRequest {
        public String firstName;
        public String lastName;
        public String preferredLocation;
        public String preferredSector;
        public BigDecimal preferredSalary;
    }
}
