package com.jobfinder.controller;

import com.jobfinder.dto.JobDTO;
import com.jobfinder.service.JobAggregatorService;
import java.util.Arrays;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    private final JobAggregatorService aggregatorService;

    public JobController(JobAggregatorService aggregatorService) {
        this.aggregatorService = aggregatorService;
    }

    @GetMapping
    public ResponseEntity<List<JobDTO>> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(aggregatorService.aggregate(q, location, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<JobDTO> detail(@PathVariable String id) {
        List<JobDTO> list = aggregatorService.aggregate(null, null, 0, 100);
        for (JobDTO dto : list) {
            if (id.equals(dto.getId())) {
                return ResponseEntity.ok(dto);
            }
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/sources")
    public ResponseEntity<List<String>> sources() {
        return ResponseEntity.ok(Arrays.asList("ADZUNA", "JSEARCH", "THEMUSE"));
    }
}
