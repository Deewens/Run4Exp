package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class CheckpointCreateModel {
    @NotNull(message = "Vous devez préciser l'id du challenge")
    private Long challengeId;

    @NotNull(message = "Vous devez préciser la coordonnée x")
    @Positive(message = "Coordonnée x doit être positive")
    private Integer x;

    @NotNull(message = "Vous devez préciser la coordonnée y")
    @Positive(message = "Coordonnée y doit être positive")
    private Integer y;

    @NotBlank(message = "Vous devez préciser le type de checkpoint")
    private String checkpointType;

    @NotBlank(message = "Vous devez préciser le nom")
    String name;

    private List<Long> segmentStartsIds;
    private List<Long> segmentEndIds;
}
