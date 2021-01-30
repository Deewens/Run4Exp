package com.g6.acrobatteAPI.controllers;

import java.util.List;

import javax.validation.Valid;

import com.g6.acrobatteAPI.entities.Challenge;
import com.g6.acrobatteAPI.entities.ChallengeFactory;
import com.g6.acrobatteAPI.hateoas.ChallengeModelAssembler;
import com.g6.acrobatteAPI.models.challenge.ChallengeCreateModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeEditModel;
import com.g6.acrobatteAPI.models.challenge.ChallengeResponseModel;
import com.g6.acrobatteAPI.repositories.ChallengeRepository;
import com.g6.acrobatteAPI.services.ChallengeService;

import org.hibernate.EntityMode;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.PagedModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
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
    // private final ModelMapper modelMapper;
    private final ChallengeModelAssembler modelAssembler;
    private final PagedResourcesAssembler<Challenge> pagedResourcesAssembler;

    @GetMapping
    public ResponseEntity<PagedModel<EntityModel<Challenge>>> getAllChallenges(Pageable pageable) {
        // List<Challenge> challenges = challengeService.findAllChallenges();

        Page<Challenge> challengesPage = challengeRepository.findAll(pageable);
        PagedModel<EntityModel<Challenge>> pagedModel = pagedResourcesAssembler.toModel(challengesPage, modelAssembler);

        return ResponseEntity.ok().body(pagedModel);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EntityModel<Challenge>> getChallenge(@PathVariable("id") Long id) {
        Challenge challenge = challengeService.findChallenge(id);

        EntityModel<Challenge> model = modelAssembler.toModel(challenge);
        return ResponseEntity.ok().body(model);
    }

    @PostMapping
    public ResponseEntity<ChallengeResponseModel> createChallenge(
            @RequestBody @Valid ChallengeCreateModel challengeCreateModel) {
        Challenge challenge = ChallengeFactory.create(challengeCreateModel);

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
