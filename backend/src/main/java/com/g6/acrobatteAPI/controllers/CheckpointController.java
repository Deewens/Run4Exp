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
import com.g6.acrobatteAPI.exceptions.ApiIdNotFoundException;
import com.g6.acrobatteAPI.exceptions.ApiNotAdminException;
import com.g6.acrobatteAPI.exceptions.ApiWrongParamsException;
import com.g6.acrobatteAPI.hateoas.CheckpointModelAssembler;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointCreateModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointUpdateModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.CheckpointRepository;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.CheckpointService;
import com.g6.acrobatteAPI.typemaps.CheckpointTypemap;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
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

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import io.swagger.annotations.ApiOperation;

@RequiredArgsConstructor
@RequestMapping(value = "/api/checkpoints")
@Controller
@Api(value = "Ccheckpoint Controller", description = "API REST sur le Checkpoint", tags = "Checkpoint")
public class CheckpointController {
    private final CheckpointRepository checkpointRepository;
    private final CheckpointService checkpointService;
    private final ChallengeRepository challengeRepository;
    private final CheckpointModelAssembler modelAssembler;
    private final AuthenticationFacade authenticationFacade;
    private final CheckpointTypemap typemap;

    @PostConstruct
    public void initialize() {

    }

    @ApiOperation(value = "Récupérer tous les Checkpoints par ID du challenge", response = Iterable.class, tags = "Checkpoint")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 401, message = "not authorized"), //
            @ApiResponse(code = 403, message = "forbidden"), //
            @ApiResponse(code = 404, message = "not found") //
    })
    @GetMapping
    public ResponseEntity<CollectionModel<EntityModel<CheckpointResponseModel>>> getAllCheckpoints(
            @RequestParam @NotEmpty long challengeId) throws ApiIdNotFoundException {

        Challenge challenge = challengeRepository.findById(challengeId)
                .orElseThrow(() -> new ApiIdNotFoundException("challenge", challengeId));

        List<Checkpoint> checkpoints = checkpointRepository.findByChallenge(challenge);

        List<CheckpointResponseModel> checkpointModels = checkpoints.stream()
                .map(checkpoint -> typemap.getMap().map(checkpoint)).collect(Collectors.toList());

        // Transformer la page de modèles en page HATEOAS
        CollectionModel<EntityModel<CheckpointResponseModel>> hateoasCheckpoints = modelAssembler
                .toCollectionModel(checkpointModels);

        return ResponseEntity.ok().body(hateoasCheckpoints);
    }

    @ApiOperation(value = "Créer un Checkpoint", response = Iterable.class, tags = "Checkpoint")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 401, message = "not authorized"), //
            @ApiResponse(code = 403, message = "forbidden"), //
            @ApiResponse(code = 404, message = "not found") //
    })
    @PostMapping
    public ResponseEntity<EntityModel<CheckpointResponseModel>> createCheckpoint(
            @RequestBody @Valid CheckpointCreateModel checkpointCreateModel)
            throws ApiNotAdminException, ApiIdNotFoundException {
        if (!authenticationFacade.getUserRoles().contains(Role.ROLE_ADMIN)) {
            throw new ApiNotAdminException("Vous");
        }

        Checkpoint checkpoint = checkpointService.createCheckpoint(checkpointCreateModel);
        CheckpointResponseModel checkpointModel = typemap.getMap().map(checkpoint);

        EntityModel<CheckpointResponseModel> checkpointHateoas = modelAssembler.toModel(checkpointModel);

        return ResponseEntity.ok().body(checkpointHateoas);
    }

    @ApiOperation(value = "Modifier un Checkpoint par ID", response = Iterable.class, tags = "Checkpoint")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 401, message = "not authorized"), //
            @ApiResponse(code = 403, message = "forbidden"), //
            @ApiResponse(code = 404, message = "not found") //
    })
    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<CheckpointResponseModel>> updateCheckpoint(@PathVariable("id") Long id,
            @RequestBody @Valid CheckpointUpdateModel checkpointUpdateModel)
            throws ApiNotAdminException, ApiIdNotFoundException, ApiWrongParamsException {
        if (!authenticationFacade.getUserRoles().contains(Role.ROLE_ADMIN)) {
            throw new ApiNotAdminException("Vous");
        }

        Checkpoint checkpoint = checkpointService.findCheckpoint(id);
        Checkpoint updatedCheckpoint = checkpointService.updateCheckpoint(checkpoint, checkpointUpdateModel);
        CheckpointResponseModel checkpointModel = typemap.getMap().map(updatedCheckpoint);

        EntityModel<CheckpointResponseModel> checkpointHateoas = modelAssembler.toModel(checkpointModel);

        return ResponseEntity.ok().body(checkpointHateoas);
    }

    @ApiOperation(value = "Récupérer un Checkpoint par ID", response = Iterable.class, tags = "Checkpoint")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 401, message = "not authorized"), //
            @ApiResponse(code = 403, message = "forbidden"), //
            @ApiResponse(code = 404, message = "not found") //
    })
    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<CheckpointResponseModel>> get(@PathVariable("id") Long id)
            throws ApiIdNotFoundException {

        Checkpoint checkpoint = checkpointService.findCheckpoint(id);

        // Transformerl'entité en un modèle
        CheckpointResponseModel model = typemap.getMap().map(checkpoint);
        EntityModel<CheckpointResponseModel> checkpointHateoas = modelAssembler.toModel(model);

        return ResponseEntity.ok().body(checkpointHateoas);
    }

    @ApiOperation(value = "Supprimer un Checkpoint par ID", response = Iterable.class, tags = "Checkpoint")
    @ApiResponses(value = { //
            @ApiResponse(code = 200, message = "Success|OK"), //
            @ApiResponse(code = 401, message = "not authorized"), //
            @ApiResponse(code = 403, message = "forbidden"), //
            @ApiResponse(code = 404, message = "not found") //
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Long id) throws ApiIdNotFoundException {

        Checkpoint checkpoint = checkpointService.findCheckpoint(id);
        Long idDeleted = checkpointService.delete(checkpoint);
        String message = "Checkpoint [id: " + idDeleted + "] supprimé avec succès";

        return ResponseEntity.ok().body(message);
    }
}