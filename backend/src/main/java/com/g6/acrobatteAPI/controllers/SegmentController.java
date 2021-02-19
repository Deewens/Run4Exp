package com.g6.acrobatteAPI.controllers;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Endpoint;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.SegmentFactory;
import com.g6.acrobatteAPI.models.segment.SegmentCreateModel;
import com.g6.acrobatteAPI.models.segment.SegmentGetAllModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.services.ChallengeService;
import com.g6.acrobatteAPI.services.EndpointService;
import com.g6.acrobatteAPI.services.SegmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/segments")
public class SegmentController {
    private final SegmentService segmentService;
    private final ChallengeService challengeService;
    private final EndpointService endpointService;

    @GetMapping("/{id}")
    public ResponseEntity<SegmentProjection> getById(@PathVariable("id") Long id) {
        SegmentProjection segment = segmentService.getProjectionById(id);

        if (segment == null) {
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok().body(segment);
    }

    @GetMapping
    public ResponseEntity<List<SegmentProjection>> getAllByChallenge(
            @Valid @RequestBody SegmentGetAllModel segmentGetAllModel) {

        Challenge challenge = challengeService.findChallenge(segmentGetAllModel.getChallengeId());

        List<Segment> segments = segmentService.findAllByChallenge(challenge);

        List<SegmentProjection> segmentProjections = new ArrayList<>();
        for (Segment segment : segments) {
            SegmentProjection segmentProjection = segmentService.getProjectionById(segment.getId());
            segmentProjections.add(segmentProjection);
        }

        return ResponseEntity.ok().body(segmentProjections);
    }

    @PostMapping
    public ResponseEntity<SegmentProjection> create(@Valid @RequestBody SegmentCreateModel segmentCreateModel) {

        Endpoint start = endpointService.getById(segmentCreateModel.getEndpointStartId())
                .orElseThrow(() -> new IllegalArgumentException("Le endpoint de début n'existe pas"));
        Endpoint end = endpointService.getById(segmentCreateModel.getEndpointEndId())
                .orElseThrow(() -> new IllegalArgumentException("Le endpoint de fin n'existe pas"));

        if (start.getEndpointId().equals(end.getEndpointId())) {
            throw new IllegalArgumentException("Les enpoint de début et de fin ne peuvent être les mêmes");
        }

        Segment segment = SegmentFactory.create(segmentCreateModel, start, end);

        Segment persistedSegment = segmentService.create(segment);

        SegmentProjection segmentProjection = segmentService.getProjectionById(persistedSegment.getId());

        return ResponseEntity.ok().body(segmentProjection);
    }
}
