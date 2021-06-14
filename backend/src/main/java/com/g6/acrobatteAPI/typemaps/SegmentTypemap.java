package com.g6.acrobatteAPI.typemaps;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleResponseModel;
import com.g6.acrobatteAPI.models.segment.SegmentResponseDetailedModel;
import com.g6.acrobatteAPI.models.segment.SegmentResponseModel;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class SegmentTypemap {
    private TypeMap<Segment, SegmentResponseModel> segmentMap;
    private TypeMap<Segment, SegmentResponseDetailedModel> segmentDetailedMap;

    private TypeMap<Obstacle, ObstacleResponseModel> obstacleMap;
    private final ModelMapper modelMapper;

    @PostConstruct
    public void initialize() {
        obstacleMap = modelMapper.createTypeMap(Obstacle.class, ObstacleResponseModel.class);

        Converter<Set<Obstacle>, Set<ObstacleResponseModel>> obstacleListToModel = ctx -> ctx.getSource().stream()
                .map(c -> obstacleMap.map(c)).collect(Collectors.toSet());

        modelMapper.getConfiguration().setSkipNullEnabled(true);

        segmentMap = modelMapper.createTypeMap(Segment.class, SegmentResponseModel.class);
        segmentDetailedMap = modelMapper.createTypeMap(Segment.class, SegmentResponseDetailedModel.class)
                .addMappings(map -> map.using(obstacleListToModel).map(Segment::getObstacles,
                        SegmentResponseDetailedModel::setObstacles));
    }

    public TypeMap<Segment, SegmentResponseModel> getMap() {
        return segmentMap;
    }

    public TypeMap<Segment, SegmentResponseDetailedModel> getDetailedMap() {
        return segmentDetailedMap;
    }
}
