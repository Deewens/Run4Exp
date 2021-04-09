package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CheckpointResponseModel {
    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "Long", required = true, example = "1")
    Long id;

    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "String", required = true, example = "Checkpoint 1")
    String name;

    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "Coordinate", required = true, example = "{ 'x': 0.5, 'y': 0.6 }")
    CoordinateModel position;

    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "Long", required = true, example = "1")
    Long challengeId;

    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "List<Long>", required = true, example = "[1, 3, 5]")
    List<Long> segmentsStartsIds;

    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "List<Long>", required = true, example = "[2, 4, 6]")
    List<Long> segmentsEndsIds;

    @ApiModelProperty(value = "Le ID du checkpoint", dataType = "String", required = true, example = "END")
    String checkpointType;
}
