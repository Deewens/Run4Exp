package com.g6.acrobatteAPI.models.challenge;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ChallengeRemoveAdministratorModel {
    @NotNull(message = "Id d'administrateur ne peut être nul")
    @Positive(message = "Id d'administrateur doit être un nombre positif")
    @ApiModelProperty(value = "ID du admin à enlever", dataType = "Long", required = true, example = "1")
    private Long adminId;
}
