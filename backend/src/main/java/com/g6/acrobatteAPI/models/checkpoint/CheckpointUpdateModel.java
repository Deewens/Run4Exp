package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.g6.acrobatteAPI.entities.CheckpointType;
import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class CheckpointUpdateModel {
    @NotNull(message = "Vous devez préciser l'id")
    @Positive(message = "L'id doit être positif")
    private Long id;

    @NotNull(message = "Vous devez préciser l'id du challenge")
    private Long challengeId;

    private CheckpointType checkpointType;

    private CoordinateModel position;

    String name;
}
