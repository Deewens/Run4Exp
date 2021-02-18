package com.g6.acrobatteAPI.entities;

import com.g6.acrobatteAPI.models.segment.SegmentModel;

public class SegmentFactory {

    public static Segment create(SegmentModel segmentModel, Endpoint start, Endpoint end) {
        Segment segment = new Segment();

        segment.setName(segmentModel.getName());
        // segment.setCoordinates(segmentModel.getCoordinates());
        segment.setStart(start);
        segment.setEnd(end);

        return segment;
    }
}
