package com.g6.acrobatteAPI.models.obstacle;

import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class ObstacleCreateModel {
    @NotNull(message = "La position ne peut être nulle")
    @Positive(message = "La position doit être entre 0.0 et 1.0")
    @Max(value = 1, message = "La position doit être entre 0.0 et 1.0")
    private Double position;

    @NotBlank(message = "L'énigme ne doit être vide")
    private String riddle;

    @NotBlank(message = "La réponse à l'énigme ne doit être vide")
    @ApiModelProperty(value = "La réponse à l'énigme", dataType = "String", required = true, example = "Jonathan")
    private String response;

    @NotNull(message = "L'id du segment ne doit être vide")
    @Positive(message = "L'id du segment ne doit négatif")
    private Long segmentId;
}
