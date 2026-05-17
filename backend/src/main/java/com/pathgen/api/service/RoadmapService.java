package com.pathgen.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathgen.api.dto.*;
import com.pathgen.api.exception.GeminiServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public RoadmapResponse generateRoadmap(RoadmapRequest request) {
        log.info("▶ Roadmap request | skill: {} | level: {} | {}days | {}h/day",
                request.getSkill(), request.getLevel(), request.getDurationDays(), request.getDailyHours());

        String prompt = buildPrompt(request);
        String jsonText = geminiService.generateContent(prompt);
        jsonText = cleanJsonResponse(jsonText);

        try {
            RoadmapResponse roadmap = objectMapper.readValue(jsonText, RoadmapResponse.class);
            roadmap.setId(UUID.randomUUID().toString());
            roadmap.setSkill(request.getSkill());
            roadmap.setLevel(request.getLevel());
            roadmap.setDurationDays(request.getDurationDays());
            roadmap.setDailyHours(request.getDailyHours());
            roadmap.setGeneratedAt(LocalDateTime.now());
            enrichResourceLinks(roadmap, request.getSkill());
            int totalDays = roadmap.getWeeks().stream().mapToInt(w -> w.getDays().size()).sum();
            log.info("✔ Roadmap built | \"{}\" | {} weeks | {} days | id: {}",
                    roadmap.getTitle(), roadmap.getWeeks().size(), totalDays, roadmap.getId());
            return roadmap;
        } catch (Exception e) {
            log.error("✘ Failed to parse roadmap JSON: {}", e.getMessage());
            throw new GeminiServiceException("AI returned an invalid response format. Please try again.");
        }
    }

    private String buildPrompt(RoadmapRequest req) {
        int weeks = req.getDurationDays() / 7;
        int daysPerWeek = 7;
        String curatedResources = getCuratedResources(req.getSkill());

        return String.format("""
            You are an expert learning coach. Generate a highly structured %d-day learning roadmap for the following:

            Skill: %s
            Current Level: %s
            Daily Study Time: %d hours
            Goal: %s

            Return ONLY valid JSON (no markdown, no explanation) matching this exact schema:
            {
              "title": "string – e.g. '30-Day Java Mastery Roadmap'",
              "weeks": [
                {
                  "week": 1,
                  "goal": "What the learner achieves this week",
                  "motivationalMessage": "A short motivational quote for the week",
                  "days": [
                    {
                      "day": 1,
                      "topic": "Topic name",
                      "task": "Specific actionable task for the day (2-3 sentences)",
                      "resource": "A direct YouTube URL from the curated list below, or official docs URL",
                      "miniProject": "Small hands-on project or exercise for this day"
                    }
                  ]
                }
              ]
            }

            Rules:
            - Generate exactly %d weeks with %d days each (total %d days)
            - Each day must have unique, progressively harder topics
            - Mini-projects must be practical and completable within the daily time budget
            - Tailor difficulty to the %s level
            - Return ONLY the JSON object, nothing else
            %s
            """,
            req.getDurationDays(),
            req.getSkill(),
            req.getLevel(),
            req.getDailyHours(),
            req.getLearningGoal() != null ? req.getLearningGoal() : "Build strong proficiency",
            weeks, daysPerWeek, req.getDurationDays(),
            req.getLevel(),
            curatedResources
        );
    }

    // Post-processing: set both youtubeUrl (YouTube) and resource (website) from curated pools
    private void enrichResourceLinks(RoadmapResponse roadmap, String skill) {
        List<String> youtubePool = getYoutubePool(skill);
        List<String> websitePool = getWebsitePool(skill);
        int idx = 0;
        for (WeekDto week : roadmap.getWeeks()) {
            for (DayDto day : week.getDays()) {
                if (!youtubePool.isEmpty()) {
                    day.setYoutubeUrl(youtubePool.get(idx % youtubePool.size()));
                }
                if (!websitePool.isEmpty()) {
                    day.setResource(websitePool.get(idx % websitePool.size()));
                }
                log.debug("✔ Day {} | youtube: {} | website: {}", day.getDay(), day.getYoutubeUrl(), day.getResource());
                idx++;
            }
        }
    }

    private List<String> getYoutubePool(String skill) {
        if (skill == null) return List.of();
        String s = skill.toLowerCase().trim();

        if (s.contains("java") && !s.contains("spring") && !s.contains("boot")) {
            return List.of(
                "https://www.youtube.com/watch?v=eIrMbAQSU34",
                "https://www.youtube.com/watch?v=Qgl81fPcLc8",
                "https://www.youtube.com/playlist?list=PL553KfytvSHTPfvmg7u0VMCLrUyfuO6_K",
                "https://www.youtube.com/watch?v=A74TOX803D0"
            );
        }
        if (s.contains("spring") || s.contains("boot")) {
            return List.of(
                "https://www.youtube.com/watch?v=9SGDpanrc8U",
                "https://www.youtube.com/watch?v=1aWhYEynZQw",
                "https://www.youtube.com/playlist?list=PLhfxuQVMs-nx3YQa3XJ9-4g_EoK0J8WhU",
                "https://www.youtube.com/watch?v=zvR-Oif_nxg",
                "https://www.youtube.com/watch?v=-mwpoE0x0JQ"
            );
        }
        if (s.contains("react")) {
            return List.of(
                "https://www.youtube.com/watch?v=bMknfKXIFA8",
                "https://www.youtube.com/watch?v=O6P86uwfdR0"
            );
        }
        if (s.contains("python")) {
            return List.of(
                "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                "https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU"
            );
        }
        return List.of();
    }

    private List<String> getWebsitePool(String skill) {
        if (skill == null) return List.of();
        String s = skill.toLowerCase().trim();

        if (s.contains("java") && !s.contains("spring") && !s.contains("boot")) {
            return List.of(
                "https://www.geeksforgeeks.org/java/",
                "https://www.w3schools.com/java/",
                "https://www.freecodecamp.org/news/tag/java/",
                "https://docs.oracle.com/en/java/javase/21/docs/api/"
            );
        }
        if (s.contains("spring") || s.contains("boot")) {
            return List.of(
                "https://www.geeksforgeeks.org/spring-boot/",
                "https://www.baeldung.com/spring-boot",
                "https://www.freecodecamp.org/news/tag/spring-boot/",
                "https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/"
            );
        }
        if (s.contains("react")) {
            return List.of(
                "https://www.freecodecamp.org/news/tag/react/",
                "https://www.w3schools.com/react/",
                "https://www.geeksforgeeks.org/reactjs/",
                "https://react.dev/learn"
            );
        }
        if (s.contains("python")) {
            return List.of(
                "https://www.freecodecamp.org/news/tag/python/",
                "https://www.w3schools.com/python/",
                "https://www.geeksforgeeks.org/python-programming-language/",
                "https://docs.python.org/3/tutorial/"
            );
        }
        return List.of(
            "https://www.freecodecamp.org",
            "https://www.geeksforgeeks.org",
            "https://www.w3schools.com"
        );
    }

    private String getCuratedResources(String skill) {
        if (skill == null) return "";
        String s = skill.toLowerCase().trim();

        if (s.contains("java") && !s.contains("spring") && !s.contains("boot")) {
            return """

            CURATED YOUTUBE RESOURCES FOR JAVA (use these exact URLs in the resource field — vary them across days):
            - Java basics, data types, variables, operators: https://www.youtube.com/watch?v=eIrMbAQSU34 (Programming with Mosh – Java Full Course)
            - OOP, classes, objects, inheritance: https://www.youtube.com/watch?v=Qgl81fPcLc8 (Programming with Mosh – Java Full Course NEW)
            - Java complete tutorials playlist: https://www.youtube.com/playlist?list=PL553KfytvSHTPfvmg7u0VMCLrUyfuO6_K (Telusko Java Tutorials)
            - Java for beginners, arrays, loops: https://www.youtube.com/watch?v=A74TOX803D0 (freeCodeCamp – Java Programming for Beginners)
            - Collections, generics, streams: https://www.youtube.com/playlist?list=PL553KfytvSHTPfvmg7u0VMCLrUyfuO6_K (Telusko Java Tutorials)
            - Exception handling, file I/O, multithreading: https://www.youtube.com/watch?v=eIrMbAQSU34 (Programming with Mosh)
            - Official Java docs: https://docs.oracle.com/en/java/
            Use a different URL each week. Do not repeat the same URL on consecutive days.
            """;
        }

        if (s.contains("spring") || s.contains("boot")) {
            return """

            CURATED YOUTUBE RESOURCES FOR SPRING BOOT (use these exact URLs in the resource field — vary them across days):
            - Spring Boot intro, project setup, REST API basics: https://www.youtube.com/watch?v=9SGDpanrc8U (Amigoscode – Spring Boot Full Course)
            - Spring Boot microservices, Docker, Kubernetes: https://www.youtube.com/watch?v=1aWhYEynZQw (Amigoscode – 10hr Microservices Course)
            - Spring Boot tutorials playlist (beginner to advanced): https://www.youtube.com/playlist?list=PLhfxuQVMs-nx3YQa3XJ9-4g_EoK0J8WhU (Daily Code Buffer)
            - Spring Boot complete master class: https://www.youtube.com/watch?v=zvR-Oif_nxg (Spring Boot Complete Tutorial)
            - Spring Boot in 2 hours: https://www.youtube.com/watch?v=-mwpoE0x0JQ (Spring Boot – Learn Spring Boot 3)
            - Spring & Spring Boot playlist: https://www.youtube.com/playlist?list=PLwvrYc43l1MzeA2bBYQhCWr2gvWLs9A7S (Amigoscode playlist)
            - Official Spring docs: https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
            Use a different URL each week. Do not repeat the same URL on consecutive days.
            """;
        }

        if (s.contains("react")) {
            return """

            CURATED YOUTUBE RESOURCES FOR REACT (use these exact URLs in the resource field — vary them across days):
            - React full course for beginners: https://www.youtube.com/watch?v=bMknfKXIFA8 (freeCodeCamp – React Course)
            - React hooks, state, useEffect: https://www.youtube.com/watch?v=O6P86uwfdR0 (Web Dev Simplified – React Hooks)
            - React official docs: https://react.dev/learn
            Use a different URL each week. Do not repeat the same URL on consecutive days.
            """;
        }

        if (s.contains("python")) {
            return """

            CURATED YOUTUBE RESOURCES FOR PYTHON (use these exact URLs in the resource field — vary them across days):
            - Python full course for beginners: https://www.youtube.com/watch?v=_uQrJ0TkZlc (Programming with Mosh – Python)
            - Python tutorials for beginners playlist: https://www.youtube.com/playlist?list=PL-osiE80TeTt2d9bfVyTiXJA-UTHn6WwU (Corey Schafer – Python)
            - Python official docs: https://docs.python.org/3/tutorial/
            Use a different URL each week. Do not repeat the same URL on consecutive days.
            """;
        }

        // Generic fallback for other skills
        return """

            RESOURCE RULES:
            - Use real, working YouTube URLs (not generic channel names)
            - Prefer freeCodeCamp, official docs, or well-known educator channels
            - Each resource field must be a direct URL (https://...)
            """;
    }

    private String cleanJsonResponse(String text) {
        text = text.trim();
        // Remove ```json ... ``` or ``` ... ```
        if (text.startsWith("```")) {
            int start = text.indexOf('\n') + 1;
            int end = text.lastIndexOf("```");
            if (end > start) {
                text = text.substring(start, end).trim();
            }
        }
        return text;
    }
}
