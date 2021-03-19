package com.g6.acrobatteAPI.entities;

import java.util.Objects;
import java.util.stream.Collectors;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import lombok.Data;

@Entity
@Data
@DiscriminatorValue("Checkpoint")
public class Checkpoint extends Endpoint {

    public Checkpoint() {
        super();
    }

    @Enumerated(EnumType.STRING)
    CheckpointType checkpointType;

    @Override
    public String toString() {
        String str = "{" + " checkpointType=" + getCheckpointType();
        String segmentStarts = null;
        String segmentEnds = null;

        if (getSegmentsStarts() != null && !getSegmentsStarts().isEmpty()) {
            segmentStarts = getSegmentsStarts().stream().map(Segment::getId).collect(Collectors.toList()).toString();
        }
        if (getSegmentsEnds() != null && !getSegmentsEnds().isEmpty()) {
            segmentEnds = getSegmentsEnds().stream().map(Segment::getId).collect(Collectors.toList()).toString();
        }

        str += " segmentStarts=" + segmentStarts;
        str += " segmentEnds=" + segmentEnds;

        return str;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Checkpoint)) {
            return false;
        }
        Checkpoint checkpoint = (Checkpoint) o;
        return this.getEndpointId() == checkpoint.getEndpointId();
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getEndpointId());
    }
}
