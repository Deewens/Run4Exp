package com.g6.acrobatteAPI.models.challenge;

import javax.validation.constraints.NotNull;

import lombok.Data;

@Data
public class ChallengeEditModel {
    private String name;

    private String description;
}
