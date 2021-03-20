package com.g6.acrobatteAPI.controllers;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Endpoint;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.SegmentFactory;
import com.g6.acrobatteAPI.models.segment.SegmentCreateModel;
import com.g6.acrobatteAPI.models.segment.SegmentDeleteModel;
import com.g6.acrobatteAPI.models.segment.SegmentResponseModel;
import com.g6.acrobatteAPI.models.segment.SegmentUpdateModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.g6.acrobatteAPI.services.ChallengeService;
import com.g6.acrobatteAPI.services.EndpointService;
import com.g6.acrobatteAPI.services.SegmentService;

import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/segments")
public class SegmentController {
    private final SegmentService segmentService;
    private final ChallengeService challengeService;
    private final EndpointService endpointService;
    private final ModelMapper modelMapper;

    @GetMapping("/{id}")
    public ResponseEntity<SegmentResponseModel> getById(@PathVariable("id") Long id) {
        SegmentProjection segment = segmentService.getProjectionById(id);

        if (segment == null) {
            return ResponseEntity.badRequest().body(null);
        }

        SegmentResponseModel response = modelMapper.map(segment, SegmentResponseModel.class);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping
    public ResponseEntity<List<SegmentResponseModel>> getAllByChallenge(@RequestParam Long challengeId) {

        Challenge challenge = challengeService.findChallenge(challengeId);
        List<Segment> segments = segmentService.findAllByChallenge(challenge);

        List<SegmentResponseModel> responses = segments.stream()
                .map(segment -> modelMapper.map(segment, SegmentResponseModel.class)).collect(Collectors.toList());

        return ResponseEntity.ok().body(responses);
    }

    @PostMapping
    public ResponseEntity<SegmentResponseModel> create(@Valid @RequestBody SegmentCreateModel segmentCreateModel) {

        Endpoint start = endpointService.getById(segmentCreateModel.getEndpointStartId())
                .orElseThrow(() -> new IllegalArgumentException("Le endpoint de début n'existe pas"));
        Endpoint end = endpointService.getById(segmentCreateModel.getEndpointEndId())
                .orElseThrow(() -> new IllegalArgumentException("Le endpoint de fin n'existe pas"));

        Challenge challenge = challengeService.findChallenge(segmentCreateModel.getChallengeId());
        if (challenge == null) {
            throw new IllegalArgumentException("Le challenge avec cet id n'existe pas");
        }

        if (start.getEndpointId().equals(end.getEndpointId())) {
            throw new IllegalArgumentException("Les enpoint de début et de fin ne peuvent être les mêmes");
        }

        Segment segment = SegmentFactory.create(segmentCreateModel, challenge, start, end);
        Segment persistedSegment = segmentService.create(segment, start, end);

        SegmentResponseModel response = modelMapper.map(persistedSegment, SegmentResponseModel.class);

        return ResponseEntity.ok().body(response);
    }

    // @PutMapping
    // public ResponseEntity<SegmentResponseModel> update(@Valid @RequestBody
    // SegmentUpdateModel segmentUpdateModel) {

    // Endpoint start =
    // endpointService.getById(segmentCreateModel.getEndpointStartId())
    // .orElseThrow(() -> new IllegalArgumentException("Le endpoint de début
    // n'existe pas"));
    // Endpoint end = endpointService.getById(segmentCreateModel.getEndpointEndId())
    // .orElseThrow(() -> new IllegalArgumentException("Le endpoint de fin n'existe
    // pas"));

    // Challenge challenge =
    // challengeService.findChallenge(segmentCreateModel.getChallengeId());
    // if (challenge == null) {
    // throw new IllegalArgumentException("Le challenge avec cet id n'existe pas");
    // }

    // if (start.getEndpointId().equals(end.getEndpointId())) {
    // throw new IllegalArgumentException("Les enpoint de début et de fin ne peuvent
    // être les mêmes");
    // }

    // Segment segment = SegmentFactory.create(segmentCreateModel, challenge, start,
    // end);
    // Segment persistedSegment = segmentService.create(segment, start, end);

    // SegmentResponseModel response = modelMapper.map(persistedSegment,
    // SegmentResponseModel.class);

    // return ResponseEntity.ok().body(response);
    // }

    @DeleteMapping("/{id}")
    public ResponseEntity<Long> delete(@PathVariable("id") Long id) {
        Segment segment = segmentService.getById(id)
                .orElseThrow(() -> new IllegalArgumentException("Segment avec cet id n'existe pas"));

        segmentService.delete(segment);

        return ResponseEntity.ok().body(segment.getId());
    }
}
