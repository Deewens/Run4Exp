package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import javax.validation.constraints.NotNull;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class SegmentUpdateModel {
    private List<CoordinateModel> coordinates;    
    private Long endpointStartId;
    private Long endpointEndId;
    private String name;
    private double length;
    private Long challengeId;
}
