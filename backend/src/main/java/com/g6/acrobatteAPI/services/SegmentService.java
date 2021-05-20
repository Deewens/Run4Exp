package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;
import com.g6.acrobatteAPI.models.segment.SegmentUpdateModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.CoordinateRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.google.common.collect.Iterables;

import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SegmentService implements SegmentServiceI {
    private final SegmentRepository segmentRepository;
    @Lazy
    private final CheckpointRepository checkpointRepository;
    private final ModelMapper modelMapper;
    private final CoordinateRepository coordinateRepository;

    public SegmentProjection getProjectionById(Long id) {
        return segmentRepository.findById(id, SegmentProjection.class);
    }

    public Optional<Segment> getById(Long id) {
        return segmentRepository.findById(id);
    }

    public Segment create(Segment segment) {
        return segmentRepository.saveAndFlush(segment);
    }

    public Segment update(Segment segment, SegmentUpdateModel segmentUpdateModel) {
        if (segmentUpdateModel.getCoordinates() != null) {
            for (int i = 0; i < segment.getCoordinates().size(); ++i) {
                Coordinate coordinate = Iterables.get(segment.getCoordinates(), i);
                CoordinateModel coordinateModel = Iterables.get(segmentUpdateModel.getCoordinates(), i);
                coordinate.setX(coordinateModel.getX());
                coordinate.setY(coordinateModel.getY());
                coordinateRepository.save(coordinate);
            }
        }

        if (segmentUpdateModel.getCheckpointStartId() != null) {
            Checkpoint start = checkpointRepository.findById(segmentUpdateModel.getCheckpointStartId())
                    .orElseThrow(() -> new IllegalArgumentException("Erreur"));
            start.addSegmentStarts(segment);
            checkpointRepository.save(start);
        }

        if (segmentUpdateModel.getCheckpointEndId() != null) {
            Checkpoint end = checkpointRepository.findById(segmentUpdateModel.getCheckpointEndId())
                    .orElseThrow(() -> new IllegalArgumentException("Erreur"));
            end.addSegmentEnds(segment);
            checkpointRepository.save(end);
        }

        if (segmentUpdateModel.getName() != null) {
            segment.setName(segmentUpdateModel.getName());
        }

        Segment persistedSegment = segmentRepository.save(segment);

        return persistedSegment;
    }

    public Set<Segment> findAllByChallenge(Challenge challenge) {
        // return segmentRepository.findByChallengeId(challenge.getId());
        return challenge.getSegments();
    }

    public Segment save(Segment segment) {
        return segmentRepository.save(segment);
    }

    public void delete(Segment segment) {
        segmentRepository.delete(segment);
        segmentRepository.flush();
    }
}
