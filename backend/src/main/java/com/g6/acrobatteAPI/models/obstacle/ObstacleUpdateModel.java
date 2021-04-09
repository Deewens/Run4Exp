package com.g6.acrobatteAPI.models.obstacle;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ObstacleUpdateModel {
    @ApiModelProperty(value = "Position de l'Obstacle sur le Segment entre [0, 1]", dataType = "Double", required = true, example = "0.55")
    private Double position;

    @ApiModelProperty(value = "Le text de l'énigme de l'Obstacle", dataType = "String", required = true, example = "Qu'est-ce qui est jaune et qui attends?")
    private String riddle;

    @ApiModelProperty(value = "L'id du segment sur lequel on s'attache", dataType = "Long", required = true, example = "1")
    private Long segmentId;
}
