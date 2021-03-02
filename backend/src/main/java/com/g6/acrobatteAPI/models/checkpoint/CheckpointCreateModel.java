package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.g6.acrobatteAPI.entities.CheckpointType;

import lombok.Data;

@Data
public class CheckpointCreateModel {
    @NotNull(message = "Vous devez préciser l'id du challenge")
    private Long challengeId;

    @NotNull(message = "Vous devez préciser la coordonnée x")
    @Positive(message = "Coordonnée x doit être positive")
    private Double x;

    @NotNull(message = "Vous devez préciser la coordonnée y")
    @Positive(message = "Coordonnée y doit être positive")
    private Double y;

    @NotNull(message = "Vous devez préciser le type de checkpoint")
    private CheckpointType checkpointType;

    @NotBlank(message = "Vous devez préciser le nom")
    String name;

    private List<Long> segmentStartsIds;
    private List<Long> segmentEndIds;
}
