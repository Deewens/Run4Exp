package com.g6.acrobatteAPI.services;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.segment.SegmentUpdateModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import org.springframework.stereotype.Service;

@Service
public interface SegmentServiceI {
    public SegmentProjection getProjectionById(Long id);

    public Optional<Segment> getById(Long id);

    public Segment create(Segment segment);

    public Segment update(Segment segment, SegmentUpdateModel segmentUpdateModel);

    public Set<Segment> findAllByChallenge(Challenge challenge);

    public Segment save(Segment segment);

    public void delete(Segment segment);
}
