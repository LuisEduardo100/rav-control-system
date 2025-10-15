package com.ravcontrol.backend.dto.activityGroup.response;

import com.ravcontrol.backend.dto.activity.response.ActivityResponseDTO;
import com.ravcontrol.backend.entity.Activity;
import com.ravcontrol.backend.entity.ActivityGroup;

import java.util.Comparator;
import java.util.List;

public record ActivityGroupResponseDTO(
    Long id,
    String name,
    Integer position,
    List<ActivityResponseDTO> activities
) {
    public static ActivityGroupResponseDTO fromEntity(ActivityGroup group) {
        List<ActivityResponseDTO> activityDtos = group.getActivities()
            .stream()
            .sorted(Comparator.comparing(Activity::getPosition))
            .map(ActivityResponseDTO::fromEntity)
            .toList();

        return new ActivityGroupResponseDTO(
            group.getId(),
            group.getName(),
            group.getPosition(),
            activityDtos
        );
    }
}
