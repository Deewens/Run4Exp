package com.g6.acrobatteAPI.models.obstacle;

import lombok.Data;

@Data
public class ObstacleUpdateModel {
    private Double position;
    private String riddle;
    private Long segmentId;
}
