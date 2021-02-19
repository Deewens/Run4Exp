package com.g6.acrobatteAPI.entities;

import lombok.Data;

@Data
public class UserSessionResult {
    private Segment currentSegment;
    private Double advancement;
    private Boolean isIntersection;
    private Boolean isEnd;
}
