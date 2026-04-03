package com.jobfinder.controller;

import com.jobfinder.dto.Requests;
import com.jobfinder.model.Favorite;
import com.jobfinder.service.FavoriteService;
import java.util.List;
import javax.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<Favorite>> list() {
        return ResponseEntity.ok(favoriteService.list());
    }

    @PostMapping
    public ResponseEntity<Favorite> create(@Valid @RequestBody Requests.FavoriteCreateRequest request) {
        return ResponseEntity.ok(favoriteService.create(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        favoriteService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
