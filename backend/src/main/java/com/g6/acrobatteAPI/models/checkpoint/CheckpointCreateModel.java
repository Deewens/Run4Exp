package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import com.g6.acrobatteAPI.entities.CheckpointType;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class CheckpointCreateModel {
    @NotNull(message = "Vous devez préciser l'id du challenge")
    @ApiModelProperty(value = "l'ID du challenge auquel le checkpoint est rattaché", dataType = "Long", required = true, example = "1")
    private Long challengeId;

    @NotNull(message = "Vous devez préciser la coordonnée x")
    @Positive(message = "Coordonnée x doit être positive")
    @ApiModelProperty(value = "Coordonnée X du checkpoint", dataType = "Double", required = true, example = "0.5")
    private Double x;

    @NotNull(message = "Vous devez préciser la coordonnée y")
    @Positive(message = "Coordonnée y doit être positive")
    @ApiModelProperty(value = "Coordonnée Y du checkpoint", dataType = "Double", required = true, example = "0.5")
    private Double y;

    @NotNull(message = "Vous devez préciser le type de checkpoint")
    @ApiModelProperty(value = "Type de checkpoint - BEGIN, MIDDLE, END", dataType = "Enum", required = true, example = "BEGIN")
    private CheckpointType checkpointType;

    @NotBlank(message = "Vous devez préciser le nom")
    @ApiModelProperty(value = "Nom du checkpoint", dataType = "String", required = true, example = "Checkpoint de Début")
    String name;

    @NotNull(message = "La liste des segments débutant dans ce checkpoint ne peut être nulle")
    @ApiModelProperty(value = "La liste des IDs des segments débutant dans ce checkpoint", dataType = "[Long]", required = true, example = "[1, 3, 5]")
    private List<Long> segmentStartsIds;

    @NotNull(message = "La liste des segments finissant dans ce checkpoint ne peut être nulle")
    @ApiModelProperty(value = "La liste des IDs des segments finissant dans ce checkpoint", dataType = "[Long]", required = true, example = "[1, 3, 5]")
    private List<Long> segmentEndIds;
}
