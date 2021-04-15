package com.g6.acrobatteAPI.models.obstacle;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ObstacleUpdateModel {
    private Double position;
    private String riddle;

    @ApiModelProperty(value = "La réponse à l'énigme", dataType = "String", required = true, example = "Jonathan")
    private String response;

    @ApiModelProperty(value = "L'id du segment sur lequel on s'attache", dataType = "Long", required = true, example = "1")
    private Long segmentId;
}
