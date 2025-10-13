package com.ravcontrol.backend.dto.activity.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record MoveActivityRequestDTO(
    @NotNull(message = "O ID do grupo de destino é obrigatório.")
    Long targetGroupId,

    @NotNull(message = "A nova posição é obrigatória.")
    @PositiveOrZero(message = "A posição deve ser igual ou maior que zero.")
    Integer newPosition
) {}
