package com.ravcontrol.backend.dto.activity.request;

import java.time.LocalDate;

public record UpdateActivityRequestDTO(
    String name,
    String description,
    LocalDate dueDate,
    Boolean completed
) {}
