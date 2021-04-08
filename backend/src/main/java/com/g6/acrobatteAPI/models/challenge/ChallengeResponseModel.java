package com.g6.acrobatteAPI.models.challenge;

import java.util.List;
import java.util.Set;

import lombok.Data;

@Data
public class ChallengeResponseModel {
    private Long id;
    private String name;
    private String description;
    private String shortDescription;
    private Set<Long> administratorsId;
    private Set<Long> checkpointsId;
    private Set<Long> segmentsId;
    private Double scale;
}
