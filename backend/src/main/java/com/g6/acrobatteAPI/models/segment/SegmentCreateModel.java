package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class SegmentCreateModel {
    @NotNull(message = "La liste de coordonnées ne doit être vide")
    private List<CoordinateModel> coordinates;

    @NotNull(message = "Vous devez précisez le id du checkpoint de début")
    @Positive(message = "Mauvais id du checkpoint de début")
    private Long checkpointStartId;

    @NotNull(message = "Vous devez précisez le id du endpoint de fin")
    @Positive(message = "Mauvais id du endpoint de fin")
    private Long checkpointEndId;

    @NotBlank(message = "Vous devez précisez le nom du segment")
    private String name;

    @NotNull(message = "Vous devez précisez la longueur du segment")
    @Positive(message = "La longueur du segment doit être positive")
    private double length;

    @NotNull(message = "Vous devez précisez le id du challenge")
    @Positive(message = "Mauvais id de challenge")
    private Long challengeId;
}
