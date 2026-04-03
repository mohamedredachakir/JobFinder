package com.jobfinder.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobfinder.dto.JobDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class JSearchClient {

    private static final Logger log = LoggerFactory.getLogger(JSearchClient.class);
    private static final String BASE_URL = "https://jsearch.p.rapidapi.com/search";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${external.jsearch.api-key:}")
    private String apiKey;

    public JSearchClient(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<JobDTO> search(String query, String location) {
        List<JobDTO> jobs = new ArrayList<>();

        if (apiKey == null || apiKey.isEmpty()) {
            log.info("JSearch API key not configured, using sample data");
            return getSampleData(query, location);
        }

        try {
            String url = BASE_URL + "?query=" + (query != null ? query.replace(" ", "%20") : "") +
                        "&location=" + (location != null ? location.replace(" ", "%20") : "") +
                        "&num_pages=1";

            HttpHeaders headers = new HttpHeaders();
            headers.set("X-RapidAPI-Key", apiKey);
            headers.set("X-RapidAPI-Host", "jsearch.p.rapidapi.com");
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode data = root.path("data");

            if (data.isArray()) {
                for (JsonNode item : data) {
                    JobDTO dto = mapToJobDTO(item);
                    jobs.add(dto);
                }
            }
        } catch (Exception e) {
            log.error("Error fetching from JSearch API: {}", e.getMessage());
            return getSampleData(query, location);
        }

        return jobs.isEmpty() ? getSampleData(query, location) : jobs;
    }

    private JobDTO mapToJobDTO(JsonNode item) {
        JobDTO dto = new JobDTO();
        dto.setId("jsearch-" + item.path("job_id").asText());
        dto.setSource("JSEARCH");
        dto.setSourceId(item.path("job_id").asText());
        dto.setTitle(item.path("job_title").asText("Unknown Position"));
        dto.setCompany(item.path("employer_name").asText("Unknown Company"));
        dto.setLocation(item.path("job_city").asText(item.path("job_location").asText("Unknown Location")));
        dto.setCountry(item.path("job_country").asText("FR"));
        
        String jobType = item.path("job_employment_type").asText("");
        dto.setRemote(jobType.contains("remote") || item.path("job_is_remote").asBoolean(false));
        dto.setContractType(mapContractType(jobType));
        
        dto.setDescription(stripHtml(item.path("job_description").asText("")));
        dto.setCategory(item.path("job_industry").asText("General"));
        dto.setApplyUrl(item.path("job_apply_link").asText(""));
        
        String salary = item.path("job_salary_currency").asText("EUR") + " " + item.path("job_salary_period").asText("year");
        dto.setSalaryCurrency(item.path("job_salary_currency").asText("EUR"));
        
        String[] salaryRange = item.path("job_salary").asText("").split("-");
        if (salaryRange.length >= 2) {
            try {
                dto.setSalaryMin(Double.parseDouble(salaryRange[0].replaceAll("[^0-9]", "")));
                dto.setSalaryMax(Double.parseDouble(salaryRange[1].replaceAll("[^0-9]", "")));
            } catch (NumberFormatException e) {
                dto.setSalaryMin(null);
                dto.setSalaryMax(null);
            }
        }
        
        dto.setLogoUrl(item.path("employer_logo").asText(null));

        List<String> tags = new ArrayList<>();
        JsonNode skills = item.path("job_skills");
        if (skills.isArray()) {
            skills.forEach(skill -> tags.add(skill.asText()));
        }
        dto.setTags(tags);

        String posted = item.path("job_posted_at_datetime_utc").asText();
        if (!posted.isEmpty()) {
            try {
                LocalDateTime postedAt = LocalDateTime.parse(posted, DateTimeFormatter.ISO_DATE_TIME);
                dto.setPostedAt(postedAt);
            } catch (Exception e) {
                dto.setPostedAt(LocalDateTime.now().minusHours(10));
            }
        }

        return dto;
    }

    private String mapContractType(String employmentType) {
        if (employmentType == null) return "CDI";
        switch (employmentType.toUpperCase()) {
            case "FULLTIME": return "CDI";
            case "CONTRACTOR": return "Freelance";
            case "PARTIME": return "CDD";
            case "INTERN": return "Stage";
            case "TEMPORARY": return "CDD";
            case "INTERNSHIP": return "Stage";
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
            query != null && !query.isEmpty() ? query : "Développeur Angular",
            "Backend Engineer Python",
            "Cloud Architect AWS",
            "UX Designer",
            "Scrum Master"
        };
        
        String[] companies = {"Google France", "Microsoft", "Amazon", "Meta", "Apple"};
        String[] locations = {location != null && !location.isEmpty() ? location : "Remote", "Paris", "Lyon", "Remote", "Bordeaux"};
        double[] salaries = {60000, 55000, 70000, 50000, 48000};

        for (int i = 0; i < titles.length; i++) {
            JobDTO dto = new JobDTO();
            dto.setSource("JSEARCH");
            dto.setSourceId("jsearch-sample-" + i);
            dto.setId("jsearch-sample-" + i);
            dto.setTitle(titles[i]);
            dto.setCompany(companies[i]);
            dto.setLocation(locations[i]);
            dto.setCountry("FR");
            dto.setRemote(locations[i].equalsIgnoreCase("Remote"));
            dto.setContractType("CDI");
            dto.setDescription("Rejoignez " + companies[i] + " en tant que " + titles[i] + ". Vous contribuerez à des projets innovants et stimulants.");
            dto.setCategory("IT");
            dto.setApplyUrl("https://rapidapi.com/");
            dto.setSalaryMin(salaries[i]);
            dto.setSalaryMax(salaries[i] + 25000);
            dto.setSalaryCurrency("EUR");
            dto.setTags(java.util.Arrays.asList("Angular", "React", "Python", "AWS", "Docker"));
            dto.setPostedAt(LocalDateTime.now().minusHours(i * 5));
            samples.add(dto);
        }
        
        return samples;
    }
}
