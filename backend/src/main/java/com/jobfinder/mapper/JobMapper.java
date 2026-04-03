package com.jobfinder.mapper;

import com.jobfinder.dto.JobDTO;
import java.util.UUID;
import org.springframework.stereotype.Component;

@Component
public class JobMapper {
    public JobDTO ensureId(JobDTO dto) {
        if (dto.getId() == null || dto.getId().trim().isEmpty()) {
            dto.setId(UUID.randomUUID().toString());
        }
        return dto;
    }
}
