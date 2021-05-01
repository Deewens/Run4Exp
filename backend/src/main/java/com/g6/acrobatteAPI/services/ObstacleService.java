package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.obstacle.ObstacleUpdateModel;
import com.g6.acrobatteAPI.models.segment.SegmentUpdateModel;
import com.g6.acrobatteAPI.repositories.ObstacleRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.google.common.collect.Iterables;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ObstacleService {
    private final SegmentService segmentService;
    private final ObstacleRepository obstacleRepository;

    public Obstacle update(Obstacle obstacle, ObstacleUpdateModel obstacleUpdateModel) {
        if (obstacleUpdateModel.getPosition() != null && obstacleUpdateModel.getPosition() > 0.0) {
            obstacle.setPosition(obstacleUpdateModel.getPosition());
        }

        if (obstacleUpdateModel.getRiddle() != null && obstacleUpdateModel.getRiddle() != "") {
            obstacle.setRiddle(obstacleUpdateModel.getRiddle());
        }

        if (obstacleUpdateModel.getResponse() != null && obstacleUpdateModel.getResponse() != "") {
            obstacle.setResponse(obstacleUpdateModel.getResponse());
        }

        if (obstacleUpdateModel.getSegmentId() != null) {
            Segment segment = segmentService.getById(obstacleUpdateModel.getSegmentId())
                    .orElseThrow(() -> new IllegalArgumentException("Le segment avec cet id n'existe pas"));

            obstacle.setSegment(segment);
        }

        Obstacle persistedObstacle = obstacleRepository.save(obstacle);

        return persistedObstacle;
    }

    public Obstacle create(Obstacle obstacle, Segment segment) {
        segment.addObstacle(obstacle);
        segmentService.save(segment);
        Obstacle persistedObstacle = Iterables.getLast(segment.getObstacles(), null);

        return obstacleRepository.save(persistedObstacle);
    }

    public Long delete(Obstacle obstacle) {
        Long id = obstacle.getId();

        obstacleRepository.delete(obstacle);

        return id;
    }
}
