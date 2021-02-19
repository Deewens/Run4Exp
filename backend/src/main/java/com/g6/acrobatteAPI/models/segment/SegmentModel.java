package com.g6.acrobatteAPI.models.segment;

import java.util.List;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;

import lombok.Data;

@Data
public class SegmentModel {
    private List<CoordinateModel> coordinates;

    private CoordinateModel startEndpointCoordinates;

    private CoordinateModel endEndpointCoordinates;

    private double length;

    private String name;

}
