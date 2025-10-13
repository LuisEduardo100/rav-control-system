package com.ravcontrol.backend.dto.activity.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateActivityRequestDTO(
    @NotBlank(message = "O nome da atividade é obrigatório.")
    String name,

    @NotNull(message = "O ID do grupo é obrigatório.")
    Long groupId,

    @Size(max = 5000, message = "A descrição não pode exceder 5000 caracteres")
    String description
) {}
