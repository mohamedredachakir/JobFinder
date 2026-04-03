package com.jobfinder.repository;

import com.jobfinder.model.Favorite;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    List<Favorite> findAllByUserIdOrderBySavedAtDesc(Long userId);
}
