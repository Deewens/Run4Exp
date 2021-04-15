package com.g6.acrobatteAPI.models.obstacle;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ObstacleResponseModel {
  Long id;

  @ApiModelProperty(value = "Le texte de l'énigme de l'Obstacle", dataType = "String", required = true, example = "Qu'est-ce qui est jaune et qui attends?")
  String riddle;

  @ApiModelProperty(value = "La réponse à l'énigme", dataType = "String", required = true, example = "Jonathan")
  String response;

  @ApiModelProperty(value = "L'id du segment sur lequel on s'attache", dataType = "Long", required = true, example = "1")
  Long segmentId;
  Double position;
}
