package com.g6.acrobatteAPI.models.checkpoint;

import com.g6.acrobatteAPI.entities.CheckpointType;
import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CheckpointUpdateModel {

    @ApiModelProperty(value = "Le ID du challenge auquel le checkpoint doit être attaché", dataType = "Long", required = true, example = "2")
    private Long challengeId;

    @ApiModelProperty(value = "Le nouveau type de checkpoint - BEGIN, MIDDLE, END", dataType = "Enum", required = true, example = "MIDDLE")
    private CheckpointType checkpointType;

    @ApiModelProperty(value = "La nouvelle position du checkpoint", dataType = "Object", required = true, example = "{ 'x': 0.3, 'y': 0.5 }")
    private CoordinateModel position;

    @ApiModelProperty(value = "Le nouveau nom du checkpoint", dataType = "String", required = true, example = "Nouveau Nom")
    String name;
}
