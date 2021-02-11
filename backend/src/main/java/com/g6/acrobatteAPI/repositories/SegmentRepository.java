package com.g6.acrobatteAPI.repositories;

import java.util.List;

import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.segment.SegmentProjection;

import org.springframework.data.jpa.repository.JpaRepository;

public interface SegmentRepository extends JpaRepository<Segment, Long> {
    List<Segment> findByIdIsIn(List<Long> idList);

    <T> T findModelById(Long id, Class<T> type);
}
