package com.pathgen.api.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class RoadmapResponse {
    private String id;
    private String title;
    private String skill;
    private String level;
    private int durationDays;
    private int dailyHours;
    private List<WeekDto> weeks;
    private LocalDateTime generatedAt;
}
