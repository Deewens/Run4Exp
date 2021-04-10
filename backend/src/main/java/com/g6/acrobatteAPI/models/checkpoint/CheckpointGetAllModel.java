package com.g6.acrobatteAPI.models.checkpoint;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CheckpointGetAllModel {
    @NotNull(message = "Vous devez préciser l'id du challenge")
    @Positive(message = "L'id du challenge doit être positif")
    @ApiModelProperty(value = "L'ID du challenge les checkpoints duquel ont veut voir", dataType = "[Long]", required = true, example = "1")
    private Long challengeId;
}
