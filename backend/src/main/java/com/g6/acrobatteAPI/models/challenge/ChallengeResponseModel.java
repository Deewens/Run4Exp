package com.g6.acrobatteAPI.models.challenge;

import java.util.List;
import java.util.Set;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ChallengeResponseModel {
    @ApiModelProperty(value = "ID du challenge", dataType = "Long", required = true, example = "1")
    private Long id;

    @ApiModelProperty(value = "Nom du challenge", dataType = "String", required = true, example = "1")
    private String name;

    @ApiModelProperty(value = "Description du challenge", dataType = "String", required = true, example = "1")
    private String description;

    @ApiModelProperty(value = "Desription courte (255 char max) du challenge", dataType = "String", required = true, example = "1")
    private String shortDescription;

    @ApiModelProperty(value = "Liste ID des administrateurs", dataType = "[long]", required = true, example = "[1, 3, 10]")
    private Set<Long> administratorsId;

    @ApiModelProperty(value = "List ID des checkpoints", dataType = "[long]", required = true, example = "[1, 3, 10]")
    private Set<Long> checkpointsId;

    @ApiModelProperty(value = "List ID des segments", dataType = "[long]", required = true, example = "[1, 3, 10]")
    private Set<Long> segmentsId;

    @ApiModelProperty(value = "L'Échelle du challenge", dataType = "Double", required = true, example = "105.5")
    private Double scale;

    @ApiModelProperty(value = "Est-ce que le challenge est publié", dataType = "Boolean", required = false, example = "true")
    private Boolean published;
}
