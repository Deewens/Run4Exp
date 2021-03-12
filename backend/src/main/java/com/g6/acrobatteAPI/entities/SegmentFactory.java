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

    public static Segment create(SegmentCreateModel segmentCreateModel, Challenge challenge, Endpoint start,
            Endpoint end) {
        Segment segment = new Segment();

        segment.setName(segmentCreateModel.getName());
        segment.setLength(segmentCreateModel.getLength());
        segment.setChallenge(challenge);

        for (CoordinateModel coord : segmentCreateModel.getCoordinates()) {
            Coordinate coordinate = new Coordinate();
            coordinate.setX(coord.getX());
            coordinate.setY(coord.getY());
            segment.addCoordinate(coordinate);
        }

        start.addSegmentStarts(segment);
        end.addSegmentEnds(segment);

        segment.setStart(start);
        segment.setEnd(end);

        return segment;
    }
}
