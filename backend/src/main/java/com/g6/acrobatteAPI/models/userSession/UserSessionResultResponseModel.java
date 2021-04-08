package com.g6.acrobatteAPI.models.userSession;

import lombok.Data;

@Data
public class UserSessionResultResponseModel {
    private Integer currentSegmentId;
    private Double advancement;
    private Double totalAdvancement;
    private Boolean isIntersection;
    private Boolean isEnd;
}
