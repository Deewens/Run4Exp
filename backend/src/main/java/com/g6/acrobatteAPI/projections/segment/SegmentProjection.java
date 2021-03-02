package com.g6.acrobatteAPI.projections.segment;

import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.entities.Endpoint;
import org.springframework.beans.factory.annotation.Value;

import java.util.List;

public interface SegmentProjection {

    @Value("#{target.name}")
    public String getName();

    @Value("#{target.id}")
    public Long getId();

    @Value("#{target.coordinates}")
    List<Coordinate> getCoordinates();
}
