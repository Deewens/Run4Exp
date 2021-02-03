package com.g6.acrobatteAPI.models.challenge;

import java.util.List;

import lombok.Data;

@Data
public class ChallengeResponseModel {
    private Long id;
    private String name;
    private String description;
    private List<Long> administratorsId;
}
