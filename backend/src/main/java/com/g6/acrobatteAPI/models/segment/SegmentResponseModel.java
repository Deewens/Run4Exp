package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class SegmentResponseModel {
    private List<CoordinateModel> coordinates;
    private Long checkpointStartId;
    private Long checkpointEndId;
    private Long challengeId;
    private Double length;
    private String name;
    private Long id;
}
