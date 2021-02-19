package com.g6.acrobatteAPI.entities;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;
import com.g6.acrobatteAPI.models.segment.SegmentCreateModel;
import com.g6.acrobatteAPI.models.segment.SegmentModel;

public class SegmentFactory {

    public static Segment create(SegmentModel segmentModel, Endpoint start, Endpoint end) {
        Segment segment = new Segment();

        segment.setName(segmentModel.getName());
        segment.setLength(segmentModel.getLength());
        // segment.setCoordinates(segmentModel.getCoordinates());
        segment.setStart(start);
        segment.setEnd(end);

        return segment;
    }

    public static Segment create(SegmentCreateModel segmentCreateModel, Endpoint start, Endpoint end) {
        Segment segment = new Segment();

        segment.setName(segmentCreateModel.getName());
        segment.setLength(segmentCreateModel.getLength());

        for (CoordinateModel coord : segmentCreateModel.getCoordinates()) {
            Coordinate coordinate = new Coordinate();
            coordinate.setX(coord.getX());
            coordinate.setY(coord.getY());
            segment.addCoordinate(coordinate);
        }

        segment.setStart(start);
        segment.setEnd(end);

        return segment;
    }
}
