package com.g6.acrobatteAPI.models.checkpoint;

import java.util.List;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class CheckpointResponseModel {
    Integer id;
    String name;
    CoordinateModel position;
    Long challengeId;
    List<Long> segmentsStartsIds;
    List<Long> segmentsEndsIds;
    String checkpointType;
}
