package com.g6.acrobatteAPI.models.obstacle;

import lombok.Data;

@Data
public class ObstacleResponseModel {
  Long id;
  String riddle;
  Long segmentId;
  Double position;
}
