package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class SegmentUpdateModel {
    private List<CoordinateModel> coordinates;
    private Long checkpointStartId;
    private Long checkpointEndId;
    private String name;
    private Long challengeId;
}
