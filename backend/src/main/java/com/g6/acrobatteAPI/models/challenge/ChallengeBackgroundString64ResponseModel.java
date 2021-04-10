package com.g6.acrobatteAPI.models.challenge;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ChallengeBackgroundString64ResponseModel {
    @ApiModelProperty(value = "Le background du challenge en base64", dataType = "String", required = true, example = "06Xsfgfg...")
    private String background;
}
