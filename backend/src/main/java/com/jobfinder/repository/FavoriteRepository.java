package com.jobfinder.repository;

import com.jobfinder.model.Favorite;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findAllByUserIdOrderBySavedAtDesc(Long userId);
    Optional<Favorite> findByUserIdAndJobId(Long userId, String jobId);
    boolean existsByUserIdAndJobId(Long userId, String jobId);
}
