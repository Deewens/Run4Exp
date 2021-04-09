package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class SegmentCreateModel {
    @NotNull(message = "La liste de coordonnées ne doit être vide")
    @ApiModelProperty(value = "Les points de coordonnées du Segment", dataType = "[Coordinate]", required = true, example = "[{'x': 1, 'y': 0.5}, {'x': 0.3, 'y': 0}]")
    private List<CoordinateModel> coordinates;

    @NotNull(message = "Vous devez précisez le id du checkpoint de début")
    @Positive(message = "Mauvais id du checkpoint de début")
    @ApiModelProperty(value = "L'ID du checkpoint de début du segment", dataType = "Long", required = true, example = "1")
    private Long checkpointStartId;

    @NotNull(message = "Vous devez précisez le id du endpoint de fin")
    @Positive(message = "Mauvais id du endpoint de fin")
    @ApiModelProperty(value = "L'ID du checkpoint de fin du segment", dataType = "Long", required = true, example = "1")
    private Long checkpointEndId;

    @NotBlank(message = "Vous devez précisez le nom du segment")
    @ApiModelProperty(value = "Le nom du segment", dataType = "Long", required = true, example = "Segment 1")
    private String name;

    @NotNull(message = "Vous devez précisez le id du challenge")
    @Positive(message = "Mauvais id de challenge")
    @ApiModelProperty(value = "L'ID du challenge auquel le segment est attaché", dataType = "Long", required = true, example = "1")
    private Long challengeId;
}
