package com.g6.acrobatteAPI.models.challenge;

import javax.validation.constraints.NotBlank;

import lombok.Data;

@Data
public class ChallengeCreateModel {
    @NotBlank(message = "Vous devez précisez le nom du challenge")
    private String name;

    @NotBlank(message = "Vous devez précisez la description du challenge")
    private String description;
}
