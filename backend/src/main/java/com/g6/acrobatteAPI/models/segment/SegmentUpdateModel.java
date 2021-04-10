package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class SegmentUpdateModel {
    @ApiModelProperty(value = "Les points de coordonnées du Segment", dataType = "[Coordinate]", required = true, example = "[{'x': 1, 'y': 0.5}, {'x': 0.3, 'y': 0}]")
    private List<CoordinateModel> coordinates;

    @ApiModelProperty(value = "L'ID du checkpoint de début du segment", dataType = "Long", required = true, example = "1")
    private Long checkpointStartId;

    @ApiModelProperty(value = "L'ID du checkpoint de fin du segment", dataType = "Long", required = true, example = "1")
    private Long checkpointEndId;

    @ApiModelProperty(value = "Le nom du segment", dataType = "Long", required = true, example = "Segment 1")
    private String name;

    @ApiModelProperty(value = "L'ID du challenge auquel le segment est attaché", dataType = "Long", required = true, example = "1")
    private Long challengeId;
}
