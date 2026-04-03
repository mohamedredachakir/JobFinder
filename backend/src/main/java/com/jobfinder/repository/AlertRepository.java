package com.jobfinder.repository;

import com.jobfinder.model.Alert;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findAllByUserId(Long userId);
    List<Alert> findAllByIsActiveTrue();
}
