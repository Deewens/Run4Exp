package com.g6.acrobatteAPI.models.segment;

import java.util.List;
import java.util.Set;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleResponseModel;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class SegmentResponseDetailedModel {
    @ApiModelProperty(value = "Les points de coordonnées du Segment", dataType = "[Coordinate]", required = true, example = "[{'x': 1, 'y': 0.5}, {'x': 0.3, 'y': 0}]")
    private List<CoordinateModel> coordinates;

    @ApiModelProperty(value = "L'ID du checkpoint de début du segment", dataType = "Long", required = true, example = "1")
    private Long checkpointStartId;

    @ApiModelProperty(value = "L'ID du checkpoint de fin du segment", dataType = "Long", required = true, example = "1")
    private Long checkpointEndId;

    @ApiModelProperty(value = "L'ID du challenge auquel le segment est attaché", dataType = "Long", required = true, example = "1")
    private Long challengeId;

    @ApiModelProperty(value = "Des obstacles - vue détaillée", dataType = "Long", required = true, example = "1")
    private Set<ObstacleResponseModel> obstacles;

    @ApiModelProperty(value = "La longueur du segment (calculé à partir des coordonnées et l'échelle du challenge)", dataType = "Double", required = true, example = "123.45")
    private Double length;

    @ApiModelProperty(value = "Le nom du segment", dataType = "Long", required = true, example = "Segment 1")
    private String name;

    @ApiModelProperty(value = "L'ID du segment", dataType = "Long", required = true, example = "1")
    private Long id;
}
