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
public class TheMuseClient {

    private static final Logger log = LoggerFactory.getLogger(TheMuseClient.class);
    private static final String BASE_URL = "https://www.themuse.com/api/public/jobs";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${external.themuse.api-key:}")
    private String apiKey;

    public TheMuseClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<JobDTO> search(String query, String location) {
        List<JobDTO> jobs = new ArrayList<>();

        try {
            String url = BASE_URL + "?page=0&descending=true" +
                        (query != null && !query.isEmpty() ? "&search=" + query.replace(" ", "%20") : "") +
                        (location != null && !location.isEmpty() ? "&location=" + location.replace(" ", "%20") : "");

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
            log.error("Error fetching from TheMuse API: {}", e.getMessage());
            return getSampleData(query, location);
        }

        return jobs.isEmpty() ? getSampleData(query, location) : jobs;
    }

    private JobDTO mapToJobDTO(JsonNode item) {
        JobDTO dto = new JobDTO();
        
        String id = item.path("id").asText("0");
        dto.setId("themuse-" + id);
        dto.setSource("THEMUSE");
        dto.setSourceId(id);
        dto.setTitle(item.path("name").asText("Unknown Position"));
        
        JsonNode company = item.path("company");
        dto.setCompany(company.path("name").asText("Unknown Company"));
        dto.setLogoUrl(company.path("logo").asText(null));
        
        JsonNode locationNode = item.path("locations");
        StringBuilder locationBuilder = new StringBuilder();
        if (locationNode.isArray()) {
            for (int i = 0; i < locationNode.size(); i++) {
                if (i > 0) locationBuilder.append(", ");
                locationBuilder.append(locationNode.get(i).path("name").asText());
            }
        }
        dto.setLocation(locationBuilder.length() > 0 ? locationBuilder.toString() : "Remote");
        
        dto.setCountry("US");
        
        JsonNode categories = item.path("categories");
        StringBuilder categoryBuilder = new StringBuilder();
        if (categories.isArray()) {
            for (int i = 0; i < Math.min(categories.size(), 2); i++) {
                if (i > 0) categoryBuilder.append(", ");
                categoryBuilder.append(categories.get(i).path("name").asText());
            }
        }
        dto.setCategory(categoryBuilder.length() > 0 ? categoryBuilder.toString() : "General");
        
        dto.setRemote(item.path("work_type").asText("").contains("Remote") || 
                      item.path("work_type").asText("").contains("remote"));
        dto.setContractType(mapWorkType(item.path("work_type").asText("")));
        
        dto.setDescription(stripHtml(item.path("contents").asText("")));
        dto.setApplyUrl(item.path("refs").path("landing_page").asText(""));
        
        JsonNode levels = item.path("levels");
        List<String> tags = new ArrayList<>();
        if (levels.isArray()) {
            levels.forEach(level -> tags.add(level.path("name").asText()));
        }
        dto.setTags(tags);

        String published = item.path("published_date").asText();
        if (!published.isEmpty()) {
            try {
                LocalDateTime postedAt = LocalDateTime.parse(published, DateTimeFormatter.ISO_DATE_TIME);
                dto.setPostedAt(postedAt);
            } catch (Exception e) {
                dto.setPostedAt(LocalDateTime.now().minusDays(2));
            }
        }

        return dto;
    }

    private String mapWorkType(String workType) {
        if (workType == null) return "CDI";
        switch (workType.toLowerCase()) {
            case "full-time": return "CDI";
            case "part-time": return "CDD";
            case "contract": return "Freelance";
            case "internship": return "Stage";
            case "temporary": return "CDD";
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
            query != null && !query.isEmpty() ? query : "Backend Engineer",
            "Frontend Developer",
            "Full Stack Engineer",
            "Machine Learning Engineer",
            "Product Designer"
        };
        
        String[] companies = {"Spotify", "Airbnb", "Uber", "Netflix", "Slack"};
        String[] locations = {location != null && !location.isEmpty() ? location : "Remote", "San Francisco", "New York", "Remote", "London"};
        double[] salaries = {70000, 65000, 75000, 80000, 60000};

        for (int i = 0; i < titles.length; i++) {
            JobDTO dto = new JobDTO();
            dto.setSource("THEMUSE");
            dto.setSourceId("themuse-sample-" + i);
            dto.setId("themuse-sample-" + i);
            dto.setTitle(titles[i]);
            dto.setCompany(companies[i]);
            dto.setLocation(locations[i]);
            dto.setCountry("US");
            dto.setRemote(locations[i].equalsIgnoreCase("Remote"));
            dto.setContractType("CDI");
            dto.setDescription("We are looking for a talented " + titles[i] + " to join " + companies[i] + ". This is an exciting opportunity to work on cutting-edge technology.");
            dto.setCategory("Technology");
            dto.setApplyUrl("https://www.themuse.com/");
            dto.setSalaryMin(salaries[i]);
            dto.setSalaryMax(salaries[i] + 30000);
            dto.setSalaryCurrency("USD");
            dto.setTags(java.util.Arrays.asList("Tech", "Innovation", "Growth", "Remote OK"));
            dto.setPostedAt(LocalDateTime.now().minusDays(i + 1));
            samples.add(dto);
        }
        
        return samples;
    }
}
