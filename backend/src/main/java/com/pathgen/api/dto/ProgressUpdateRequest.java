package com.pathgen.api.dto;

import lombok.Data;

@Data
public class ProgressUpdateRequest {
    private String roadmapId;
    private int dayNumber;
    private boolean completed;
}
