package com.g6.acrobatteAPI.models.userSession;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserSessionPassObstacleModel {
    @NotNull(message = "L'id de l'obstacle à passer ne peut être nul")
    @Positive(message = "L'id de l'obstacle à passer ne peut être négatif")
    @ApiModelProperty(value = "ID de l'obstacle à passer", dataType = "Long", required = true, example = "1")
    private Long obstacleToPassId;
}
