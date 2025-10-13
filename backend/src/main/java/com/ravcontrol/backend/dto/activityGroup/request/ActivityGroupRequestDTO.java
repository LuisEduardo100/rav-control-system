package com.ravcontrol.backend.dto.activityGroup.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ActivityGroupRequestDTO(
    @NotBlank(message = "O nome do grupo não pode ser vazio.")
    @Size(max = 100, message = "O nome do grupo deve ter no máximo 100 caracteres.")
    String name
) {}
