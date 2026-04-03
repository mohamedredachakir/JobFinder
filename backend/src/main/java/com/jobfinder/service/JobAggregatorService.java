package com.jobfinder.service;

import com.jobfinder.dto.JobDTO;
import com.jobfinder.integration.AdzunaClient;
import com.jobfinder.integration.JSearchClient;
import com.jobfinder.integration.TheMuseClient;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

@Service
public class JobAggregatorService {

    private final AdzunaClient adzunaClient;
    private final JSearchClient jSearchClient;
    private final TheMuseClient theMuseClient;
    private final Executor executor;

    public JobAggregatorService(AdzunaClient adzunaClient,
                                JSearchClient jSearchClient,
                                TheMuseClient theMuseClient,
                                @Qualifier("jobAggregatorExecutor") Executor executor) {
        this.adzunaClient = adzunaClient;
        this.jSearchClient = jSearchClient;
        this.theMuseClient = theMuseClient;
        this.executor = executor;
    }

    @Cacheable(value = "jobs-search", key = "#query + ':' + #location + ':' + #page + ':' + #size")
    public List<JobDTO> aggregate(String query, String location, int page, int size) {
        CompletableFuture<List<JobDTO>> adzuna = CompletableFuture.supplyAsync(() -> adzunaClient.search(query, location), executor);
        CompletableFuture<List<JobDTO>> jsearch = CompletableFuture.supplyAsync(() -> jSearchClient.search(query, location), executor);
        CompletableFuture<List<JobDTO>> muse = CompletableFuture.supplyAsync(() -> theMuseClient.search(query, location), executor);

        List<JobDTO> all = CompletableFuture.allOf(adzuna, jsearch, muse)
                .thenApply(v -> {
                    List<JobDTO> list = new ArrayList<JobDTO>();
                    list.addAll(adzuna.join());
                    list.addAll(jsearch.join());
                    list.addAll(muse.join());
                    return list;
                }).join();

        Map<String, JobDTO> dedup = all.stream().collect(Collectors.toMap(
                j -> (safe(j.getTitle()) + "|" + safe(j.getCompany()) + "|" + safe(j.getLocation())).toLowerCase(),
                j -> j,
                (a, b) -> a
        ));

        List<JobDTO> deduped = new ArrayList<JobDTO>(dedup.values());
        deduped.sort(Comparator.comparing(JobDTO::getPostedAt, Comparator.nullsLast(Comparator.reverseOrder())));

        int from = Math.min(page * size, deduped.size());
        int to = Math.min(from + size, deduped.size());
        if (from >= to) {
            return Collections.emptyList();
        }
        return new ArrayList<JobDTO>(deduped.subList(from, to));
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
