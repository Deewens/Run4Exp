package com.g6.acrobatteAPI.services;

import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SegmentService {
    private final SegmentRepository segmentRepository;
    private final CheckpointRepository checkpointRepository;

    public SegmentProjection getProjectionById(Long id) {
        return segmentRepository.findById(id, SegmentProjection.class);
    }

    public Optional<Segment> getById(Long id) {
        return segmentRepository.findById(id);
    }

    public Segment create(Segment segment) {
        return segmentRepository.saveAndFlush(segment);
    }

    public List<Segment> findAllByChallenge(Challenge challenge) {
        return segmentRepository.findByChallengeId(challenge.getId());
    }

    public Segment save(Segment segment) {
        return segmentRepository.save(segment);
    }

    public void delete(Segment segment) {
        segmentRepository.delete(segment);
        segmentRepository.flush();
    }

    private Double calculateLengthBetweenPoints(Coordinate point1, Coordinate point2, Double scale) {
        Double xLength = point2.getX() - point1.getX();
        Double yLenght = point2.getY() - point1.getY();

        return (Math.sqrt(Math.pow(xLength, 2) + Math.pow(yLenght, 2))) * scale;
    }

    public Segment recalculateLength(Segment segment) {
        Double length = 0.0;

        List<Coordinate> points = segment.getCoordinates();
        Double scale = segment.getChallenge().getScale();

        for (int i = 0; i < points.size() - 1; i++) {
            length += calculateLengthBetweenPoints(points.get(i), points.get(i + 1), scale);
        }

        segment.setLength(length);

        return segment;
    }
}
