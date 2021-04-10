package com.g6.acrobatteAPI.models.userSession;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class UserSessionResultResponseModel {
    @ApiModelProperty(value = "ID du segment sur lequel le joueur se trouve actuellement", dataType = "Long", required = true, example = "1")
    private Integer currentSegmentId;

    @ApiModelProperty(value = "Avancement actuel sur le segment actuel", dataType = "Long", required = true, example = "100")
    private Double advancement;

    @ApiModelProperty(value = "Avancement actuel sur tout le challenge", dataType = "Long", required = true, example = "100")
    private Double totalAdvancement;

    @ApiModelProperty(value = "Est-ce qu'on se trouve à une intersection", dataType = "Boolean", required = true, example = "true")
    private Boolean isIntersection;

    @ApiModelProperty(value = "Est-ce qu'on se trouve à la fin du parcours", dataType = "Boolean", required = true, example = "false")
    private Boolean isEnd;
}
