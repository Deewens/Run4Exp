package com.g6.acrobatteAPI.services;

import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.repositories.SegmentRepository;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SegmentService {
    private final SegmentRepository segmentRepository;

    public Segment getById(Long id) {
        return segmentRepository.getOne(id);
    }

}
