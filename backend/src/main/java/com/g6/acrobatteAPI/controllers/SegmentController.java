package com.g6.acrobatteAPI.controllers;

import java.util.Optional;

import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.g6.acrobatteAPI.security.JwtTokenProvider;
import com.g6.acrobatteAPI.services.SegmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/segments")
public class SegmentController {
    private final SegmentService segmentService;

    SegmentController(SegmentService segmentService) {
        this.segmentService = segmentService;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Segment> getById(@PathVariable("id") Long id) {
        Segment segment = segmentService.getById(id);

        if (segment == null) {
            return ResponseEntity.badRequest().body(null);
        }

        return ResponseEntity.ok().body(segment);
    }

}
