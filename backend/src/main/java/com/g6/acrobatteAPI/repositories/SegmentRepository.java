package com.g6.acrobatteAPI.repositories;

import java.util.List;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Segment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

public interface SegmentRepository extends JpaRepository<Segment, Long> {
    List<Segment> findByIdIsIn(List<Long> idList);

    <T> T findById(Long id, Class<T> type);

    @Query("SELECT s from Segment s left join Challenge c on c.id=?1")
    List<Segment> findByChallengeId(Long challengeId);
}
