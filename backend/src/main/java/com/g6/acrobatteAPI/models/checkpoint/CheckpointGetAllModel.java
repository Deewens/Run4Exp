package com.g6.acrobatteAPI.models.checkpoint;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class CheckpointGetAllModel {
    @NotNull(message = "Vous devez préciser l'id du challenge")
    private Long challengeId;
}
