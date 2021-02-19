package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class SegmentResponseModel {
    private List<CoordinateModel> coordinates;
    private Long endpointStartId;
    private Long endpointEndId;
    private String name;
    private double length;
}
