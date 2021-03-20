package com.g6.acrobatteAPI.entities;

import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;
import com.g6.acrobatteAPI.models.segment.SegmentCreateModel;

public class SegmentFactory {

    public static Segment create(SegmentCreateModel segmentCreateModel, Challenge challenge, Endpoint start,
            Endpoint end) {
        Segment segment = new Segment();

        segment.setName(segmentCreateModel.getName());
        segment.setLength(segmentCreateModel.getLength());
        segment.setChallenge(challenge);
        challenge.getSegments().add(segment);

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
