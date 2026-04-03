package com.jobfinder.service;

import com.jobfinder.dto.JobDTO;
import com.jobfinder.integration.AdzunaClient;
import com.jobfinder.integration.JSearchClient;
import com.jobfinder.integration.TheMuseClient;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.Executors;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

class JobAggregatorServiceTest {

    @Test
    void shouldDeduplicateJobs() {
        AdzunaClient adzuna = Mockito.mock(AdzunaClient.class);
        JSearchClient jsearch = Mockito.mock(JSearchClient.class);
        TheMuseClient muse = Mockito.mock(TheMuseClient.class);

        JobDTO a = new JobDTO();
        a.setId("1");
        a.setTitle("Java Developer");
        a.setCompany("ACME");
        a.setLocation("Paris");

        JobDTO b = new JobDTO();
        b.setId("2");
        b.setTitle("Java Developer");
        b.setCompany("ACME");
        b.setLocation("Paris");

        Mockito.when(adzuna.search(Mockito.anyString(), Mockito.anyString())).thenReturn(Collections.singletonList(a));
        Mockito.when(jsearch.search(Mockito.anyString(), Mockito.anyString())).thenReturn(Collections.singletonList(b));
        Mockito.when(muse.search(Mockito.anyString(), Mockito.anyString())).thenReturn(Collections.<JobDTO>emptyList());

        JobAggregatorService service = new JobAggregatorService(adzuna, jsearch, muse, Executors.newFixedThreadPool(2));
        List<JobDTO> jobs = service.aggregate("java", "paris", 0, 20);

        Assertions.assertEquals(1, jobs.size());
    }
}
