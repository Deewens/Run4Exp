package com.g6.acrobatteAPI.models.challenge;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Positive;

import lombok.Data;

@Data
public class ChallengeCreateModel {
    @NotBlank(message = "Vous devez précisez le nom du challenge")
    private String name;

    @NotBlank(message = "Vous devez précisez la description du challenge")
    private String description;

    private String shortDescription;

    @NotNull(message = "Vous devez précisez le scale")
    @Positive(message = "Le scale doit être positif")
    private Double scale;
}
