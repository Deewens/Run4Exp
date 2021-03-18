package com.g6.acrobatteAPI.typemaps;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class CheckpointTypemap {
    private TypeMap<Checkpoint, CheckpointResponseModel> checkpointMap;
    private final ModelMapper modelMapper;

    @PostConstruct
    public void initialize() {
        Converter<List<Segment>, List<Long>> segmentListToIdList = ctx -> ctx.getSource().stream()//
                .map(Segment::getId).collect(Collectors.toList());

        modelMapper.getConfiguration().setSkipNullEnabled(true);

        checkpointMap = modelMapper.createTypeMap(Checkpoint.class, CheckpointResponseModel.class)
                .addMapping(src -> src.getPosition().getX(), CheckpointResponseModel::setX)
                .addMapping(src -> src.getPosition().getY(), CheckpointResponseModel::setY)
                .addMappings(map -> map.using(segmentListToIdList).map(Checkpoint::getSegmentsStarts,
                        CheckpointResponseModel::setSegmentsStartsIds))
                .addMappings(map -> map.using(segmentListToIdList).map(Checkpoint::getSegmentsEnds,
                        CheckpointResponseModel::setSegmentsEndsIds));
    }

    public TypeMap<Checkpoint, CheckpointResponseModel> getMap() {
        return checkpointMap;
    }
}
