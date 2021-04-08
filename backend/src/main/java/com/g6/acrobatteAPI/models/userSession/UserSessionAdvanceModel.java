package com.g6.acrobatteAPI.models.userSession;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class UserSessionAdvanceModel {
    @NotNull(message = "L'avancement ne peut être nul")
    @Positive(message = "L'avancement ne peut être négatif")
    private Double advancement;

    @NotNull(message = "L'id du challenge ne peut être nul")
    @Positive(message = "L'id du challenge ne peut être négatif")
    private Long challengeId;
}
