package com.g6.acrobatteAPI.models.challenge;

import java.util.List;
import java.util.Set;

import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.models.segment.SegmentResponseModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;

import lombok.Data;

@Data
public class ChallengeResponseDetailedModel {
    private Long id;
    private String name;
    private String description;
    private List<UserResponseModel> administrators;
    private Set<CheckpointResponseModel> checkpoints;
    private Set<SegmentResponseModel> segments;
}
