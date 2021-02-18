package com.g6.acrobatteAPI.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.CheckpointFactory;
import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.hateoas.CheckpointModelAssembler;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointGetAllModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping(value = "/checkpoints")
@Controller
public class CheckpointController {
    private final CheckpointRepository checkpointRepository;
    private final ChallengeRepository challengeRepository;
    private final SegmentRepository segmentRepository;
    private final ModelMapper modelMapper;
    private final CheckpointModelAssembler modelAssembler;
    private final AuthenticationFacade authenticationFacade;

    private TypeMap<Checkpoint, CheckpointResponseModel> checkpointMap;

    @PostConstruct
    public void initialize() {
        checkpointMap = modelMapper.createTypeMap(Checkpoint.class, CheckpointResponseModel.class)
                .addMapping(src -> src.getPosition().getX(), CheckpointResponseModel::setX)
                .addMapping(src -> src.getPosition().getY(), CheckpointResponseModel::setY);
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<CheckpointResponseModel>>> getAllCheckpoints(
            @RequestBody @Valid CheckpointGetAllModel checkpointGetAllModel) {
        Optional<Challenge> result = challengeRepository.findById(checkpointGetAllModel.getChallengeId());
        if (result.isEmpty())
            throw new IllegalArgumentException("Le challenge avec cet id n'existe pas");

        Challenge challenge = result.get();

        List<Checkpoint> checkpoints = checkpointRepository.findByChallenge(challenge);

        List<CheckpointResponseModel> checkpointModels = checkpoints.stream()
                .map(checkpoint -> checkpointMap.map(checkpoint)).collect(Collectors.toList());

        // Transformer la page de modèles en page HATEOAS
        CollectionModel<EntityModel<CheckpointResponseModel>> hateoasCheckpoints = modelAssembler
                .toCollectionModel(checkpointModels);

        // List<EntityModel<CheckpointResponseModel>> hateoasCheckpoints =
        // checkpointModels.stream()
        // .map(checkpoint ->
        // modelAssembler.toModel(checkpoint)).collect(Collectors.toList());

        return ResponseEntity.ok().body(hateoasCheckpoints);
    }

    @PostMapping
    public ResponseEntity<EntityModel<CheckpointResponseModel>> createCheckpoint(
            @RequestBody @Valid CheckpointCreateModel checkpointCreateModel) {
        if (!authenticationFacade.getUserRoles().contains(Role.ROLE_ADMIN)) {
            throw new IllegalArgumentException("Vous n'êtes pas administrateur");
        }

        Optional<Challenge> result = challengeRepository.findById(checkpointCreateModel.getChallengeId());
        if (result.isEmpty()) {
            throw new IllegalArgumentException("Le challenge avec cet id n'existe pas");
        }

        List<Long> segmentStartIds = checkpointCreateModel.getSegmentStartsIds();
        List<Segment> segmentsStart = null;
        if (segmentStartIds != null && !segmentStartIds.isEmpty()) {
            segmentsStart = segmentRepository.findByIdIsIn(segmentStartIds);
        }

        List<Long> segmentEndIds = checkpointCreateModel.getSegmentEndIds();
        List<Segment> segmentsEnd = null;
        if (segmentEndIds != null && !segmentEndIds.isEmpty()) {
            segmentsEnd = segmentRepository.findByIdIsIn(segmentEndIds);
        }

        Challenge challenge = result.get();
        Checkpoint checkpoint = CheckpointFactory.create(checkpointCreateModel, challenge, segmentsStart, segmentsEnd);
        checkpointRepository.save(checkpoint);
        CheckpointResponseModel checkpointModel = checkpointMap.map(checkpoint);

        EntityModel<CheckpointResponseModel> checkpointHateoas = modelAssembler.toModel(checkpointModel);

        return ResponseEntity.ok().body(checkpointHateoas);
    }

    // @GetMapping("/{id}")
    // public ResponseEntity<EntityModel<ChallengeResponseModel>>
    // getChallenge(@PathVariable("id") Long id) {
    // Challenge challenge = challengeService.findChallenge(id);

    // // Transformerl'entité en un modèle
    // ChallengeResponseModel model = modelMapper.map(challenge,
    // ChallengeResponseModel.class);

    // // Transformer le modèle en un modèle HATEOAS
    // EntityModel<ChallengeResponseModel> hateoasModel =
    // modelAssembler.toModel(model);

    // return ResponseEntity.ok().body(hateoasModel);
    // }
}