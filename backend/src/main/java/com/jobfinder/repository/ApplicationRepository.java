package com.jobfinder.repository;

import com.jobfinder.model.Application;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findAllByUserIdOrderByUpdatedAtDesc(Long userId);
}
