package com.g6.acrobatteAPI.controllers;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.Checkpoint;
import com.g6.acrobatteAPI.entities.Obstacle;
import com.g6.acrobatteAPI.entities.Segment;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.hateoas.ChallengeDetailAssembler;
import com.g6.acrobatteAPI.hateoas.ChallengeModelAssembler;
import com.g6.acrobatteAPI.models.challenge.ChallengeAddAdministratorModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.segment.SegmentResponseModel;
import com.g6.acrobatteAPI.models.user.UserResponseModel;
import com.g6.acrobatteAPI.projections.challenge.ChallengeDetailProjection;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeRemoveAdministratorModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseDetailedModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.models.checkpoint.CheckpointResponseModel;
import com.g6.acrobatteAPI.models.obstacle.ObstacleModel;
import com.g6.acrobatteAPI.projections.segment.SegmentProjection;
import com.g6.acrobatteAPI.security.AuthenticationFacade;
import com.g6.acrobatteAPI.services.ChallengeService;
import com.g6.acrobatteAPI.services.SegmentService;
import com.g6.acrobatteAPI.services.UserService;
import com.g6.acrobatteAPI.typemaps.ChallengeTypemap;
import com.g6.acrobatteAPI.typemaps.CheckpointTypemap;

import org.modelmapper.Converter;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@RequestMapping("/api/challenges")
@Controller
public class ChallengeController {
    private final SegmentService segmentService;
    private final ChallengeService challengeService;
    private final UserService userService;
    private final ChallengeTypemap typemap;
    private final ChallengeModelAssembler modelAssembler;
    private final ChallengeDetailAssembler challengeDetailAssembler;
    private final PagedResourcesAssembler<ChallengeResponseModel> pagedResourcesAssembler;
    private final AuthenticationFacade authenticationFacade;

    @PostConstruct
    public void initialize() {

    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ChallengeResponseModel>>> pagedChallenges(Pageable pageable) {
        Page<Challenge> challengesPage = challengeService.pagedChallenges(pageable);

        // Transformer la page d'entités en une page de modèles
        Page<ChallengeResponseModel> challengesResponsePage = challengesPage
                .map((challenge) -> typemap.getMap().map(challenge));

        // Transformer la page de modèles en page HATEOAS
        PagedModel<EntityModel<ChallengeResponseModel>> pagedModel = pagedResourcesAssembler
                .toModel(challengesResponsePage, modelAssembler);

        return ResponseEntity.ok().body(pagedModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<ChallengeResponseModel>> getChallenge(@PathVariable("id") Long id) {
        Challenge challenge = challengeService.findChallenge(id);

        // Transformerl'entité en un modèle
        ChallengeResponseModel model = typemap.getMap().map(challenge);

        // Transformer le modèle en un modèle HATEOAS
        EntityModel<ChallengeResponseModel> hateoasModel = modelAssembler.toModel(model);

        return ResponseEntity.ok().body(hateoasModel);
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<ChallengeResponseDetailedModel> getChallengeDetail(@PathVariable("id") Long id) {
        Challenge challenge = challengeService.findChallenge(id);
        ChallengeResponseDetailedModel response = typemap.getDetailedMap().map(challenge);

        return ResponseEntity.ok().body(response);
    }

    @PostMapping
    public ResponseEntity<Object> createChallenge(@RequestBody @Valid ChallengeCreateModel challengeCreateModel) {

        User user = authenticationFacade.getUser().get();

        ChallengeDetailProjection challengeResponse = challengeService.create(challengeCreateModel, user);

        if (challengeResponse == null) {
            return ResponseEntity.badRequest().body("Erreur lors de la création du challenge");
        }

        return ResponseEntity.ok().body(challengeResponse);
    }

    @PutMapping("/{id}/background")
    public ResponseEntity<Object> handleBackgroundUpload(@PathVariable("id") Long id,
            @RequestParam("file") MultipartFile file) {

        challengeService.updateBackground(id, file);

        return ResponseEntity.ok().body(null);
    }

    @GetMapping(value = "/{id}/background", produces = MediaType.IMAGE_JPEG_VALUE)
    public @ResponseBody byte[] getBackground(@PathVariable("id") Long id) {

        return challengeService.getBackground(id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EntityModel<ChallengeDetailProjection>> update(@PathVariable("id") Long id,
            @RequestBody @Valid ChallengeEditModel challengeEditModel) {

        var challengeDetail = challengeService.update(id, challengeEditModel);

        // Transformer le modèle en un modèle HATEOAS
        EntityModel<ChallengeDetailProjection> hateoasModel = challengeDetailAssembler.toModel(challengeDetail);

        return ResponseEntity.ok().body(hateoasModel);
    }

    @PutMapping("/{id}/admin")
    public ResponseEntity<EntityModel<ChallengeResponseModel>> addAdministrator(@PathVariable("id") Long id,
            @RequestBody @Valid ChallengeAddAdministratorModel challengeAddAdministratorModel) {

        User user = userService.getUserById(challengeAddAdministratorModel.getAdminId());

        if (user == null)
            ResponseEntity.badRequest().body("User target not found");

        ChallengeResponseModel challengeResponseModel = challengeService.addAdministrator(id, user);

        // Transformer le modèle en un modèle HATEOAS
        EntityModel<ChallengeResponseModel> hateoasModel = modelAssembler.toModel(challengeResponseModel);

        return ResponseEntity.ok().body(hateoasModel);
    }

    @DeleteMapping("/{id}/admin")
    public ResponseEntity<EntityModel<ChallengeResponseModel>> removeAdministrator(@PathVariable("id") Long id,
            ChallengeRemoveAdministratorModel removeAdministratorModel) {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User user = userService.getUserByEmail(email);

        ChallengeResponseModel model = challengeService.removeAdministrator(id, user,
                removeAdministratorModel.getAdminId());

        // Transformer le modèle en un modèle HATEOAS
        EntityModel<ChallengeResponseModel> hateoasModel = modelAssembler.toModel(model);

        return ResponseEntity.ok().body(hateoasModel);
    }

    @GetMapping("/{id}/segments")
    public ResponseEntity<List<SegmentProjection>> getAllByChallenge(@PathVariable("id") Long id) {
        Challenge challenge = challengeService.findChallenge(id);

        List<Segment> segments = segmentService.findAllByChallenge(challenge);

        List<SegmentProjection> segmentProjections = new ArrayList<>();
        for (Segment segment : segments) {
            SegmentProjection segmentProjection = segmentService.getProjectionById(segment.getId());
            segmentProjections.add(segmentProjection);
        }

        return ResponseEntity.ok().body(segmentProjections);
    }
}
