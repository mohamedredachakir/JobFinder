package com.jobfinder.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobfinder.dto.JobDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class AdzunaClient {

    private static final Logger log = LoggerFactory.getLogger(AdzunaClient.class);
    private static final String BASE_URL = "https://api.adzuna.com/v1/api/jobs/fr/search/";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${external.adzuna.app-id:}")
    private String appId;

    @Value("${external.adzuna.app-key:}")
    private String appKey;

    public AdzunaClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<JobDTO> search(String query, String location) {
        List<JobDTO> jobs = new ArrayList<>();

        if (appId == null || appId.isEmpty() || appKey == null || appKey.isEmpty()) {
            log.info("Adzuna API keys not configured, using sample data");
            return getSampleData(query, location);
        }

        try {
            String url = BASE_URL + "1?app_id=" + appId + "&app_key=" + appKey +
                        "&what=" + (query != null ? query.replace(" ", "+") : "") +
                        "&where=" + (location != null ? location.replace(" ", "+") : "") +
                        "&results_per_page=20&content-type=application/json";

            String response = restTemplate.getForObject(url, String.class);
            JsonNode root = objectMapper.readTree(response);
            JsonNode results = root.path("results");

            if (results.isArray()) {
                for (JsonNode item : results) {
                    JobDTO dto = mapToJobDTO(item);
                    jobs.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching from Adzuna API: {}", e.getMessage());
            return getSampleData(query, location);
        }

        return jobs.isEmpty() ? getSampleData(query, location) : jobs;
    }

    private JobDTO mapToJobDTO(JsonNode item) {
        JobDTO dto = new JobDTO();
        dto.setId("adzuna-" + item.path("id").asText());
        dto.setSource("ADZUNA");
        dto.setSourceId(item.path("id").asText());
        dto.setTitle(item.path("title").asText("Unknown Position"));
        dto.setCompany(item.path("company").path("display_name").asText("Unknown Company"));
        dto.setLocation(item.path("location").path("display_name").asText("Unknown Location"));
        dto.setCountry("FR");
        
        String contractTime = item.path("contract_time").asText("");
        dto.setRemote(contractTime.contains("full_time") ? false : null);
        dto.setContractType(mapContractType(contractTime));
        
        dto.setDescription(stripHtml(item.path("description").asText("")));
        dto.setCategory(item.path("category").path("label").asText("General"));
        dto.setApplyUrl(item.path("redirect_url").asText(""));
        dto.setSalaryMin(item.path("salary_min").asDouble());
        dto.setSalaryMax(item.path("salary_max").asDouble());
        dto.setSalaryCurrency("EUR");
        dto.setLogoUrl(item.path("company").path("logo_url").asText(null));

        List<String> tags = new ArrayList<>();
        if (item.has("tags")) {
            item.path("tags").forEach(tag -> tags.add(tag.asText()));
        }
        dto.setTags(tags);

        String created = item.path("created").asText();
        if (!created.isEmpty()) {
            try {
                LocalDateTime postedAt = LocalDateTime.parse(created, DateTimeFormatter.ISO_DATE_TIME);
                dto.setPostedAt(postedAt);
            } catch (Exception e) {
                dto.setPostedAt(LocalDateTime.now().minusDays(1));
            }
        }

        return dto;
    }

    private String mapContractType(String contractTime) {
        if (contractTime == null) return "CDI";
        switch (contractTime.toLowerCase()) {
            case "full_time": return "CDI";
            case "part_time": return "CDD";
            case "contract": return "Freelance";
            case "internship": return "Stage";
            case "apprenticeship": return "Alternance";
            default: return "CDI";
        }
    }

    private String stripHtml(String html) {
        if (html == null) return "";
        return html.replaceAll("<[^>]*>", "").trim();
    }

    private List<JobDTO> getSampleData(String query, String location) {
        List<JobDTO> samples = new ArrayList<>();
        
        String[] titles = {
            query != null && !query.isEmpty() ? query : "Développeur Java Senior",
            "Développeur Full Stack Angular/React",
            "Data Engineer",
            "DevOps Engineer",
            "Product Manager IT"
        };
        
        String[] companies = {"Société Générale", "L'Oréal", "BNP Paribas", "Dassault Systèmes", "Capgemini"};
        String[] locations = {location != null && !location.isEmpty() ? location : "Paris", "Lyon", "Toulouse", "Remote", "Bordeaux"};
        double[] salaries = {55000, 65000, 45000, 50000, 60000};

        for (int i = 0; i < titles.length; i++) {
            JobDTO dto = new JobDTO();
            dto.setSource("ADZUNA");
            dto.setSourceId("adzuna-sample-" + i);
            dto.setId("adzuna-sample-" + i);
            dto.setTitle(titles[i]);
            dto.setCompany(companies[i]);
            dto.setLocation(locations[i]);
            dto.setCountry("FR");
            dto.setRemote(locations[i].equalsIgnoreCase("Remote"));
            dto.setContractType("CDI");
            dto.setDescription("Nous recherchons un(e) " + titles[i] + " pour rejoindre notre équipe. Vous participerez au développement de nos solutions innovantes.");
            dto.setCategory("IT");
            dto.setApplyUrl("https://www.adzuna.com");
            dto.setSalaryMin(salaries[i]);
            dto.setSalaryMax(salaries[i] + 20000);
            dto.setSalaryCurrency("EUR");
            dto.setTags(java.util.Arrays.asList("Java", "Spring Boot", "Angular", "React", "Python"));
            dto.setPostedAt(LocalDateTime.now().minusDays(i + 1));
            samples.add(dto);
        }
        
        return samples;
    }
}
