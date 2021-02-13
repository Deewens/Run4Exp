package com.g6.acrobatteAPI.models.challenge;

import java.util.ArrayList;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import com.g6.acrobatteAPI.models.obstacle.ObstacleModel;
import lombok.Data;

@Data
public class ChallengeCreateModel {
    @NotBlank(message = "Vous devez précisez le nom du challenge")
    private String name;

    @NotBlank(message = "Vous devez précisez la description du challenge")
    private String description;

    @NotNull(message = "Vous devez précisez l'échelle du projet")
    private double scale;

    private ArrayList<ObstacleModel> obstacles;

}
