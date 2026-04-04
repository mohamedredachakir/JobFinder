package com.jobfinder.service;

import com.jobfinder.dto.Requests;
import com.jobfinder.exception.ResourceNotFoundException;
import com.jobfinder.model.Favorite;
import com.jobfinder.repository.FavoriteRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final UserContextService userContextService;

    public FavoriteService(FavoriteRepository favoriteRepository, UserContextService userContextService) {
        this.favoriteRepository = favoriteRepository;
        this.userContextService = userContextService;
    }

    public List<Favorite> list() {
        return favoriteRepository.findAllByUserIdOrderBySavedAtDesc(userContextService.currentUser().getId());
    }

    @Transactional
    public Favorite create(Requests.FavoriteCreateRequest request) {
        Long userId = userContextService.currentUser().getId();
        
        if (favoriteRepository.existsByUserIdAndJobId(userId, request.jobId)) {
            throw new IllegalArgumentException("Job already in favorites");
        }
        
        Favorite favorite = new Favorite();
        favorite.setUser(userContextService.currentUser());
        favorite.setJobId(request.jobId);
        favorite.setJobData(request.jobData);
        return favoriteRepository.save(favorite);
    }

    @Transactional
    public void delete(Long id) {
        Favorite favorite = favoriteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        if (!favorite.getUser().getId().equals(userContextService.currentUser().getId())) {
            throw new IllegalArgumentException("Forbidden");
        }
        favoriteRepository.delete(favorite);
    }
}
