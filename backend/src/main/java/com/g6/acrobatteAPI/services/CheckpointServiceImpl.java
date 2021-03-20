package com.g6.acrobatteAPI.services;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.CheckpointFactory;
import com.g6.acrobatteAPI.entities.Coordinate;
import com.g6.acrobatteAPI.entities.Segment;
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
public class CheckpointServiceImpl implements CheckpointService {

    private final CheckpointRepository checkpointRepository;
    private final ChallengeRepository challengeRepository;
    private final ChallengeService challengeService;
    private final SegmentRepository segmentRepository;

    @Override
    public Checkpoint findCheckpoint(Long id) {
        return checkpointRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Le checkpoint avec cet id n'existe pas"));
    }

    @Override
    public void deleteCheckpoint(Long id) {

        Checkpoint checkpoint = findCheckpoint(id);

        checkpointRepository.delete(checkpoint);

    }

    @Override
    public Checkpoint addCheckpoint(CheckpointCreateModel checkpointCreateModel) {

        Challenge challenge = challengeRepository.findById(checkpointCreateModel.getChallengeId())
                .orElseThrow(() -> new IllegalArgumentException("Challenge avec cet id n'existe pas"));

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
        challenge.addEndpoint(checkpoint);
        challengeRepository.save(challenge);

        return checkpoint;
    }

    @Override
    public Checkpoint updateCheckpoint(Checkpoint checkpoint, CheckpointUpdateModel checkpointUpdateModel) {

        if (checkpointUpdateModel.getChallengeId() != null) {
            Challenge challenge = challengeService.findChallenge(checkpointUpdateModel.getChallengeId());
            if (challenge == null)
                throw new IllegalArgumentException("Challenge avec cet id n'existe pas");

            checkpoint.setChallenge(challenge);
        }

        if (checkpointUpdateModel.getCheckpointType() != null) {
            checkpoint.setCheckpointType(checkpointUpdateModel.getCheckpointType());
        }

        if (checkpointUpdateModel.getName() != null && checkpointUpdateModel.getName() != "") {
            checkpoint.setName(checkpointUpdateModel.getName());
        }

        System.out.println(checkpointUpdateModel.toString());

        if (checkpointUpdateModel.getPosition() != null) {
            Coordinate coord = new Coordinate();
            coord.setX(checkpointUpdateModel.getPosition().getX());
            coord.setY(checkpointUpdateModel.getPosition().getY());
            checkpoint = this.reposition(checkpoint, coord);
        }

        Checkpoint persistedCheckpoint = checkpointRepository.save(checkpoint);

        return persistedCheckpoint;
    }

    public Checkpoint reposition(Checkpoint checkpoint, Coordinate newPosition) {
        if (newPosition.getX() == null || newPosition.getY() == null) {
            throw new IllegalArgumentException("Les coordonnées ne peuvent être nuls ou partiellement nuls");
        }

        checkpoint.setPosition(newPosition);

        /**
         * TODO: se donner du temps si possible d'enlever cette logique frontend Logique
         * pour le frontend: pas trop propre
         */
        for (Segment segment : checkpoint.getSegmentsStarts()) {
            // Enlever la dernière coordonnée
            segment.getCoordinates().remove(Iterables.getLast(segment.getCoordinates()));
            // Remplacer par la nouvelle coordonnée
            segment.getCoordinates().add(newPosition);
        }

        for (Segment segment : checkpoint.getSegmentsStarts()) {
            // Enlever la première coordonnée
            segment.getCoordinates().remove(Iterables.getFirst(segment.getCoordinates(), null));
            // Remplacer par la nouvelle coordonnée
            segment.getCoordinates().add(0, newPosition);
        }

        checkpoint.getPosition().setY(newPosition.getY());

        return checkpoint;
    }
}
