package com.ravcontrol.backend.dto.activity.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateActivityRequestDTO(
    @NotBlank(message = "O nome da atividade é obrigatório.")
    String name,

    @NotNull(message = "O ID do grupo é obrigatório.")
    Long groupId
) {}
