package com.g6.acrobatteAPI.models.userSession;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserSessionAdvanceModel {
    @NotNull(message = "L'avancement ne peut être nul")
    @Positive(message = "L'avancement ne peut être négatif")
    @ApiModelProperty(value = "Avancement à rajouter sur la carte", dataType = "Doule", required = true, example = "100")
    private Double advancement;

    @NotNull(message = "L'id du challenge ne peut être nul")
    @Positive(message = "L'id du challenge ne peut être négatif")
    @ApiModelProperty(value = "ID du challenge attaché à la Session", dataType = "Long", required = true, example = "1")
    private Long challengeId;
}
