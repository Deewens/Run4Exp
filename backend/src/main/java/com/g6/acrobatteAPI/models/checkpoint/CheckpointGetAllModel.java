package com.g6.acrobatteAPI.models.checkpoint;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class CheckpointGetAllModel {
    @NotNull(message = "Vous devez préciser l'id du challenge")
    @Positive(message = "L'id du challenge doit être positif")
    private Long challengeId;
}
