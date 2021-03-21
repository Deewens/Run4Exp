package com.g6.acrobatteAPI.repositories;

import java.util.Set;

import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ObstacleRepository extends JpaRepository<Obstacle, Long> {
    Set<Obstacle> findBySegment(Segment segment);
}
