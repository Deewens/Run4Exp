package com.g6.acrobatteAPI.models.obstacle;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ObstacleCreateModel {
    @NotNull(message = "La position ne peut être nulle")
    @Positive(message = "La position doit être entre 0.0 et 1.0")
    @Max(value = 1, message = "La position doit être entre 0.0 et 1.0")
    @ApiModelProperty(value = "Position de l'Obstacle sur le Segment entre [0, 1]", dataType = "Double", required = true, example = "0.55")
    private Double position;

    @NotBlank(message = "L'énigme ne doit être vide")
    @ApiModelProperty(value = "Le text de l'énigme de l'Obstacle", dataType = "String", required = true, example = "Qu'est-ce qui est jaune et qui attends?")
    private String riddle;

    @NotNull(message = "L'id du segment ne doit être vide")
    @Positive(message = "L'id du segment ne doit négatif")
    @ApiModelProperty(value = "L'id du segment sur lequel on s'attache", dataType = "Long", required = true, example = "1")
    private Long segmentId;
}
