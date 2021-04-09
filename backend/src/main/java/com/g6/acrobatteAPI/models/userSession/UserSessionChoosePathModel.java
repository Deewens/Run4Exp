package com.g6.acrobatteAPI.models.userSession;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserSessionChoosePathModel {
    @NotNull(message = "L'id du segment à choisir ne peut être nul")
    @Positive(message = "L'id du segment à choisir ne peut être négatif")
    @ApiModelProperty(value = "ID du segment sur le croisement à choisir", dataType = "Long", required = true, example = "1")
    private Long segmentToChooseId;

    @NotNull(message = "L'id du challenge ne peut être nul")
    @Positive(message = "L'id du challenge ne peut être négatif")
    @ApiModelProperty(value = "ID du challenge attaché à la Session", dataType = "Long", required = true, example = "1")
    private Long challengeId;
}
