package com.g6.acrobatteAPI.models.obstacle;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ObstacleResponseModel {
  @ApiModelProperty(value = "L'id de l'Obstacle", dataType = "Long", required = true, example = "1")
  Long id;

  @ApiModelProperty(value = "Le text de l'énigme de l'Obstacle", dataType = "String", required = true, example = "Qu'est-ce qui est jaune et qui attends?")
  String riddle;

  @ApiModelProperty(value = "L'id du segment sur lequel on s'attache", dataType = "Long", required = true, example = "1")
  Long segmentId;

  @ApiModelProperty(value = "Position de l'Obstacle sur le Segment entre [0, 1]", dataType = "Double", required = true, example = "0.55")
  Double position;
}
