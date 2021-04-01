package com.g6.acrobatteAPI.controllers;

import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.ObstacleFactory;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.models.obstacle.ObstacleCreateModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleResponseModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleUpdateModel;
import com.g6.acrobatteAPI.repositories.ObstacleRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.g6.acrobatteAPI.services.ObstacleService;
import com.g6.acrobatteAPI.services.SegmentService;

import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
@RequestMapping(value = "/api/obstacles")
public class ObstacleController {
        private final ObstacleRepository obstacleRepository;
        private final ModelMapper modelMapper;
        private final SegmentService segmentService;
        private final ObstacleService obstacleService;

        @GetMapping("/{id}")
        public ResponseEntity<ObstacleResponseModel> getById(@PathVariable("id") Long id)
                        throws ApiIdNotFoundException {
                Obstacle obstacle = obstacleRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("Obstacle", id));

                ObstacleResponseModel response = modelMapper.map(obstacle, ObstacleResponseModel.class);

                return ResponseEntity.ok().body(response);
        }

        @GetMapping
        public ResponseEntity<Set<ObstacleResponseModel>> getAllBySegment(@RequestParam @NotEmpty long segmentId)
                        throws ApiIdNotFoundException {
                Segment segment = segmentService.getById(segmentId)
                                .orElseThrow(() -> new ApiIdNotFoundException("Segment", segmentId));

                Set<Obstacle> obstacles = obstacleRepository.findBySegment(segment);

                Set<ObstacleResponseModel> obstaclesResponse = obstacles.stream()
                                .map(source -> modelMapper.map(source, ObstacleResponseModel.class))
                                .collect(Collectors.toSet());

                return ResponseEntity.ok().body(obstaclesResponse);
        }

        @PutMapping("/{id}")
        public ResponseEntity<ObstacleResponseModel> update(@PathVariable("id") Long id,
                        @RequestBody @Valid ObstacleUpdateModel obstacleUpdateModel) throws ApiIdNotFoundException {
                Obstacle obstacle = obstacleRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("Obstacle", id));

                Obstacle updatedObstacle = obstacleService.update(obstacle, obstacleUpdateModel);

                ObstacleResponseModel response = modelMapper.map(updatedObstacle, ObstacleResponseModel.class);

                return ResponseEntity.ok().body(response);
        }

        @PostMapping
        public ResponseEntity<ObstacleResponseModel> create(@RequestBody @Valid ObstacleCreateModel obstacleCreateModel)
                        throws ApiIdNotFoundException {

                Segment segment = segmentService.getById(obstacleCreateModel.getSegmentId()).orElseThrow(
                                () -> new ApiIdNotFoundException("Segment", obstacleCreateModel.getSegmentId()));

                Obstacle obstacle = ObstacleFactory.create(obstacleCreateModel, segment);

                Obstacle persistedObstacle = obstacleService.create(obstacle, segment);

                ObstacleResponseModel response = modelMapper.map(persistedObstacle, ObstacleResponseModel.class);

                return ResponseEntity.ok().body(response);
        }

        @DeleteMapping("/{id}")
        public ResponseEntity<Long> delete(@PathVariable("id") Long id) throws ApiIdNotFoundException {
                Obstacle obstacle = obstacleRepository.findById(id)
                                .orElseThrow(() -> new ApiIdNotFoundException("Obstacle", id));

                obstacleService.delete(obstacle);

                return ResponseEntity.ok().body(obstacle.getId());
        }
}
