package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.coordinate.CoordinateModel;
import com.g6.acrobatteAPI.models.segment.SegmentUpdateModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;

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
            segment.getCoordinates().clear();
            for (CoordinateModel coordinateModel : segmentUpdateModel.getCoordinates()) {
                Coordinate coordinate = new Coordinate();
                coordinate = modelMapper.map(coordinateModel, Coordinate.class);
                segment.addCoordinate(coordinate);
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
}
