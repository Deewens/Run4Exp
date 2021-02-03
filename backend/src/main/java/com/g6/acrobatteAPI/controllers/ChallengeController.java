package com.g6.acrobatteAPI.controllers;

import java.util.List;
import java.util.function.Function;

import javax.annotation.PostConstruct;
import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.entities.User;
import com.g6.acrobatteAPI.hateoas.ChallengeModelAssembler;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.repositories.UserRepository;
import com.g6.acrobatteAPI.services.ChallengeService;

import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.modelmapper.TypeMap;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@RequestMapping("challenges")
@Controller
public class ChallengeController {
    private final ChallengeService challengeService;
    private final ChallengeRepository challengeRepository;
    private final ModelMapper modelMapper;
    private final ChallengeModelAssembler modelAssembler;
    private final PagedResourcesAssembler<ChallengeResponseModel> pagedResourcesAssembler;
    private final UserRepository userRepository;

    @PostConstruct
    public void initialize() {
        /**
         * Rajoute le mapping explicite de administratorsId entre l'entité et le modèle
         */
        PropertyMap<Challenge, ChallengeResponseModel> challengeMap = new PropertyMap<Challenge, ChallengeResponseModel>() {
            protected void configure() {
                map().setAdministratorsId(source.getAdministratorsId());
            }
        };
        modelMapper.addMappings(challengeMap);
    }

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<ChallengeResponseModel>>> getAllChallenges(Pageable pageable) {
        // List<Challenge> challenges = challengeService.findAllChallenges();

        Page<Challenge> challengesPage = challengeRepository.findAll(pageable);
        // Page<ChallengeResponseModel> challengesResponsePage = challengesPage
        // .map(new Function<Challenge, ChallengeResponseModel>() {
        // @Override
        // public ChallengeResponseModel apply(Challenge entity) {
        // ChallengeResponseModel model = new ChallengeResponseModel();
        // // Conversion logic

        // return model;
        // }
        // });

        Page<ChallengeResponseModel> challengesResponsePage = challengesPage
                .map((challenge) -> modelMapper.map(challenge, ChallengeResponseModel.class));
        PagedModel<EntityModel<ChallengeResponseModel>> pagedModel = pagedResourcesAssembler
                .toModel(challengesResponsePage, modelAssembler);

        return ResponseEntity.ok().body(pagedModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<ChallengeResponseModel>> getChallenge(@PathVariable("id") Long id) {
        Challenge challenge = challengeService.findChallenge(id);
        ChallengeResponseModel model = modelMapper.map(challenge, ChallengeResponseModel.class);

        EntityModel<ChallengeResponseModel> hateoasModel = modelAssembler.toModel(model);
        return ResponseEntity.ok().body(hateoasModel);
    }

    @PostMapping
    public ResponseEntity<ChallengeResponseModel> createChallenge(
            @RequestBody @Valid ChallengeCreateModel challengeCreateModel) {

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String email = ((UserDetails) principal).getUsername();
        User user = userRepository.findByEmail(email).get();

        Challenge challenge = ChallengeFactory.create(challengeCreateModel);
        challenge.getAdministrators().add(user);

        Challenge persistedChallenge = challengeService.create(challenge).get();

        ChallengeResponseModel responseModel = challengeService.convertToResponseModel(persistedChallenge);

        return ResponseEntity.ok().body(responseModel);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChallengeResponseModel> editChallenge(@PathVariable("id") Long id,
            @RequestBody @Valid ChallengeEditModel challengeEditModel) {
        Challenge challengeToEdit = challengeService.findChallenge(id);
        if (challengeToEdit == null) {
            throw new IllegalArgumentException("Le challenge avec cet id n'existe pas");
        }

        String name = challengeEditModel.getName();

        if (name != null && !name.equals("")) {
            challengeToEdit.setName(name);
        }

        String description = challengeEditModel.getDescription();
        if (description != null) {
            challengeToEdit.setDescription(description);
        }

        challengeService.edit(challengeToEdit);

        ChallengeResponseModel responseModel = challengeService.convertToResponseModel(challengeToEdit);

        return ResponseEntity.ok().body(responseModel);
    }
}
