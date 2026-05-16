package com.pathgen.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoadmapRequest {

    @NotBlank(message = "Skill is required")
    private String skill;

    @NotNull(message = "Current level is required")
    private String level; // BEGINNER, INTERMEDIATE, ADVANCED

    private int dailyHours = 2;

    private int durationDays = 30;

    private String learningGoal;
}
