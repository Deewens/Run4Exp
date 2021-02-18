package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.function.Consumer;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.CheckpointFactory;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.SegmentFactory;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleModel;
import com.g6.acrobatteAPI.models.segment.SegmentModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class ChallengeServiceImpl implements ChallengeService {

    private final ChallengeRepository challengeRepository;
    private final CheckpointRepository checkpointRepository;
    private final SegmentRepository segmentRepository;
    private final ModelMapper modelMapper;

    @Override
    public Challenge findChallenge(Long id) {
        return challengeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Le challenge avec cet id n'existe pas"));
    }

    @Override
    public List<Challenge> findAllChallenges() {
        List<Challenge> challenges = new ArrayList<>();
        challengeRepository.findAll().forEach(challenges::add);

        return challenges;
    }

    @Override
    public List<Challenge> findUserChallenges(User user) {
        List<Challenge> challenges = new ArrayList<>();

        Consumer<Challenge> lambda = (challenge) -> {
            if (challenge.getName() == "Hello") {
                challenges.add(challenge);
            }
        };

        challengeRepository.findAll().forEach(lambda);

        return null;
    }

    public ChallengeDetailProjection findChallengeDetail(Long id) {
        return challengeRepository.findDetailById(id);
    }

    @Override
    public Optional<Challenge> create(Challenge challenge) {
        Challenge challengeResp = challengeRepository.save(challenge);

        if (challengeResp == null)
            return Optional.empty();

        return Optional.of(challengeResp);
    }

    @Override
    public Optional<Challenge> edit(Challenge challenge) {
        Challenge challengeResp = challengeRepository.save(challenge);

        if (challengeResp == null)
            return Optional.empty();

        return Optional.of(challengeResp);
    }

    @Override
    public ChallengeResponseModel convertToResponseModel(Challenge challenge) {
        return modelMapper.map(challenge, ChallengeResponseModel.class);
    }

    public ChallengeDetailProjection create(ChallengeCreateModel challengeModel, User user) {

        Challenge challengeEntity = ChallengeFactory.create(challengeModel);

        // challengeEntity.addAdministrator(user);

        challengeEntity = challengeRepository.save(challengeEntity);

        ArrayList<Checkpoint> checkpoints = new ArrayList<>();

        for (CheckpointModel checkpointModel : challengeModel.getCheckpoints()) {

            Checkpoint checkpointEntity = CheckpointFactory.create(checkpointModel, challengeEntity);

            checkpointEntity = checkpointRepository.save(checkpointEntity);

            checkpoints.add(checkpointEntity);
        }

        for (ObstacleModel obstacleModel : challengeModel.getObstacles()) {
            System.out.println("Pas encore implémenté");
        }

        for (SegmentModel segmentModel : challengeModel.getSegments()) {

            Checkpoint startpoint = checkpoints.stream().filter(
                    points -> segmentModel.getStartEndpointCoordinates().getX().equals(points.getPosition().getX())
                            && segmentModel.getStartEndpointCoordinates().getY().equals(points.getPosition().getY()))
                    .findAny().orElse(null);

            Checkpoint endpoint = checkpoints.stream().filter(
                    points -> segmentModel.getEndEndpointCoordinates().getX().equals(points.getPosition().getX())
                            && segmentModel.getEndEndpointCoordinates().getY().equals(points.getPosition().getY()))
                    .findAny().orElse(null);

            Segment segmentEntity = SegmentFactory.create(segmentModel, startpoint, endpoint);

            segmentRepository.save(segmentEntity);
        }

        challengeEntity.getEndpoints().addAll(checkpoints);

        challengeEntity = challengeRepository.save(challengeEntity);

        return findChallengeDetail(challengeEntity.getId());
    }

}
