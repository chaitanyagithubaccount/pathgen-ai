package com.pathgen.api.controller;

import com.pathgen.api.dto.ProgressUpdateRequest;
import com.pathgen.api.dto.RoadmapRequest;
import com.pathgen.api.dto.RoadmapResponse;
import com.pathgen.api.service.RoadmapService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class RoadmapController {

    private final RoadmapService roadmapService;

    /**
     * Generate a personalized AI learning roadmap.
     */
    @PostMapping("/generate-roadmap")
    public ResponseEntity<RoadmapResponse> generateRoadmap(@Valid @RequestBody RoadmapRequest request) {
        log.info("Roadmap generation request for skill: {}", request.getSkill());
        RoadmapResponse response = roadmapService.generateRoadmap(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Health check endpoint.
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of(
            "status", "UP",
            "service", "PathGen AI Backend"
        ));
    }

    /**
     * Save progress update (progress is managed on frontend via localStorage,
     * but this endpoint is available for future DB integration).
     */
    @PostMapping("/save-progress")
    public ResponseEntity<Map<String, Object>> saveProgress(@RequestBody ProgressUpdateRequest request) {
        log.info("Progress update: roadmap={}, day={}, completed={}",
                 request.getRoadmapId(), request.getDayNumber(), request.isCompleted());
        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Progress saved",
            "dayNumber", request.getDayNumber(),
            "completed", request.isCompleted()
        ));
    }
}
