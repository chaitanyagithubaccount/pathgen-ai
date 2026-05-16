package com.pathgen.api.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.pathgen.api.dto.*;
import com.pathgen.api.exception.GeminiServiceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoadmapService {

    private final GeminiService geminiService;
    private final ObjectMapper objectMapper;

    public RoadmapResponse generateRoadmap(RoadmapRequest request) {
        String prompt = buildPrompt(request);
        log.info("Generating roadmap for skill: {}, level: {}", request.getSkill(), request.getLevel());

        String jsonText = geminiService.generateContent(prompt);

        // Strip markdown code fences if present
        jsonText = cleanJsonResponse(jsonText);

        try {
            RoadmapResponse roadmap = objectMapper.readValue(jsonText, RoadmapResponse.class);
            roadmap.setId(UUID.randomUUID().toString());
            roadmap.setSkill(request.getSkill());
            roadmap.setLevel(request.getLevel());
            roadmap.setDurationDays(request.getDurationDays());
            roadmap.setDailyHours(request.getDailyHours());
            roadmap.setGeneratedAt(LocalDateTime.now());
            return roadmap;
        } catch (Exception e) {
            log.error("Failed to parse roadmap JSON: {}", e.getMessage());
            throw new GeminiServiceException("AI returned an invalid response format. Please try again.");
        }
    }

    private String buildPrompt(RoadmapRequest req) {
        int weeks = req.getDurationDays() / 7;
        int daysPerWeek = 7;

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
                      "resource": "Free online resource URL or name (YouTube/docs/tutorial)",
                      "miniProject": "Small hands-on project or exercise for this day"
                    }
                  ]
                }
              ]
            }

            Rules:
            - Generate exactly %d weeks with %d days each (total %d days)
            - Each day must have unique, progressively harder topics
            - Resources must be real, free, and relevant (YouTube channels, official docs, freeCodeCamp, etc.)
            - Mini-projects must be practical and completable within the daily time budget
            - Tailor difficulty to the %s level
            - Return ONLY the JSON object, nothing else
            """,
            req.getDurationDays(),
            req.getSkill(),
            req.getLevel(),
            req.getDailyHours(),
            req.getLearningGoal() != null ? req.getLearningGoal() : "Build strong proficiency",
            weeks, daysPerWeek, req.getDurationDays(),
            req.getLevel()
        );
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
