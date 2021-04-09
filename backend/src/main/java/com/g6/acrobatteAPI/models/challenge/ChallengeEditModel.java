package com.g6.acrobatteAPI.models.challenge;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class ChallengeEditModel {
    @NotBlank(message = "Vous devez précisez le nom du challenge")
    @ApiModelProperty(value = "Nom du challenge", name = "Nom du challenge", dataType = "String", required = true, example = "Skyrim Challenge")
    private String name;

    @NotBlank(message = "Vous devez précisez la description du challenge")
    @ApiModelProperty(value = "Description Longue du challenge", name = "Description du challenge", dataType = "String", required = true, example = "Skyrim Challenge is a great challenge...")
    private String description;

    @ApiModelProperty(value = "Description Courte (255 char) du challenge", name = "Description Courte (255 char) du challenge", dataType = "String", required = true, example = "Skyrim Challenge is a great challenge (Short)...")
    private String shortDescription;

    @NotNull(message = "Vous devez précisez l'échelle du challenge")
    @ApiModelProperty(value = "L'échelle du challenge. À combien de mètres corresponds la longueur la plus grande de l'image (Largeur si le mode paysage)", dataType = "String", required = true, example = "550")
    private double scale;
}
