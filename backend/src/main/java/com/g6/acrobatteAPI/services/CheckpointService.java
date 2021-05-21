package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.List;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.CheckpointFactory;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointUpdateModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.google.common.collect.Iterables;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class CheckpointService implements CheckpointServiceI {

    private final CheckpointRepository checkpointRepository;
    private final ChallengeRepository challengeRepository;
    private final ChallengeService challengeService;
    private final SegmentServiceI segmentService;
    private final SegmentRepository segmentRepository;

    public Checkpoint findCheckpoint(Long id) throws ApiIdNotFoundException {
        return checkpointRepository.findById(id).orElseThrow(() -> new ApiIdNotFoundException("Checkpoint", id));
    }

    public void deleteCheckpoint(Long id) throws ApiIdNotFoundException {

        Checkpoint checkpoint = findCheckpoint(id);

        checkpointRepository.delete(checkpoint);

    }

    public Checkpoint save(Checkpoint checkpoint) {
        return checkpointRepository.save(checkpoint);
    }

    public Checkpoint createCheckpoint(CheckpointCreateModel checkpointCreateModel) throws ApiIdNotFoundException {

        Challenge challenge = challengeRepository.findById(checkpointCreateModel.getChallengeId())
                .orElseThrow(() -> new ApiIdNotFoundException("Challenge", checkpointCreateModel.getChallengeId()));

        List<Long> segmentStartIds = checkpointCreateModel.getSegmentStartsIds();
        List<Segment> segmentsStart = new ArrayList<>();
        if (segmentStartIds != null && !segmentStartIds.isEmpty()) {
            segmentsStart = segmentRepository.findByIdIsIn(segmentStartIds);
        }

        List<Long> segmentEndIds = checkpointCreateModel.getSegmentEndIds();
        List<Segment> segmentsEnd = new ArrayList<>();
        if (segmentEndIds != null && !segmentEndIds.isEmpty()) {
            segmentsEnd = segmentRepository.findByIdIsIn(segmentEndIds);
        }

        Checkpoint checkpoint = CheckpointFactory.create(checkpointCreateModel, challenge, segmentsStart, segmentsEnd);
        challenge.addCheckpoint(checkpoint);
        challengeRepository.save(challenge);

        checkpoint = Iterables.getLast(challenge.getCheckpoints());

        return checkpoint;
    }

    public Checkpoint updateCheckpoint(Checkpoint checkpoint, CheckpointUpdateModel checkpointUpdateModel)
            throws ApiIdNotFoundException, ApiWrongParamsException {

        if (checkpointUpdateModel.getChallengeId() != null) {
            Challenge challenge = challengeService.findChallenge(checkpointUpdateModel.getChallengeId());
            if (challenge == null)
                throw new ApiIdNotFoundException("Challenge", checkpointUpdateModel.getChallengeId());

            checkpoint.setChallenge(challenge);
        }

        if (checkpointUpdateModel.getCheckpointType() != null) {
            checkpoint.setCheckpointType(checkpointUpdateModel.getCheckpointType());
        }

        if (checkpointUpdateModel.getName() != null && checkpointUpdateModel.getName() != "") {
            checkpoint.setName(checkpointUpdateModel.getName());
        }

        if (checkpointUpdateModel.getPosition() != null) {
            Coordinate coord = new Coordinate();
            coord.setX(checkpointUpdateModel.getPosition().getX());
            coord.setY(checkpointUpdateModel.getPosition().getY());
            checkpoint = this.reposition(checkpoint, coord);
        }

        Checkpoint persistedCheckpoint = checkpointRepository.save(checkpoint);

        return persistedCheckpoint;
    }

    public Checkpoint reposition(Checkpoint checkpoint, Coordinate newPosition) throws ApiWrongParamsException {
        if (newPosition.getX() == null || newPosition.getY() == null) {
            throw new ApiWrongParamsException("coordinate", "'position': { 'x': 400, 'y': 350}",
                    "Les coordonnées ne peuvent être nuls ou partiellement nuls");
        }

        checkpoint.setPosition(newPosition);

        /**
         * TODO: se donner du temps si possible d'enlever cette logique frontend Logique
         * pour le frontend: pas trop propre
         */
        for (Segment segment : checkpoint.getSegmentsEnds()) {
            Coordinate coord = Iterables.getLast(segment.getCoordinates());
            coord.setX(newPosition.getX());
            coord.setY(newPosition.getY());
        }

        for (Segment segment : checkpoint.getSegmentsStarts()) {
            Coordinate coord = Iterables.getFirst(segment.getCoordinates(), null);
            coord.setX(newPosition.getX());
            coord.setY(newPosition.getY());
        }

        checkpoint.getPosition().setY(newPosition.getY());

        return checkpoint;
    }

    public Long delete(Checkpoint checkpoint) {
        Long id = checkpoint.getId();

        for (Segment segment : checkpoint.getSegmentsStarts()) {
            segmentService.delete(segment);
        }

        for (Segment segment : checkpoint.getSegmentsEnds()) {
            segmentService.delete(segment);
        }

        checkpointRepository.delete(checkpoint);

        return id;
    }
}
