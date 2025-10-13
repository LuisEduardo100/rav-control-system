package com.ravcontrol.backend.dto.activity.response;

import com.ravcontrol.backend.entity.Activity;

import java.time.LocalDate;

public record ActivityResponseDTO(
    Long id,
    String name,
    String description,
    LocalDate dueDate,
    Boolean completed,
    Integer position
) {
    public static ActivityResponseDTO fromEntity(Activity activity) {
        return new ActivityResponseDTO(
            activity.getId(),
            activity.getName(),
            activity.getDescription(),
            activity.getDueDate(),
            activity.getCompleted(),
            activity.getPosition()
        );
    }
}
