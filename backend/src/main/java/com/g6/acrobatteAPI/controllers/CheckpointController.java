package com.g6.acrobatteAPI.controllers;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Role;
import com.g6.acrobatteAPI.hateoas.CheckpointModelAssembler;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointGetAllModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.repositories.SegmentRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.CheckpointService;

import org.modelmapper.ModelMapper;
import org.modelmapper.TypeMap;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping(value = "/api/checkpoints")
@Controller
public class CheckpointController {
    private final CheckpointRepository checkpointRepository;
    private final CheckpointService checkpointService;
    private final ChallengeRepository challengeRepository;
    private final CheckpointModelAssembler modelAssembler;
    private final AuthenticationFacade authenticationFacade;
    private TypeMap<Checkpoint, CheckpointResponseModel> checkpointMap;
    private final ModelMapper modelMapper;

    @PostConstruct
    public void initialize() {
        checkpointMap = modelMapper.createTypeMap(Checkpoint.class, CheckpointResponseModel.class)
                .addMapping(src -> src.getPosition().getX(), CheckpointResponseModel::setX)
                .addMapping(src -> src.getPosition().getY(), CheckpointResponseModel::setY);
    }

    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<CheckpointResponseModel>>> getAllCheckpoints(
            @RequestParam @NotEmpty long challengeId) {

        Optional<Challenge> result = challengeRepository.findById(challengeId);

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

        Checkpoint checkpoint = checkpointService.addCheckpoint(checkpointCreateModel);

        CheckpointResponseModel checkpointModel = checkpointMap.map(checkpoint);

        EntityModel<CheckpointResponseModel> checkpointHateoas = modelAssembler.toModel(checkpointModel);

        return ResponseEntity.ok().body(checkpointHateoas);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<CheckpointResponseModel>> get(@PathVariable("id") Long id) {

        Checkpoint checkpoint = checkpointService.findCheckpoint(id);

        // Transformerl'entité en un modèle
        CheckpointResponseModel model = modelMapper.map(checkpoint, CheckpointResponseModel.class);

        EntityModel<CheckpointResponseModel> checkpointHateoas = modelAssembler.toModel(model);

        return ResponseEntity.ok().body(checkpointHateoas);
    }
}