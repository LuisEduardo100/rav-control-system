package com.ravcontrol.backend.dto.activity.response;

import java.time.LocalDate;

public record SearchActivityResponseDTO(
    Long id,
    String name,
    String description,
    LocalDate dueDate,
    Boolean completed,
    Long groupId,
    String groupName
) {}
