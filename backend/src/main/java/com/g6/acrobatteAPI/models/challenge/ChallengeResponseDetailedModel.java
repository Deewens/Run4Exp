package com.g6.acrobatteAPI.models.challenge;

import java.util.List;
import java.util.Set;

import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleResponseModel;
import com.g6.acrobatteAPI.models.segment.SegmentResponseModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ChallengeResponseDetailedModel {
    @ApiModelProperty(value = "ID du challenge", dataType = "Long", required = true, example = "2")
    private Long id;

    @ApiModelProperty(value = "Nom du challenge", dataType = "String", required = true, example = "Challenge Skyrim")
    private String name;

    @ApiModelProperty(value = "Description longue du challenge", dataType = "String", required = true, example = "Challenge Skyrim is a great challenge...")
    private String description;

    @ApiModelProperty(value = "Description courte (max 255 char) du challenge", dataType = "String", required = true, example = "Challenge Skyrim is a great challenge (Short)...")
    private String shortDescription;

    @ApiModelProperty(value = "Liste des Objets des Admins", dataType = "[Object]", required = true, example = "[{}, {}, {}]")
    private List<UserResponseModel> administrators;

    @ApiModelProperty(value = "Liste des Objets des Checkpoints", dataType = "[Object]", required = true, example = "[{}, {}, {}]")
    private Set<CheckpointResponseModel> checkpoints;

    @ApiModelProperty(value = "Liste des Objets des Segments", dataType = "[Object]", required = true, example = "[{}, {}, {}]")
    private Set<SegmentResponseModel> segments;

    @ApiModelProperty(value = "l'Échelle du challenge", dataType = "Double", required = true, example = "105.5")
    private Double scale;

    @ApiModelProperty(value = "Est-ce que le challenge est publié", dataType = "Boolean", required = false, example = "true")
    private Boolean published;

    @ApiModelProperty(value = "ID du créateur du challenge", dataType = "Long", required = true, example = "5")
    private Long creatorId;
}
