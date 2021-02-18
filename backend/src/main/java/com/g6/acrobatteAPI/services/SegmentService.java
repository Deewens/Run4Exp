package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.repositories.SegmentRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SegmentService {
    private final SegmentRepository segmentRepository;

    public SegmentProjection getById(Long id) {
        return segmentRepository.findById(id, SegmentProjection.class);
    }

}
