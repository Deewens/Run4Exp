package com.g6.acrobatteAPI.entities;

import lombok.Data;

@Data
public class UserSessionResult {
    private Long id;
    private Segment currentSegment;
    private Double advancement;
    private Double totalAdvancement;
    private Boolean isIntersection;
    private Long obstacleId;
    private Boolean isEnd;
}
