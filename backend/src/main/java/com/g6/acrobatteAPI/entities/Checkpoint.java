package com.g6.acrobatteAPI.entities;

import java.util.Objects;
import java.util.stream.Collectors;

import java.util.ArrayList;
import java.util.List;
import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Id;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;

@Entity
@Data
public class Checkpoint {

    public Checkpoint() {
        this.segmentsEnds = new ArrayList<>();
        this.segmentsStarts = new ArrayList<>();
        this.position = new Coordinate();
    }

    @Id
    @EqualsAndHashCode.Include()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    String name;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "position_id", referencedColumnName = "id")
    Coordinate position;

    @ManyToOne(optional = false)
    @JoinColumn(name = "challenge_id")
    Challenge challenge;

    @OneToMany(mappedBy = "start", cascade = CascadeType.MERGE, orphanRemoval = false)
    List<Segment> segmentsStarts;

    @OneToMany(mappedBy = "end", cascade = CascadeType.MERGE, orphanRemoval = false)
    List<Segment> segmentsEnds;

    @Enumerated(EnumType.STRING)
    CheckpointType checkpointType;

    public void addSegmentStarts(Segment segment) {
        segment.setStart(this);
        this.segmentsStarts.add(segment);
    }

    public void addSegmentEnds(Segment segment) {
        segment.setEnd(this);
        this.segmentsEnds.add(segment);
    }

    /**
     * Helper methods override
     */

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
        return this.getId() == checkpoint.getId();
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}
