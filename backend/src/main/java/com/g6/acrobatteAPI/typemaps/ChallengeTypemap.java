package com.g6.acrobatteAPI.typemaps;

import java.util.List;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseDetailedModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ChallengeTypemap {
    private final ModelMapper modelMapper;
    private final CheckpointTypemap checkpointTypemap;
    private TypeMap<Challenge, ChallengeResponseModel> challengeMap;
    private TypeMap<Challenge, ChallengeResponseDetailedModel> challengeDetailedMap;

    @PostConstruct
    public void initialize() {
        challengeMap = modelMapper.createTypeMap(Challenge.class, ChallengeResponseModel.class)
                .addMapping(src -> src.getAdministratorsId(), ChallengeResponseModel::setAdministratorsId)
                .addMapping(src -> src.getCheckpointsId(), ChallengeResponseModel::setCheckpointsId)
                .addMapping(src -> src.getObstaclesId(), ChallengeResponseModel::setObstaclesId);

        Converter<List<Checkpoint>, List<CheckpointResponseModel>> checkpointListToModel = ctx -> ctx.getSource()
                .stream().map(c -> checkpointTypemap.getMap().map(c)).collect(Collectors.toList());

        // Converter<List<Obstacle>, List<ObstacleModel>> obstacleListToModel = ctx ->
        // ctx.getSource().stream()
        // .map(c -> modelMapper.map(c,
        // ObstacleModel.class)).collect(Collectors.toList());

        challengeDetailedMap = modelMapper.createTypeMap(Challenge.class, ChallengeResponseDetailedModel.class)
                .addMappings(map -> map.using(checkpointListToModel).map(Challenge::getCheckpoints,
                        ChallengeResponseDetailedModel::setCheckpoints))
                .addMappings(map -> map.map(Challenge::getObstacles, ChallengeResponseDetailedModel::setObstacles));
    }

    public TypeMap<Challenge, ChallengeResponseModel> getMap() {
        return challengeMap;
    }

    public TypeMap<Challenge, ChallengeResponseDetailedModel> getDetailedMap() {
        return challengeDetailedMap;
    }
}
