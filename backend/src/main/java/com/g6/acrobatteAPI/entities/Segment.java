package com.g6.acrobatteAPI.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.GenerationType;

import lombok.Data;
import lombok.EqualsAndHashCode;
import com.g6.acrobatteAPI.Util;

@Entity
@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Segment {
    @Id
    @EqualsAndHashCode.Include()
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Coordinate> coordinates;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "start_id")
    private Checkpoint start;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "end_id")
    private Checkpoint end;

    @OneToMany(mappedBy = "segment", cascade = CascadeType.ALL, orphanRemoval = false)
    private Set<Obstacle> obstacles;

    @ManyToOne(optional = false)
    @JoinColumn(name = "challenge_id")
    Challenge challenge;

    private String name;

    public Segment() {
        coordinates = new ArrayList<>();
    }

    public void addCoordinate(Coordinate coordinate) {
        coordinates.add(coordinate);
    }

    public void addObstacle(Obstacle obstacle) {
        obstacle.setSegment(this);
        getObstacles().add(obstacle);
    }

    public Double getLength() {
        Double length = 0.0;

        List<Coordinate> points = this.getCoordinates();
        Double scale = this.getChallenge().getScale();

        for (int i = 0; i < points.size() - 1; i++) {
            length += Util.calculateLengthBetweenPoints(points.get(i), points.get(i + 1)) * scale;
        }

        return length;
    }

    public Boolean isIntersectionAtEnd() {
        if (getEnd().getSegmentsStarts() != null && getEnd().getSegmentsStarts().size() > 1) {
            return true;
        }

        return false;
    }

    public Boolean isDeadEnd() {
        if (getEnd().getSegmentsStarts() == null || getEnd().getSegmentsStarts().size() == 0) {
            return true;
        }

        return false;
    }
}
