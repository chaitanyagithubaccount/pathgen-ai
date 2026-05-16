package com.pathgen.api.dto;

import lombok.Data;
import java.util.List;

@Data
public class WeekDto {
    private int week;
    private String goal;
    private String motivationalMessage;
    private List<DayDto> days;
}
